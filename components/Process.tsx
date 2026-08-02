import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "Discover",
    text: "Map the process, people, information, bottlenecks, priorities, and measurable outcomes.",
    output: "Requirements map · Success measures",
  },
  {
    number: "02",
    title: "Design",
    text: "Shape the user journey, data model, architecture, and practical delivery roadmap.",
    output: "Solution design · Delivery plan",
  },
  {
    number: "03",
    title: "Build",
    text: "Deliver focused working releases so real progress can be reviewed and guided early.",
    output: "Working software · Quality checks",
  },
  {
    number: "04",
    title: "Improve",
    text: "Support launch, learn from usage, and evolve the system with the changing operation.",
    output: "Adoption · Continuous improvement",
  },
];

export function Process() {
  return (
    <section id="approach" className="bg-night py-20 text-white sm:py-28">
      <div className="container-shell">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-kicker !text-lime">Delivery approach</p>
            <h2 className="mt-6 text-4xl font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl">
              Clear steps.
              <span className="block text-white/35">Visible progress.</span>
            </h2>
          </div>
          <div className="relative min-h-[280px] overflow-hidden rounded-[24px]">
            <Image
              src="/images/approach-process.png"
              alt="A visual representation of the four-stage software delivery process"
              fill
              sizes="(min-width: 1024px) 700px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mt-16 border-t border-white/15">
          {steps.map((step) => (
            <article
              key={step.number}
              className="group grid gap-5 border-b border-white/15 py-8 sm:grid-cols-[80px_0.6fr_1.1fr_0.7fr] sm:items-center"
            >
              <span className="font-mono text-xs text-lime">{step.number}</span>
              <h3 className="text-3xl font-semibold transition group-hover:text-lime">
                {step.title}
              </h3>
              <p className="max-w-xl text-sm leading-6 text-white/55">{step.text}</p>
              <p className="font-mono text-[9px] uppercase leading-5 tracking-[0.12em] text-white/35 sm:text-right">
                {step.output}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
