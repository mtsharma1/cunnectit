import { BrandLogo } from "./BrandLogo";

const serviceColumns = [
  [
    { label: "Inventory systems", href: "#capabilities" },
    { label: "Web applications", href: "#capabilities" },
    { label: "API integrations", href: "#capabilities" },
    { label: "Chatbot services", href: "#capabilities" },
  ],
  [
    { label: "Excel & Access", href: "#capabilities" },
    { label: "Desktop applications", href: "#capabilities" },
    { label: "Bulk email automation", href: "#capabilities" },
    { label: "Data, BI & cloud", href: "#technology" },
  ],
];

const companyColumns = [
  [
    { label: "About us", href: "#about" },
    { label: "How we work", href: "#approach" },
    { label: "Technology", href: "#technology" },
    { label: "Contact us", href: "#contact" },
  ],
  [
    { label: "React & Next.js", href: "#technology" },
    { label: ".NET & SQL Server", href: "#technology" },
    { label: "Excel, VBA & Access", href: "#technology" },
    { label: "Azure & AWS", href: "#technology" },
  ],
];

const legal = [
  "Privacy",
  "Terms",
  "Security",
  "Accessibility",
  "Cookie preferences",
];

export function Footer() {
  return (
    <footer className="bg-[#f4f2ef] text-ink">
      <div className="container-shell py-12 sm:py-16">
        <div>
          <a
            href="#top"
            className="inline-flex"
            aria-label="Cunnectit home"
          >
            <BrandLogo size="footer" />
          </a>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="text-2xl font-medium">Services</h2>
            <div className="mt-4 h-0.5 w-12 bg-coral" />
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {serviceColumns.map((column, index) => (
                <nav key={index} className="grid gap-4" aria-label={`Services column ${index + 1}`}>
                  {column.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm text-ink/75 transition hover:translate-x-1 hover:text-green"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-medium">About us</h2>
            <div className="mt-4 h-0.5 w-12 bg-coral" />
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {companyColumns.map((column, index) => (
                <nav key={index} className="grid gap-4" aria-label={`Company column ${index + 1}`}>
                  {column.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm text-ink/75 transition hover:translate-x-1 hover:text-green"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-ink/10 pt-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-ink/65">
              {legal.map((item, index) => (
                <span key={item} className="inline-flex items-center gap-3">
                  {item}
                  {index < legal.length - 1 && (
                    <span className="text-ink/30" aria-hidden="true">|</span>
                  )}
                </span>
              ))}
            </div>
            <p className="text-xs font-medium text-ink/70">India · English⌃</p>
          </div>

          <div className="mt-9 flex flex-col gap-3 text-xs text-ink/55 sm:flex-row sm:items-center sm:justify-between">
            <p>Copyright © 2026 Mithlesh Software Consulting. All rights reserved.</p>
            <p>Greater Noida · Delhi NCR · India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
