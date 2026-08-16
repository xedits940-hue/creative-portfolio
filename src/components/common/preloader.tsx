"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useAssetLoader } from "@/hooks/use-asset-loader";
import { useIsMobile } from "@/hooks/use-mobile";

// The whole overlay slides up and off-screen once loading completes.
// NOTE: we animate `y` (a GPU-composited transform), never `top` — animating
// `top` forces a layout+paint on every frame and is the classic cause of a
// juddering slide-up on phones.
const slideUp: Variants = {
  initial: { y: 0 },
  exit: {
    y: "-100vh",
    transition: {
      duration: 1.1,
      ease: [0.76, 0, 0.24, 1] as const,
      delay: 0.15,
    },
  },
};

interface PreloaderProps {
  /** Fired once all real assets are in — the parent then unmounts this. */
  onComplete?: () => void;
  words?: string[];
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  words = [
    "नमस्ते",
    "Hello",
    "Bonjour",
    "स्वागत",
    "Ciao",
    "Olà",
    "やあ",
    "Hallå",
    "Guten tag",
    "प्रणाम",
    "Hallo",
    "आपका स्वागत है",
  ],
  backgroundColor = "#141516",
  textColor = "#ffffff",
  accentColor = "#e11d2a",
}) => {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const isMobile = useIsMobile();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  // Real load progress lives here (not in the page), so its updates only
  // re-render this overlay and never the heavy page tree behind it.
  const { progress, isComplete } = useAssetLoader();

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Start the riser sound the moment the preloader itself appears (i.e. the
  // moment the site starts loading), not when it finishes.
  useEffect(() => {
    try {
      const audio = new Audio("/dragon-studio-dramatic-riser-397994.mp3");
      audio.volume = 0.5;
      audioRef.current = audio;
      void audio.play().catch(() => {
        // Some browsers block audio until the first user interaction.
      });
    } catch {
      // A sound error must never stop the website from opening.
    }

    return () => {
      audioRef.current?.pause();
      if (fadeIntervalRef.current !== null) {
        window.clearInterval(fadeIntervalRef.current);
      }
    };
  }, []);

  // As soon as loading finishes, fade the sound out over ~0.9s so it ends
  // right around the same time the loading screen slides away.
  useEffect(() => {
    if (!isComplete) return;

    const audio = audioRef.current;
    if (audio) {
      const fadeDurationMs = 900;
      const steps = 18;
      const stepTime = fadeDurationMs / steps;
      const startVolume = audio.volume;
      let currentStep = 0;

      fadeIntervalRef.current = window.setInterval(() => {
        currentStep += 1;
        const nextVolume = Math.max(
          0,
          startVolume * (1 - currentStep / steps),
        );
        audio.volume = nextVolume;

        if (currentStep >= steps) {
          audio.pause();
          if (fadeIntervalRef.current !== null) {
            window.clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
        }
      }, stepTime);
    }

    onComplete?.();
  }, [isComplete, onComplete]);

  // The greeting shown is derived from real progress, so the languages march
  // forward in lock-step with how much of the site has actually loaded.
  const clamped = Math.min(100, Math.max(0, progress));
  const index = Math.min(
    words.length - 1,
    Math.floor((clamped / 100) * words.length),
  );

  // Curved-edge reveal for the slide-up (the classic elastic bottom) — desktop
  // only. Morphing two full-screen SVG paths every frame is far too heavy for
  // mobile GPUs, so phones get a clean straight edge instead.
  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height + 300} 0 ${
    dimension.height
  } L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve: Variants = {
    initial: {
      d: initialPath,
      transition: { duration: 1.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: targetPath,
      transition: { duration: 1.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  const lineInitial = `M0 ${dimension.height} Q${dimension.width / 2} ${
    dimension.height + 300
  } ${dimension.width} ${dimension.height}`;
  const lineTarget = `M0 ${dimension.height} Q${dimension.width / 2} ${
    dimension.height
  } ${dimension.width} ${dimension.height}`;

  const lineCurve: Variants = {
    initial: {
      d: lineInitial,
      transition: { duration: 1.7, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      d: lineTarget,
      transition: { duration: 1.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      exit="exit"
      className="h-screen w-screen fixed left-0 top-0 z-[99]"
      style={{ backgroundColor, willChange: "transform" }}
    >
      {dimension.width > 0 && (
        <>
          {/* Soft accent glow — desktop only. A large `blur-[120px]` surface is
              cheap to paint once but ruinous to re-composite on mobile, so we
              simply omit it there. It pulses on its own timeline (scale/opacity
              transforms) rather than re-animating on every progress tick. */}
          {!isMobile && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
              style={{
                backgroundColor: accentColor,
                willChange: "transform, opacity",
              }}
              animate={{ scale: [1, 1.35, 1], opacity: [0.08, 0.2, 0.08] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          {/* Center: the cycling multilingual greeting */}
          <div className="absolute inset-0 z-[2] flex items-center justify-center">
            <div className="flex items-center overflow-hidden">
              <span
                className="mr-3 block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <div className="relative overflow-hidden">
                {/* Keyed by index: each greeting is fully opaque the moment it
                    appears (only a small slide), so nothing flashes invisible
                    even when words change quickly. Natural width (no fixed
                    sizer box) keeps the dot sitting right next to the word
                    for every language, instead of floating far from short
                    words like "やあ". */}
                <motion.span
                  key={index}
                  initial={{ y: "35%" }}
                  animate={{ y: "0%" }}
                  transition={{
                    duration: 0.4,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  className="block whitespace-nowrap text-4xl font-light leading-[1.6] md:text-5xl"
                  style={{ color: textColor }}
                >
                  {words[index]}
                </motion.span>
              </div>
            </div>
          </div>

          {/* Bottom-left label */}
          <div className="absolute bottom-8 left-8 z-[2] flex items-center gap-3">
            <motion.span
              className="block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: accentColor }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span
              className="text-[11px] font-medium uppercase tracking-[0.35em] opacity-60"
              style={{ color: textColor }}
            >
              Loading experience
            </span>
          </div>

          {/* Bottom-right: the big live counter */}
          <div className="absolute bottom-4 right-3 z-[2] flex items-end tabular-nums sm:right-6 md:right-10">
            <span
              className="font-[var(--font-accent)] text-[12vw] leading-none tracking-tighter sm:text-[10vw] md:text-[6vw]"
              style={{ color: textColor }}
            >
              {String(Math.round(clamped)).padStart(2, "0")}
            </span>
            <span
              className="mb-[1vw] ml-1 text-[2.5vw] font-light sm:mb-[1.2vw] sm:text-[2vw] md:mb-[0.8vw] md:text-[1.3vw]"
              style={{ color: accentColor }}
            >
              %
            </span>
          </div>

          {isMobile ? (
            /* Mobile: a dead-simple straight progress bar pinned to the bottom.
               Only its `scaleX` transform animates (compositor-only), so it
               stays perfectly smooth even on low-end phones. */
            <div className="absolute bottom-0 left-0 z-[3] h-[3px] w-full">
              <div
                className="absolute inset-0"
                style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              />
              <motion.div
                className="absolute inset-0 origin-left"
                style={{ backgroundColor: accentColor }}
                animate={{ scaleX: clamped / 100 }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              />
            </div>
          ) : (
            <>
              {/* Progress line — a stroke tracing the same bottom curve, so it
                  bows and sweeps up exactly with the panel. Sits above content. */}
              <svg
                className="absolute top-0 left-0 z-[3] w-full"
                style={{ height: "calc(100% + 300px)" }}
              >
                {/* faint track */}
                <motion.path
                  variants={lineCurve}
                  initial="initial"
                  exit="exit"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={4}
                  vectorEffect="non-scaling-stroke"
                />
                {/* red fill, revealed left→right by real progress */}
                <motion.path
                  variants={lineCurve}
                  initial="initial"
                  exit="exit"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth={4}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  strokeDasharray="1 1"
                  animate={{ strokeDashoffset: 1 - clamped / 100 }}
                  transition={{ ease: "easeOut", duration: 0.4 }}
                />
              </svg>

              {/* Curved slide-up reveal */}
              <svg
                className="absolute top-0 left-0 z-[0] w-full"
                style={{ height: "calc(100% + 300px)" }}
              >
                <motion.path
                  variants={curve}
                  initial="initial"
                  exit="exit"
                  style={{ fill: backgroundColor }}
                />
              </svg>
            </>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Preloader;
