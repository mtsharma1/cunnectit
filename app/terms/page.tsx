import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Cunnectit",
  description:
    "Terms governing the use of Cunnectit websites, consulting services, and WhatsApp messaging tools.",
  alternates: { canonical: "https://www.cunnectit.com/terms" },
};

const sections = [
  { id: "services", label: "Our services" },
  { id: "accounts", label: "Accounts and security" },
  { id: "messaging", label: "WhatsApp messaging" },
  { id: "acceptable-use", label: "Acceptable use" },
  { id: "fees", label: "Fees and balances" },
  { id: "content", label: "Content and intellectual property" },
  { id: "third-parties", label: "Third-party services" },
  { id: "termination", label: "Suspension and termination" },
  { id: "liability", label: "Liability" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-white">
        <div className="container-shell flex h-[76px] items-center justify-between">
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

      <section className="border-b border-line bg-cream">
        <div className="container-shell py-16 sm:py-24">
          <p className="section-kicker">Legal &amp; service terms</p>
          <h1 className="mt-6 max-w-4xl text-4xl font-medium tracking-[-0.04em] sm:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">
            These terms govern access to the Cunnectit website, software
            consulting services, and business messaging tools, including the
            WavePing WhatsApp campaign service.
          </p>
          <p className="mt-8 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
            Effective date: 7 August 2026
          </p>
        </div>
      </section>

      <div className="container-shell grid gap-12 py-14 lg:grid-cols-[260px_minmax(0,760px)] lg:gap-20 lg:py-20">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-ink/45">
            On this page
          </p>
          <nav className="mt-5 grid gap-1" aria-label="Terms of service sections">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-cream hover:text-coral"
              >
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        <article className="privacy-copy min-w-0">
          <section>
            <h2>Agreement to these terms</h2>
            <p>
              These Terms of Service form an agreement between you and Cunnectit,
              operated by Cunnect IT in Greater Noida, Delhi
              NCR, India. “You” means the individual or organisation accessing
              our website or using our services.
            </p>
            <p>
              By accessing or using a service, creating an account, or accepting
              a project proposal that refers to these terms, you confirm that you
              have authority to accept them. If you act for an organisation, that
              organisation is responsible for your use and the use of its other
              authorised users.
            </p>
          </section>

          <section id="services">
            <h2>Our services</h2>
            <p>
              Cunnectit provides software consulting, custom application
              development, automation, integration, database, analytics, support,
              and related technology services. WavePing provides tools for
              managing contacts, creating Meta templates, preparing WhatsApp
              campaigns, sending approved messages, and reviewing delivery logs
              and analytics.
            </p>
            <p>
              Project-specific scope, deliverables, timelines, support, fees, and
              acceptance requirements may be described in a proposal, statement
              of work, order, or other written agreement. If a project agreement
              conflicts with these terms, the project agreement controls for that
              project.
            </p>
            <p>
              We may improve, replace, restrict, or discontinue features when
              reasonably necessary, including to comply with law, security needs,
              or third-party platform requirements.
            </p>
          </section>

          <section id="accounts">
            <h2>Accounts, credentials, and security</h2>
            <ul>
              <li>You must provide accurate account and business information and keep it current.</li>
              <li>You are responsible for authorised users, access controls, and all activity performed through your account.</li>
              <li>Access tokens, App Secrets, passwords, verification tokens, and database credentials must be kept confidential.</li>
              <li>You must notify us promptly about exposed credentials or suspected unauthorised access and rotate compromised secrets.</li>
            </ul>
            <p>
              We may require reasonable verification before changing account
              ownership, releasing data, or assisting with sensitive configuration.
            </p>
          </section>

          <section id="messaging">
            <h2>WhatsApp messaging responsibilities</h2>
            <p>
              WhatsApp services are provided through the WhatsApp Business
              Platform operated by Meta. You are responsible for complying with
              applicable laws, Meta terms, WhatsApp Business and Commerce
              policies, template requirements, messaging limits, and any industry
              rules that apply to your communications.
            </p>
            <p>You must:</p>
            <ul>
              <li>Contact only recipients for whom you have a lawful basis and any consent required for the message type and jurisdiction.</li>
              <li>Maintain appropriate evidence of consent and accurately identify the sending business.</li>
              <li>Use approved templates for their approved category and purpose and avoid misleading variables, media, links, or claims.</li>
              <li>Provide and honour clear opt-out methods and promptly suppress recipients who ask not to be contacted.</li>
              <li>Import only contact information you are authorised to possess and use for the selected campaign.</li>
            </ul>
            <p>
              Meta may approve, reject, pause, reclassify, limit, or disable
              templates, phone numbers, accounts, or messages. Cunnectit does not
              control those decisions or guarantee delivery, reading, response,
              template approval, quality rating, or continued platform access.
            </p>
          </section>

          <section id="acceptable-use">
            <h2>Acceptable use</h2>
            <p>You may not use our services to:</p>
            <ul>
              <li>Send spam, unsolicited bulk messages, or deceptive promotions.</li>
              <li>Harass, threaten, discriminate against, exploit, or impersonate another person or organisation.</li>
              <li>Distribute malware, phishing, fraudulent schemes, illegal goods, prohibited content, or infringing material.</li>
              <li>Bypass opt-outs, platform limits, security controls, account restrictions, billing controls, or template review.</li>
              <li>Probe, interfere with, overload, reverse engineer, scrape, or gain unauthorised access to the service or customer data.</li>
              <li>Use the service in violation of law, court order, sanctions, or applicable Meta and WhatsApp policies.</li>
            </ul>
            <p>
              We may investigate suspected misuse and cooperate with platform
              providers or authorities when legally required.
            </p>
          </section>

          <section id="fees">
            <h2>Fees, balances, and message charges</h2>
            <p>
              Prices may include service charges and message rates based on
              message category, destination, platform pricing, or an agreed plan.
              Current rates shown in your account or order apply unless otherwise
              agreed in writing. Taxes may be added where applicable.
            </p>
            <p>
              A message initially marked “accepted” means Meta accepted the API
              request for processing; it does not prove that the message was sent
              or delivered. WavePing uses available Meta responses and webhook
              status events to record processing outcomes.
            </p>
            <p>
              Our intended billing behaviour is to avoid charging for API requests
              rejected before acceptance and to credit eligible failed messages
              when a verified failure status is received. A missing, delayed, or
              incorrectly configured webhook may delay status-based adjustments.
              Charges imposed directly by Meta or another provider remain subject
              to that provider’s rules.
            </p>
            <p>
              Account balances, prepaid amounts, credits, refunds, and payment due
              dates are governed by the applicable order or plan. We may suspend
              sending when a balance is insufficient or payment is overdue.
            </p>
          </section>

          <section id="content">
            <h2>Content and intellectual property</h2>
            <p>
              You retain ownership of contact lists, templates, text, media,
              branding, and other content you provide. You grant us limited
              permission to host, process, reproduce, transmit, and display that
              content as needed to provide, secure, and support the services.
            </p>
            <p>
              You confirm that you have the rights and permissions necessary for
              uploaded content and that its use will not violate law, privacy,
              publicity, copyright, trademark, or other rights.
            </p>
            <p>
              Cunnectit retains ownership of its pre-existing software, designs,
              documentation, methods, tools, and service technology. Ownership and
              licences for custom project deliverables are governed by the
              applicable project agreement.
            </p>
          </section>

          <section id="third-parties">
            <h2>Third-party services and availability</h2>
            <p>
              Our services may depend on Meta, WhatsApp, hosting companies,
              databases, payment services, telecommunications networks, and other
              third parties. Their separate terms, policies, availability, and
              technical limits apply.
            </p>
            <p>
              We aim to operate services reliably but do not promise uninterrupted,
              error-free, or permanently available access. Maintenance, incidents,
              internet conditions, third-party changes, security events, and legal
              requirements may cause delay or interruption.
            </p>
          </section>

          <section id="termination">
            <h2>Suspension and termination</h2>
            <p>
              You may stop using the service subject to outstanding fees, project
              commitments, and any agreed notice period. We may suspend or restrict
              access where reasonably necessary to address security risk,
              non-payment, unlawful conduct, policy violations, platform
              requirements, or harm to recipients, customers, or the service.
            </p>
            <p>
              We may terminate service for a material breach that is not remedied
              within a reasonable period, or immediately where a breach creates
              serious legal, security, fraud, or platform risk. Provisions that by
              their nature should continue survive termination.
            </p>
          </section>

          <section id="liability">
            <h2>Disclaimers and limitation of liability</h2>
            <p>
              To the extent permitted by law, services are provided on an “as
              available” basis. We disclaim implied warranties that cannot
              reasonably apply to customised, internet-dependent, or third-party
              platform services, while preserving rights that applicable law does
              not allow us to exclude.
            </p>
            <p>
              To the extent permitted by law, Cunnectit will not be liable for
              indirect, incidental, special, punitive, or consequential loss, or
              loss of profits, revenue, goodwill, opportunities, or data. Our
              aggregate liability relating to a paid service will not exceed the
              amount paid to us for that service during the six months preceding
              the event giving rise to the claim.
            </p>
            <p>
              These limitations do not apply where liability cannot lawfully be
              limited, including liability arising from fraud, wilful misconduct,
              or other non-excludable obligations.
            </p>
          </section>

          <section>
            <h2>Governing law and changes</h2>
            <p>
              These terms are governed by the laws of India. Subject to mandatory
              rights, courts with jurisdiction in Gautam Buddha Nagar, Uttar
              Pradesh will have jurisdiction over disputes relating to these terms.
            </p>
            <p>
              We may update these terms to reflect changes in law, services,
              security, or third-party requirements. Material changes will be
              communicated through the service or by another reasonable method.
            </p>
          </section>

          <section id="contact">
            <h2>Contact us</h2>
            <address className="not-italic">
              <strong>Cunnectit / Cunnect IT</strong>
              <br />
              Greater Noida, Delhi NCR, India
              <br />
              Email: <a href="mailto:info@cunnectit.com">info@cunnectit.com</a>
            </address>
            <p className="mt-4">
              Our handling of personal information is described in our{" "}
              <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
          </section>
        </article>
      </div>

      <Footer />
    </main>
  );
}
