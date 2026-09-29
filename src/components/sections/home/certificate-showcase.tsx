"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, CheckCircle2, ShieldCheck } from "lucide-react";

export interface CertificateItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: string;
  specs: string;
}

export const CERTIFICATES: CertificateItem[] = [
  {
    id: "gemmi",
    title: "Official Professional Credential",
    category: "Verified Accreditation",
    badge: "CREDENTIAL 01",
    src: "/GEMMI.png",
    alt: "GEMMI Certificate - VTECH Studios",
    width: 591,
    height: 440,
    aspectRatio: "591 / 440",
    specs: "VERIFIED ARCHIVE // ORIGINAL MASTER",
  },
  {
    id: "cbitts",
    title: "Technical Excellence & Practical Achievement",
    category: "Professional Certification",
    badge: "CREDENTIAL 02",
    src: "/CBITTS.png",
    alt: "CBITTS Certificate - VTECH Studios",
    width: 687,
    height: 487,
    aspectRatio: "687 / 487",
    specs: "ACCREDITED RECORD // AUTHENTIC ISSUANCE",
  },
  {
    id: "certicate",
    title: "Master Studio Qualification Certificate",
    category: "Studio Accreditation",
    badge: "CREDENTIAL 03",
    src: "/certicate.png",
    alt: "Official Qualification Certificate - VTECH Studios",
    width: 801,
    height: 566,
    aspectRatio: "801 / 566",
    specs: "OFFICIAL SEAL // REGISTERED CREDENTIAL",
  },
];

interface CertificateCardProps {
  item: CertificateItem;
  index: number;
  onOpenLightbox: (item: CertificateItem) => void;
}

export function CertificateCard({
  item,
  index,
  onOpenLightbox,
}: CertificateCardProps) {
  // oklch(59.71% 0.23 23.86) ≈ #c93a2a (VTECH Studio Accent Red)
  const redColor = "oklch(59.71% 0.23 23.86)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      className="group relative w-full max-w-4xl mx-auto overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-neutral-950/80 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-white/25 hover:shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
    >
      {/* Subtle Studio Scanline / Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-black/30 to-black/85" />

      {/* Corner Brackets */}
      <span className="absolute left-3 top-3 block size-3 border-l-2 border-t-2 transition-colors duration-300 pointer-events-none border-white/20 group-hover:border-[oklch(59.71%_0.23_23.86)]" />
      <span className="absolute right-3 top-3 block size-3 border-r-2 border-t-2 transition-colors duration-300 pointer-events-none border-white/20 group-hover:border-[oklch(59.71%_0.23_23.86)]" />
      <span className="absolute bottom-3 left-3 block size-3 border-b-2 border-l-2 transition-colors duration-300 pointer-events-none border-white/20 group-hover:border-[oklch(59.71%_0.23_23.86)]" />
      <span className="absolute bottom-3 right-3 block size-3 border-b-2 border-r-2 transition-colors duration-300 pointer-events-none border-white/20 group-hover:border-[oklch(59.71%_0.23_23.86)]" />

      {/* Card Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span
            className="flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] font-semibold tracking-widest uppercase border bg-black/60 backdrop-blur-md"
            style={{
              borderColor: `oklch(59.71% 0.23 23.86 / 0.4)`,
              color: redColor,
            }}
          >
            <span
              className="size-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: redColor }}
            />
            {item.badge}
          </span>
          <span className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-wider text-white/60">
            {item.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-block font-mono text-[10px] uppercase tracking-widest text-neutral-400">
            {item.specs}
          </span>
          <button
            type="button"
            onClick={() => onOpenLightbox(item)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-mono tracking-wider text-white/80 transition-all hover:border-white/40 hover:bg-white/10 hover:text-white cursor-pointer"
            aria-label={`Expand ${item.title}`}
          >
            <Maximize2 className="size-3 text-white/70" />
            <span className="hidden sm:inline">FULLSCREEN</span>
          </button>
        </div>
      </div>

      {/* Certificate Image Frame — Strict Aspect Ratio Preservation, Zero Crop */}
      <div
        className="relative z-10 w-full p-3 sm:p-6 md:p-8 flex items-center justify-center cursor-pointer group/img"
        onClick={() => onOpenLightbox(item)}
      >
        <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-neutral-900/60 p-2 sm:p-3 shadow-inner transition-transform duration-500 ease-out group-hover:border-white/30 group-hover:shadow-[0_10px_40px_rgba(0,0,0,0.7)]">
          <div
            className="relative w-full overflow-hidden rounded-lg bg-black/40 flex items-center justify-center"
            style={{ aspectRatio: item.aspectRatio }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              priority={index === 0}
              className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover/img:scale-[1.015]"
              sizes="(max-width: 768px) 95vw, (max-width: 1200px) 85vw, 900px"
              quality={95}
            />

            {/* Subtle hover overlay hint */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/img:bg-black/20 flex items-center justify-center pointer-events-none opacity-0 group-hover/img:opacity-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 border border-white/30 text-white text-xs font-mono tracking-widest uppercase backdrop-blur-md shadow-xl">
                <Maximize2 className="size-3.5" />
                Click to Inspect
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Info */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 sm:px-8 bg-black/40">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-400" />
          <span className="text-xs sm:text-sm font-semibold tracking-tight text-white/90">
            {item.title}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-neutral-400">
          <span className="flex items-center gap-1 text-white/60">
            <ShieldCheck className="size-3.5 text-primary" />
            OFFICIAL RECORD
          </span>
          <span className="hidden sm:inline text-neutral-600">|</span>
          <span className="hidden sm:inline text-white/40">
            {item.width} × {item.height} PX
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function CertificateShowcase() {
  const [activeItem, setActiveItem] = useState<CertificateItem | null>(null);

  return (
    <div className="w-full space-y-10 sm:space-y-14 md:space-y-18">
      {/* 
        Exact requested order:
        1. GEMMI.png
        2. CBITTS.png
        3. certicate.png
      */}
      {CERTIFICATES.map((cert, index) => (
        <CertificateCard
          key={cert.id}
          item={cert}
          index={index}
          onOpenLightbox={(item) => setActiveItem(item)}
        />
      ))}

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

export default CertificateShowcase;
