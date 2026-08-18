"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
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
  const [released, setReleased] = useState(false);
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    setDimension({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    let frameId = 0;
    let startTime = 0;
    let completed = false;

    const handleCinematicComplete = () => {
      if (released) return;

      setProgress(0);
      setReleased(true);
      startTime = performance.now();

      const duration = 3200;

      const animateProgress = (time: number) => {
        const elapsed = time - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);

        // Smooth cinematic acceleration/deceleration.
        const easedProgress =
          rawProgress < 0.55
            ? rawProgress / 0.55
            : 1 - Math.pow((1 - rawProgress) / 0.45, 1.8);

        const nextProgress = Math.min(
          100,
          Math.round(Math.max(0, easedProgress) * 100),
        );

        setProgress(nextProgress);

        if (rawProgress < 1) {
          frameId = requestAnimationFrame(animateProgress);
          return;
        }

        if (!completed) {
          completed = true;
          setProgress(100);

          window.setTimeout(() => {
            onComplete?.();
          }, 260);
        }
      };

      frameId = requestAnimationFrame(animateProgress);
    };

    window.addEventListener(
      "vishal:cinematic-complete",
      handleCinematicComplete,
    );

    return () => {
      window.removeEventListener(
        "vishal:cinematic-complete",
        handleCinematicComplete,
      );

      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [onComplete, released]);

  if (!released) {
    return null;
  }

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
      transition: {
        duration: 1.7,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exit: {
      d: targetPath,
      transition: {
        duration: 1.7,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.3,
      },
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
      transition: {
        duration: 1.7,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exit: {
      d: lineTarget,
      transition: {
        duration: 1.7,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="initial"
      exit="exit"
      className="h-screen w-screen fixed left-0 top-0 z-[99998]"
      style={{
        backgroundColor,
        willChange: "transform",
      }}
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
              animate={{
                scale: [1, 1.35, 1],
                opacity: [0.08, 0.2, 0.08],
              }}
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
                  initial={{ y: "35%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
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
              {String(clamped).padStart(2, "0")}
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
                style={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                }}
              />

              <motion.div
                className="absolute inset-0 origin-left"
                style={{
                  backgroundColor: accentColor,
                }}
                animate={{
                  scaleX: clamped / 100,
                }}
                transition={{
                  ease: "easeOut",
                  duration: 0.2,
                }}
              />
            </div>
          ) : (
            <>
              <svg
                className="absolute top-0 left-0 z-[3] w-full"
                style={{
                  height: "calc(100% + 300px)",
                }}
              >
                <motion.path
                  variants={lineCurve}
                  initial="initial"
                  animate="initial"
                  exit="exit"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={4}
                  vectorEffect="non-scaling-stroke"
                />

                <motion.path
                  variants={lineCurve}
                  initial="initial"
                  animate="initial"
                  exit="exit"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth={4}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  strokeDasharray="1 1"
                  animate={{
                    strokeDashoffset: 1 - clamped / 100,
                  }}
                  transition={{
                    ease: "easeOut",
                    duration: 0.3,
                  }}
                />
              </svg>

              <svg
                className="absolute top-0 left-0 z-[0] w-full"
                style={{
                  height: "calc(100% + 300px)",
                }}
              >
                <motion.path
                  variants={curve}
                  initial="initial"
                  animate="initial"
                  exit="exit"
                  style={{
                    fill: backgroundColor,
                  }}
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
