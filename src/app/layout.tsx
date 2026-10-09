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
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import LiquidSilkBackground from "@/components/common/liquid-silk-background";
import { BackgroundProvider } from "@/providers/background-provider";
import { ErrorBoundary } from "@/components/common/error-boundary";
import PerformanceMonitor from "@/components/common/performance-monitor";
import SoundToggle from "@/components/common/sound-toggle";
import { SoundProvider } from "@/providers/sound-provider";
import SoundExperienceModal from "@/components/common/sound-experience-modal";

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
  manifest: "/manifest.json",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://framerusercontent.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              if(typeof window==='undefined')return;
              window.addEventListener('error',function(e){
                if(e && e.message && (e.message.indexOf('Loading chunk')!==-1 || e.message.indexOf('ChunkLoadError')!==-1)){
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  var key='_last_chunk_reload';
                  var now=Date.now();
                  var last=parseInt(sessionStorage.getItem(key)||'0',10);
                  if(now-last>8000){
                    sessionStorage.setItem(key,now.toString());
                    window.location.reload();
                  }
                  return;
                }
                if(!e.error||(e.target&&e.target!==window)){
                  e.stopImmediatePropagation();
                }
                if(e.message&&(e.message.indexOf('ResizeObserver')!==-1||e.message.indexOf('isTrusted')!==-1)){
                  e.stopImmediatePropagation();
                  e.preventDefault();
                }
              },true);
              window.addEventListener('unhandledrejection',function(e){
                var reason=e.reason;
                if(reason && (reason.name==='ChunkLoadError' || (typeof reason.message==='string' && (reason.message.indexOf('Loading chunk')!==-1 || reason.message.indexOf('ChunkLoadError')!==-1)))){
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  var key='_last_chunk_reload';
                  var now=Date.now();
                  var last=parseInt(sessionStorage.getItem(key)||'0',10);
                  if(now-last>8000){
                    sessionStorage.setItem(key,now.toString());
                    window.location.reload();
                  }
                  return;
                }
                if(!reason||reason instanceof Event||(typeof reason==='object'&&reason&&'isTrusted' in reason)){
                  e.stopImmediatePropagation();
                  e.preventDefault();
                }
              },true);
            })();`,
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${cormorantGaramond.variable} antialiased mx-auto`}
      >
        <PerformanceMonitor />
        <StructuredData />
        <Analytics />
        <ConsoleLog />
        <ErrorBoundary name="root-layout">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <BackgroundProvider>
              <SoundProvider>
                <LiquidSilkBackground />
                <SmoothCursor />
                <SoundToggle />
                <SoundExperienceModal />
                <LenisWrapper>
                  <Navbar />
                  {children}
                  <FooterSection />
                </LenisWrapper>
              </SoundProvider>
            </BackgroundProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
