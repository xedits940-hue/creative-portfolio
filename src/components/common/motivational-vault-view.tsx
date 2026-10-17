"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Play, ShieldCheck, Film, Compass, Flame } from "lucide-react";
import { useSecretLanyard } from "@/providers/secret-lanyard-provider";

interface MotivationalVaultViewProps {
  onClose: () => void;
}

export default function MotivationalVaultView({ onClose }: MotivationalVaultViewProps) {
  const { lockVault } = useSecretLanyard();

  const handleReturn = () => {
    lockVault();
    onClose();
  };

  const samplePlaceholders = [
    {
      id: "vault-1",
      title: "The Architecture of Obsession",
      category: "Mindset & Execution",
      duration: "04:32",
      tag: "FEATURED",
      quote: "Success is not an accident; it is the compounding of uncompromising standards.",
    },
    {
      id: "vault-2",
      title: "Silence the Noise, Build the Vision",
      category: "Focus & Discipline",
      duration: "06:15",
      tag: "MEMBER PASS",
      quote: "When everyone else seeks shortcuts, fall in love with the deep craft.",
    },
    {
      id: "vault-3",
      title: "Rise Above the Ordinary",
      category: "Creative Drive",
      duration: "05:48",
      tag: "VIP EXCLUSIVE",
      quote: "What you build in quiet solitude will speak thunderously in public.",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-20 flex flex-col w-full max-w-5xl mx-auto my-auto p-6 sm:p-10 rounded-3xl bg-neutral-950/80 border border-red-500/20 backdrop-blur-2xl shadow-2xl shadow-black/80 text-foreground overflow-hidden"
    >
      {/* Decorative ambient glowing radial beams */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Status and Return Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600/30 to-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 shadow-lg shadow-red-950/50">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-[0.25em] text-red-400 uppercase font-semibold">
                Access Granted • Level 5
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Motivational Vault <Sparkles className="h-4 w-4 text-red-400" />
            </h1>
          </div>
        </div>

        <button
          onClick={handleReturn}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 text-xs sm:text-sm font-medium text-neutral-300 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Return to Studio</span>
        </button>
      </div>

      {/* Content Pathway Notice */}
      <div className="mt-8 relative z-10">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-neutral-900/40 to-neutral-950/40 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Pathway Initialized & Secure
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                5-tap logo sequence verified. The pathway is live and ready for your motivational video collection.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-[10px] font-mono uppercase tracking-wider text-red-300 self-start sm:self-auto">
            Ready For Videos
          </span>
        </div>
      </div>

      {/* Motivational Video Cards Grid (Pathway Ready) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
        {samplePlaceholders.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.08, duration: 0.4 }}
            className="group relative flex flex-col rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-red-500/40 transition-all duration-300 overflow-hidden p-5"
          >
            {/* Video Thumbnail Placeholder */}
            <div className="relative aspect-video w-full rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-red-950/40 border border-white/5 flex items-center justify-center overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <div className="h-12 w-12 rounded-full bg-red-600/80 group-hover:bg-red-500 flex items-center justify-center text-white shadow-xl shadow-red-900/50 transition-colors z-20">
                <Play className="h-5 w-5 ml-0.5 fill-current" />
              </div>
              <div className="absolute bottom-2.5 right-2.5 z-20 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-neutral-300 border border-white/10">
                {item.duration}
              </div>
              <div className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 rounded-full bg-red-900/60 backdrop-blur-md text-[9px] font-mono tracking-wider uppercase text-red-200 border border-red-500/30">
                {item.tag}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-red-400/90 uppercase tracking-wider mb-1.5">
              <Film className="h-3 w-3" />
              <span>{item.category}</span>
            </div>

            <h3 className="text-base font-semibold text-white group-hover:text-red-300 transition-colors">
              {item.title}
            </h3>

            <p className="text-xs text-neutral-400 mt-2 italic leading-relaxed line-clamp-2">
              &ldquo;{item.quote}&rdquo;
            </p>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1 text-red-400/80">
                <Flame className="h-3 w-3" /> Direct Channel
              </span>
              <span>Available</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 relative z-10">
        <p className="font-mono text-[11px] text-neutral-400">
          VTECH ENCRYPTED ACCESS // 2026 PRIME
        </p>
        <button
          onClick={handleReturn}
          className="text-xs text-red-400 hover:text-red-300 font-medium underline underline-offset-4 cursor-pointer"
        >
          Exit to main website
        </button>
      </div>
    </motion.div>
  );
}
