import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { DeviceCameraClient } from "@/components/DeviceCameraClient";

export const metadata: Metadata = {
  title: "Camera Device | Cunnectit",
  description: "Register a computer and respond to consent-based camera requests.",
};

export default function CameraDevicePage() {
  return (
    <main className="min-h-screen bg-[#f5f9f1] text-ink">
      <header className="border-b border-[#071d4f]/10 bg-white/90 backdrop-blur-xl">
        <div className="container-shell flex min-h-[76px] items-center justify-between gap-5 py-3">
          <Link href="/" aria-label="Cunnectit home" className="inline-flex"><BrandLogo /></Link>
          <Link href="/" className="rounded-xl border border-[#071d4f]/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#071d4f] transition hover:border-coral hover:text-coral">Back to website</Link>
        </div>
      </header>
      <div className="container-shell py-10 sm:py-14"><DeviceCameraClient /></div>
    </main>
  );
}
