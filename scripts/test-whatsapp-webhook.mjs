import assert from "node:assert/strict";
import crypto from "node:crypto";
import http from "node:http";

process.env.META_WEBHOOK_VERIFY_TOKEN = "local-test-token";
process.env.META_APP_SECRET = "local-test-app-secret";
process.env.WHATSAPP_WEBHOOK_FORWARD_SECRET = "local-forward-secret";
delete process.env.DATABASE_URL;

let captured;
let resolveCapture;
const capturePromise = new Promise((resolve) => { resolveCapture = resolve; });
const receiver = http.createServer((request, response) => {
  let body = "";
  request.setEncoding("utf8");
  request.on("data", (chunk) => { body += chunk; });
  request.on("end", () => {
    captured = { body, secret: request.headers["x-waveping-webhook-secret"] };
    resolveCapture(captured);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end('{"received":true}');
  });
});
await new Promise((resolve) => receiver.listen(0, "127.0.0.1", resolve));
const address = receiver.address();
process.env.WHATSAPP_WEBHOOK_FORWARD_URL = `http://127.0.0.1:${address.port}/api/meta/webhook`;

const { GET, POST } = await import("../app/api/webhook/whatsapp/route.js");

const health = await GET(new Request("http://localhost/api/webhook/whatsapp"));
assert.equal(health.status, 200);
assert.deepEqual(await health.json(), {
  ready: true,
  verifyTokenConfigured: true,
  appSecretConfigured: true,
  deliveryDestination: "forward",
});

const verification = await GET(new Request(
  "http://localhost/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=local-test-token&hub.challenge=verified",
));
assert.equal(verification.status, 200);
assert.equal(await verification.text(), "verified");

const rejectedVerification = await GET(new Request(
  "http://localhost/api/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=no",
));
assert.equal(rejectedVerification.status, 403);

const payload = JSON.stringify({
  object: "whatsapp_business_account",
  entry: [{
    id: "test-waba",
    changes: [{
      field: "messages",
      value: {
        statuses: [{
          id: "wamid.webhook-contract-test",
          status: "sent",
          timestamp: "1786032000",
          recipient_id: "919999999999",
        }],
      },
    }],
  }],
});
const signature = `sha256=${crypto.createHmac("sha256", process.env.META_APP_SECRET).update(payload).digest("hex")}`;
const delivered = await POST(new Request("http://localhost/api/webhook/whatsapp", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-hub-signature-256": signature },
  body: payload,
}));
assert.equal(delivered.status, 200);
assert.deepEqual(await delivered.json(), { received: true, statuses: 1 });
await capturePromise;
assert.equal(captured.body, payload);
assert.equal(captured.secret, "local-forward-secret");

const invalidSignature = await POST(new Request("http://localhost/api/webhook/whatsapp", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-hub-signature-256": "sha256=invalid" },
  body: payload,
}));
assert.equal(invalidSignature.status, 401);

receiver.close();
console.log("WhatsApp webhook verification, signature validation, parsing and forwarding passed.");
