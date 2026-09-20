"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error" | "invalid";

export function NewsletterForm({
  placeholder,
  cta,
  successText,
  errorText,
  invalidText,
}: {
  placeholder: string;
  cta: string;
  successText: string;
  errorText: string;
  invalidText: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("invalid");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter subscriber",
          email,
          enquiryType: "newsletter",
          message: "Requested an update when Phase 1 results are published.",
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="mt-3 rounded-md border border-accent/40 bg-accent-soft px-3 py-2 text-sm text-fg">
        {successText}
      </p>
    );
  }

  return (
    <form className="mt-3" onSubmit={handleSubmit} noValidate>
      <div className="flex gap-2">
        <label htmlFor="footer-newsletter-email" className="sr-only">
          {placeholder}
        </label>
        <input
          id="footer-newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder={placeholder}
          aria-invalid={status === "invalid"}
          className="w-full min-w-0 rounded-md border border-border bg-bg-raised px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-accent"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {cta}
        </button>
      </div>
      {(status === "error" || status === "invalid") && (
        <p role="alert" className="mt-2 text-xs text-quad-priority">
          {status === "invalid" ? invalidText : errorText}
        </p>
      )}
    </form>
  );
}
