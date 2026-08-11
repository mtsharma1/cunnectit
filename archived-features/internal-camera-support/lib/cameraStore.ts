import crypto from "node:crypto";
import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";

let pool: Pool | undefined;
let schemaPromise: Promise<void> | undefined;

export function getCameraPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  pool ??= mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 4,
    enableKeepAlive: true,
  });

  schemaPromise ??= initializeCameraSchema(pool);
  return { pool, ready: schemaPromise };
}

async function initializeCameraSchema(database: Pool) {
  await database.execute(`
    CREATE TABLE IF NOT EXISTS camera_devices (
      id CHAR(36) PRIMARY KEY,
      secret_hash CHAR(64) NOT NULL,
      name VARCHAR(80) NOT NULL,
      ip_address VARCHAR(64) NOT NULL,
      user_agent VARCHAR(255) NOT NULL DEFAULT '',
      last_seen DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      INDEX camera_devices_last_seen_idx (last_seen)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await database.execute(`
    CREATE TABLE IF NOT EXISTS camera_sessions (
      id CHAR(36) PRIMARY KEY,
      device_id CHAR(36) NOT NULL,
      status VARCHAR(20) NOT NULL,
      offer_json MEDIUMTEXT NULL,
      answer_json MEDIUMTEXT NULL,
      requested_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      expires_at DATETIME(3) NOT NULL,
      INDEX camera_sessions_device_idx (device_id, requested_at),
      INDEX camera_sessions_status_idx (status, expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function safeSecretMatch(received: string, expected: string) {
  const receivedBytes = Buffer.from(received);
  const expectedBytes = Buffer.from(expected);
  return receivedBytes.length === expectedBytes.length
    && crypto.timingSafeEqual(receivedBytes, expectedBytes);
}

export function isAdminRequest(request: Request) {
  const configured = process.env.CAMERA_ADMIN_KEY || "";
  const received = request.headers.get("x-camera-admin-key") || "";
  return configured.length >= 16 && safeSecretMatch(received, configured);
}

export function clientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "Unavailable"
  ).slice(0, 64);
}

export function validDeviceCredentials(id: unknown, secret: unknown) {
  return typeof id === "string"
    && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
    && typeof secret === "string"
    && secret.length >= 32
    && secret.length <= 160;
}

export async function authorizeDevice(database: Pool, id: string, secret: string) {
  const [rows] = await database.execute<RowDataPacket[]>(
    "SELECT secret_hash FROM camera_devices WHERE id=? LIMIT 1",
    [id],
  );
  return Boolean(rows[0] && safeSecretMatch(sha256(secret), String(rows[0].secret_hash)));
}

export function parseSessionJson(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function publicSession(row: RowDataPacket) {
  return {
    id: String(row.id),
    deviceId: String(row.device_id),
    status: String(row.status),
    offer: parseSessionJson(row.offer_json),
    answer: parseSessionJson(row.answer_json),
    requestedAt: row.requested_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at,
  };
}
