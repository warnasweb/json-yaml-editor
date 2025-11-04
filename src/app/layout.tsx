import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://json-yaml-editor.example.com",
  ),
  title: {
    default: "🧩 JSON–YAML Editor",
    template: "%s · 🧩 JSON–YAML Editor",
  },
  description:
    "Interactive JSON⇄YAML converter with validation, Monaco editing, and instant previews.",
  keywords: [
    "JSON editor",
    "YAML editor",
    "JSON to YAML",
    "YAML to JSON",
    "monaco editor",
    "developer tools",
    "data converter",
    "R5W Tech",
  ],
  authors: [{ name: "R5W Tech" }],
  creator: "R5W Tech",
  publisher: "R5W Tech",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "🧩 JSON–YAML Editor",
    description:
      "Convert and validate JSON and YAML side by side with an interactive Monaco-powered interface.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://json-yaml-editor.example.com",
    siteName: "JSON–YAML Editor",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JSON–YAML Editor by R5W Tech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "🧩 JSON–YAML Editor",
    description:
      "Convert and validate JSON and YAML with an interactive split-view editor.",
    creator: "@r5wtech",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
