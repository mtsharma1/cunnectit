import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PrivacyConsentBanner } from "@/components/PrivacyConsentBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mithlesh | Software Consultant",
  description:
    "Software consulting since 2010: custom inventory systems, web and desktop applications, Excel and Access automation, databases, BI, and cloud solutions.",
  openGraph: {
    title: "Mithlesh | Software Consultant",
    description:
      "Custom software, Excel and Access automation, database, BI, and cloud solutions built around your business.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mithlesh | Software Consultant",
    description:
      "Custom software, Excel and Access automation, database, BI, and cloud solutions built around your business.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth antialiased`}
    >
      <body>
        {children}
        <PrivacyConsentBanner />
      </body>
    </html>
  );
}
