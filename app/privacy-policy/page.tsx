import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Cunnectit",
  description:
    "Learn how Cunnectit collects, uses, protects, and deletes personal information, including data processed through WhatsApp services.",
  alternates: {
    canonical: "https://www.cunnectit.com/privacy-policy",
  },
};

const sections = [
  { id: "information-we-collect", label: "Information we collect" },
  { id: "how-we-use-information", label: "How we use information" },
  { id: "whatsapp-and-meta", label: "WhatsApp and Meta" },
  { id: "sharing", label: "Sharing" },
  { id: "retention", label: "Retention" },
  { id: "data-deletion", label: "Your rights and deletion" },
  { id: "security", label: "Security" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPolicyPage() {
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
          <p className="section-kicker">Legal &amp; privacy</p>
          <h1 className="mt-6 max-w-4xl text-4xl font-medium tracking-[-0.04em] sm:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">
            This policy explains how Cunnectit collects, uses, shares, retains,
            and protects personal information when you use our website,
            software services, or WhatsApp messaging tools.
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
          <nav className="mt-5 grid gap-1" aria-label="Privacy policy sections">
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
            <h2>Who we are</h2>
            <p>
              Cunnectit is a software consulting and technology services
              business operated by Cunnect IT in Greater
              Noida, Delhi NCR, India. In this policy, “Cunnectit”, “we”, “us”,
              and “our” refer to this business.
            </p>
            <p>
              Businesses may also use software we provide to manage contacts
              and send approved WhatsApp message templates. In that situation,
              the business customer determines which contacts are uploaded and
              which messages are sent, while Cunnectit processes information to
              provide the service.
            </p>
          </section>

          <section id="information-we-collect">
            <h2>Information we collect</h2>
            <p>Depending on how you interact with us, we may process:</p>
            <ul>
              <li>
                Contact information, such as your name, email address, telephone
                or WhatsApp number, company, and contact tags.
              </li>
              <li>
                Information you provide through enquiries, project discussions,
                support requests, or uploaded contact files.
              </li>
              <li>
                WhatsApp campaign information, approved template names, message
                variables, recipient selections, and opt-out preferences.
              </li>
              <li>
                Message delivery information supplied by Meta, such as accepted,
                sent, delivered, read, and failed status events and their times.
              </li>
              <li>
                Account, billing, authentication, connection, error, and security
                logs needed to operate and protect the service.
              </li>
              <li>
                Basic technical information generated when you access our
                website, such as IP address, browser type, device information,
                requested pages, and server-log timestamps.
              </li>
            </ul>
          </section>

          <section id="how-we-use-information">
            <h2>How we use information</h2>
            <p>We use personal information to:</p>
            <ul>
              <li>Respond to enquiries and provide requested software services.</li>
              <li>
                Import and organise authorised contact lists and send messages
                selected by our business customers.
              </li>
              <li>
                Create and manage WhatsApp templates, campaigns, message previews,
                delivery logs, analytics, and account balances.
              </li>
              <li>
                Authenticate connections, diagnose failures, secure accounts,
                prevent misuse, and maintain service reliability.
              </li>
              <li>
                Meet legal, accounting, contractual, and regulatory obligations.
              </li>
            </ul>
            <p>
              Where applicable, we rely on consent, performance of a contract,
              compliance with legal obligations, or legitimate interests such as
              delivering, securing, and improving our services. We do not sell
              personal information.
            </p>
          </section>

          <section id="whatsapp-and-meta">
            <h2>WhatsApp and Meta services</h2>
            <p>
              Our messaging tools integrate with the WhatsApp Business Platform
              provided by Meta. When an authorised user sends a campaign, relevant
              recipient information, template content, media, and message
              parameters are transmitted to Meta for processing and delivery.
              Meta sends message status events back to our webhook so that the
              sender can monitor delivery and failures.
            </p>
            <p>
              Meta independently processes information under its own terms and
              privacy policies. Business customers are responsible for having a
              lawful basis to contact recipients, maintaining appropriate consent
              records, complying with WhatsApp policies, and promptly respecting
              opt-out requests. Recipients can ask the sender to stop further
              marketing messages.
            </p>
          </section>

          <section id="sharing">
            <h2>How information is shared</h2>
            <p>We may share information only as needed with:</p>
            <ul>
              <li>Meta and WhatsApp to submit and deliver requested messages.</li>
              <li>
                Hosting, database, security, communications, and technical service
                providers acting on our behalf.
              </li>
              <li>
                Professional advisers, regulators, courts, or authorities where
                required by law or necessary to protect legal rights and safety.
              </li>
              <li>
                A successor organisation in connection with a legitimate merger,
                acquisition, restructuring, or transfer of business assets.
              </li>
            </ul>
            <p>
              Providers receive only the information needed for their role and
              are expected to handle it securely and for authorised purposes.
            </p>
          </section>

          <section id="retention">
            <h2>Data retention</h2>
            <p>
              We retain information only for as long as reasonably necessary to
              provide the service, maintain security and delivery records, resolve
              disputes, meet contractual commitments, and comply with legal or
              accounting obligations. Retention periods vary according to the
              type of information and why it is processed.
            </p>
            <p>
              Business customers can update or delete contact records in their
              account. Some limited records may be retained where required for
              fraud prevention, security, legal compliance, or the establishment,
              exercise, or defence of legal claims.
            </p>
          </section>

          <section id="data-deletion">
            <h2>Your rights and data deletion</h2>
            <p>
              Subject to applicable law, you may request access, correction,
              deletion, restriction, or a copy of your personal information, or
              object to certain processing. You may also withdraw consent where
              processing is based on consent.
            </p>
            <div className="my-6 rounded-2xl border border-coral/25 bg-[#fff7f5] p-6">
              <h3>How to request deletion</h3>
              <p>
                Email{" "}
                <a href="mailto:info@cunnectit.com?subject=Data%20Deletion%20Request">
                  info@cunnectit.com
                </a>{" "}
                with the subject “Data Deletion Request”. Include enough
                information to identify the relevant account or contact record,
                such as your registered email address or WhatsApp number. Do not
                send passwords or access tokens.
              </p>
              <p>
                We may request reasonable verification before acting. We will
                assess the request and respond within the period required by
                applicable law. When deletion is approved, information is removed
                or de-identified unless retention is legally required.
              </p>
            </div>
            <p>
              If you received a message from one of our business customers, you
              can also contact that sender directly or reply with the stated
              opt-out instruction.
            </p>
          </section>

          <section id="security">
            <h2>Security and international processing</h2>
            <p>
              We use reasonable administrative, technical, and organisational
              safeguards designed to protect information, including access
              controls, encrypted credentials, secure connections, and operational
              logging. No internet or storage system can be guaranteed completely
              secure.
            </p>
            <p>
              Service providers may process information in countries other than
              your own. Where required, we use appropriate safeguards for such
              transfers. Our services are intended for businesses and adults and
              are not directed to children under 13.
            </p>
          </section>

          <section>
            <h2>Changes to this policy</h2>
            <p>
              We may update this policy when our services, legal requirements, or
              processing practices change. The current version and effective date
              will always be published on this page.
            </p>
          </section>

          <section id="contact">
            <h2>Contact us</h2>
            <p>
              For privacy questions, rights requests, or complaints, contact:
            </p>
            <address className="not-italic">
              <strong>Cunnectit / Cunnect IT</strong>
              <br />
              Greater Noida, Delhi NCR, India
              <br />
              Email: <a href="mailto:info@cunnectit.com">info@cunnectit.com</a>
            </address>
          </section>
        </article>
      </div>

      <Footer />
    </main>
  );
}
