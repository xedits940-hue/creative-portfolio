"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import CollabModal from "./collab-modal";
import { ArrowUpRight } from "lucide-react";

const CollabSec: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hovered, setHovered] = useState<null | "left" | "right">(null);

  // Studio signature red accent
  const redColor = "#ff1f3d";

  return (
    <>
      <section
        ref={containerRef}
        className="relative w-full overflow-hidden min-h-[520px] md:min-h-[640px] bg-black flex flex-col justify-center border-y border-white/10"
      >
        {/* Top Header Badge — Clean, subtle, studio-aligned */}
        <div className="absolute top-6 left-0 right-0 z-30 flex items-center justify-center px-4 pointer-events-none">
          <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-black/60 backdrop-blur-md shadow-sm">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: redColor }}
            />
            <span className="text-[11px] md:text-xs tracking-[0.25em] uppercase font-mono text-white/90">
              TOGETHER WE BUILD
            </span>
          </div>
        </div>

        {/* ── SPLIT PANELS (VTECH on left, CLIENT on right) ── */}
        <div className="relative flex flex-col md:flex-row w-full h-[520px] md:h-[640px] items-stretch">
          {/* LEFT PANEL: VTECH */}
          <div
            className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHovered("left")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setModalOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="Collaborate with VTECH"
          >
            {/* Cinematic dark background visual — clean, high-impact, zero unwanted text */}
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform">
              <Image
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80"
                alt="VTECH Studio background"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Clean dark cinematic gradient overlay */}
            <div
              className={`absolute inset-0 transition-colors duration-500 ${
                hovered === "left" ? "bg-black/40" : "bg-black/60"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

            {/* Center Typography - VTECH (Immediate, crisp, no delayed wavy lag) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-6 text-center select-none">
              <h2 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
                VTECH
              </h2>
            </div>
          </div>

          {/* RIGHT PANEL: CLIENT */}
          <div
            className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHovered("right")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setModalOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="Collaborate as Client"
          >
            {/* Cinematic dark background visual — clean, elegant, completely free of any baked-in 'YOU' letters */}
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform">
              <Image
                src="https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=1600&q=80"
                alt="Client vision background"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Clean dark cinematic gradient overlay */}
            <div
              className={`absolute inset-0 transition-colors duration-500 ${
                hovered === "right" ? "bg-black/40" : "bg-black/60"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent pointer-events-none" />

            {/* Center Typography - CLIENT (Immediate, crisp, no delayed wavy lag, no 'YOU' behind it) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-6 text-center select-none">
              <h2 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
                CLIENT
              </h2>
            </div>
          </div>

          {/* ── CLEAN CENTER DIVIDER ── */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-30 pointer-events-none bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <div className="md:hidden absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 z-30 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* ── REFINED, COMPACT COLLABORATION BUTTON ── */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center gap-2 pointer-events-auto">
            <motion.button
              type="button"
              onClick={() => setModalOpen(true)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open collaboration form"
              title="Click to collaborate"
              className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-black/85 border border-white/25 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-[#ff1f3d] hover:shadow-[0_0_30px_rgba(255,31,61,0.5)] cursor-pointer group"
            >
              {/* Subtle pulsing glow ring */}
              <div
                className="absolute inset-0 rounded-full border border-[#ff1f3d]/40 animate-ping opacity-40 pointer-events-none"
                style={{ animationDuration: "3s" }}
              />

              {/* Center Cross / Collab Symbol */}
              <span
                className="relative text-xl sm:text-2xl font-bold transition-transform duration-300 group-hover:rotate-45"
                style={{
                  color: redColor,
                  textShadow: "0 0 12px rgba(255,31,61,0.6)",
                }}
              >
                ✕
              </span>
            </motion.button>

            {/* Clean Pill Label below the button */}
            <motion.div
              onClick={() => setModalOpen(true)}
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 bg-black/70 backdrop-blur-md cursor-pointer hover:border-[#ff1f3d]/50 hover:bg-black/90 transition-colors shadow-lg"
            >
              <span className="text-[10px] md:text-[11px] font-mono tracking-widest text-white/80 uppercase">
                START COLLAB
              </span>
              <ArrowUpRight className="w-3 h-3 text-[#ff1f3d]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Collaboration Modal */}
      <CollabModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default CollabSec;
