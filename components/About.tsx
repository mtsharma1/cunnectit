import Image from "next/image";

const strengths = [
  ["Business-first", "Requirements start with your workflow, people, and measurable goals."],
  ["Microsoft depth", "Excel, Access, VBA, .NET, and SQL Server expertise reduces modernisation risk."],
  ["Full delivery", "Strategy, user experience, development, deployment, and improvement stay connected."],
  ["Direct ownership", "You work with the consultant responsible for shaping and delivering the solution."],
];

const specialties = [
  ".NET & SQL Server",
  "Excel, Access & VBA",
  "ASP.NET web applications",
  "BI & data warehousing",
  "Business process automation",
  "Cloud & web platforms",
  "Custom software development",
  "Database design & reporting",
];

const showcase = [
  {
    title: "Process automation",
    text: "Replace fragmented manual work with one clear operational flow.",
    image: "/images/about-consulting.png",
    href: "#services",
  },
  {
    title: "Custom applications",
    text: "Build focused software around the work your team actually performs.",
    image: "/images/approach-process.png",
    href: "#approach",
  },
  {
    title: "Data & cloud",
    text: "Connect information, reporting, and infrastructure for better decisions.",
    image: "/images/technology-platform.png",
    href: "#technology",
  },
];

export function About() {
  return (
    <section id="about" className="overflow-hidden bg-cream py-20 sm:py-28">
      <div className="container-shell">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="relative lg:sticky lg:top-28">
            <div className="relative min-h-[560px] overflow-hidden rounded-[28px] bg-night">
              <Image
                src="/images/about-consulting.png"
                alt="Consultants reviewing a business process and inventory information"
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,16,13,0.9),rgba(6,16,13,0.05)_65%)]" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-white sm:p-9">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-lime">
                  Delhi NCR · India
                </p>
                <p className="mt-4 max-w-sm text-2xl font-semibold leading-tight">
                  Personal consulting backed by serious delivery capability.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-3 rounded-2xl bg-lime p-5 text-night shadow-xl sm:-right-6">
              <p className="text-3xl font-semibold">200+</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.12em]">
                Clients served
              </p>
            </div>
          </div>

          <div className="lg:pl-8">
            <p className="section-kicker">About the consultancy</p>
            <h2 className="mt-6 text-4xl font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl">
              Useful software.
              <span className="block text-green">No unnecessary complexity.</span>
            </h2>

            <div className="mt-9 space-y-5 text-base leading-8 text-muted sm:text-lg">
              <p>
                Our journey began in 2010. Since then, our consultants and
                developers have built decades of combined experience delivering
                pragmatic, cost-effective business systems.
              </p>
              <p>
                Based in Delhi NCR, our delivery network brings together four
                consultants and 12 in-house developers. Clients receive direct,
                personal service with the technical depth needed for larger
                applications and modernisation programmes.
              </p>
              <p>
                More than 200 clients have trusted us with desktop software,
                Microsoft Office solutions, web applications, databases,
                reporting, business intelligence, and data warehousing.
              </p>
            </div>

            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-ink/10 sm:grid-cols-2">
              {strengths.map(([title, text], index) => (
                <div key={title} className="bg-paper p-6">
                  <span className="font-mono text-[10px] text-green">0{index + 1}</span>
                  <h3 className="mt-5 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {specialties.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-ink/15 bg-paper px-4 py-2 text-xs font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-6">
            <h3 className="max-w-xl text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
              Three ways technology can move your operation forward.
            </h3>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:block">
              Selected capabilities / 01—03
            </span>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {showcase.map((item, index) => (
              <a
                key={item.title}
                href={item.href}
                className="group relative isolate min-h-[420px] overflow-hidden rounded-[24px] bg-night text-white"
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 410px, 100vw"
                  className="-z-20 object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(6,16,13,0.98),rgba(6,16,13,0.12)_75%)]" />
                <div className="flex min-h-[420px] flex-col justify-end p-7">
                  <span className="font-mono text-[10px] text-lime">0{index + 1}</span>
                  <h4 className="mt-4 text-3xl font-semibold">{item.title}</h4>
                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
                    {item.text}
                  </p>
                  <span className="mt-6 text-sm font-semibold text-lime">
                    Explore <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
