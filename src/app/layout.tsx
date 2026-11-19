import type { Metadata, Viewport } from "next";
import { Exo_2, Manrope, Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { company } from "@/content/site";
import { themeInitScript } from "@/lib/themeScript";

// Site typefaces: Sora (headings) + Manrope (text). Exo 2 is loaded only for the logo wordmark.
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const exo = Exo_2({ variable: "--font-exo", subsets: ["latin"], weight: ["600"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: "Network Resource | Managed IT Support for Bay Area Businesses",
    template: "%s · Network Resource",
  },
  description: company.description,
  applicationName: "Network Resource",
  openGraph: {
    type: "website",
    siteName: "Network Resource",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07090d" },
    { media: "(prefers-color-scheme: light)", color: "#f3f5f9" },
  ],
  colorScheme: "dark light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: company.name,
  url: company.url,
  description: company.description,
  foundingDate: String(company.founded),
  email: "sales@networkresource.com",
  telephone: company.phones.tollFree.tel,
  areaServed: "San Francisco Bay Area",
  department: company.offices.map((o) => ({
    "@type": "ProfessionalService",
    name: `${company.name}, ${o.region}`,
    telephone: o.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: o.street,
      addressLocality: o.city,
      addressRegion: o.state,
      postalCode: o.zip,
      addressCountry: "US",
    },
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${sora.variable} ${manrope.variable} ${exo.variable} antialiased`}>
      <body className="min-h-dvh">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-bone-50 px-5 py-3 text-sm font-medium text-ink-950 transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
