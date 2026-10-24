"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import PhraseAnimation from "@/components/common/phrase-reveal";
import CardSwap, { CardSwapHandle, CardSwapItem } from "@/components/ui/card-swap";
import { ChevronLeft, ChevronRight, Layers, Sparkles } from "lucide-react";

const APPS_DATA: CardSwapItem[] = [
  {
    id: "orion",
    title: "ORION",
    subtitle: "Voice Assistant",
    tag: "VOICE AI",
    video: "/apps/orion.mp4",
    url: "https://ais-pre-mi7mlf6ohfyov7vr4jfxkf-275752075489.asia-east1.run.app/",
  },
  {
    id: "genesis-v2",
    title: "GENESIS X",
    subtitle: "Version 2.0 • AI Canvas",
    tag: "V2.0 PROTOTYPE",
    video: "/apps/genesis-v2.mp4",
    url: "https://ais-pre-akhbeo3hpgpahimdiestwe-275752075489.asia-east1.run.app/",
  },
  {
    id: "nothing-drive",
    title: "NOTHING DRIVE",
    subtitle: "Minimalist GPS Speedometer",
    tag: "GPS UTILITY",
    video: "/apps/nothing-drive.mp4",
    url: "https://ais-pre-hsy7zz4ogms3ryix7olt65-275752075489.asia-east1.run.app/",
  },
  {
    id: "kite-z",
    title: "KITE Z",
    subtitle: "Precision Kite Analytics",
    tag: "AERODYNAMICS",
    video: "/apps/kite-z.mp4",
    url: "https://ais-pre-wncrcqtxpdwjz44tmktr7a-698605112581.asia-southeast1.run.app/",
  },
  {
    id: "genesis-v3",
    title: "GENESIS X",
    subtitle: "Version 3.0 • Apex Studio",
    tag: "V3.0 APEX",
    video: "/apps/genesis-v3.mp4",
    url: "https://ais-pre-nektp3g7ghpr2pwaojzxpo-698605112581.asia-southeast1.run.app/",
  },
  {
    id: "genesis-v1",
    title: "GENESIS X",
    subtitle: "Version 1.0 • Generative Core",
    tag: "V1.0 CLASSIC",
    video: "/apps/genesis-v1.mp4",
    url: "https://ais-pre-ehare5jmandgzaj2fnoufo-698605112581.asia-southeast1.run.app/",
  },
];

export default function AppsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const swapRef = useRef<CardSwapHandle | null>(null);

  const headerInView = useInView(headerRef, {
    once: true,
    margin: "0px 0px -80px 0px",
  });

  return (
    <section
      ref={sectionRef}
      id="apps"
      className="relative flex w-full flex-col items-center justify-center py-20 md:py-28 overflow-hidden isolate bg-transparent"
    >
      {/* Background ambient crimson glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-primary/12 blur-[140px] rounded-full pointer-events-none -z-10 opacity-70" />

      {/* Section Header */}
      <div
        ref={headerRef}
        className="container relative z-10 mb-10 px-6 text-center mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={
            headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
          }
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-4 w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium text-primary uppercase tracking-widest font-mono flex items-center gap-2"
        >
          <Sparkles className="size-3 text-primary" />
          <span>Interactive App Ecosystem</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={
            headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
          }
          transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <PhraseAnimation phrase="Engineered    Apps.    Real" />
            <span className="block bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              <PhraseAnimation phrase="Execution." className="text-primary" />
            </span>
          </h2>
        </motion.div>

        {/* Sweeping accent divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={headerInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0 }}
          className="mx-auto mt-6 h-px max-w-xs bg-linear-to-r from-primary/60 via-primary/20 to-transparent"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-2xl text-sm text-neutral-400 md:text-base leading-relaxed"
        >
          Explore my suite of proprietary web applications. Drag, flick, or use
          the controls below to cycle through each interactive 3D card stack.
        </motion.p>
      </div>

      {/* 3D CardSwap Stage */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        <div className="w-full h-[520px] sm:h-[580px] md:h-[620px] flex items-center justify-center">
          <CardSwap
            ref={swapRef}
            items={APPS_DATA}
            width={400}
            height={480}
            cardDistance={52}
            verticalDistance={62}
            depth={80}
            skewAmount={4}
            visibleCards={4}
            delay={4500}
            autoplay={true}
            pauseOnHover={true}
            draggable={true}
            cardRadius={20}
            className="mx-auto"
          />
        </div>

        {/* Interactive Controls & Hints */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-neutral-400 font-mono text-xs">
          {/* Previous Card Button */}
          <button
            type="button"
            onClick={() => swapRef.current?.prev()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 bg-neutral-900/80 hover:bg-neutral-800 hover:border-primary/40 text-neutral-300 hover:text-white transition-all cursor-pointer backdrop-blur-md shadow-lg"
            aria-label="Previous app card"
          >
            <ChevronLeft className="size-4 text-primary" />
            <span className="hidden sm:inline">PREV</span>
          </button>

          {/* Drag & Status Hint */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-black/40 backdrop-blur-md text-[11px] uppercase tracking-wider text-neutral-400">
            <Layers className="size-3.5 text-primary" />
            <span>Fling or Drag to Swap • Click Preview to Open</span>
          </div>

          {/* Next Card Button */}
          <button
            type="button"
            onClick={() => swapRef.current?.next()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 bg-neutral-900/80 hover:bg-neutral-800 hover:border-primary/40 text-neutral-300 hover:text-white transition-all cursor-pointer backdrop-blur-md shadow-lg"
            aria-label="Next app card"
          >
            <span className="hidden sm:inline">NEXT</span>
            <ChevronRight className="size-4 text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
}
