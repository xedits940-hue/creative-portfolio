"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { playSound } from "@/lib/sound";
import {
  createCounter,
  trackAssets,
  shouldPlayIntro,
  markIntroSeen,
  VT_MOTION,
} from "@/vtech/loader.js";

const slideUp: Variants = {
  initial: {
    y: "0%",
  },
  exit: {
    y: "-100%",
    transition: {
      duration: VT_MOTION.revealMs / 1000,
      ease: [0.76, 0, 0.24, 1],
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
  const [progressVal, setProgressVal] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const numRef = useRef<HTMLSpanElement | null>(null);
  const barPathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    // If user has already seen the intro this session, release immediately
    if (!shouldPlayIntro("once-per-session")) {
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("vt-intro");
      }
      onComplete?.();
      return undefined;
    }

    const counter = createCounter({
      smoothingMs: 140,
      maxPointsPerSec: 140,
      creepTo: 0,
      holdAt100Ms: VT_MOTION.holdAt100Ms,
      render: (v) => {
        setProgressVal(v);
        if (numRef.current) {
          numRef.current.textContent = String(Math.round(v)).padStart(2, "0");
        }
        if (barPathRef.current) {
          barPathRef.current.style.strokeDashoffset = String(1 - v / 100);
        }
      },
      onDone: () => {
        setIsComplete(true);
        try {
          playSound("/universfield-swoosh-07-351043.mp3", 0.18);
        } catch {
          // Audio safe fallback
        }
        markIntroSeen();
        if (typeof document !== "undefined") {
          document.documentElement.classList.remove("vt-intro");
        }
        setTimeout(() => {
          onComplete?.();
        }, VT_MOTION.holdAt100Ms + 100);
      },
    });

    // Real critical asset tracking (fonts, window load, above-the-fold assets)
    trackAssets({
      images: ["/vtech-studios-logo.png"],
      fonts: true,
      windowLoad: true,
      timeoutMs: 3600,
      onProgress: (p) => counter.setTarget(p),
    });

    return () => counter.stop();
  }, [onComplete]);

  const clamped = Math.min(100, Math.max(0, progressVal));

  // Determine index evenly across words
  const index = Math.min(
    words.length - 1,
    Math.floor((clamped / 100) * words.length)
  );

  // SVG curtain paths in 1000x1000 normalized coordinates:
  // Starts 100% flat/straight: M 0 0 L 1000 0 L 1000 1000 Q 500 1000 0 1000 Z
  // Upon exit, it curves dynamically upward into an elegant arch (Q 500 660) as the curtain lifts!
  const curtainCurve: Variants = {
    initial: {
      d: "M 0 0 L 1000 0 L 1000 1000 Q 500 1000 0 1000 Z",
    },
    exit: {
      d: "M 0 0 L 1000 0 L 1000 1000 Q 500 660 0 1000 Z",
      transition: {
        duration: VT_MOTION.revealMs / 1000,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  // Line paths in 1000x1000 coordinates:
  // Initial: perfectly STRAIGHT at bottom edge (y=998 across entire screen)
  // Exit: sweeps and arches beautifully UPWARDS (Q 500 660) in sync with the curtain!
  const lineCurve: Variants = {
    initial: {
      d: "M 0 998 Q 500 998 1000 998",
    },
    exit: {
      d: "M 0 998 Q 500 660 1000 998",
      transition: {
        duration: VT_MOTION.revealMs / 1000,
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
      className="fixed inset-0 h-screen w-screen z-[99999] select-none pointer-events-auto bg-transparent overflow-hidden vt-loader"
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
        {/* Curtain */}
        <motion.path
          variants={curtainCurve}
          initial="initial"
          animate="initial"
          exit="exit"
          style={{
            fill: backgroundColor,
          }}
        />

        {/* Base Track Line - flat line on screen bottom */}
        <motion.path
          variants={lineCurve}
          initial="initial"
          animate="initial"
          exit="exit"
          fill="none"
          stroke="rgba(255, 255, 255, 0.12)"
          strokeWidth={4}
          vectorEffect="non-scaling-stroke"
        />

        {/* Active Crimson Glowing Line: fills 0 -> 100% via scaleX/offset, arches upward on exit */}
        <motion.path
          ref={barPathRef}
          variants={lineCurve}
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
          strokeDashoffset={1 - clamped / 100}
          style={{
            filter: "drop-shadow(0 0 12px rgba(255, 31, 61, 0.9))",
            transformOrigin: "left center",
          }}
        />
      </svg>

      {/* 2. Ambient blurred crimson glow in center — soft, capped via vt-loader__glow, never a solid disc */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[280px] w-[280px] sm:h-[340px] sm:w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] sm:blur-[130px] vt-loader__glow vt-fx"
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
      <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center pointer-events-none px-4">
        {/* Signature VTECH STUDIOS Logo */}
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={
            isComplete
              ? {
                  y: -120,
                  scale: 0.65,
                  opacity: 0.8,
                  transition: {
                    duration: VT_MOTION.logoMs / 1000,
                    ease: VT_MOTION.easeArray as readonly [number, number, number, number],
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
            y: -200,
            scale: 0.5,
            opacity: 0,
            transition: {
              duration: 0.75,
              ease: VT_MOTION.easeArray as readonly [number, number, number, number],
            },
          }}
          className="relative mb-6 sm:mb-8 flex flex-col items-center"
        >
          {/* Radial glowing pulse behind logo */}
          <motion.div
            className="absolute -inset-4 sm:-inset-5 rounded-full blur-xl pointer-events-none"
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
            className="relative z-10 h-16 w-16 sm:h-24 sm:w-24 object-contain filter drop-shadow-[0_0_24px_rgba(255,31,61,0.65)]"
          />
        </motion.div>

        {/* Multilingual greeting text with accent dot */}
        <div className="flex items-center overflow-hidden max-w-full justify-center">
          <span
            className="mr-2.5 sm:mr-3 block h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0 rounded-full shadow-[0_0_10px_#ff1f3d]"
            style={{
              backgroundColor: accentColor,
            }}
          />

          <div className="relative overflow-hidden h-[46px] sm:h-[54px] flex items-center justify-center min-w-[140px] sm:min-w-[200px]">
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
                duration: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="block whitespace-nowrap text-2xl sm:text-3xl md:text-5xl font-light leading-none text-center"
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
      <div
        className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-[10] flex items-center gap-2.5 sm:gap-3 pointer-events-none"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          paddingLeft: "env(safe-area-inset-left, 0px)",
        }}
      >
        <motion.span
          className="block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full shadow-[0_0_8px_#ff1f3d]"
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
          className="text-[10px] sm:text-[11px] font-mono font-medium uppercase tracking-[0.3em] sm:tracking-[0.35em] opacity-80"
          style={{
            color: textColor,
          }}
        >
          VTECH STUDIO
        </span>
      </div>

      {/* 5. Bottom Right: High-impact editorial percentage with tabular-nums */}
      <div
        className="absolute bottom-3 right-4 sm:bottom-5 sm:right-6 md:bottom-7 md:right-10 z-[10] flex items-end tabular-nums pointer-events-none"
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          paddingRight: "env(safe-area-inset-right, 0px)",
        }}
      >
        <span
          ref={numRef}
          className="font-[var(--font-accent)] text-[15vw] sm:text-[10vw] md:text-[6.5vw] lg:text-[5vw] leading-none tracking-tighter font-bold"
          style={{
            color: textColor,
            textShadow: "0 4px 30px rgba(0,0,0,0.9)",
          }}
        >
          {String(Math.round(clamped)).padStart(2, "0")}
        </span>

        <span
          className="mb-[1.5vw] ml-1 sm:ml-1.5 text-[4vw] sm:text-[2.2vw] md:text-[1.5vw] font-light font-mono"
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
