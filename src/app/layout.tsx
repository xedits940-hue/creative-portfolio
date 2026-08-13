import type { Metadata } from "next";
import { Poppins, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { BASE_URL, OG_IMAGE } from "@/lib/constants";
import LenisWrapper from "@/providers/lenis-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import FooterSection from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import StructuredData from "@/components/common/structured-data";
import Analytics from "@/components/common/analytics";
import ConsoleLog from "@/components/common/console-log";
import CustomCursor from "@/components/ui/custom-cursor";

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
    default: "VISHAL SHARMA | NEXT-GEN VIBE CODER",
    template: "%s | Vishal Sharma",
  },
  description:
    "Portfolio of Vishal Sharma, a self-taught vibe coder from Chandigarh, India, turning ideas into working digital products through AI-assisted development.",
  keywords: [
    "Vibe Coding",
    "Prompt Engineering",
    "AI Prototyping",
    "Web Development",
    "Portfolio",
    "Digital Services",
    "Next.js",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "Vishal Sharma" }],
  creator: "Vishal Sharma",
  publisher: "Vishal Sharma",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: "VISHAL SHARMA | NEXT-GEN VIBE CODER",
    description:
      "EXPLORE A PORTFOLIO BUILT THROUGH VIBE CODING — AI-ASSISTED PROJECTS, PROTOTYPES, AND DIGITAL EXPERIMENTS BY VISHAL SHARMA.",
    siteName: "Vishal Sharma Portfolio",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Portfolio preview",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VISHAL SHARMA | NEXT-GEN VIBE CODER",
    description:
      "Explore a portfolio built through vibe coding — AI-assisted projects, prototypes, and digital experiments by Vishal Sharma.",
    creator: "@yourhandle",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Portfolio preview",
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
      { url: "/logo.png", type: "image/png", sizes: "any" },
    ],
    shortcut: "/logo.png",
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
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
        <StructuredData />
        <Analytics />
      </head>
      <body
        className={`${poppins.variable} ${cormorantGaramond.variable} antialiased mx-auto`}
      >
        <CustomCursor />
        <ConsoleLog />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LenisWrapper>
            <Navbar />
            {children}
            <FooterSection />
          </LenisWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
