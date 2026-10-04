"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Anton } from "next/font/google";
import TrueFocus from "@/components/ui/TrueFocus";
import TechText from "@/components/ui/TechText";

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

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] w-full overflow-hidden flex flex-col items-center justify-between pt-24 pb-12 bg-transparent select-none"
    >
      {/* Giant typography background with interactive TechText effect */}
      <div
        className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-0 pointer-events-auto select-none overflow-hidden opacity-90"
      >
        <div className="w-full max-w-6xl h-[26vh] max-h-[190px] flex items-center justify-center">
          <TechText
            text="VTECH"
            fontFamily={anton.style.fontFamily}
            fontWeight={400}
            fontSize={200}
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
        <div className="w-full max-w-6xl h-[26vh] max-h-[190px] flex items-center justify-center">
          <TechText
            text="STUDIOS"
            fontFamily={anton.style.fontFamily}
            fontWeight={400}
            fontSize={200}
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
      <div className="relative z-20 w-full max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-foreground mt-auto">
        <div className="flex flex-col gap-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start">
            <ShineBar />
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Studio Capabilities
            </p>
          </div>
          <TrueFocus
            sentence="CREATIVE DIRECTION CINEMATIC MOTION DIGITAL PRODUCTION"
            manualMode={false}
            blurAmount={3}
            borderColor="#ff1f3d"
            glowColor="rgba(255, 31, 61, 0.6)"
            animationDuration={0.6}
            pauseBetweenAnimations={1.2}
          />
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="#projects"
            className="px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all backdrop-blur-md"
          >
            View Projects ↓
          </Link>
          <Link
            href="#contact"
            className="px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(255,31,61,0.4)] transition-all"
          >
            Start Project ✦
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
