"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PrivacyDecision = "accepted" | "declined";

const policyVersion = "2026-08-12";
const choiceKey = "cunnectit-privacy-choice";
const idKey = "cunnectit-privacy-id";

type StoredChoice = {
  decision: PrivacyDecision;
  policyVersion: string;
};

function currentConsentId() {
  const existing = localStorage.getItem(idKey);
  if (existing) return existing;
  const created = crypto.randomUUID();
  localStorage.setItem(idKey, created);
  return created;
}

export function PrivacyConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const explicitlyOpened = params.get("privacy-settings") === "open";
    try {
      const stored = localStorage.getItem(choiceKey);
      const choice = stored ? JSON.parse(stored) as StoredChoice : null;
      setVisible(
        explicitlyOpened
        || !choice
        || choice.policyVersion !== policyVersion,
      );
    } catch {
      localStorage.removeItem(choiceKey);
      setVisible(true);
    }
  }, []);

  const saveChoice = async (decision: PrivacyDecision) => {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/privacy-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consentId: currentConsentId(),
          decision,
          policyVersion,
          pagePath: `${window.location.pathname}${window.location.search}`,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save your choice.");

      localStorage.setItem(choiceKey, JSON.stringify({ decision, policyVersion }));
      document.cookie = `cunnectit_privacy_choice=${decision}; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;
      window.dispatchEvent(new CustomEvent("cunnectit:privacy-consent", {
        detail: { decision, policyVersion },
      }));
      setVisible(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save your choice.");
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <aside
      className="fixed inset-x-0 bottom-0 z-[120] border-t border-white/15 bg-[#102729] px-4 py-4 text-white shadow-[0_-18px_55px_rgba(0,0,0,0.22)] sm:px-6"
      role="dialog"
      aria-modal="false"
      aria-label="Privacy preferences"
    >
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm leading-6 text-white/85">
            We use necessary storage to remember your preferences and optional
            analytics cookies to understand site usage. Read our{" "}
            <Link
              href="/privacy-policy"
              className="font-semibold text-white underline decoration-white/45 underline-offset-4 transition hover:text-coral"
            >
              Privacy Policy
            </Link>
            .
          </p>
          {error && (
            <p className="mt-1 text-xs font-medium text-[#ffb4aa]" aria-live="polite">
              {error}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void saveChoice("declined")}
            disabled={saving}
            className="rounded-lg border border-white/35 px-5 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => void saveChoice("accepted")}
            disabled={saving}
            className="rounded-lg bg-coral px-6 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#102729] disabled:cursor-wait disabled:opacity-60"
          >
            {saving ? "Saving…" : "Accept"}
          </button>
        </div>
      </div>
    </aside>
  );
}
