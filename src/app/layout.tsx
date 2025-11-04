import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const SITE_URL = "https://json-yaml-editor.vercel.app";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  title: "🧩 JSON–YAML Editor | Next.js + Monaco + TypeScript",
  description:
    "Free, open-source web app to edit and convert YAML ↔ JSON in real-time. Built with Next.js, TypeScript, Monaco Editor, and js-yaml.",
  keywords: [
    "yaml editor",
    "json yaml converter",
    "online yaml editor",
    "yaml formatter",
    "monaco editor",
    "nextjs tools",
  ],
  authors: [{ name: "R5W Tech", url: "https://github.com/r5wtech" }],
  creator: "R5W Tech",
  publisher: "R5W Tech",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "JSON–YAML Editor",
    description: "Edit and convert YAML ↔ JSON online in real-time.",
    url: SITE_URL,
    siteName: "JSON–YAML Editor",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "JSON–YAML Editor preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON–YAML Editor",
    description: "Online YAML ↔ JSON live editor built with Next.js + Monaco.",
    images: [`${SITE_URL}/og-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

const jsonLdSoftwareApplication = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "JSON–YAML Editor",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description:
    "Free, open-source web app to edit and convert YAML ↔ JSON in real-time.",
  url: SITE_URL,
  image: `${SITE_URL}/og-image.png`,
  author: {
    "@type": "Organization",
    name: "R5W Tech",
    url: "https://github.com/r5wtech",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "JSON–YAML Editor",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              description:
                "Edit and convert YAML ↔ JSON online using Next.js and Monaco Editor.",
              url: SITE_URL,
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
