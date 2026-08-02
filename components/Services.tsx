import Image from "next/image";

const services = [
  {
    number: "01",
    title: "Inventory Systems",
    text: "Bring stock, purchases, sales, suppliers, and reporting into one dependable operational workflow.",
    tags: ["Stock control", "Reporting", "Integrations"],
  },
  {
    number: "02",
    title: "Custom Web Applications",
    text: "Create secure portals and business applications that simplify complex work for teams and customers.",
    tags: ["React", "Next.js", "ASP.NET"],
  },
  {
    number: "03",
    title: "Excel & Access Solutions",
    text: "Transform spreadsheets and databases into reliable tools with advanced automation, forms, and reporting.",
    tags: ["VBA", "MS Access", "Excel"],
  },
  {
    number: "04",
    title: "Desktop Applications",
    text: "Build purpose-made software around your business rules, users, data, and day-to-day decisions.",
    tags: [".NET", "VB.NET", "SQL Server"],
  },
  {
    number: "05",
    title: "Data, BI & Cloud",
    text: "Connect information, dashboards, APIs, and cloud infrastructure for greater visibility and scale.",
    tags: ["Power BI", "MongoDB", "SQL Server", "MySQL", "Azure & AWS"],
  },
  {
    number: "06",
    title: "API & System Integration",
    text: "Connect business applications, databases, payment services, CRMs, and third-party platforms through secure, reliable APIs.",
    tags: ["REST APIs", "GraphQL", "SOAP", "Webhooks", "Integrations"],
  },
  {
    number: "07",
    title: "Chatbot Services",
    text: "Create customer-facing and internal chatbots for support, lead capture, FAQs, knowledge access, and routine workflow assistance.",
    tags: ["AI assistants", "Support", "Knowledge", "Whatsapp", "Lead capture"],
  },
  {
    number: "08",
    title: "Bulk Email & Automation",
    text: "Build permission-based bulk email, transactional messaging, scheduled campaigns, follow-up sequences, and delivery reporting.",
    tags: ["Bulk email", "Workflows", "Analytics"],
  },
];

export function Services() {
  return (
    <section id="services" className="bg-paper py-20 sm:py-24">
      <div className="container-shell">
        <h2 className="gradient-heading max-w-4xl text-4xl font-semibold leading-[1.06] tracking-[-0.045em] sm:text-6xl">
          Let&apos;s Build Your Technology Around Your Business Goals
        </h2>

        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="section-kicker">Service overview</p>
            <h3 className="mt-6 max-w-xl text-3xl font-semibold leading-[1.12] tracking-[-0.035em] sm:text-4xl">
              Discover what is and isn&apos;t working inside your operation.
            </h3>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Technology should support your team, not slow it down. I assess
              the current workflow, systems, data, risks, and growth plans to
              identify where focused software can create the greatest value.
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex rounded-lg bg-green px-6 py-3.5 text-sm font-bold text-white transition hover:bg-ink hover:text-white"
            >
              Discuss your environment <span className="ml-3" aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="relative order-1 min-h-[420px] overflow-hidden rounded-2xl lg:order-2">
            <Image
              src="/images/about-consulting.png"
              alt="Consultants reviewing a business process and data"
              fill
              sizes="(min-width: 1024px) 620px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative min-h-[380px] overflow-hidden rounded-2xl">
            <Image
              src="/images/technology-platform.png"
              alt="Connected application, database, cloud, and analytics platform"
              fill
              sizes="(min-width: 1024px) 620px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="lg:pl-10">
            <p className="section-kicker">How I help</p>
            <h3 className="mt-6 max-w-xl text-3xl font-semibold leading-[1.12] tracking-[-0.035em] sm:text-4xl">
              Turn to a practical software partner to modernise your technology.
            </h3>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              From assessing cost and risk to streamlining operations and
              building the solution, consulting continues through delivery—so
              you are never left with advice but no implementation.
            </p>
          </div>
        </div>

        <div id="capabilities" className="scroll-mt-32 pt-20">
          <div className="max-w-3xl">
            <p className="section-kicker">Service areas</p>
            <h3 className="gradient-heading mt-6 text-4xl font-semibold leading-[1.06] tracking-[-0.045em] sm:text-5xl">
              Choose Consulting Services Designed to Help You Grow
            </h3>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.number}
                className="lift flex min-h-[300px] flex-col rounded-2xl border border-line bg-white p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-green">
                    {service.number}
                  </span>
                  <span className="grid size-10 place-items-center rounded-full bg-cream text-green">
                    ↗
                  </span>
                </div>
                <div className="mt-auto">
                  <h4 className="text-2xl font-semibold">{service.title}</h4>
                  <p className="mt-4 text-sm leading-6 text-muted">{service.text}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
