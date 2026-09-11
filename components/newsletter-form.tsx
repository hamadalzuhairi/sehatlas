"use client";

export function NewsletterForm({
  placeholder,
  cta,
}: {
  placeholder: string;
  cta: string;
}) {
  return (
    <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="footer-newsletter-email" className="sr-only">
        {placeholder}
      </label>
      <input
        id="footer-newsletter-email"
        type="email"
        placeholder={placeholder}
        className="w-full min-w-0 rounded-md border border-border bg-bg-raised px-3 py-2 text-sm text-fg placeholder:text-fg-muted"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-accent-fg"
      >
        {cta}
      </button>
    </form>
  );
}
