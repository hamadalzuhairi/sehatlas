import clsx from "clsx";
import { SITE_NAME } from "@/lib/site-config";

/**
 * The mark is the product in miniature: a four-quadrant plot with the
 * priority quadrant (low access, high vulnerability) filled and pinned.
 */
export function LogoMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      focusable="false"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="var(--logo-bg, #0a6e5f)" />
      <rect x="7" y="7" width="8.2" height="8.2" rx="1.6" fill="var(--logo-priority, #ffffff)" />
      <rect x="16.8" y="7" width="8.2" height="8.2" rx="1.6" fill="var(--logo-dim, #ffffff)" fillOpacity="0.32" />
      <rect x="7" y="16.8" width="8.2" height="8.2" rx="1.6" fill="var(--logo-dim, #ffffff)" fillOpacity="0.32" />
      <rect x="16.8" y="16.8" width="8.2" height="8.2" rx="1.6" fill="var(--logo-dim, #ffffff)" fillOpacity="0.18" />
      <circle cx="11.1" cy="11.1" r="1.9" fill="var(--logo-bg, #0a6e5f)" />
    </svg>
  );
}

export function Logo({
  size = 32,
  className,
  textClassName,
  name = SITE_NAME,
}: {
  size?: number;
  className?: string;
  textClassName?: string;
  /** Localised wordmark. Defaults to the Latin name. */
  name?: string;
}) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      <span className={clsx("font-semibold tracking-tight text-fg", textClassName)}>
        {name}
      </span>
    </span>
  );
}
