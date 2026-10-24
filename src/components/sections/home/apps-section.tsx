"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import PhraseAnimation from "@/components/common/phrase-reveal";
import CardSwap, { CardSwapHandle, CardSwapItem } from "@/components/ui/card-swap";
import {
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  ExternalLink,
  X,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Cpu,
} from "lucide-react";

const APPS_DATA: CardSwapItem[] = [
  {
    id: "genesis-v1",
    title: "Genesis V1",
    subtitle: "Image Generation",
    price: "₹50,000",
    priceNote: "ONE-TIME ASKING PRICE",
    tag: "PROPRIETARY APP",
    video: "/apps/genesis-v1.mp4",
    url: "https://ais-pre-ehare5jmandgzaj2fnoufo-698605112581.asia-southeast1.run.app/",
    description:
      "First-generation creative image synthesis system. Engineered with custom prompt workflows, instant preset filters, and private encrypted digital vault storage.",
    features: [
      "Custom generative prompt engine",
      "Private vault storage & image repository",
      "Instant preset style synthesizer",
      "Complete source code & IP ownership transfer",
    ],
  },
  {
    id: "genesis-v2",
    title: "Genesis V2",
    subtitle: "Image Generation",
    price: "₹60,000",
    priceNote: "ONE-TIME ASKING PRICE",
    tag: "PROPRIETARY APP",
    video: "/apps/genesis-v2.mp4",
    url: "https://ais-pre-akhbeo3hpgpahimdiestwe-275752075489.asia-east1.run.app/",
    description:
      "Next-generation AI canvas and prompt alchemy platform. Features dual-stage Craft & Polish mode, aspect ratio selectors, voice-to-prompt recording, and zero-latency client rendering.",
    features: [
      "Dual-stage Craft & Polish rendering pipeline",
      "Built-in voice input for spoken prompts",
      "Adaptive aspect ratio matrix (1:1, 16:9, 9:16)",
      "Zero-latency client UI with full deployment ready",
    ],
  },
  {
    id: "genesis-v3",
    title: "Genesis V3",
    subtitle: "Image Generation",
    price: "₹80,000",
    priceNote: "ONE-TIME ASKING PRICE",
    tag: "FLAGSHIP APEX",
    video: "/apps/genesis-v3.mp4",
    url: "https://ais-pre-nektp3g7ghpr2pwaojzxpo-698605112581.asia-southeast1.run.app/",
    description:
      "Flagship generative apex environment. Engineered with Materialize & Augment pipelines, cinematic camera directives, live atmospheric weather sync, and legal/compliance trust center.",
    features: [
      "Materialize & Augment generative architecture",
      "Cinematic lighting & photographic directives",
      "Integrated Legal, Compliance & Trust Center",
      "High-throughput enterprise cloud readiness",
    ],
  },
  {
    id: "kite-z",
    title: "Kite Z",
    subtitle: "Kite Scanning & Learning",
    price: "₹70,000",
    priceNote: "ONE-TIME ASKING PRICE",
    tag: "AERODYNAMICS",
    video: "/apps/kite-z.mp4",
    url: "https://ais-pre-wncrcqtxpdwjz44tmktr7a-698605112581.asia-southeast1.run.app/",
    description:
      "Specialized aerodynamic kite scanning and structure analysis app. Computes spine lengths, bow curve depth, live wind speed, and bridle knot calibration with interactive feed.",
    features: [
      "Computer-vision structural kite analyzer",
      "Real-time anemometer & wind bridle guidance",
      "Interactive knowledge feed & scanner module",
      "Clean mobile-first architecture & responsive design",
    ],
  },
  {
    id: "nothing-drive",
    title: "Nothing Drive",
    subtitle: "GPS Speedometer",
    price: "₹60,000",
    priceNote: "ONE-TIME ASKING PRICE",
    tag: "GPS UTILITY",
    video: "/apps/nothing-drive.mp4",
    url: "https://ais-pre-hsy7zz4ogms3ryix7olt65-275752075489.asia-east1.run.app/",
    description:
      "Ultra-minimalist dot-matrix HUD digital speedometer. Features high-precision GPS lock, satellite telemetry, instant KM/H and MPH toggle, and zero distraction cockpit interface.",
    features: [
      "High-precision sub-second GPS telemetry lock",
      "Instant dual unit toggle (KM/H & MPH)",
      "Minimalist monochrome dot-matrix HUD aesthetic",
      "Low-power battery-efficient background operation",
    ],
  },
  {
    id: "orion",
    title: "Orion",
    subtitle: "Voice Assistant",
    price: "₹80,000",
    priceNote: "ONE-TIME ASKING PRICE",
    tag: "VOICE AI",
    video: "/apps/orion.mp4",
    url: "https://ais-pre-mi7mlf6ohfyov7vr4jfxkf-275752075489.asia-east1.run.app/",
    description:
      "Autonomous conversational AI voice assistant. Features biometric voice synthesis, multi-model voice profiles (Misty, Charon, Kore, Fenrir), interactive waveform, and zero-telemetry architecture.",
    features: [
      "Multi-persona biometric voice synthesis",
      "Interactive fluid audio waveform visualizer",
      "Zero-telemetry enterprise privacy architecture",
      "Natural real-time conversational streaming",
    ],
  },
];

export default function AppsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const swapRef = useRef<CardSwapHandle | null>(null);
  const [selectedApp, setSelectedApp] = useState<CardSwapItem | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  const headerInView = useInView(headerRef, {
    once: true,
    margin: "0px 0px -80px 0px",
  });

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedApp(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Enforce muted on modal video if opened
  useEffect(() => {
    if (selectedApp && modalVideoRef.current) {
      modalVideoRef.current.muted = true;
      modalVideoRef.current.defaultMuted = true;
      modalVideoRef.current.playsInline = true;
    }
  }, [selectedApp]);

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
          <span>Proprietary Software Suite</span>
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
            <PhraseAnimation phrase="Apps    For    Sale.    Direct" />
            <span className="block bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              <PhraseAnimation phrase="Architecture." className="text-primary" />
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
          Explore my production-engineered web apps available for complete
          acquisition. Swipe or click to manually navigate.
        </motion.p>
      </div>

      {/* 3D CardSwap Stage */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center">
        <div className="w-full h-[540px] sm:h-[600px] md:h-[630px] flex items-center justify-center">
          <CardSwap
            ref={swapRef}
            items={APPS_DATA}
            width={390}
            height={510}
            cardDistance={52}
            verticalDistance={62}
            depth={80}
            skewAmount={4}
            visibleCards={4}
            autoplay={false} // Manual movement strictly preserved!
            pauseOnHover={true}
            draggable={true}
            cardRadius={22}
            onCardClick={(index) => setSelectedApp(APPS_DATA[index] || null)}
            className="mx-auto"
          />
        </div>

        {/* Premium Frosted-Glass Controls & Manual Navigation */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-neutral-300 font-mono text-xs">
          {/* Previous Card Glass Button */}
          <button
            type="button"
            onClick={() => swapRef.current?.prev()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 bg-neutral-900/80 hover:bg-neutral-800 hover:border-primary/50 text-neutral-200 hover:text-white transition-all duration-200 cursor-pointer backdrop-blur-xl shadow-lg active:scale-95"
            aria-label="Previous app card"
          >
            <ChevronLeft className="size-4 text-primary" />
            <span className="font-semibold tracking-wider">PREV APP</span>
          </button>

          {/* Swipe & Interaction Guide Pill */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-black/50 backdrop-blur-xl text-[11px] uppercase tracking-wider text-neutral-400">
            <Layers className="size-3.5 text-primary" />
            <span>Fling / Swipe To Browse • Click Card For Details</span>
          </div>

          {/* Next Card Glass Button */}
          <button
            type="button"
            onClick={() => swapRef.current?.next()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 bg-neutral-900/80 hover:bg-neutral-800 hover:border-primary/50 text-neutral-200 hover:text-white transition-all duration-200 cursor-pointer backdrop-blur-xl shadow-lg active:scale-95"
            aria-label="Next app card"
          >
            <span className="font-semibold tracking-wider">NEXT APP</span>
            <ChevronRight className="size-4 text-primary" />
          </button>
        </div>
      </div>

      {/* Compact iOS-Style Glass Details & Purchase Enquiry Popup */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-3xl border border-white/15 bg-neutral-950/90 p-5 sm:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.85)] text-white backdrop-blur-2xl"
            >
              {/* Header: Title, Category, and Close Button */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-primary/15 border border-primary/30 text-primary">
                      {selectedApp.tag || "SOFTWARE"}
                    </span>
                    <span className="text-xs font-mono text-neutral-400 uppercase">
                      {selectedApp.subtitle}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {selectedApp.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="rounded-full border border-white/15 bg-white/5 p-2 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Price Highlight Banner */}
              <div className="my-5 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-semibold block mb-0.5">
                    {selectedApp.priceNote || "ONE-TIME ASKING PRICE"}
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
                    {selectedApp.price}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono uppercase">
                    <ShieldCheck className="size-3.5" />
                    <span>IP Transfer</span>
                  </span>
                </div>
              </div>

              {/* Video Preview Frame */}
              {selectedApp.video && (
                <div className="relative mb-5 w-full rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video flex items-center justify-center shadow-inner">
                  <video
                    ref={modalVideoRef}
                    src={selectedApp.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-neutral-300 border border-white/10">
                    LIVE RECORDING
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                {selectedApp.description}
              </p>

              {/* Verified Architecture Features */}
              {selectedApp.features && selectedApp.features.length > 0 && (
                <div className="mb-6 space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-2 flex items-center gap-1.5">
                    <Cpu className="size-3 text-primary" />
                    <span>Key Capabilities Included:</span>
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedApp.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-neutral-300 bg-white/5 border border-white/5 px-3 py-2 rounded-xl"
                      >
                        <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons: Enquire & Live Preview */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`mailto:vtechprime01@gmail.com?subject=${encodeURIComponent(
                    `Purchase Enquiry: One-Time Rights for ${selectedApp.title}`
                  )}&body=${encodeURIComponent(
                    `Hi Vishal,\n\nI am interested in acquiring the one-time rights and source architecture for "${selectedApp.title}" (${selectedApp.subtitle}) listed at ${selectedApp.price} (One-Time Asking Price).\n\nPlease share the handover process, IP transfer details, and next steps.\n\nBest regards,`
                  )}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary hover:bg-[#ff3350] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(255,31,61,0.4)] active:scale-98 text-center"
                >
                  <Mail className="size-4" />
                  <span>ENQUIRE ABOUT PURCHASE</span>
                </a>

                {selectedApp.url && (
                  <a
                    href={selectedApp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-98 text-center"
                  >
                    <span>LIVE PREVIEW</span>
                    <ExternalLink className="size-4 text-primary" />
                  </a>
                )}
              </div>

              {/* Disclaimer footer */}
              <div className="mt-4 text-center text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                Direct Handover from Architect Vishal Sharma • Complete Code Transfer
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
