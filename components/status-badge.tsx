import clsx from "clsx";

export type FeatureStatus = "live" | "in-development" | "planned" | "permission-dependent";

const STATUS_STYLES: Record<FeatureStatus, string> = {
  live: "bg-quad-none/15 text-quad-none border-quad-none/40",
  "in-development": "bg-accent-soft text-accent border-accent/40",
  planned: "bg-quad-remote/15 text-quad-remote border-quad-remote/40",
  "permission-dependent": "bg-quad-served/15 text-quad-served border-quad-served/40",
};

export function StatusBadge({
  status,
  label,
}: {
  status: FeatureStatus;
  label: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        STATUS_STYLES[status],
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
