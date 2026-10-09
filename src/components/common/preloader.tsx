"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useAssetLoader } from "@/hooks/use-asset-loader";
import { playSound } from "@/lib/sound";

const slideUp: Variants = {
  initial: {
    y: "0%",
  },
  exit: {
    y: "-100%",
    transition: {
      duration: 1.0,
      ease: [0.76, 0, 0.24, 1] as const,
      delay: 0.05,
    },
  },
};

interface PreloaderProps {
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
  backgroundColor = "#0b0c0e",
  textColor = "#ffffff",
  accentColor = "#ff1f3d",
}) => {
  const { progress, isComplete } = useAssetLoader(2000);

  useEffect(() => {
    if (!isComplete) return;
    try {
      playSound("/universfield-swoosh-07-351043.mp3", 0.18);
    } catch {
      // Audio playback safe fallback
    }

    // Brief 250ms hold at 100% so the user sees completion before the curtain lifts
    const timer = setTimeout(() => {
      onComplete?.();
    }, 250);
    return () => clearTimeout(timer);
  }, [isComplete, onComplete]);

  const clamped = Math.min(100, Math.max(0, progress));

  const index = Math.min(
    words.length - 1,
    Math.floor((clamped / 100) * words.length),
  );

  // SVG curtain paths in 1000x1000 normalized coordinates:
  // Initial: covers 100% of screen completely with zero leaks
  // Exit: bottom edge curves UPWARD into a deep arch (y=660) as the curtain lifts
  const curtainCurve: Variants = {
    initial: {
      d: "M 0 0 L 1000 0 L 1000 1000 Q 500 1000 0 1000 Z",
    },
    exit: {
      d: "M 0 0 L 1000 0 L 1000 1000 Q 500 660 0 1000 Z",
      transition: {
        duration: 1.0,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  // Line paths in 1000x1000 coordinates:
  // Initial: resting across the bottom edge with a gentle visible curve (y=982)
  // Exit: arches deeply UPWARDS (y=660) in exact sync with the curtain bottom
  const lineCurve: Variants = {
    initial: (progressRatio: number = 0) => ({
      d: "M 0 998 Q 500 982 1000 998",
      strokeDashoffset: 1 - progressRatio,
      transition: {
        d: { duration: 1.0, ease: [0.76, 0, 0.24, 1] },
        strokeDashoffset: { ease: "easeOut", duration: 0.12 },
      },
    }),
    exit: {
      d: "M 0 998 Q 500 660 1000 998",
      strokeDashoffset: 0,
      transition: {
        duration: 1.0,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="initial"
      exit="exit"
      className="fixed inset-0 h-screen w-screen z-[99999] select-none pointer-events-auto bg-transparent overflow-hidden"
      style={{
        willChange: "transform",
      }}
    >
      {/* 1. Underlying SVG Curtain & Animated Curved Lines */}
      <svg
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {/* The SVG curtain filling the entire screen */}
        <motion.path
          variants={curtainCurve}
          initial="initial"
          animate="initial"
          exit="exit"
          style={{
            fill: backgroundColor,
          }}
        />

        {/* Base Track Line along the curve */}
        <motion.path
          variants={lineCurve}
          initial="initial"
          animate="initial"
          exit="exit"
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={4}
          vectorEffect="non-scaling-stroke"
        />

        {/* Active Glowing Crimson Line that fills 0 -> 100%, then curves UP */}
        <motion.path
          variants={lineCurve}
          custom={clamped / 100}
          initial="initial"
          animate="initial"
          exit="exit"
          fill="none"
          stroke={accentColor}
          strokeWidth={5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray="1 1"
          style={{
            filter: "drop-shadow(0 0 12px rgba(255, 31, 61, 0.9))",
          }}
        />
      </svg>

      {/* 2. Ambient blurred crimson glow in background center */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
        style={{
          backgroundColor: accentColor,
          willChange: "transform, opacity",
        }}
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.12, 0.25, 0.12],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 3. Central Showcase: Studio Logo & Multilingual Greetings */}
      <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center pointer-events-none">
        {/* Signature VTECH STUDIOS Logo */}
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={
            isComplete
              ? {
                  y: -140,
                  scale: 0.65,
                  opacity: 0.8,
                  transition: {
                    duration: 0.65,
                    ease: [0.76, 0, 0.24, 1],
                  },
                }
              : {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  transition: {
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }
          }
          exit={{
            y: -240,
            scale: 0.5,
            opacity: 0,
            transition: {
              duration: 0.75,
              ease: [0.76, 0, 0.24, 1],
            },
          }}
          className="relative mb-7 flex flex-col items-center"
        >
          {/* Radial glowing pulse behind logo */}
          <motion.div
            className="absolute -inset-5 rounded-full blur-xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,31,61,0.55) 0%, rgba(255,31,61,0) 70%)",
            }}
            animate={{
              scale: [0.92, 1.22, 0.92],
              opacity: [0.45, 0.85, 0.45],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <Image
            src="/vtech-studios-logo.png"
            alt="VTECH STUDIOS Logo"
            width={110}
            height={110}
            priority
            className="relative z-10 h-20 w-20 sm:h-24 sm:w-24 object-contain filter drop-shadow-[0_0_24px_rgba(255,31,61,0.65)]"
          />
        </motion.div>

        {/* Multilingual greeting text with accent dot */}
        <div className="flex items-center overflow-hidden">
          <span
            className="mr-3 block h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_10px_#ff1f3d]"
            style={{
              backgroundColor: accentColor,
            }}
          />

          <div className="relative overflow-hidden h-[54px] flex items-center">
            <motion.span
              key={index}
              initial={{
                y: "60%",
                opacity: 0,
                filter: "blur(4px)",
              }}
              animate={{
                y: "0%",
                opacity: 1,
                filter: "blur(0px)",
              }}
              exit={{
                y: "-60%",
                opacity: 0,
                filter: "blur(4px)",
              }}
              transition={{
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="block whitespace-nowrap text-3xl font-light leading-none md:text-5xl"
              style={{
                color: textColor,
                letterSpacing: "-0.02em",
              }}
            >
              {words[index]}
            </motion.span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Left: Studio identity status indicator */}
      <div className="absolute bottom-8 left-8 z-[2] flex items-center gap-3 pointer-events-none">
        <motion.span
          className="block h-2 w-2 rounded-full shadow-[0_0_8px_#ff1f3d]"
          style={{
            backgroundColor: accentColor,
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.85, 1.2, 0.85],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <span
          className="text-[11px] font-mono font-medium uppercase tracking-[0.35em] opacity-70"
          style={{
            color: textColor,
          }}
        >
          VTECH STUDIO
        </span>
      </div>

      {/* 5. Bottom Right: High-impact editorial percentage */}
      <div className="absolute bottom-5 right-4 z-[2] flex items-end tabular-nums sm:right-8 md:right-12 pointer-events-none">
        <span
          className="font-[var(--font-accent)] text-[13vw] leading-none tracking-tighter sm:text-[11vw] md:text-[6.5vw] font-bold"
          style={{
            color: textColor,
            textShadow: "0 4px 30px rgba(0,0,0,0.8)",
          }}
        >
          {String(Math.round(clamped)).padStart(2, "0")}
        </span>

        <span
          className="mb-[1.5vw] ml-1.5 text-[3vw] font-light sm:mb-[1.2vw] sm:text-[2.2vw] md:mb-[0.8vw] md:text-[1.5vw] font-mono"
          style={{
            color: accentColor,
          }}
        >
          %
        </span>
      </div>
    </motion.div>
  );
};

export default Preloader;
