import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.message !== "string" ||
    !body.name.trim() ||
    !body.email.trim() ||
    !body.message.trim()
  ) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const destination = process.env.CONTACT_FORM_ENDPOINT;

  if (destination) {
    try {
      await fetch(destination, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }
  } else {
    console.log("[contact form submission — CONTACT_FORM_ENDPOINT not configured]", body);
  }

  return NextResponse.json({ ok: true });
}
