"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Anton } from "next/font/google";
import TrueFocus from "@/components/ui/TrueFocus";
import TechText from "@/components/ui/TechText";
import { Sparkles, ArrowDown, Play } from "lucide-react";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const ShineBar = () => (
  <span
    aria-hidden="true"
    className="inline-block w-[3px] h-4 rounded-full mr-1.5"
    style={{
      backgroundColor: "#ff1f3d",
      boxShadow: "0 0 8px 2px rgba(255, 31, 61, 0.6)",
    }}
  />
);

const AboutMe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<number>(195);

  useEffect(() => {
    const computeResponsiveSize = () => {
      const w = window.innerWidth;
      if (w < 440) {
        // Mobile Phones: ~80-92px (fits edge-to-edge with luxury margins, no clipping)
        setFontSize(Math.max(76, Math.min(Math.round(w * 0.22), 94)));
      } else if (w < 768) {
        // Large phones, foldables: ~105-135px
        setFontSize(Math.max(100, Math.min(Math.round(w * 0.185), 140)));
      } else if (w < 1024) {
        // Tablets & small notebooks: ~140-175px
        setFontSize(Math.max(140, Math.min(Math.round(w * 0.165), 175)));
      } else if (w < 1600) {
        // Laptops & Desktops: Bold, high-end, premium presence ~190-225px
        setFontSize(Math.max(185, Math.min(Math.round(w * 0.15), 225)));
      } else {
        // Ultra-wides & 4K TVs: Impressive ~240-285px
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
      className="relative min-h-[95vh] w-full overflow-hidden flex flex-col items-center justify-between pt-24 pb-12 bg-transparent select-none"
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
            text="STUDIOS"
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

      {/* Studio Capabilities & CTAs */}
      <div className="relative z-20 w-full max-w-7xl px-6 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-foreground mt-auto">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start">
            <ShineBar />
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Studio Capabilities
            </p>
          </div>
          <TrueFocus
            sentence="CREATIVE DIRECTION CINEMATIC MOTION DIGITAL PRODUCTION"
            manualMode={false}
            blurAmount={0}
            borderColor="#ff1f3d"
            glowColor="rgba(255, 31, 61, 0.6)"
            animationDuration={0.6}
            pauseBetweenAnimations={1.2}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="#projects"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all backdrop-blur-md hover:scale-105 active:scale-95"
          >
            <span>View Projects</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="#showreel"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-500/40 transition-all backdrop-blur-md hover:scale-105 active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-red-400 text-red-400" />
            <span>Watch Reel</span>
          </Link>
          <Link
            href="#contact"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider bg-primary hover:bg-primary/90 text-white shadow-[0_0_25px_rgba(255,31,61,0.5)] transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Start Project</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
