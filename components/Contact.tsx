const contactDetails = [
  {
    label: "Email",
    value: "info@cunnectit.com",
    href: "mailto:info@cunnectit.com",
  },
  {
    label: "Phone",
    value: "+91 70657 27024",
    href: "tel:+917065727024",
  },
  {
    label: "Location",
    value: "Greater Noida · Delhi NCR · India",
    href: "https://maps.google.com/?q=Sector+16B+Greater+Noida+India",
  },
];

export function Contact() {
  return (
    <section id="contact" className="bg-paper px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[32px] bg-night text-white">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-7 sm:p-12 lg:p-20">
            <p className="section-kicker !text-lime">Free consultation</p>
            <h2 className="mt-7 max-w-3xl text-4xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Let&apos;s build the
              <span className="block text-lime">right thing.</span>
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-8 text-white/65">
              Share the operational challenge, the current tools, and the
              outcome you need. I&apos;ll help turn that into a practical next step.
            </p>
            <a
              href="mailto:info@excelandaccessconsultant.com?subject=Free%20software%20consultation"
              className="mt-10 inline-flex rounded-xl bg-lime px-7 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-ink"
            >
              Book a free consultation <span className="ml-3" aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="flex flex-col justify-end bg-night p-7 sm:p-12 lg:p-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/35">
              Direct contact
            </p>
            <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {contactDetails.map((detail) => (
                <a
                  key={detail.label}
                  href={detail.href}
                  target={detail.label === "Location" ? "_blank" : undefined}
                  rel={detail.label === "Location" ? "noreferrer" : undefined}
                  className="group flex items-center justify-between gap-6 py-6"
                >
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-lime">
                      {detail.label}
                    </p>
                    <p className="mt-2 text-sm text-white/70 sm:text-base">
                      {detail.value}
                    </p>
                  </div>
                  <span className="text-lg text-white/40 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-lime">
                    ↗
                  </span>
                </a>
              ))}
            </div>
            <p className="mt-8 text-xs leading-6 text-white/35">
              Initial consultations are free and focused on understanding the
              problem, constraints, and most useful way forward.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
