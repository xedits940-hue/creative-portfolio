"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Anton } from "next/font/google";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Small neon "shine" accent — a thin glowing bar, not a full box.
const ShineBar = () => (
  <span
    aria-hidden="true"
    className="inline-block w-[3px] h-4 rounded-full mr-1"
    style={{
      backgroundColor: "#00f3ff",
      boxShadow: "0 0 6px 1.5px rgba(0, 243, 255, 0.6)",
    }}
  />
);

const AboutMe = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const yImage = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      ref={containerRef}
      className="relative h-dvh md:h-screen w-full overflow-hidden flex flex-col items-center justify-end bg-transparent"
    >
      {/* Giant stacked name — sits behind the character */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-0 pointer-events-none select-none overflow-hidden"
      >
        <span
          className={`${anton.className} uppercase leading-[0.82] tracking-tight text-transparent bg-clip-text`}
          style={{
            fontSize: "clamp(70px, 19vw, 270px)",
            backgroundImage:
              "linear-gradient(to bottom, #ff1f3d 0%, #ef1230 20%, #b8081f 45%, #5c0210 70%, #150005 92%, transparent 100%)",
            WebkitFontSmoothing: "antialiased",
            textRendering: "optimizeLegibility",
          }}
        >
          VTECH
        </span>
        <span
          className={`${anton.className} uppercase leading-[0.82] tracking-tight text-transparent bg-clip-text`}
          style={{
            fontSize: "clamp(70px, 19vw, 270px)",
            backgroundImage:
              "linear-gradient(to bottom, #ff1f3d 0%, #ef1230 20%, #b8081f 45%, #5c0210 70%, #150005 92%, transparent 100%)",
            WebkitFontSmoothing: "antialiased",
            textRendering: "optimizeLegibility",
          }}
        >
          STUDIOS
        </span>
      </div>

      <motion.div
        style={{
          y: yImage,
        }}
        className="relative z-20 flex items-end group"
      >
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-500" />

        {/* Mobile image — forced via inline style so it ALWAYS applies, no caching/purge issues */}
        <img
          src="/profile.png"
          alt="VTECH STUDIOS"
          className="relative md:hidden object-contain object-bottom rounded-3xl"
          style={{
            width: "260vw",
            height: "130vh",
            maxWidth: "none",
          }}
        />

        {/* Desktop / Laptop image — slightly reduced from before */}
        <img
          src="/profile.png"
          alt="VTECH STUDIOS"
          className="relative hidden md:block object-contain object-bottom rounded-3xl"
          style={{
            width: "88vw",
            height: "104dvh",
            maxWidth: "none",
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 z-30 text-foreground"
      >
        <div className="flex items-center gap-4 [writing-mode:vertical-rl] rotate-180">
          <ShineBar />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
            Studio Capabilities
          </span>
          <span className="w-1 h-1 bg-foreground rounded-full" />
          <span className="text-sm font-bold">CREATIVE DIRECTION</span>
          <span className="w-1 h-1 bg-foreground rounded-full" />
          <span className="text-sm font-bold">CINEMATIC MOTION</span>
          <span className="w-1 h-1 bg-foreground rounded-full" />
          <span className="text-sm font-bold">DIGITAL PRODUCTION</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="hidden md:flex absolute bottom-10 z-30 w-full px-10 flex-row justify-between items-center text-foreground"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <ShineBar />
            <p className="text-xs font-mono uppercase text-gray-500 dark:text-gray-400">
              Studio Capabilities
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold">
            <span className="hover:text-primary transition-colors cursor-pointer">
              CREATIVE DIRECTION
            </span>
            <span className="w-1 h-1 bg-foreground rounded-full" />
            <span className="hover:text-primary transition-colors cursor-pointer">
              CINEMATIC MOTION
            </span>
            <span className="w-1 h-1 bg-foreground rounded-full" />
            <span className="hover:text-primary transition-colors cursor-pointer">
              DIGITAL PRODUCTION
            </span>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="flex items-center justify-end">
            <p className="text-xs font-mono text-right text-gray-500 dark:text-gray-400">
              Social
            </p>
            <span className="ml-1">
              <ShineBar />
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-bold">
            <Link
              href={"https://www.instagram.com/yourusername"}
              target="_blank"
            >
              <span className="hover:text-primary transition-colors cursor-pointer">
                INSTAGRAM
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutMe;
