"use client";

import React, { useRef, useState, useEffect } from "react";
import { Anton } from "next/font/google";
import TrueFocus from "@/components/ui/TrueFocus";
import TechText from "@/components/ui/TechText";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const CAPABILITIES = [
  "WEBSITE DEVELOPMENT",
  "VIBE CODING",
  "PROMPT ENGINEERING",
  "SOCIAL MEDIA POSTS",
  "LOGO DESIGN",
  "PRESENTATION DESIGN",
  "PDF & BROCHURE DESIGN",
  "RESTAURANT & CAFE MENUS",
  "BUSINESS CARD DESIGN",
  "CERTIFICATE DESIGN",
];

const AboutMe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<number>(195);

  useEffect(() => {
    const computeResponsiveSize = () => {
      const w = window.innerWidth;
      if (w < 440) {
        // Mobile Phones: ~80-92px
        setFontSize(Math.max(76, Math.min(Math.round(w * 0.22), 94)));
      } else if (w < 768) {
        // Large phones, foldables: ~105-135px
        setFontSize(Math.max(100, Math.min(Math.round(w * 0.185), 140)));
      } else if (w < 1024) {
        // Tablets & small notebooks: ~140-175px
        setFontSize(Math.max(140, Math.min(Math.round(w * 0.165), 175)));
      } else if (w < 1600) {
        // Laptops & Desktops: ~190-225px
        setFontSize(Math.max(185, Math.min(Math.round(w * 0.15), 225)));
      } else {
        // Ultra-wides & 4K TVs: ~240-285px
        setFontSize(Math.max(230, Math.min(Math.round(w * 0.125), 285)));
      }
    };

    computeResponsiveSize();
    window.addEventListener("resize", computeResponsiveSize);
    return () => window.removeEventListener("resize", computeResponsiveSize);
  }, []);

  return (
    <section
      ref={containerRef}
        className="relative min-h-[92vh] w-full overflow-hidden flex flex-col items-center justify-between pt-24 pb-12 bg-transparent select-none"
      >
        {/* Ambient background glow effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[200px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        {/* Giant typography section with dynamically calibrated responsive TechText effect */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center my-auto pointer-events-auto select-none overflow-hidden px-2 sm:px-4">
          <div className="w-full max-w-7xl h-[15vh] sm:h-[18vh] md:h-[22vh] lg:h-[25vh] min-h-[90px] sm:min-h-[120px] md:min-h-[160px] lg:min-h-[200px] flex items-center justify-center relative">
            <TechText
              text="VTECH"
              fontFamily={anton.style.fontFamily}
              fontWeight={400}
              fontSize={fontSize}
              color="#ff1f3d"
              accentColor="#ff1f3d"
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
              selection={true}
              labels={true}
              draggable={true}
              sweep={true}
            />
          </div>

          <div className="w-full max-w-7xl h-[15vh] sm:h-[18vh] md:h-[22vh] lg:h-[25vh] min-h-[90px] sm:min-h-[120px] md:min-h-[160px] lg:min-h-[200px] flex items-center justify-center relative">
            <TechText
              text="STUDIO"
              fontFamily={anton.style.fontFamily}
              fontWeight={400}
              fontSize={fontSize}
              color="#ff1f3d"
              accentColor="#ff1f3d"
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
              selection={true}
              labels={true}
              draggable={true}
              sweep={true}
            />
          </div>
        </div>

        {/* Studio Capabilities — Centered, refined minimalist badge and clean layout */}
        <div className="relative z-20 w-full px-4 sm:px-6 md:px-8 max-w-5xl mx-auto flex flex-col justify-center items-center text-foreground mt-auto pb-4">
          <div className="flex flex-col gap-3 text-center items-center w-full">
            <div className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-sm">
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-neutral-300 font-medium">
                Studio Capabilities
              </span>
            </div>
            <div className="w-full flex justify-center items-center">
              <TrueFocus
                items={CAPABILITIES}
                manualMode={false}
                blurAmount={0}
                borderColor="#ff1f3d"
                glowColor="rgba(255, 31, 61, 0.6)"
                animationDuration={0.6}
                pauseBetweenAnimations={1.2}
                className="justify-center text-center"
              />
            </div>
          </div>
        </div>
      </section>
  );
};

export default AboutMe;
