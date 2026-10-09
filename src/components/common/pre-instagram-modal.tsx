"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, ArrowUpRight, X } from "lucide-react";

interface PreInstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  instagramUrl?: string;
}

export const PreInstagramModal: React.FC<PreInstagramModalProps> = ({
  isOpen,
  onClose,
  instagramUrl = "https://www.instagram.com/vtechstudio.dev/",
}) => {
  const handleProceed = () => {
    onClose();
    if (typeof window !== "undefined") {
      window.open(instagramUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-neutral-950 p-6 sm:p-8 shadow-2xl text-center z-10"
          >
            {/* Ambient accent glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-red-600/20 rounded-full blur-[60px] pointer-events-none" />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close confirmation dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Instagram Badge */}
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-950/40 shadow-inner">
              <Instagram className="h-7 w-7 text-[#ff1f3d]" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Connect on Instagram
            </h3>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              You are being directed to VTECH STUDIO&apos;s official Instagram profile (
              <span className="text-white font-mono font-medium">@vtechstudio.dev</span>
              ) for direct inquiries, project briefings, and messaging.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                Stay on Site
              </button>
              <button
                type="button"
                onClick={handleProceed}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-[#ff1f3d] hover:from-red-500 hover:to-[#ff3b55] text-sm font-medium text-white shadow-[0_0_20px_rgba(255,31,61,0.4)] transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PreInstagramModal;
