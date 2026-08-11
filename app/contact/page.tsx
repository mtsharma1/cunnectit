import type { Metadata } from "next";
import Link from "next/link";
import { ContactEnquiryForm } from "@/components/ContactEnquiryForm";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Contact | Cunnectit",
  description:
    "Discuss your software, automation, database, web application, or business technology project with Cunnectit.",
};

const contactItems = [
  {
    icon: "✉",
    label: "Email",
    value: "info@cunnectit.com",
    href: "mailto:info@cunnectit.com",
  },
  {
    icon: "☎",
    label: "Phone",
    value: "+91 70657 27024",
    href: "tel:+917065727024",
  },
  {
    icon: "◉",
    label: "WhatsApp",
    value: "Chat on WhatsApp →",
    href: "https://wa.me/917065727024",
  },
  {
    icon: "▣",
    label: "Schedule a meeting",
    value: "Book a Google Meet / Teams call",
    href: "mailto:info@cunnectit.com?subject=Meeting%20request",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#fafbf8] text-ink">
      <Navbar />

      <section className="border-b border-line pt-[68px]">
        <div className="container-shell py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink/55">
            <Link href="/" className="transition hover:text-coral">Home</Link>
            <span aria-hidden="true">›</span>
            <span className="font-medium text-ink">Contact</span>
          </nav>
        </div>
      </section>

      <section className="container-shell py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <aside>
            <p className="section-kicker">Contact Cunnectit</p>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              What happens next?
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-ink/65">
              We&apos;ll review what you send us and reply during the next working day. If it is a good fit, we&apos;ll schedule a short call to discuss your project in detail.
            </p>

            <div className="mt-9 border-t border-line">
              <h2 className="py-4 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
                Contact information
              </h2>
              {contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.label === "WhatsApp" ? "_blank" : undefined}
                  rel={item.label === "WhatsApp" ? "noreferrer" : undefined}
                  className="group block border-t border-line py-5"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <span className="text-coral" aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="mt-3 block text-sm font-semibold text-ink/75 transition group-hover:text-coral">
                    {item.value}
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-10 border-l-2 border-coral bg-white p-6">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
                Business hours
              </h2>
              <div className="mt-4 space-y-1 text-sm leading-6 text-ink/65">
                <p>Monday to Friday: 10:00 AM to 7:00 PM (IST)</p>
                <p>Weekend: Closed</p>
                <p className="italic">Flexible hours are available for international clients.</p>
                <p className="pt-2 font-semibold text-ink/75">We reply by the next working day.</p>
              </div>
            </div>
          </aside>

          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
              You don&apos;t need technical details. Business context is enough.
            </h2>
            <p className="mt-4 text-base leading-7 text-ink/60">
              Typical enquiries involve automation, system cleanup, API integrations, databases, reporting, cloud applications, or replacing manual workflows.
            </p>
            <p className="mb-6 mt-3 text-sm leading-6 text-ink/60">
              We use your details only to respond to your enquiry. See our{" "}
              <Link href="/privacy-policy" className="font-medium text-coral underline underline-offset-4">Privacy Policy</Link>
              {" "}and{" "}
              <Link href="/security" className="font-medium text-coral underline underline-offset-4">Security page</Link>.
            </p>
            <ContactEnquiryForm />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
