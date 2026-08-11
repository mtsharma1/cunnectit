import {
  recordPrivacyConsent,
  type PrivacyDecision,
} from "@/lib/privacyConsentStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const expectedHost = request.headers.get("x-forwarded-host")
    || request.headers.get("host");
  try {
    return Boolean(expectedHost && new URL(origin).host === expectedHost);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return Response.json({ error: "Cross-origin request rejected." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const consentId = String(body.consentId || "");
  const decision = String(body.decision || "") as PrivacyDecision;
  const policyVersion = String(body.policyVersion || "");
  const rawPagePath = String(body.pagePath || "/");

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(consentId)) {
    return Response.json({ error: "Invalid consent identifier." }, { status: 400 });
  }
  if (!(["accepted", "declined"] as const).includes(decision)) {
    return Response.json({ error: "Invalid privacy decision." }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(policyVersion)) {
    return Response.json({ error: "Invalid policy version." }, { status: 400 });
  }
  const pagePath = rawPagePath.startsWith("/")
    ? rawPagePath.slice(0, 255)
    : "/";

  try {
    await recordPrivacyConsent({ consentId, decision, policyVersion, pagePath });
    return Response.json({ stored: true }, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Privacy consent storage failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return Response.json(
      { error: "Your preference could not be stored. Please try again." },
      { status: 503 },
    );
  }
}
