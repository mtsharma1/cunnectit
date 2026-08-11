import Image from "next/image";

const features = [
  "Custom Software Development",
  "Business Process Automation",
  "Cloud & Web Applications",
  "Data & Analytics",
  "Database Solutions",
  "Excel & Access Expertise",
];

const stats = [
  { value: "2010", label: "Consulting since" },
  { value: "200+", label: "Clients served" },
  { value: "15+", label: "Years of experience" },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate min-h-[780px] overflow-hidden bg-paper pt-20 text-ink"
    >
      <Image
        src="/images/technology-platform.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-30 object-cover object-[68%_top] opacity-75"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(243,242,240,0.96)_0%,rgba(243,242,240,0.84)_48%,rgba(243,242,240,0.22)_100%)]" />
      <div className="dot-grid absolute inset-y-0 left-0 -z-10 w-1/2 opacity-35" />

      <div className="container-shell flex min-h-[650px] flex-col justify-center py-16">
        <div className="max-w-[780px]">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-ink/10 bg-white/75 px-4 py-2 backdrop-blur-sm">
            <span className="pulse-dot size-2 rounded-full bg-lime" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/65">
              Available for selected consulting projects
            </span>
          </div>

          <h1 className="text-[clamp(3.1rem,6vw,6.4rem)] font-semibold leading-[0.9] tracking-[-0.065em]">
            Transform your
            <span className="block text-lime">business with</span>
            digital excellence.
          </h1>

          <div className="mt-10 grid gap-7 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <p className="max-w-xl text-xl font-medium tracking-[-0.02em] text-ink">
                Innovative Solutions for Modern Enterprises
              </p>
              <p className="mt-4 max-w-xl text-base leading-7 text-ink/65">
                Inventory systems, business applications, automation, data, and
                cloud platforms shaped around the way your operation works.
              </p>
            </div>
            <div className="grid gap-1">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 border-b border-ink/10 py-2.5"
                >
                  <span className="font-mono text-[10px] text-lime">
                    0{index + 1}
                  </span>
                  <span className="text-sm text-ink/70">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#contact"
              className="rounded-xl bg-lime px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-ink hover:text-white"
            >
              Book a free consultation <span aria-hidden="true">↗</span>
            </a>
            <a
              href="#services"
              className="rounded-xl border border-ink/20 bg-white/70 px-7 py-4 text-sm font-semibold text-ink backdrop-blur-sm transition hover:border-coral hover:text-coral"
            >
              Explore capabilities
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-ink/10 bg-white/80 backdrop-blur-md">
        <div className="container-shell grid grid-cols-3 divide-x divide-ink/10">
          {stats.map((stat) => (
            <div key={stat.label} className="py-7 text-center sm:text-left sm:px-8 first:pl-0">
              <p className="text-2xl font-semibold text-lime sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-ink/50">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
