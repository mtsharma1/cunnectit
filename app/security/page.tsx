import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Security & Data Protection | Cunnectit",
  description:
    "Learn how Cunnectit approaches confidentiality, secure software delivery, data protection, access control, backups, and compliance requirements.",
  alternates: { canonical: "https://www.cunnectit.com/security" },
};

const principles = [
  {
    number: "01",
    title: "Confidentiality by agreement",
    copy: "Project information is used only to deliver the agreed work. NDAs are available, and access to client materials is limited to people who need them for the engagement.",
    points: ["Project-specific confidentiality terms", "Need-to-know access", "No sale of client information"],
  },
  {
    number: "02",
    title: "Purpose-limited data handling",
    copy: "We aim to request only the data required for discovery, development, testing, and support, with retention and deletion expectations agreed for sensitive projects.",
    points: ["Data minimisation", "Controlled test data", "Practical retention planning"],
  },
  {
    number: "03",
    title: "Encryption and secrets",
    copy: "Production connections use HTTPS, while credentials and integration secrets are kept outside source code. Encryption at rest depends on the selected database and hosting platform.",
    points: ["TLS-protected connections", "Environment-managed secrets", "Secure transfer methods"],
  },
  {
    number: "04",
    title: "Identity and access",
    copy: "Applications can be designed with authenticated access, role-based permissions, session controls, and audit information appropriate to the sensitivity of the workflow.",
    points: ["Least-privilege design", "Role-based permissions", "MFA-ready integrations"],
  },
  {
    number: "05",
    title: "Secure engineering",
    copy: "Security is considered from architecture through release: input validation, server-side authorization, protected APIs, dependency maintenance, and focused testing are applied where relevant.",
    points: ["Secure coding practices", "API and webhook validation", "Release checks"],
  },
  {
    number: "06",
    title: "Backup and recovery",
    copy: "Backup frequency, retention, restore testing, and recovery responsibilities are defined with the client and implemented using capabilities available in the chosen platform.",
    points: ["Documented backup scope", "Restore planning", "Operational handover"],
  },
] as const;

const deliverySteps = [
  {
    number: "1",
    title: "Understand the risk",
    copy: "We identify sensitive data, user roles, integrations, hosting constraints, and the business impact of failure before finalising the solution design.",
  },
  {
    number: "2",
    title: "Design the controls",
    copy: "Authentication, permissions, validation, logging, backups, and data flows are selected to match the actual project rather than added as generic promises.",
  },
  {
    number: "3",
    title: "Build and verify",
    copy: "Implementation includes focused reviews and testing for the agreed risks, with production credentials separated from development configuration.",
  },
  {
    number: "4",
    title: "Handover responsibly",
    copy: "We document deployment and operational responsibilities, remove unnecessary access, and agree how updates, incidents, and future changes will be handled.",
  },
] as const;

const readinessAreas = [
  "Data-flow and retention documentation",
  "Access-control and audit requirements",
  "Hosting and regional processing choices",
  "Backup, recovery, and continuity planning",
  "Secure API and third-party integration design",
  "Client-specific policy and evidence needs",
] as const;

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-white">
        <div className="container-shell flex h-[76px] items-center justify-between gap-5">
          <Link href="/" aria-label="Cunnectit home" className="text-ink">
            <BrandLogo />
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-ink/15 px-4 py-2.5 text-sm font-semibold transition hover:border-coral hover:text-coral"
          >
            Back to website
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-line bg-[#071d4f] text-white">
        <div className="pointer-events-none absolute -right-28 -top-48 size-[36rem] rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-6 -top-24 size-[25rem] rounded-full border border-coral/40" />
        <div className="container-shell relative grid gap-12 py-20 sm:py-28 lg:grid-cols-[1fr_0.7fr] lg:items-center lg:py-32">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-coral">
              Security &amp; trust
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">
              Your business data deserves deliberate protection.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Cunnectit approaches security as part of discovery, architecture,
              development, deployment, and support—not as a checklist added at
              the end of a project.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="#security-principles"
                className="rounded-xl bg-coral px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#071d4f]"
              >
                Review our approach
              </Link>
              <Link
                href="/#contact"
                className="rounded-xl border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10"
              >
                Discuss your requirements
              </Link>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/15 bg-white/8 p-6 backdrop-blur sm:p-8">
            <div className="grid aspect-square place-items-center rounded-[1.5rem] border border-white/10 bg-black/10">
              <div className="relative grid size-44 place-items-center rounded-full border border-coral/50 sm:size-52">
                <div className="absolute inset-5 rounded-full border border-white/20" />
                <div className="absolute inset-11 rounded-full bg-coral/15" />
                <div className="relative text-center">
                  <span className="font-mono text-4xl font-bold text-coral" aria-hidden="true">✓</span>
                  <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">
                    Secure by design
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/65">
              Controls are selected for each engagement based on data
              sensitivity, application exposure, hosting model, and client needs.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="container-shell grid grid-cols-2 divide-x divide-y divide-line sm:grid-cols-4 sm:divide-y-0">
          {["Confidentiality", "Least privilege", "Secure delivery", "Recoverability"].map((item) => (
            <div key={item} className="px-4 py-6 text-center font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[#071d4f] sm:py-8">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section id="security-principles" className="bg-[#f5f9f1] py-20 sm:py-28">
        <div className="container-shell">
          <div className="max-w-3xl">
            <p className="section-kicker">Our security principles</p>
            <h2 className="mt-5 text-4xl font-medium tracking-[-0.045em] sm:text-6xl">
              Practical safeguards across the software lifecycle.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted sm:text-lg">
              The exact control set is documented in the project scope. These
              principles guide how we handle client information and design the
              systems we deliver.
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {principles.map((principle) => (
              <article key={principle.number} className="rounded-[1.75rem] border border-[#071d4f]/10 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start justify-between gap-6">
                  <h3 className="max-w-md text-2xl font-semibold tracking-[-0.035em] text-[#071d4f]">
                    {principle.title}
                  </h3>
                  <span className="font-mono text-xs font-bold text-coral">{principle.number}</span>
                </div>
                <p className="mt-5 text-sm leading-7 text-muted">{principle.copy}</p>
                <ul className="mt-6 grid gap-3 border-t border-line pt-5">
                  {principle.points.map((point) => (
                    <li key={point} className="flex items-center gap-3 text-sm text-ink/75">
                      <span className="size-1.5 rounded-full bg-coral" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <div className="container-shell grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="section-kicker">Secure delivery</p>
            <h2 className="mt-5 text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
              Security decisions made in context.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              An internal inventory tool, a public web application, and a
              financial workflow do not carry the same risks. We align controls
              to the system, its users, and the consequences of failure.
            </p>
          </div>

          <ol className="grid gap-4">
            {deliverySteps.map((step) => (
              <li key={step.number} className="grid gap-4 rounded-2xl border border-line p-6 sm:grid-cols-[56px_1fr] sm:items-start">
                <span className="grid size-12 place-items-center rounded-full bg-[#071d4f] font-mono text-sm font-bold text-white">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.025em] text-[#071d4f]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream py-20 sm:py-28">
        <div className="container-shell grid gap-10 rounded-[2rem] border border-line bg-white p-7 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-coral">Compliance readiness</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#071d4f] sm:text-5xl">
              Built around your obligations—not empty badges.
            </h2>
            <p className="mt-6 text-base leading-8 text-muted">
              Cunnectit does not claim blanket certification under SOC 2,
              ISO 27001, HIPAA, or similar frameworks. When a project has
              specific regulatory or customer requirements, we help translate
              them into scope, architecture, operating controls, and evidence.
            </p>
          </div>
          <ul className="grid content-start gap-3">
            {readinessAreas.map((area) => (
              <li key={area} className="flex items-center gap-4 rounded-xl bg-[#f5f9f1] px-4 py-4 text-sm font-medium text-ink/75">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-coral/10 text-xs font-bold text-coral" aria-hidden="true">✓</span>
                {area}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#071d4f] py-20 text-white sm:py-24">
        <div className="container-shell flex flex-col gap-9 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-coral">Security enquiries</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">
              Tell us what your project needs to protect.
            </h2>
            <p className="mt-6 text-base leading-8 text-white/65">
              Share your hosting, data, access, compliance, or vendor-security
              requirements before development begins. For a suspected security
              issue involving Cunnectit, contact us with clear reproduction details.
            </p>
          </div>
          <a
            href="mailto:info@cunnectit.com?subject=Security%20Enquiry"
            className="w-fit shrink-0 rounded-xl bg-coral px-6 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-[#071d4f]"
          >
            Email security enquiry
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
