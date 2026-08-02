"use client";

import { useState } from "react";
import { BrandLogo } from "./BrandLogo";

const links = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Approach", href: "#approach" },
  { label: "Technology", href: "#technology" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-white/95 px-3 backdrop-blur-xl sm:px-6">
      <div className="relative mx-auto max-w-[1280px] bg-white/90 text-ink">
        <div className="flex h-[68px] items-center justify-between px-4 sm:px-5">
          <a
            href="#top"
            className="flex items-center text-ink"
            aria-label="Cunnectit home"
          >
            <BrandLogo />
          </a>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-ink/85 transition hover:text-coral"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden rounded-xl bg-lime px-5 py-3 text-xs font-bold text-white transition hover:bg-ink hover:text-white sm:block"
            >
              Start a project <span aria-hidden="true">↗</span>
            </a>
            <button
              type="button"
              className={`relative z-10 grid size-11 place-items-center rounded-xl border text-ink transition lg:hidden ${
                open ? "border-coral bg-cream" : "border-ink/15 bg-white"
              }`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="text-xl leading-none">{open ? "×" : "≡"}</span>
            </button>
          </div>
        </div>

        {open && (
          <nav
            id="mobile-menu"
            className="absolute inset-x-0 top-full z-50 grid gap-1 rounded-b-2xl border border-line bg-white p-3 shadow-2xl shadow-black/10 lg:hidden"
            aria-label="Mobile navigation"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-ink/70 transition hover:bg-cream hover:text-coral"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-xl bg-lime px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-ink hover:text-white sm:hidden"
            >
              Start a project
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
