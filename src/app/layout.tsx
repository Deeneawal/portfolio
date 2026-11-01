import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { profile as defaultProfile, SITE_URL } from "@/content/profile";
import { getSiteContent } from "@/lib/content/site";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { Dock } from "@/components/chrome/Dock";
import { PaletteHost } from "@/components/chrome/PaletteHost";
import { Tracker } from "@/components/analytics/Tracker";
import { VercelInsights } from "@/components/analytics/VercelInsights";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", preload: false });

const description =
  "Zuhaib Ahmad Khan is an agentic full-stack engineer and product lead who builds multi-tenant healthcare SaaS end to end: React, TypeScript, PostgreSQL with RLS, serverless APIs, Flutter and AI. Based in Bengaluru, open to remote roles or relocation.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${defaultProfile.name} · ${defaultProfile.title}`, template: `%s · ${defaultProfile.name}` },
  description,
  applicationName: `${defaultProfile.name} portfolio`,
  authors: [{ name: defaultProfile.name, url: SITE_URL }],
  creator: defaultProfile.name,
  keywords: [
    "Zuhaib Ahmad Khan",
    "full-stack developer",
    "agentic engineer",
    "React",
    "TypeScript",
    "PostgreSQL",
    "Supabase",
    "Flutter",
    "RAG",
    "Bengaluru",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: defaultProfile.name,
    title: `${defaultProfile.name} · ${defaultProfile.title}`,
    description,
    firstName: "Zuhaib Ahmad",
    lastName: "Khan",
  },
  twitter: { card: "summary_large_image", title: `${defaultProfile.name} · ${defaultProfile.title}`, description },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f5f5f7",
  colorScheme: "light",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};


function personJsonLd(profile: Awaited<ReturnType<typeof getSiteContent>>["profile"]) {
  return {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  url: SITE_URL,
  image: `${SITE_URL}${profile.portrait}`,
  email: `mailto:${profile.email}`,
  telephone: profile.phoneHref.replace("tel:", ""),
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
  worksFor: { "@type": "Organization", name: profile.company, url: profile.companyUrl },
  alumniOf: { "@type": "CollegeOrUniversity", name: "JSS Academy of Technical Education, Bengaluru" },
  sameAs: [profile.linkedin, profile.github, profile.leetcode],
  knowsAbout: ["Full-stack development", "React", "TypeScript", "PostgreSQL", "Row-Level Security", "Flutter", "RAG", "AI agents"],
  };
}

export default async function RootLayout({ children, modal }: { children: ReactNode; modal: ReactNode }) {
  const { profile, stories } = await getSiteContent();
  const paletteData = {
    stories: stories.map(({ slug, title, eyebrow, summary, keywords, visual }) => ({ slug, title, eyebrow, summary, keywords, visual })),
    contact: {
      email: profile.email,
      phone: profile.phone,
      phoneHref: profile.phoneHref,
      whatsapp: profile.whatsapp,
      linkedin: profile.linkedin,
      github: profile.github,
    },
  };
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <MotionProvider>
          {children}
          {modal}
          <Dock />
          <PaletteHost data={paletteData} />
        </MotionProvider>
        <Tracker />
        <VercelInsights />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(profile)) }} />
      </body>
    </html>
  );
}
