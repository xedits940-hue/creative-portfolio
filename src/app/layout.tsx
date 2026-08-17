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
    "PORTFOLIO OF VISHAL SHARMA, A SELF-TAUGHT VIBE CODER FROM CHANDIGARH, INDIA, TURNING IDEAS INTO IMMERSIVE DIGITAL EXPERIENCES THROUGH CREATIVITY, EXPERIMENTATION, AND AI.",
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
      "EXPLORE THE PORTFOLIO OF VISHAL SHARMA — A SELF-TAUGHT VIBE CODER CREATING IMMERSIVE DIGITAL EXPERIENCES THROUGH CREATIVITY, EXPERIMENTATION, AND AI.",
    siteName: "Vishal Sharma Portfolio",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Vishal Sharma Portfolio",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VISHAL SHARMA | NEXT-GEN VIBE CODER",
    description:
      "EXPLORE THE PORTFOLIO OF VISHAL SHARMA — A SELF-TAUGHT VIBE CODER CREATING IMMERSIVE DIGITAL EXPERIENCES THROUGH CREATIVITY, EXPERIMENTATION, AND AI.",
    creator: "@vishalcore07",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Vishal Sharma Portfolio",
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
