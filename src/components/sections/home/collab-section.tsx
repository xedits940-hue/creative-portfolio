"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import CollabModal from "./collab-modal";
import { TextAnimate } from "@/registry/magicui/text-animate";

const wavyTextVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotate: 20,
    scale: 0.8,
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.35,
      y: {
        type: "spring",
        damping: 14,
        stiffness: 180,
      },
      rotate: {
        type: "spring",
        damping: 10,
        stiffness: 140,
      },
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: 20,
    transition: {
      delay: i * 0.02,
      duration: 0.2,
    },
  }),
};

const CollabSec: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hovered, setHovered] = useState<null | "left" | "right">(null);

  // oklch(59.71% 0.23 23.86) ≈ #c93a2a in hex, ≈ rgb(201, 58, 42)
  const redColor = "oklch(59.71% 0.23 23.86)";

  return (
    <>
      <section
        ref={containerRef}
        className="relative w-full overflow-hidden min-h-[600px] md:min-h-screen bg-black flex flex-col justify-center border-y border-white/10"
      >
        {/* Top Header Badge — Clean, studio-aligned, touching top border */}
        <div className="absolute top-6 left-0 right-0 z-30 flex flex-col items-center justify-center px-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-black/60 backdrop-blur-md"
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: redColor }}
            />
            <span
              className="text-[11px] md:text-xs tracking-[0.25em] uppercase font-mono text-white/90"
            >
              TOGETHER WE BUILD
            </span>
          </motion.div>
        </div>

        {/* ── SPLIT PANELS (VTECH on left, CLIENT on right) ── */}
        <div className="relative flex flex-col md:flex-row w-full h-[580px] md:h-screen items-stretch">
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
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform">
              <Image
                src="/bg/1.png"
                alt="VTECH Studio background"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Gradient & Dark overlays */}
            <div
              className={`absolute inset-0 bg-black/45 transition-colors duration-500 ${
                hovered === "left" ? "bg-black/25" : "bg-black/50"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60 pointer-events-none" />

            {/* Center Typography - VTECH */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-6 text-center">
              <h2
                className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-wider drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
              >
                <TextAnimate variants={wavyTextVariants} by="character">
                  VTECH
                </TextAnimate>
              </h2>
              <div
                className="h-0.5 w-24 sm:w-32 md:w-44 mt-3 rounded-full transition-all duration-500"
                style={{
                  backgroundImage: `linear-gradient(to right, transparent, ${redColor}, transparent)`,
                  transform: hovered === "left" ? "scaleX(1.4)" : "scaleX(1)",
                }}
              />
              <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/60 font-mono mt-2.5">
                CREATIVE ENGINEERING
              </span>
            </div>

            {/* Corner Bracket: Top-Left */}
            <div
              className="absolute top-6 left-6 w-6 h-6 border-t border-l pointer-events-none transition-colors duration-300"
              style={{
                borderColor:
                  hovered === "left"
                    ? redColor
                    : "rgba(255, 255, 255, 0.25)",
              }}
            />
            {/* Corner Bracket: Bottom-Left */}
            <div
              className="absolute bottom-6 left-6 w-6 h-6 border-b border-l pointer-events-none transition-colors duration-300"
              style={{
                borderColor:
                  hovered === "left"
                    ? redColor
                    : "rgba(255, 255, 255, 0.25)",
              }}
            />
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
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform">
              <Image
                src="/bg/2.png"
                alt="Client vision background"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Gradient & Dark overlays */}
            <div
              className={`absolute inset-0 bg-black/45 transition-colors duration-500 ${
                hovered === "right" ? "bg-black/25" : "bg-black/50"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-black/60 pointer-events-none" />

            {/* Center Typography - CLIENT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-6 text-center">
              <h2
                className="text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-wider drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
              >
                <TextAnimate variants={wavyTextVariants} by="character">
                  CLIENT
                </TextAnimate>
              </h2>
              <div
                className="h-0.5 w-24 sm:w-32 md:w-44 mt-3 rounded-full transition-all duration-500"
                style={{
                  backgroundImage: `linear-gradient(to right, transparent, ${redColor}, transparent)`,
                  transform: hovered === "right" ? "scaleX(1.4)" : "scaleX(1)",
                }}
              />
              <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/60 font-mono mt-2.5">
                YOUR VISION
              </span>
            </div>

            {/* Corner Bracket: Top-Right */}
            <div
              className="absolute top-6 right-6 w-6 h-6 border-t border-r pointer-events-none transition-colors duration-300"
              style={{
                borderColor:
                  hovered === "right"
                    ? redColor
                    : "rgba(255, 255, 255, 0.25)",
              }}
            />
            {/* Corner Bracket: Bottom-Right */}
            <div
              className="absolute bottom-6 right-6 w-6 h-6 border-b border-r pointer-events-none transition-colors duration-300"
              style={{
                borderColor:
                  hovered === "right"
                    ? redColor
                    : "rgba(255, 255, 255, 0.25)",
              }}
            />
          </div>

          {/* ── FULL-HEIGHT CENTER DIVIDER (Desktop & Mobile) ── */}
          {/* Vertical divider on desktop, horizontal divider on mobile */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-30 pointer-events-none">
            {/* The line running cleanly from top edge to bottom edge */}
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${redColor} 0%, rgba(255,255,255,0.2) 15%, rgba(255,255,255,0.2) 85%, ${redColor} 100%)`,
              }}
            />
            {/* Top Node touching top border */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-white/50"
              style={{ backgroundColor: redColor }}
            />
            {/* Bottom Node touching bottom border */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-white/50"
              style={{ backgroundColor: redColor }}
            />
          </div>

          {/* Horizontal divider on mobile */}
          <div className="md:hidden absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 z-30 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* ── CENTRAL COLLABORATION BUTTON (ALWAYS VISIBLE & INSTANT) ── */}
          <motion.div
            className="group/x absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex items-center justify-center cursor-pointer"
            onClick={() => setModalOpen(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            role="button"
            tabIndex={0}
            aria-label="Open collaboration form"
            title="Click to collaborate"
          >
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center">
              {/* Rotating Orbiting Text */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-85 group-hover/x:opacity-100 transition-opacity"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <path
                      id="collabRingBadge"
                      d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                    />
                  </defs>
                  <text
                    fill={redColor}
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "6.8px",
                      letterSpacing: "2.4px",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    <textPath href="#collabRingBadge" startOffset="0%">
                      LET&apos;S COLLABORATE ✦ START HERE ✦
                    </textPath>
                  </text>
                </svg>
              </motion.div>

              {/* Pulsing ring */}
              <motion.div
                className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full pointer-events-none"
                style={{
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: redColor,
                }}
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />

              {/* Center Puck */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-black/90 border border-white/20 backdrop-blur-md shadow-2xl transition-all duration-300 group-hover/x:border-[oklch(59.71%_0.23_23.86)] group-hover/x:shadow-[0_0_35px_rgba(201,58,42,0.5)]">
                <span
                  className="relative text-xl sm:text-2xl font-bold z-10 transition-transform duration-500 ease-out group-hover/x:rotate-45"
                  style={{
                    fontFamily: "'DM Serif Display', Georgia, serif",
                    color: redColor,
                    textShadow: "0 0 15px rgba(201,58,42,0.6)",
                  }}
                >
                  ✕
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar Info */}
        <div className="absolute bottom-4 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-12 pointer-events-none text-[10px] font-mono tracking-widest text-white/40 uppercase">
          <span>PORTFOLIO COLLAB</span>
          <span className="hidden sm:inline">CLICK CENTER TO TRANSMIT BRIEF</span>
          <span>EST. 2026</span>
        </div>
      </section>

      {/* Collaboration Modal */}
      <CollabModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default CollabSec;
