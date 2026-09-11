import { DATA_SOURCES } from "@/lib/site-config";

export function DataSourceStrip() {
  const items = [...DATA_SOURCES, ...DATA_SOURCES];

  return (
    <div className="hide-scrollbar overflow-hidden border-y border-border bg-bg-sunken py-6">
      <div className="flex w-max animate-marquee gap-12 ps-6">
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="shrink-0 whitespace-nowrap text-lg font-semibold tracking-tight text-fg-muted/70"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
