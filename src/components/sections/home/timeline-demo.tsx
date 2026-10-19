"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Timeline } from "@/components/ui/timeline";
import PhraseAnimation from "@/components/common/phrase-reveal";
import {
  CertificateCard,
  CERTIFICATES,
  CertificateItem,
} from "./certificate-showcase";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function TimelineDemo() {
  const [activeItem, setActiveItem] = useState<CertificateItem | null>(null);

  // Exact requested order:
  // 1. GEMMI.png
  // 2. CBITTS.png
  // 3. certicate.png
  const data = [
    {
      title: "MILESTONE 01",
      content: (
        <div className="w-full">
          <h3 className="text-xl font-bold text-neutral-800 md:text-3xl dark:text-neutral-200">
            <PhraseAnimation phrase="Gemini Certified Student" />
          </h3>
          <p className="mb-6 text-xs text-muted-foreground md:text-base mt-2">
            <PhraseAnimation phrase="Google for Education certified. I use AI tools confidently and responsibly to build better, faster." />
          </p>

          <CertificateCard
            item={CERTIFICATES[0]}
            index={0}
            onOpenLightbox={(item) => setActiveItem(item)}
          />
        </div>
      ),
    },
    {
      title: "MILESTONE 02",
      content: (
        <div className="w-full">
          <h3 className="text-xl font-bold text-neutral-800 md:text-3xl dark:text-neutral-200">
            <PhraseAnimation phrase="English Communication" />
          </h3>
          <p className="mb-6 text-xs text-muted-foreground md:text-base mt-2">
            <PhraseAnimation phrase="Verified 3-month Spoken English course at CBitss (Grade A). I speak clearly and confidently with clients." />
          </p>

          <CertificateCard
            item={CERTIFICATES[1]}
            index={1}
            onOpenLightbox={(item) => setActiveItem(item)}
          />
        </div>
      ),
    },
    {
      title: "MILESTONE 03",
      content: (
        <div className="w-full">
          <h3 className="text-xl font-bold text-neutral-800 md:text-3xl dark:text-neutral-200">
            <PhraseAnimation phrase="Computer Fundamentals" />
          </h3>
          <p className="mb-6 text-xs text-muted-foreground md:text-base mt-2">
            <PhraseAnimation phrase="Basic computer course. A solid foundation behind my design and development work." />
          </p>

          <CertificateCard
            item={CERTIFICATES[2]}
            index={2}
            onOpenLightbox={(item) => setActiveItem(item)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip mt-10">
      <Timeline data={data} />

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-6 md:p-10"
            onClick={() => setActiveItem(null)}
          >
            {/* Top Close Button & Meta */}
            <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 z-20 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-primary border border-primary/40 bg-primary/10 px-3 py-1 rounded-full">
                  {activeItem.badge}
                </span>
                <span className="text-sm font-medium hidden sm:inline text-white/90">
                  {activeItem.title}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveItem(null);
                }}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-mono tracking-widest uppercase hover:bg-white/20 transition-colors cursor-pointer text-white"
                aria-label="Close fullscreen view"
              >
                <X className="size-4" />
                <span>CLOSE</span>
              </button>
            </div>

            {/* Modal Image Display */}
            <div
              className="relative max-h-[85vh] max-w-[92vw] overflow-hidden rounded-xl border border-white/20 bg-neutral-950 p-2 sm:p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative max-h-[80vh] w-auto overflow-hidden flex items-center justify-center"
                style={{ aspectRatio: activeItem.aspectRatio }}
              >
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  width={activeItem.width}
                  height={activeItem.height}
                  className="max-h-[80vh] w-auto object-contain rounded-lg"
                  quality={100}
                />
              </div>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-4 left-0 right-0 z-20 text-center font-mono text-[11px] uppercase tracking-widest text-neutral-400">
              Press ESC or click outside to dismiss • Original Master Record
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TimelineDemo;
