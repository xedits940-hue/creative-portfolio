"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import CollabModal from "./collab-modal";
import { TextTrail } from "@/components/ui/text-trail";

const CollabSec: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hovered, setHovered] = useState<null | "left" | "right">(null);

  // Signature VTECH crimson accent
  const redColor = "#ff1f3d";

  return (
    <>
      <section
        ref={containerRef}
        className="relative w-full overflow-hidden min-h-[580px] md:min-h-[660px] bg-[#070709] flex flex-col justify-center border-y border-white/15"
      >
        {/* Top Header Badge — Floating pill with pulsing indicator */}
        <div className="absolute top-6 left-0 right-0 z-30 flex flex-col items-center justify-center px-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-md shadow-lg shadow-black/50"
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: redColor }}
            />
            <span
              className="text-[11px] md:text-xs tracking-[0.28em] uppercase font-mono text-white/95 font-semibold"
            >
              TOGETHER WE BUILD
            </span>
          </motion.div>
        </div>

        {/* ── SPLIT PANELS (VTECH on Left, CLIENT on Right) — No random photos ── */}
        <div className="relative flex flex-col md:flex-row w-full h-[580px] md:h-[660px] items-stretch">
          
          {/* ══════════ LEFT PANEL: VTECH ══════════ */}
          <div
            className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden group cursor-pointer border-b md:border-b-0 md:border-r border-white/15 transition-all duration-500 bg-linear-to-b from-[#111116] via-[#09090c] to-[#050507] hover:border-[#ff1f3d]/60"
            onMouseEnter={() => setHovered("left")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setModalOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="Collaborate with VTECH"
          >
            {/* Ambient Red Glow on Hover */}
            <div
              className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,31,61,0.18),transparent_70%)] transition-opacity duration-700 pointer-events-none ${
                hovered === "left" ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Subtle Grid Accent */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Center Typography & Text Animation - VTECH Motion Text Trail */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-3 sm:px-6 text-center select-none pointer-events-none">
              <div className="relative w-full max-w-xl h-[170px] sm:h-[220px] md:h-[270px] flex items-center justify-center pointer-events-auto">
                <TextTrail
                  text="VTECH"
                  font={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "140px",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                  }}
                  color="#FFFFFF"
                  trailColor={redColor}
                  trail={16}
                  drift={20}
                  warp={6}
                  speed={20}
                  push={6}
                  className="w-full h-full"
                />
              </div>

              {/* Glowing Red Underline Accent */}
              <div
                className="h-0.5 w-24 sm:w-32 md:w-44 mt-1 rounded-full transition-all duration-500 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, transparent, ${redColor}, transparent)`,
                  transform: hovered === "left" ? "scaleX(1.4)" : "scaleX(1)",
                  boxShadow: hovered === "left" ? "0 0 16px rgba(255,31,61,0.8)" : "none",
                }}
              />
            </div>

            {/* High-End Technical Framing Corner Brackets */}
            <div
              className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 pointer-events-none transition-all duration-300"
              style={{
                borderColor:
                  hovered === "left"
                    ? redColor
                    : "rgba(255, 255, 255, 0.4)",
                transform: hovered === "left" ? "scale(1.1)" : "scale(1)",
              }}
            />
            <div
              className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 pointer-events-none transition-all duration-300"
              style={{
                borderColor:
                  hovered === "left"
                    ? redColor
                    : "rgba(255, 255, 255, 0.4)",
                transform: hovered === "left" ? "scale(1.1)" : "scale(1)",
              }}
            />

            {/* Subtle panel bottom badge */}
            <div className="absolute bottom-6 right-6 z-20 pointer-events-none hidden sm:block">
              <span className="font-mono text-[10px] tracking-widest uppercase text-white/50 group-hover:text-white/80 transition-colors">
                [ STUDIO CORE // 01 ]
              </span>
            </div>
          </div>

          {/* ══════════ RIGHT PANEL: CLIENT ══════════ */}
          <div
            className="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden group cursor-pointer transition-all duration-500 bg-linear-to-b from-[#111116] via-[#09090c] to-[#050507] hover:border-[#ff1f3d]/60"
            onMouseEnter={() => setHovered("right")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setModalOpen(true)}
            role="button"
            tabIndex={0}
            aria-label="Collaborate as Client"
          >
            {/* Ambient Red Glow on Hover */}
            <div
              className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,31,61,0.18),transparent_70%)] transition-opacity duration-700 pointer-events-none ${
                hovered === "right" ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Subtle Grid Accent */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Center Typography & Text Animation - CLIENT Motion Text Trail */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-3 sm:px-6 text-center select-none pointer-events-none">
              <div className="relative w-full max-w-xl h-[170px] sm:h-[220px] md:h-[270px] flex items-center justify-center pointer-events-auto">
                <TextTrail
                  text="CLIENT"
                  font={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "140px",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                  }}
                  color="#FFFFFF"
                  trailColor={redColor}
                  trail={16}
                  drift={20}
                  warp={6}
                  speed={20}
                  push={6}
                  className="w-full h-full"
                />
              </div>

              {/* Glowing Red Underline Accent */}
              <div
                className="h-0.5 w-24 sm:w-32 md:w-44 mt-1 rounded-full transition-all duration-500 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, transparent, ${redColor}, transparent)`,
                  transform: hovered === "right" ? "scaleX(1.4)" : "scaleX(1)",
                  boxShadow: hovered === "right" ? "0 0 16px rgba(255,31,61,0.8)" : "none",
                }}
              />
            </div>

            {/* High-End Technical Framing Corner Brackets */}
            <div
              className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 pointer-events-none transition-all duration-300"
              style={{
                borderColor:
                  hovered === "right"
                    ? redColor
                    : "rgba(255, 255, 255, 0.4)",
                transform: hovered === "right" ? "scale(1.1)" : "scale(1)",
              }}
            />
            <div
              className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 pointer-events-none transition-all duration-300"
              style={{
                borderColor:
                  hovered === "right"
                    ? redColor
                    : "rgba(255, 255, 255, 0.4)",
                transform: hovered === "right" ? "scale(1.1)" : "scale(1)",
              }}
            />

            {/* Subtle panel bottom badge */}
            <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden sm:block">
              <span className="font-mono text-[10px] tracking-widest uppercase text-white/50 group-hover:text-white/80 transition-colors">
                [ PARTNER NETWORK // 02 ]
              </span>
            </div>
          </div>

          {/* ── FULL-HEIGHT CENTER DIVIDER (Desktop & Mobile) ── */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-30 pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${redColor} 0%, rgba(255,255,255,0.25) 15%, rgba(255,255,255,0.25) 85%, ${redColor} 100%)`,
              }}
            />
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-white/60 shadow-[0_0_8px_#ff1f3d]"
              style={{ backgroundColor: redColor }}
            />
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-white/60 shadow-[0_0_8px_#ff1f3d]"
              style={{ backgroundColor: redColor }}
            />
          </div>

          <div className="md:hidden absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 z-30 pointer-events-none bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* ── CENTRAL COLLABORATION BADGE (Balanced Medium Size, neatly hugging the X puck) ── */}
          <motion.div
            className="group/x absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex items-center justify-center cursor-pointer"
            onClick={() => setModalOpen(true)}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
            role="button"
            tabIndex={0}
            aria-label="Open collaboration form"
            title="Click to collaborate"
          >
            {/* Balanced Medium Size Container */}
            <div className="relative w-24 h-24 sm:w-26 sm:h-26 md:w-28 md:h-28 flex items-center justify-center">
              {/* Rotating Orbiting Text Badge hugging the center puck comfortably */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-90 group-hover/x:opacity-100 transition-opacity"
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
                      d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                    />
                  </defs>
                  <text
                    fill={redColor}
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "5.8px",
                      letterSpacing: "2.1px",
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
                className="absolute w-14 h-14 sm:w-15 sm:h-15 rounded-full pointer-events-none"
                style={{
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: redColor,
                }}
                animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />

              {/* Center Puck with X */}
              <div className="relative w-13 h-13 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-full flex items-center justify-center bg-black/90 border border-white/25 backdrop-blur-md shadow-2xl transition-all duration-300 group-hover/x:border-[#ff1f3d] group-hover/x:shadow-[0_0_30px_rgba(255,31,61,0.65)]">
                <span
                  className="relative text-lg sm:text-xl font-bold z-10 transition-transform duration-500 ease-out group-hover/x:rotate-45"
                  style={{
                    color: redColor,
                    textShadow: "0 0 14px rgba(255,31,61,0.8)",
                  }}
                >
                  ✕
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Collaboration Modal */}
      <CollabModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default CollabSec;
