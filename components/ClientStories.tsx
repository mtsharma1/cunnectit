import { TestimonialCarousel } from "./TestimonialCarousel";

export function ClientStories() {
  return (
    <section id="clients" className="bg-cream py-20 sm:py-28">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="section-kicker">Client testimonials</p>
            <h2 className="mt-6 text-4xl font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl">
              Client feedback, presented one story at a time.
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-2xl text-lg leading-8 text-muted">
              Add approved client quotes, names, roles, and logos in the client
              data file. Each testimonial will appear automatically in the
              upward-scrolling carousel below.
            </p>
          </div>
        </div>

        <TestimonialCarousel />
      </div>
    </section>
  );
}
