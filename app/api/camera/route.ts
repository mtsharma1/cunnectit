import crypto from "node:crypto";
import { type RowDataPacket } from "mysql2/promise";
import {
  authorizeDevice,
  clientIp,
  getCameraPool,
  isAdminRequest,
  publicSession,
  sha256,
  validDeviceCredentials,
} from "@/lib/cameraStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openStatuses = ["requested", "accepted", "offered", "active"];

function noStore(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function adminRequired(request: Request) {
  if (!process.env.CAMERA_ADMIN_KEY || process.env.CAMERA_ADMIN_KEY.length < 16) {
    return noStore({ error: "CAMERA_ADMIN_KEY is not configured." }, 503);
  }
  if (!isAdminRequest(request)) {
    return noStore({ error: "Invalid administrator key." }, 401);
  }
  return null;
}

async function readBody(request: Request) {
  try {
    return await request.json() as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function deviceFromRequest(request: Request) {
  const url = new URL(request.url);
  return {
    id: url.searchParams.get("deviceId") || "",
    secret: request.headers.get("x-device-secret") || "",
  };
}

export async function GET(request: Request) {
  try {
    const { pool, ready } = getCameraPool();
    await ready;
    const url = new URL(request.url);
    const mode = url.searchParams.get("mode");

    if (mode === "devices") {
      const denied = adminRequired(request);
      if (denied) return denied;

      await pool.execute(
        "UPDATE camera_sessions SET status='ended', updated_at=NOW(3) WHERE status IN ('requested','accepted','offered','active') AND expires_at < NOW(3)",
      );
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT id, name, ip_address, user_agent, last_seen, created_at,
          IF(last_seen >= DATE_SUB(NOW(3), INTERVAL 15 SECOND), 1, 0) AS online
         FROM camera_devices
         ORDER BY online DESC, last_seen DESC
         LIMIT 200`,
      );
      return noStore({
        devices: rows.map((row) => ({
          id: String(row.id),
          name: String(row.name),
          ipAddress: String(row.ip_address),
          userAgent: String(row.user_agent),
          lastSeen: row.last_seen,
          createdAt: row.created_at,
          online: Boolean(row.online),
        })),
      });
    }

    if (mode === "device-session") {
      const device = await deviceFromRequest(request);
      if (!validDeviceCredentials(device.id, device.secret)
        || !(await authorizeDevice(pool, device.id, device.secret))) {
        return noStore({ error: "Device authentication failed." }, 401);
      }

      await pool.execute(
        "UPDATE camera_devices SET last_seen=NOW(3), ip_address=? WHERE id=?",
        [clientIp(request), device.id],
      );
      await pool.execute(
        "UPDATE camera_sessions SET status='ended', updated_at=NOW(3) WHERE device_id=? AND status IN ('requested','accepted','offered','active') AND expires_at < NOW(3)",
        [device.id],
      );
      const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM camera_sessions
         WHERE device_id=? AND status IN ('requested','accepted','offered','active')
         ORDER BY requested_at DESC LIMIT 1`,
        [device.id],
      );
      return noStore({ session: rows[0] ? publicSession(rows[0]) : null });
    }

    if (mode === "session") {
      const denied = adminRequired(request);
      if (denied) return denied;
      const sessionId = url.searchParams.get("sessionId") || "";
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM camera_sessions WHERE id=? LIMIT 1",
        [sessionId],
      );
      return rows[0]
        ? noStore({ session: publicSession(rows[0]) })
        : noStore({ error: "Session not found." }, 404);
    }

    return noStore({ error: "Unknown request mode." }, 400);
  } catch (error) {
    console.error("Camera API GET failed", error instanceof Error ? error.message : error);
    return noStore({ error: "Camera service is unavailable." }, 503);
  }
}

export async function POST(request: Request) {
  const body = await readBody(request);
  if (!body) return noStore({ error: "Invalid JSON body." }, 400);

  try {
    const { pool, ready } = getCameraPool();
    await ready;
    const action = String(body.action || "");

    if (action === "register" || action === "heartbeat") {
      const id = String(body.deviceId || "");
      const secret = String(body.deviceSecret || "");
      const name = String(body.name || "").trim().slice(0, 80);
      if (!validDeviceCredentials(id, secret) || !name) {
        return noStore({ error: "Valid device details are required." }, 400);
      }

      const [existing] = await pool.execute<RowDataPacket[]>(
        "SELECT secret_hash FROM camera_devices WHERE id=? LIMIT 1",
        [id],
      );
      const secretHash = sha256(secret);
      if (existing[0] && String(existing[0].secret_hash) !== secretHash) {
        return noStore({ error: "Device authentication failed." }, 401);
      }
      if (!existing[0] && action === "heartbeat") {
        return noStore({ error: "Device is not registered." }, 404);
      }

      await pool.execute(
        `INSERT INTO camera_devices
          (id, secret_hash, name, ip_address, user_agent, last_seen)
         VALUES (?, ?, ?, ?, ?, NOW(3))
         ON DUPLICATE KEY UPDATE name=VALUES(name), ip_address=VALUES(ip_address),
           user_agent=VALUES(user_agent), last_seen=NOW(3)`,
        [
          id,
          secretHash,
          name,
          clientIp(request),
          (request.headers.get("user-agent") || "").slice(0, 255),
        ],
      );
      return noStore({ registered: true });
    }

    if (action === "request") {
      const denied = adminRequired(request);
      if (denied) return denied;
      const deviceId = String(body.deviceId || "");
      const [devices] = await pool.execute<RowDataPacket[]>(
        "SELECT id, last_seen >= DATE_SUB(NOW(3), INTERVAL 15 SECOND) AS online FROM camera_devices WHERE id=? LIMIT 1",
        [deviceId],
      );
      if (!devices[0] || !devices[0].online) {
        return noStore({ error: "This computer is currently offline." }, 409);
      }

      await pool.execute(
        "UPDATE camera_sessions SET status='ended', updated_at=NOW(3) WHERE device_id=? AND status IN ('requested','accepted','offered','active')",
        [deviceId],
      );
      const id = crypto.randomUUID();
      await pool.execute(
        `INSERT INTO camera_sessions (id, device_id, status, expires_at)
         VALUES (?, ?, 'requested', DATE_ADD(NOW(3), INTERVAL 5 MINUTE))`,
        [id, deviceId],
      );
      return noStore({ sessionId: id }, 201);
    }

    const sessionId = String(body.sessionId || "");
    const [sessions] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM camera_sessions WHERE id=? LIMIT 1",
      [sessionId],
    );
    const session = sessions[0];
    if (!session) return noStore({ error: "Session not found." }, 404);

    if (["accept", "decline", "offer", "device-end"].includes(action)) {
      const deviceId = String(body.deviceId || "");
      const secret = String(body.deviceSecret || "");
      if (deviceId !== String(session.device_id)
        || !validDeviceCredentials(deviceId, secret)
        || !(await authorizeDevice(pool, deviceId, secret))) {
        return noStore({ error: "Device authentication failed." }, 401);
      }

      if (action === "accept" && session.status === "requested") {
        await pool.execute(
          "UPDATE camera_sessions SET status='accepted', updated_at=NOW(3) WHERE id=?",
          [sessionId],
        );
      } else if (action === "decline" && session.status === "requested") {
        await pool.execute(
          "UPDATE camera_sessions SET status='declined', updated_at=NOW(3) WHERE id=?",
          [sessionId],
        );
      } else if (action === "offer" && ["accepted", "offered"].includes(String(session.status))) {
        const offer = JSON.stringify(body.description || null);
        if (offer.length > 200_000) return noStore({ error: "Offer is too large." }, 413);
        await pool.execute(
          "UPDATE camera_sessions SET status='offered', offer_json=?, updated_at=NOW(3) WHERE id=?",
          [offer, sessionId],
        );
      } else if (action === "device-end") {
        await pool.execute(
          "UPDATE camera_sessions SET status='ended', updated_at=NOW(3) WHERE id=?",
          [sessionId],
        );
      } else {
        return noStore({ error: "This session can no longer perform that action." }, 409);
      }
      return noStore({ updated: true });
    }

    if (action === "answer" || action === "admin-end") {
      const denied = adminRequired(request);
      if (denied) return denied;

      if (action === "answer" && session.status === "offered") {
        const answer = JSON.stringify(body.description || null);
        if (answer.length > 200_000) return noStore({ error: "Answer is too large." }, 413);
        await pool.execute(
          "UPDATE camera_sessions SET status='active', answer_json=?, updated_at=NOW(3), expires_at=DATE_ADD(NOW(3), INTERVAL 30 MINUTE) WHERE id=?",
          [answer, sessionId],
        );
      } else if (action === "admin-end") {
        await pool.execute(
          "UPDATE camera_sessions SET status='ended', updated_at=NOW(3) WHERE id=?",
          [sessionId],
        );
      } else {
        return noStore({ error: "This session can no longer perform that action." }, 409);
      }
      return noStore({ updated: true });
    }

    return noStore({ error: "Unknown action." }, 400);
  } catch (error) {
    console.error("Camera API POST failed", error instanceof Error ? error.message : error);
    return noStore({ error: "Camera service is unavailable." }, 503);
  }
}
