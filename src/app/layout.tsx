import type { Metadata } from "next";
import { Poppins, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { BASE_URL } from "@/lib/constants";
import LenisWrapper from "@/providers/lenis-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import FooterSection from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import StructuredData from "@/components/common/structured-data";
import Analytics from "@/components/common/analytics";
import ConsoleLog from "@/components/common/console-log";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";
import LiquidSilkBackground from "@/components/common/liquid-silk-background";
import CinematicStartGate from "@/components/common/CinematicStartGate";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "VTECH STUDIOS",
    template: "%s | VTECH STUDIOS",
  },
  description:
    "OFFICIAL STUDIO PORTFOLIO OF VTECH STUDIOS — DIGITAL PRODUCTION, MOTION, AND HIGH-END CREATIVE ENGINEERING.",
  keywords: [
    "VTECH STUDIOS",
    "Creative Direction",
    "Digital Production",
    "Motion Design",
    "Web Engineering",
    "AI Prototyping",
    "Portfolio",
    "Next.js",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "VTECH STUDIOS" }],
  creator: "VTECH STUDIOS",
  publisher: "VTECH STUDIOS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: "VTECH STUDIOS",
    description:
      "OFFICIAL STUDIO PORTFOLIO OF VTECH STUDIOS — DIGITAL PRODUCTION, MOTION, AND HIGH-END CREATIVE ENGINEERING.",
    siteName: "VTECH STUDIOS",
    images: [
      {
        url: "/vtech-studios-logo.png",
        width: 1200,
        height: 1200,
        alt: "VTECH STUDIOS Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VTECH STUDIOS",
    description:
      "OFFICIAL STUDIO PORTFOLIO OF VTECH STUDIOS — DIGITAL PRODUCTION, MOTION, AND HIGH-END CREATIVE ENGINEERING.",
    creator: "@vtechstudios",
    images: [
      {
        url: "/vtech-studios-logo.png",
        width: 1200,
        height: 1200,
        alt: "VTECH STUDIOS Logo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
      { url: "/vtech-studios-logo.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: [{ url: "/vtech-studios-logo.png", type: "image/png" }],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://i.vimeocdn.com" />
        <link rel="preconnect" href="https://f.vimeocdn.com" />
        <link
          rel="preconnect"
          href="https://ik.imagekit.io"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
      </head>
      <body
        className={`${poppins.variable} ${cormorantGaramond.variable} antialiased mx-auto`}
      >
        <StructuredData />
        <Analytics />
        <ConsoleLog />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LiquidSilkBackground />
          <CinematicStartGate />
          <MagneticCursor
            magneticFactor={0.4}
            blendMode="exclusion"
            cursorSize={28}
            cursorColor="white"
            contrastBoost={1.5}
          >
            <LenisWrapper>
              <Navbar />
              {children}
              <FooterSection />
            </LenisWrapper>
          </MagneticCursor>
        </ThemeProvider>
      </body>
    </html>
  );
}
