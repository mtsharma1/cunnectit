import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { CameraFun } from "@/components/CameraFun";

export const metadata: Metadata = {
  title: "Fun Camera | Cunnectit",
  description: "A simple interactive camera experience from Cunnectit.",
};

export default function FunPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f9f1] text-ink">
      <div className="pointer-events-none absolute -right-32 -top-32 size-[32rem] rounded-full bg-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-32 size-[34rem] rounded-full bg-[#0fc5de]/10 blur-3xl" />

      <header className="relative border-b border-[#071d4f]/10 bg-white/80 backdrop-blur-xl">
        <div className="container-shell flex min-h-[76px] items-center justify-between gap-5 py-3">
          <Link href="/" aria-label="Cunnectit home" className="inline-flex">
            <BrandLogo />
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-[#071d4f]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#071d4f] transition hover:border-coral hover:text-coral"
          >
            Back to website
          </Link>
        </div>
      </header>

      <div className="container-shell relative grid items-center gap-12 py-12 lg:min-h-[calc(100vh-76px)] lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
        <section>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-coral">
            A little something fun
          </p>
          <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-[#071d4f] sm:text-6xl lg:text-7xl">
            Ready for your close-up?
          </h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-muted sm:text-lg sm:leading-8">
            Your camera starts automatically when this page opens. The first visit may still require browser permission.
          </p>

          <div className="mt-8 flex items-center gap-3 text-sm text-ink/65">
            <span className="grid size-8 place-items-center rounded-full bg-[#071d4f] text-xs font-bold text-white" aria-hidden="true">
              ✓
            </span>
            Nothing is recorded or uploaded.
          </div>
        </section>

        <CameraFun />
      </div>
    </main>
  );
}
