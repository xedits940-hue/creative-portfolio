"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

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
      className="relative h-dvh md:h-screen w-full overflow-hidden flex flex-col items-center justify-end"
    >
      {/* Background Noise Texture for Awwwards feel */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* Giant stacked name — sits behind the character */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 md:gap-3 pointer-events-none select-none overflow-hidden"
      >
        <span
          className="font-black uppercase leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-red-600 via-red-700 to-red-950/10"
          style={{
            fontSize: "clamp(70px, 20vw, 280px)",
            fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
            transform: "scaleX(0.85)",
          }}
        >
          VISHAL
        </span>
        <span
          className="font-black uppercase leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-red-600 via-red-700 to-red-950/10"
          style={{
            fontSize: "clamp(70px, 20vw, 280px)",
            fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
            transform: "scaleX(0.85)",
          }}
        >
          SHARMA
        </span>
      </div>

      <motion.div
        style={{
          y: yImage,
        }}
        className="relative z-20 flex items-end group"
      >
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-500" />

        <img
          src="/ichigo.png"
          alt="Profile photo"
          className="relative w-[125vw] md:w-[60vw] lg:w-[40vw] h-[75vh] md:h-[75dvh] object-contain object-bottom rounded-3xl"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 z-30 text-foreground"
      >
        <div className="flex items-center gap-4 [writing-mode:vertical-rl] rotate-180">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
            Featured Work
          </span>
          <span className="w-1 h-1 bg-foreground rounded-full" />
          <span className="text-sm font-bold">VISIONARY</span>
          <span className="w-1 h-1 bg-foreground rounded-full" />
          <span className="text-sm font-bold">VIBE CODER</span>
          <span className="w-1 h-1 bg-foreground rounded-full" />
          <span className="text-sm font-bold">NEXT-GEN BUILDER</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="hidden md:flex absolute bottom-10 z-30 w-full px-10 flex-row justify-between items-center text-foreground"
      >
        <div className="flex flex-col gap-2">
          <p className="text-xs font-mono uppercase text-gray-500 dark:text-gray-400">
            Featured Work
          </p>
          <div className="flex items-center gap-4 text-sm font-bold">
            <span className="hover:text-primary transition-colors cursor-pointer">
              VISIONARY
            </span>
            <span className="w-1 h-1 bg-foreground rounded-full" />
            <span className="hover:text-primary transition-colors cursor-pointer">
              VIBE CODER
            </span>
            <span className="w-1 h-1 bg-foreground rounded-full" />
            <span className="hover:text-primary transition-colors cursor-pointer">
              NEXT-GEN BUILDER
            </span>
          </div>
        </div>

        <div className="hidden md:block">
          <p className="text-xs font-mono text-right text-gray-500 dark:text-gray-400">
            Social
          </p>
          <div className="flex items-center gap-4 text-sm font-bold">
            <Link
              href={"https://www.instagram.com/yourusername"}
              target="_blank"
            >
              <span className="hover:text-primary transition-colors cursor-pointer">
                Instagram
              </span>
            </Link>
            <span className="w-1 h-1 bg-foreground rounded-full" />
            <Link
              href={"https://www.youtube.com/@yourusername"}
              target="_blank"
            >
              <span className="hover:text-primary transition-colors cursor-pointer">
                Youtube
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const StatCard = ({
  position,
  label,
  value,
  delay,
}: {
  position: string;
  label: string;
  value: string;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className={`absolute ${position} z-30`}
    >
      <div className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-xl shadow-2xl hover:bg-white/10 transition-colors duration-300 w-32 md:w-40">
        <h3 className="text-3xl font-bold  mb-1">{value}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-300 uppercase tracking-wider font-mono">
          {label}
        </p>
      </div>
    </motion.div>
  );
};

export default AboutMe;
