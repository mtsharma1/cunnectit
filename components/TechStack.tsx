import Image from "next/image";

const groups = [
  {
    number: "01",
    title: "Applications",
    text: "Portals, internal tools, APIs, and desktop applications.",
    items: ["React.js", "Next.js", "ASP.NET", "VB.NET", "REST APIs", "Webhooks"],
  },
  {
    number: "02",
    title: "Data & automation",
    text: "Structured data, reporting, and automation for daily operations.",
    items: ["SQL Server", "MongoDB", "Excel", "VBA", "MS Access", "Email APIs"],
  },
  {
    number: "03",
    title: "Cloud & intelligence",
    text: "Secure infrastructure and decision-ready business insight.",
    items: ["Azure", "AWS", "Power BI", "AI Chatbots", "Automation"],
  },
];

export function TechStack() {
  return (
    <section id="technology" className="bg-paper py-20 sm:py-28">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-[28px] border border-line bg-cream p-8 sm:p-11">
            <p className="section-kicker">Technology strategy</p>
            <h2 className="mt-6 text-4xl font-semibold leading-[1] tracking-[-0.05em] sm:text-5xl">
              Right-sized technology, selected for the outcome.
            </h2>
            <p className="mt-7 max-w-xl leading-7 text-ink/65">
              The stack is chosen around your users, current environment,
              security, budget, ownership, and growth plan—not around trends.
            </p>
            <div className="mt-10 border-t border-ink/15 pt-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-ink/50">
                The principle
              </p>
              <p className="mt-3 text-xl font-semibold">
                Use the simplest architecture that can deliver the result
                reliably.
              </p>
            </div>
          </div>

          <div className="relative min-h-[460px] overflow-hidden rounded-[28px] bg-night">
            <Image
              src="/images/technology-platform.png"
              alt="Connected applications, data, cloud, and business intelligence systems"
              fill
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-night/80 p-7 text-white backdrop-blur-sm sm:p-9">
              <p className="max-w-xl text-lg font-medium">
                Extend what already works. Modernise what holds the business
                back. Build new only where it creates real value.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {groups.map((group) => (
            <article
              key={group.number}
              className="lift rounded-[24px] border border-line bg-white p-7"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-green">
                  {group.number}
                </span>
                <span className="size-2 rounded-full bg-lime ring-4 ring-lime/25" />
              </div>
              <h3 className="mt-10 text-2xl font-semibold">{group.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{group.text}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg bg-cream px-3 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.08em]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
