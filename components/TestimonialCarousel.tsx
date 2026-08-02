"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { clientStories, type ClientStory } from "@/data/clientStories";

function TestimonialCard({ client }: { client: ClientStory }) {
  const testimonial = client.testimonial;

  return (
    <article className="flex h-1/2 flex-col justify-center px-7 py-8 sm:px-10 lg:px-12">
      <div className="flex items-center gap-4">
        <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/15 bg-white">
          {client.logoSrc ? (
            <Image
              src={client.logoSrc}
              alt={client.logoAlt ?? `${client.name} logo`}
              width={48}
              height={48}
              className="size-full object-contain p-1.5"
            />
          ) : (
            <span className="text-sm font-bold text-[#075099]">
              {client.logoFallback}
            </span>
          )}
        </div>
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-coral">
            {testimonial ? "Client testimonial" : "Testimonial placeholder"}
          </p>
          <p className="mt-1 text-sm text-white/55">{client.industry}</p>
        </div>
      </div>

      <blockquote className="mt-7">
        <p className="text-xl font-medium leading-8 tracking-[-0.02em] text-white sm:text-2xl">
          “
          {testimonial?.quote ??
            `Add the approved testimonial for ${client.name} in the client data file.`}
          ”
        </p>
        <footer className="mt-6 text-sm text-white/50">
          <span className="font-semibold text-white">
            {testimonial?.person ?? client.name}
          </span>
          <span> · {testimonial?.role ?? client.project}</span>
        </footer>
      </blockquote>
    </article>
  );
}

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const resumeFrame = useRef<number | null>(null);
  const itemCount = clientStories.length;

  useEffect(() => {
    if (itemCount < 2 || isPaused || isSliding) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => setIsSliding(true), 4500);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, isSliding, itemCount]);

  useEffect(() => {
    return () => {
      if (resumeFrame.current !== null) {
        window.cancelAnimationFrame(resumeFrame.current);
      }
    };
  }, []);

  if (itemCount === 0) return null;

  const nextIndex = (activeIndex + 1) % itemCount;

  const finishSlide = () => {
    if (!isSliding) return;

    setTransitionEnabled(false);
    setActiveIndex(nextIndex);
    setIsSliding(false);
    resumeFrame.current = window.requestAnimationFrame(() => {
      resumeFrame.current = window.requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    });
  };

  return (
    <div className="mt-12 overflow-hidden rounded-[28px] bg-night text-white">
      <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
        <div className="flex flex-col justify-center border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
          <p className="section-kicker !text-coral">Testimonials</p>
          <h3 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
            One client voice at a time.
          </h3>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/55">
            Testimonials move upward automatically and pause when a visitor
            hovers over or focuses on this area.
          </p>
          <div className="mt-8 flex items-center gap-3 text-xs text-white/45">
            <span className="size-2 rounded-full bg-coral" />
            <span>
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(itemCount).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div
          className="h-[340px] overflow-hidden sm:h-[320px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          <div
            className={`h-[200%] ${
              transitionEnabled
                ? "transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
                : "transition-none"
            } ${isSliding ? "-translate-y-1/2" : "translate-y-0"}`}
            onTransitionEnd={finishSlide}
          >
            <TestimonialCard client={clientStories[activeIndex]} />
            <TestimonialCard client={clientStories[nextIndex]} />
          </div>
        </div>
      </div>
    </div>
  );
}
