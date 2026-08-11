import "server-only";

import mysql, { type Pool } from "mysql2/promise";

export type PrivacyDecision = "accepted" | "declined";

let pool: Pool | undefined;
let schemaPromise: Promise<void> | undefined;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  pool ??= mysql.createPool({
    uri: process.env.DATABASE_URL,
    connectionLimit: 4,
    enableKeepAlive: true,
  });
  schemaPromise ??= initializeSchema(pool);
  return { pool, ready: schemaPromise };
}

async function initializeSchema(database: Pool) {
  await database.execute(`
    CREATE TABLE IF NOT EXISTS privacy_consents (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      consent_id CHAR(36) NOT NULL,
      decision VARCHAR(16) NOT NULL,
      policy_version VARCHAR(32) NOT NULL,
      page_path VARCHAR(255) NOT NULL DEFAULT '/',
      first_recorded_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      UNIQUE KEY privacy_consents_identity_version_uq (consent_id, policy_version),
      INDEX privacy_consents_updated_idx (updated_at),
      INDEX privacy_consents_decision_idx (decision)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

export async function recordPrivacyConsent(input: {
  consentId: string;
  decision: PrivacyDecision;
  policyVersion: string;
  pagePath: string;
}) {
  const { pool: database, ready } = getPool();
  await ready;
  await database.execute(
    `INSERT INTO privacy_consents
      (consent_id, decision, policy_version, page_path)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE decision=VALUES(decision),
       page_path=VALUES(page_path), updated_at=CURRENT_TIMESTAMP(3)`,
    [
      input.consentId,
      input.decision,
      input.policyVersion,
      input.pagePath,
    ],
  );
}
