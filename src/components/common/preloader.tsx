"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { playSound } from "@/lib/sound";

interface PreloaderProps {
  onComplete?: () => void;
  words?: string[];
  textColor?: string;
  accentColor?: string;
}

const DEFAULT_WORDS = [
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
];

export default function Preloader({
  onComplete,
  words = DEFAULT_WORDS,
  textColor = "#ffffff",
  accentColor = "#e11d2a",
}: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isLifting, setIsLifting] = useState(false);
  const [dimension, setDimension] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  const completedRef = useRef(false);

  // Measure screen dimensions reliably
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const onResize = () => {
        setDimension({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", onResize, { passive: true });
      return () => window.removeEventListener("resize", onResize);
    }
  }, []);

  const handleFinish = React.useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;

    playSound("/universfield-swoosh-07-351043.mp3", 0.2);

    // Start curtain lifting animation
    setIsLifting(true);

    // Signal completion to page once curtain lifts off-screen
    setTimeout(() => {
      onComplete?.();
    }, 850);
  }, [onComplete]);

  // Self-contained, snappy counter: 0% to 100% in exactly 900ms
  useEffect(() => {
    const startTime = performance.now();
    const DURATION = 900;
    let animId = 0;

    const updateCounter = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / DURATION);
      // Smooth ease-out quad
      const eased = 1 - Math.pow(1 - t, 2.2);
      const val = Math.min(100, Math.round(eased * 100));

      setProgress(val);

      if (t < 1) {
        animId = requestAnimationFrame(updateCounter);
      } else {
        setProgress(100);
        handleFinish();
      }
    };

    animId = requestAnimationFrame(updateCounter);

    // Hard fallback: never stay past 1400ms under any circumstances
    const fallbackTimer = setTimeout(() => {
      setProgress(100);
      handleFinish();
    }, 1400);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(fallbackTimer);
    };
  }, [handleFinish]);

  const clamped = Math.min(100, Math.max(0, progress));
  const wordIndex = Math.min(
    words.length - 1,
    Math.floor((clamped / 100) * words.length)
  );

  // The iconic curved SVG arch (Dennis Snellenberg style)
  const initialArchPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height + 280} 0 ${
    dimension.height
  } L0 0`;

  const targetArchPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${
    dimension.height
  } Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const initialLinePath = `M0 ${dimension.height} Q${dimension.width / 2} ${
    dimension.height + 280
  } ${dimension.width} ${dimension.height}`;

  const targetLinePath = `M0 ${dimension.height} Q${dimension.width / 2} ${
    dimension.height
  } ${dimension.width} ${dimension.height}`;

  // Direct vertical translation to land directly at the navbar logo position
  const targetLogoY = dimension.height > 0 ? -(dimension.height / 2 - 56) : -320;

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{
        y: isLifting ? "-100vh" : 0,
      }}
      transition={{
        duration: 0.85,
        ease: [0.76, 0, 0.24, 1],
      }}
      className={`fixed inset-0 z-[99999] h-screen w-screen select-none ${
        isLifting ? "pointer-events-none" : "pointer-events-auto"
      }`}
      style={{
        backgroundColor: "transparent",
        willChange: "transform",
      }}
    >
      {/* 1. Theatrical Deep Black Curved SVG Curtain */}
      <svg
        className="absolute top-0 left-0 z-0 w-full pointer-events-none"
        style={{
          height: "calc(100% + 280px)",
        }}
      >
        <motion.path
          initial={{ d: initialArchPath }}
          animate={{
            d: isLifting ? targetArchPath : initialArchPath,
          }}
          transition={{
            duration: 0.85,
            ease: [0.76, 0, 0.24, 1],
          }}
          fill="#070707"
        />
      </svg>

      {/* 2. Glowing Red Curved Arch Line */}
      <svg
        className="absolute top-0 left-0 z-[1] w-full pointer-events-none"
        style={{
          height: "calc(100% + 280px)",
        }}
      >
        {/* Subtle white guide line */}
        <motion.path
          initial={{ d: initialLinePath }}
          animate={{
            d: isLifting ? targetLinePath : initialLinePath,
          }}
          transition={{
            duration: 0.85,
            ease: [0.76, 0, 0.24, 1],
          }}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
        />

        {/* Vibrant Red Animated Stroke */}
        <motion.path
          initial={{ d: initialLinePath }}
          animate={{
            d: isLifting ? targetLinePath : initialLinePath,
          }}
          transition={{
            duration: 0.85,
            ease: [0.76, 0, 0.24, 1],
          }}
          fill="none"
          stroke={accentColor}
          strokeWidth={3.5}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray="1 1"
          style={{
            strokeDashoffset: 1 - clamped / 100,
          }}
        />
      </svg>

      {/* 3. Central Content: Logo + Multilingual Greeting */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4">
        {/* VTECH STUDIOS Logo: Smoothly scales down and glides into navbar position */}
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={
            isLifting
              ? {
                  y: targetLogoY,
                  scale: 0.48,
                  opacity: 1,
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
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }
          }
          className="relative mb-5 flex flex-col items-center"
        >
          {/* Subtle red aura behind logo */}
          <motion.div
            className="absolute -inset-4 rounded-full blur-xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(225,29,42,0.5) 0%, rgba(225,29,42,0) 70%)",
            }}
            animate={
              isLifting
                ? { opacity: 0, scale: 0.7 }
                : {
                    scale: [0.95, 1.2, 0.95],
                    opacity: [0.35, 0.75, 0.35],
                  }
            }
            transition={{
              duration: 2,
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
            className="relative z-10 h-20 w-20 sm:h-24 sm:w-24 object-contain filter drop-shadow-[0_0_20px_rgba(225,29,42,0.6)]"
          />
        </motion.div>

        {/* Multilingual Greeting & Accent Dot: Both fade out together smoothly */}
        <motion.div
          animate={{
            opacity: isLifting ? 0 : 1,
            y: isLifting ? 10 : 0,
          }}
          transition={{
            duration: 0.25,
            ease: "easeInOut",
          }}
          className="flex items-center overflow-hidden"
        >
          <span
            className="mr-3 block h-2.5 w-2.5 shrink-0 rounded-full"
            style={{
              backgroundColor: accentColor,
            }}
          />

          <div className="relative overflow-hidden h-12 flex items-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={wordIndex}
                initial={{
                  y: "40%",
                  opacity: 0,
                }}
                animate={{
                  y: "0%",
                  opacity: 1,
                }}
                exit={{
                  y: "-40%",
                  opacity: 0,
                }}
                transition={{
                  duration: 0.22,
                  ease: [0.33, 1, 0.68, 1],
                }}
                className="block whitespace-nowrap text-3xl font-light leading-none md:text-5xl"
                style={{
                  color: textColor,
                }}
              >
                {words[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* 4. Bottom Left Status Indicator */}
      <motion.div
        animate={{
          opacity: isLifting ? 0 : 1,
          y: isLifting ? 8 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="absolute bottom-8 left-6 sm:left-8 z-10 flex items-center gap-2.5 pointer-events-none"
      >
        <span
          className="block h-1.5 w-1.5 rounded-full animate-pulse"
          style={{
            backgroundColor: accentColor,
          }}
        />

        <span
          className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-60"
          style={{
            color: textColor,
          }}
        >
          Studio Experience
        </span>
      </motion.div>

      {/* 5. Bottom Right Percentage Counter */}
      <motion.div
        animate={{
          opacity: isLifting ? 0 : 1,
          y: isLifting ? 8 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="absolute bottom-5 right-5 sm:right-8 md:right-10 z-10 flex items-end tabular-nums pointer-events-none"
      >
        <span
          className="font-[var(--font-accent)] text-[12vw] leading-none tracking-tighter sm:text-[9vw] md:text-[5.5vw]"
          style={{
            color: textColor,
          }}
        >
          {String(Math.round(clamped)).padStart(2, "0")}
        </span>

        <span
          className="mb-[1vw] ml-1 text-[2.5vw] font-light sm:mb-[1vw] sm:text-[1.8vw] md:mb-[0.6vw] md:text-[1.2vw]"
          style={{
            color: accentColor,
          }}
        >
          %
        </span>
      </motion.div>
    </motion.div>
  );
}
