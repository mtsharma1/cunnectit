"use client";

import { FormEvent, useState } from "react";

type Challenge = {
  first: number;
  second: number;
};

const initialChallenge: Challenge = { first: 7, second: 5 };

function newChallenge(): Challenge {
  return {
    first: Math.floor(Math.random() * 8) + 2,
    second: Math.floor(Math.random() * 8) + 2,
  };
}

export function ContactEnquiryForm() {
  const [challenge, setChallenge] = useState(initialChallenge);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function refreshChallenge() {
    setChallenge(newChallenge());
    setAnswer("");
    setError("");
  }

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    if (Number(answer) !== challenge.first + challenge.second) {
      setError("Please enter the correct security answer.");
      return;
    }

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const description = String(form.get("description") ?? "");
    const website = String(form.get("website") ?? "");

    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, description, website }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "The enquiry could not be sent.");
      }

      formElement.reset();
      refreshChallenge();
      setStatus("Thank you. Your enquiry has been emailed successfully.");
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The enquiry could not be sent. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-2 w-full border border-ink/20 bg-white px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink/40 focus:border-coral focus:ring-1 focus:ring-coral";

  return (
    <form
      onSubmit={submitEnquiry}
      className="border border-ink/15 bg-white p-5 sm:p-7"
    >
      <div className="grid gap-5">
        <label className="hidden" aria-hidden="true">
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>

        <label className="text-sm font-semibold text-ink">
          Full name <span className="text-coral">*</span>
          <input
            className={inputClass}
            type="text"
            name="name"
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </label>

        <label className="text-sm font-semibold text-ink">
          Email address <span className="text-coral">*</span>
          <input
            className={inputClass}
            type="email"
            name="email"
            placeholder="you@email.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="text-sm font-semibold text-ink">
          Phone number <span className="font-normal text-ink/50">(optional)</span>
          <input
            className={inputClass}
            type="tel"
            name="phone"
            placeholder="+91 XXXXX XXXXX"
            autoComplete="tel"
          />
        </label>

        <label className="text-sm font-semibold text-ink">
          Brief description <span className="text-coral">*</span>
          <span className="mt-1 block text-xs font-normal text-ink/55">
            What problem are you trying to solve or improve?
          </span>
          <textarea
            className={`${inputClass} min-h-40 resize-y`}
            name="description"
            placeholder="Describe the problem, manual process, or system you need help with..."
            required
          />
        </label>

        <div className="flex flex-col gap-3 border border-ink/15 bg-cream/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-medium">Security verification</span>
            <span className="font-mono font-semibold">
              {challenge.first} + {challenge.second} =
            </span>
            <input
              type="number"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              className="h-11 w-20 border border-ink/20 bg-white px-3 text-center outline-none focus:border-coral"
              aria-label="Security verification answer"
              placeholder="?"
              required
            />
          </div>
          <button
            type="button"
            onClick={refreshChallenge}
            className="h-11 border border-ink/25 bg-white px-4 text-xs font-semibold text-ink transition hover:border-coral hover:text-coral"
            aria-label="Create a new security question"
          >
            New question ↻
          </button>
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-coral">
            {error}
          </p>
        )}
        {status && (
          <p role="status" className="text-sm font-medium text-ink/70">
            {status}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-night px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-coral hover:text-white disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Sending enquiry..." : "Send enquiry"}{" "}
          {!submitting && <span className="ml-2" aria-hidden="true">↗</span>}
        </button>

        <p className="text-center text-xs leading-5 text-ink/50">
          We work on a limited number of projects at a time to ensure quality and responsiveness.
        </p>
      </div>
    </form>
  );
}
