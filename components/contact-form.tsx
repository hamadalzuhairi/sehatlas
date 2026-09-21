"use client";

import { useState } from "react";
import { sendEnquiry } from "@/lib/send-enquiry";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  labels,
}: {
  labels: {
    name: string;
    organisation: string;
    email: string;
    enquiryType: string;
    enquiryOptions: { general: string; research: string; partnership: string; press: string };
    message: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    errorBody: string;
  };
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries()) as Record<string, string>;

    // Honeypot: hidden from people, so anything in it is a bot. Show the
    // success screen without sending, rather than teaching it to retry.
    if (payload.hp_field) {
      setStatus("success");
      return;
    }

    setStatus("submitting");
    const sent = await sendEnquiry({
      name: payload.name ?? "",
      email: payload.email ?? "",
      message: payload.message ?? "",
      organisation: payload.organisation ?? "",
      enquiryType: payload.enquiryType ?? "general",
    });
    setStatus(sent ? "success" : "error");
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-quad-none/40 bg-quad-none/10 p-6">
        <h2 className="text-lg font-bold text-fg">{labels.successTitle}</h2>
        <p className="mt-2 text-sm text-fg-muted">{labels.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <input
        type="text"
        name="hp_field"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fg-muted">
            {labels.name}
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-md border border-border bg-bg-raised px-3 py-2 text-sm text-fg"
          />
        </div>
        <div>
          <label htmlFor="organisation" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fg-muted">
            {labels.organisation}
          </label>
          <input
            id="organisation"
            name="organisation"
            className="w-full rounded-md border border-border bg-bg-raised px-3 py-2 text-sm text-fg"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fg-muted">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-border bg-bg-raised px-3 py-2 text-sm text-fg"
        />
      </div>

      <div>
        <label htmlFor="enquiryType" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fg-muted">
          {labels.enquiryType}
        </label>
        <select
          id="enquiryType"
          name="enquiryType"
          className="w-full rounded-md border border-border bg-bg-raised px-3 py-2 text-sm text-fg"
          defaultValue="general"
        >
          <option value="general">{labels.enquiryOptions.general}</option>
          <option value="research">{labels.enquiryOptions.research}</option>
          <option value="partnership">{labels.enquiryOptions.partnership}</option>
          <option value="press">{labels.enquiryOptions.press}</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-fg-muted">
          {labels.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-md border border-border bg-bg-raised px-3 py-2 text-sm text-fg"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-quad-priority">
          {labels.errorBody}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
