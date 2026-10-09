"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useSoundContext } from "@/providers/sound-provider";

export default function SoundExperienceModal() {
  const { hasPrompted, setHasPrompted, setSoundActive } = useSoundContext();

  if (hasPrompted) return null;

  const handleChoice = (enableSound: boolean) => {
    setSoundActive(enableSound);
    setHasPrompted(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
        {/* Subtle dark backdrop with soft blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Container: Compact, Red-Glass aesthetic matching the sound toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 14 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[340px] sm:max-w-[360px] overflow-hidden rounded-2xl border border-red-500/30 bg-[#0d0a0d]/90 p-5 sm:p-6 shadow-[0_12px_36px_rgba(255,20,30,0.28)] backdrop-blur-xl text-center z-10"
          style={{
            background:
              "linear-gradient(150deg, rgba(255,255,255,0.08) 0%, rgba(255,40,50,0.12) 55%, rgba(10,5,7,0.85) 100%)",
            boxShadow:
              "inset 0 1px 1px rgba(255,255,255,0.22), inset 0 -6px 14px rgba(0,0,0,0.4), 0 12px 36px rgba(255,20,30,0.25)",
          }}
        >
          {/* Ambient red glow behind modal */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 bg-red-600/30 rounded-full blur-[40px] pointer-events-none" />

          {/* Minimal Icon Badge */}
          <div className="mx-auto mb-3.5 flex h-11 w-11 items-center justify-center rounded-full border border-red-500/40 bg-red-500/15 text-white shadow-[0_0_16px_rgba(255,45,61,0.4)]">
            <Volume2 className="h-5 w-5 text-white" />
          </div>

          {/* Simple, Elegant Single Statement */}
          <h3 className="text-base font-semibold tracking-wide text-white mb-1.5 font-sans">
            Sound Experience
          </h3>
          <p className="text-xs text-neutral-300/80 mb-5 leading-relaxed font-sans">
            Experience the portfolio with audio?
          </p>

          {/* Clean Yes / No Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleChoice(false)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-medium text-neutral-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer"
            >
              <VolumeX className="w-3.5 h-3.5 opacity-60" />
              <span>No</span>
            </button>

            <button
              type="button"
              onClick={() => handleChoice(true)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-red-600/80 hover:bg-red-500 border border-red-500/60 shadow-[0_4px_16px_rgba(255,30,40,0.4)] transition-all cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Yes</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
