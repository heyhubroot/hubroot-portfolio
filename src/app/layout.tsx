import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/config/site";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MotionProvider } from "@/components/MotionProvider";
import { RevealObserver } from "@/components/Reveal";
import { themeInitScript } from "@/components/Theme";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/components.css";

/** Host Grotesk, self-hosted. The single typeface for the whole site. */
const host = localFont({
  src: [
    { path: "../fonts/HostGrotesk-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/HostGrotesk-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/HostGrotesk-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/HostGrotesk-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-host",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · ${site.title}`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { title: `${site.name} · ${site.title}`, description: site.description, type: "website" },
  twitter: { card: "summary", creator: site.contact.x.handle },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfe" },
    { media: "(prefers-color-scheme: dark)", color: "#070b26" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={host.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <MotionProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </MotionProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
