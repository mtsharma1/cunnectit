import crypto from "node:crypto";
import mysql from "mysql2/promise";

export const runtime = "nodejs";

let databasePool;

function configuredVerifyToken() {
  return process.env.META_WEBHOOK_VERIFY_TOKEN
    || process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
    || "";
}

function isPlaceholder(value) {
  return !value || /your-|replace-|public-host|user:password/i.test(value);
}

function databaseIsPublic() {
  const value = process.env.DATABASE_URL;
  if (isPlaceholder(value)) return false;
  try {
    const host = new URL(value).hostname.toLowerCase();
    return !["localhost", "127.0.0.1", "::1"].includes(host);
  } catch {
    return false;
  }
}

function readiness() {
  const verifyTokenConfigured = !isPlaceholder(configuredVerifyToken());
  const appSecretConfigured = !isPlaceholder(process.env.META_APP_SECRET);
  const publicDatabaseConfigured = databaseIsPublic();
  const forwardUrl = process.env.WHATSAPP_WEBHOOK_FORWARD_URL || "";
  const forwardingConfigured = /^https:\/\//i.test(forwardUrl)
    || (process.env.NODE_ENV !== "production"
      && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(?:\/|$)/i.test(forwardUrl));
  return {
    ready: verifyTokenConfigured
      && appSecretConfigured
      && (publicDatabaseConfigured || forwardingConfigured),
    verifyTokenConfigured,
    appSecretConfigured,
    deliveryDestination: publicDatabaseConfigured
      ? "database"
      : forwardingConfigured
        ? "forward"
        : "missing",
  };
}

function getPool() {
  if (!databaseIsPublic() && process.env.NODE_ENV === "production") return null;
  if (!process.env.DATABASE_URL || isPlaceholder(process.env.DATABASE_URL)) return null;
  databasePool ??= mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 4,
    enableKeepAlive: true,
  });
  return databasePool;
}

function validMetaSignature(rawBody, signature) {
  const secret = process.env.META_APP_SECRET;
  if (isPlaceholder(secret)) return process.env.NODE_ENV !== "production";
  if (!signature?.startsWith("sha256=")) return false;
  const expected = `sha256=${crypto.createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  const expectedBytes = Buffer.from(expected);
  const receivedBytes = Buffer.from(signature);
  return expectedBytes.length === receivedBytes.length
    && crypto.timingSafeEqual(expectedBytes, receivedBytes);
}

function extractStatuses(payload) {
  if (payload?.object !== "whatsapp_business_account") return [];
  return payload.entry?.flatMap((entry) =>
    entry?.changes?.flatMap((change) => change?.value?.statuses || []) || [],
  ) || [];
}

async function saveStatuses(statuses) {
  const pool = getPool();
  if (!pool) return false;
  const allowed = new Set(["sent", "delivered", "read", "failed", "deleted"]);
  for (const status of statuses) {
    if (!status?.id || !allowed.has(status.status)) continue;
    const firstError = status.errors?.[0];
    const errorCode = firstError?.code ? String(firstError.code) : null;
    const errorMessage = firstError?.error_data?.details
      || firstError?.message
      || firstError?.title
      || null;
    const eventTime = status.timestamp
      ? new Date(Number(status.timestamp) * 1000)
      : new Date();
    const timestampColumn = status.status === "sent"
      ? "sent_at"
      : status.status === "delivered"
        ? "delivered_at"
        : status.status === "read"
          ? "read_at"
          : status.status === "failed"
            ? "failed_at"
            : null;
    const timestampSql = timestampColumn ? `, ${timestampColumn}=?` : "";
    const parameters = [
      status.status,
      errorCode,
      errorMessage,
      JSON.stringify(status),
      ...(timestampColumn ? [eventTime] : []),
      status.status,
      "default",
      status.id,
    ];
    const [result] = await pool.execute(
      `UPDATE message_deliveries SET status=?, error_code=?, error_message=?,
         status_payload=?${timestampSql},
         credit_due=IF(?='failed', charged_amount, credit_due)
       WHERE workspace_key=? AND wamid=?`,
      parameters,
    );
    if (result.affectedRows) continue;
    await pool.execute(
      `INSERT INTO message_deliveries
        (workspace_key, wamid, recipient_phone, template_name, status,
         error_code, error_message, status_payload, charged_amount, credit_due)
       VALUES ('default', ?, ?, '', ?, ?, ?, ?, 0, 0)
       ON DUPLICATE KEY UPDATE status=VALUES(status), error_code=VALUES(error_code),
         error_message=VALUES(error_message), status_payload=VALUES(status_payload)`,
      [
        status.id,
        status.recipient_id || "",
        status.status,
        errorCode,
        errorMessage,
        JSON.stringify(status),
      ],
    );
  }
  return true;
}

async function forwardPayload(rawBody, metaSignature) {
  const target = process.env.WHATSAPP_WEBHOOK_FORWARD_URL;
  if (!target) return false;
  const response = await fetch(target, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(metaSignature ? { "x-hub-signature-256": metaSignature } : {}),
      ...(process.env.WHATSAPP_WEBHOOK_FORWARD_SECRET
        ? { "x-waveping-webhook-secret": process.env.WHATSAPP_WEBHOOK_FORWARD_SECRET }
        : {}),
    },
    body: rawBody,
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`WavePing webhook returned HTTP ${response.status}.`);
  return true;
}

export async function GET(request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  const configuredToken = configuredVerifyToken();
  if (!mode) {
    const state = readiness();
    return Response.json(state, {
      status: state.ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
  if (isPlaceholder(configuredToken)) {
    return Response.json({ error: "Webhook verify token is not configured." }, { status: 503 });
  }
  if (mode === "subscribe" && token === configuredToken) {
    return new Response(challenge || "", {
      status: 200,
      headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
    });
  }
  return Response.json({ error: "Webhook verification failed." }, { status: 403 });
}

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  if (isPlaceholder(process.env.META_APP_SECRET) && process.env.NODE_ENV === "production") {
    return Response.json({ error: "META_APP_SECRET is not configured." }, { status: 503 });
  }
  if (!validMetaSignature(rawBody, signature)) {
    return Response.json({ error: "Invalid Meta webhook signature." }, { status: 401 });
  }
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
  const statuses = extractStatuses(payload);
  try {
    const savedToDatabase = await saveStatuses(statuses);
    const forwarded = savedToDatabase ? false : await forwardPayload(rawBody, signature);
    if (!savedToDatabase && !forwarded) {
      return Response.json(
        { error: "Configure DATABASE_URL or WHATSAPP_WEBHOOK_FORWARD_URL." },
        { status: 503 },
      );
    }
    console.info("WhatsApp webhook processed", {
      statuses: statuses.length,
      destination: savedToDatabase ? "database" : "forward",
    });
    return Response.json({ received: true, statuses: statuses.length });
  } catch (error) {
    console.error("WhatsApp webhook processing failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return Response.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
