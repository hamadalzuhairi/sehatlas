import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site-config";

export type Enquiry = {
  name: string;
  email: string;
  message: string;
  organisation?: string;
  enquiryType?: string;
};

/**
 * Sends an enquiry to the founder's inbox.
 *
 * FormSubmit answers 403 to requests from datacenter IPs, so posting from a
 * Vercel function fails while the same call from a visitor's browser
 * succeeds. The request therefore leaves from the client. The address is
 * already printed on the contact page, so putting it in the bundle exposes
 * nothing new.
 *
 * The API route is kept as a second attempt: it is the path that runs when a
 * server-side provider (Resend, or a webhook) is configured, and it costs
 * nothing to fall back to when the direct call fails.
 */
export async function sendEnquiry(enquiry: Enquiry): Promise<boolean> {
  const { name, email, message, organisation = "", enquiryType = "general" } = enquiry;
  const subject = `[${SITE_NAME}] ${enquiryType} — ${name}`;

  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          organisation,
          enquiryType,
          message,
          _subject: subject,
          _template: "table",
          _captcha: "false",
        }),
      },
    );

    const result = (await response.json().catch(() => null)) as
      | { success?: string | boolean }
      | null;

    // FormSubmit returns 200 with an activation notice when the address has
    // not been confirmed yet, so the status alone is not enough.
    if (response.ok && (result?.success === true || result?.success === "true")) {
      return true;
    }
  } catch {
    /* fall through to the server route */
  }

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, organisation, enquiryType }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
