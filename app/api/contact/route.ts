import { NextResponse } from "next/server";
import { CONTACT_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site-config";

export const runtime = "nodejs";

const LIMITS = {
  name: 200,
  organisation: 200,
  email: 254,
  enquiryType: 60,
  message: 5000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  // Honeypot. The field is hidden from people, so anything in it is a bot —
  // (named so that no password manager autofill heuristic matches it) —
  // answer as if it went through rather than teaching the bot to retry.
  if (field((body as Record<string, unknown>).hp_field, 200)) {
    return NextResponse.json({ ok: true });
  }

  const payload = body as Record<string, unknown>;
  const name = field(payload.name, LIMITS.name);
  const email = field(payload.email, LIMITS.email);
  const message = field(payload.message, LIMITS.message);
  const organisation = field(payload.organisation, LIMITS.organisation);
  const enquiryType = field(payload.enquiryType, LIMITS.enquiryType) || "general";

  if (!name || !message || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const subject = `[${SITE_NAME}] ${enquiryType} — ${name}`;
  const text = [
    `Name: ${name}`,
    organisation ? `Organisation: ${organisation}` : null,
    `Email: ${email}`,
    `Enquiry type: ${enquiryType}`,
    "",
    message,
    "",
    "—",
    `Sent from the contact form at ${SITE_URL}`,
  ]
    .filter(Boolean)
    .join("\n");

  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Resend's shared sender works without verifying a domain. Set
          // CONTACT_FROM_EMAIL once sehhatlas.health is verified there.
          from: process.env.CONTACT_FROM_EMAIL ?? `${SITE_NAME} <onboarding@resend.dev>`,
          to: [process.env.CONTACT_TO_EMAIL ?? CONTACT_EMAIL],
          // Replying to the notification replies to the enquirer, not to us.
          reply_to: email,
          subject,
          text,
        }),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        console.error("[contact] Resend rejected the message", response.status, detail);
        return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
      }

      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("[contact] could not reach Resend", error);
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }
  }

  // Generic webhook, for anyone wiring this to something other than Resend.
  const endpoint = process.env.CONTACT_FORM_ENDPOINT;

  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, organisation, email, enquiryType, message }),
      });

      if (!response.ok) {
        console.error("[contact] endpoint rejected the message", response.status);
        return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
      }

      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("[contact] could not reach the endpoint", error);
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }
  }

  // Default path: FormSubmit forwards straight to the inbox and needs no key
  // or account — only a one-time confirmation click by the owner. Delivery is
  // server-side so the address is never in the client bundle.
  const origin = request.headers.get("origin") ?? SITE_URL;

  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(
        process.env.CONTACT_TO_EMAIL ?? CONTACT_EMAIL,
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // FormSubmit rejects calls with no page origin ("open this page
          // through a web server"). A server-to-server fetch sends neither
          // header, so pass the site's own origin through.
          Origin: origin,
          Referer: `${origin}/`,
        },
        body: JSON.stringify({
          name,
          email,
          organisation,
          enquiryType,
          message,
          _subject: subject,
          _template: "table",
          // No interstitial captcha page — this is a server-to-server call.
          _captcha: "false",
        }),
      },
    );

    const result = (await response.json().catch(() => null)) as
      | { success?: string | boolean; message?: string }
      | null;

    // FormSubmit answers 200 with success:"true"; anything else is a failure
    // worth surfacing rather than showing a success screen over.
    const delivered =
      response.ok && (result?.success === true || result?.success === "true");

    if (!delivered) {
      console.error(
        "[contact] FormSubmit did not accept the message",
        response.status,
        result?.message ?? "",
      );
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] could not reach FormSubmit", error);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}
