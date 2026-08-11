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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
