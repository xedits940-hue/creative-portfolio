"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useAssetLoader } from "@/hooks/use-asset-loader";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const hasPlayedRef = useRef(false);

  const { progress, isComplete } = useAssetLoader();

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Preloader sound using direct MyInstants link with user-interaction fallback
  useEffect(() => {
    // Direct MP3 link from MyInstants
    const audio = new Audio(
      "https://www.myinstants.com/media/sounds/ffxiv-duty-unlocked.mp3"
    );
    audio.volume = 0.5;
    audioRef.current = audio;

    const playSound = () => {
      if (hasPlayedRef.current) return;
      audio
        .play()
        .then(() => {
          hasPlayedRef.current = true;
        })
        .catch(() => {
          // Browser blocked autoplay until user interaction
        });
    };

    // Try playing immediately
    playSound();

    // Fallback: play on first click/tap/keypress anywhere on the screen
    const handleInteraction = () => {
      playSound();
    };

    window.addEventListener("pointerdown", handleInteraction, { once: true });
    window.addEventListener("keydown", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (isComplete) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      onComplete?.();
    }
  }, [isComplete, onComplete]);

  const clamped = Math.min(100, Math.max(0, progress));
  const index = Math.min(
    words.length - 1,
    Math.floor((clamped / 100) * words.length),
  );

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

          <div className="absolute inset-0 z-[2] flex items-center justify-center">
            <div className="flex items-center overflow-hidden">
              <span
                className="mr-3 block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <div className="relative overflow-hidden">
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
              <svg
                className="absolute top-0 left-0 z-[3] w-full"
                style={{ height: "calc(100% + 300px)" }}
              >
                <motion.path
                  variants={lineCurve}
                  initial="initial"
                  exit="exit"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={4}
                  vectorEffect="non-scaling-stroke"
                />
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
