"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Anton } from "next/font/google";
import { motion } from "framer-motion";
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

  return (
    <section
      ref={containerRef}
      className="relative min-h-[95vh] w-full overflow-hidden flex flex-col items-center justify-between pt-28 pb-12 bg-transparent select-none"
    >
      {/* Ambient background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/4 w-[300px] h-[200px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Top Studio Status Pill */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-20 flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-red-500/30 bg-black/50 backdrop-blur-md shadow-[0_0_15px_rgba(255,31,61,0.2)] mb-4"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span className="text-[11px] font-mono tracking-widest text-red-100 uppercase">
          VTECH STUDIOS — OFFICIAL PRODUCTION REEL 2026
        </span>
      </motion.div>

      {/* Giant typography section with interactive TechText effect */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center my-auto pointer-events-auto select-none overflow-hidden">
        <div className="w-full max-w-6xl h-[22vh] min-h-[130px] max-h-[190px] flex items-center justify-center relative">
          {/* Static glowing fallback layer for instant visual impact */}
          <h1
            className={`${anton.className} absolute text-7xl sm:text-9xl md:text-[160px] lg:text-[190px] font-bold text-red-600/20 select-none tracking-tight pointer-events-none filter drop-shadow-[0_0_40px_rgba(255,31,61,0.3)]`}
          >
            VTECH
          </h1>
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

        <div className="w-full max-w-6xl h-[22vh] min-h-[130px] max-h-[190px] flex items-center justify-center relative">
          <h1
            className={`${anton.className} absolute text-7xl sm:text-9xl md:text-[160px] lg:text-[190px] font-bold text-red-600/20 select-none tracking-tight pointer-events-none filter drop-shadow-[0_0_40px_rgba(255,31,61,0.3)]`}
          >
            STUDIOS
          </h1>
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
            blurAmount={3}
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
