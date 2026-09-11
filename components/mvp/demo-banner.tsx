export function DemoBanner({ text }: { text: string }) {
  return (
    <div
      role="alert"
      className="sticky top-[57px] z-40 border-b border-black/10 bg-banner-bg px-4 py-2.5 text-center text-sm font-semibold text-banner-fg sm:top-[65px]"
    >
      {text}
    </div>
  );
}
