const anchors = [
  { label: "Overview", href: "#services" },
  { label: "Service Areas", href: "#capabilities" },
  { label: "How We Deliver", href: "#approach" },
  { label: "Working With Us", href: "#about" },
  { label: "Technology", href: "#technology" },
  { label: "Clients", href: "#clients" },
  { label: "Contact", href: "#contact" },
];

export function AnchorNav() {
  return (
    <div className="sticky top-[94px] z-30 hidden bg-paper/95 py-3 backdrop-blur-md md:block">
      <nav
        className="container-shell flex items-center gap-6 overflow-x-auto rounded-xl bg-[#f0f1f3] px-6 py-4"
        aria-label="Page sections"
      >
        {anchors.map((anchor) => (
          <a
            key={anchor.href}
            href={anchor.href}
            className="shrink-0 text-[13px] font-semibold text-ink/85 transition hover:text-green"
          >
            {anchor.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
