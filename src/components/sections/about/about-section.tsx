"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { AsciiReveal } from "@/components/AsciiReveal";
import { useTapReveal } from "@/vtech/interactions.js";
import { canUseFineHover } from "@/vtech/tier.js";
import { BRAND } from "@/vtech/brand.js";

// ─── Direct Process Card Component (Prompt 10: Numbers 01, 02, 03, no count-up animation) ───────
interface ProcessCardProps {
  step: string;
  label: string;
  description: string;
  highlight?: boolean;
  delay?: number;
}

const ProcessCard = ({
  step,
  label,
  description,
  highlight = false,
  delay = 0,
}: ProcessCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col gap-3 p-8 rounded-2xl border overflow-hidden transition-all duration-500 cursor-default ${
        highlight
          ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
          : "border-border bg-card hover:border-primary/30 hover:bg-muted/40"
      }`}
    >
      {highlight && (
        <motion.div
          animate={{ opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/5 to-transparent pointer-events-none"
        />
      )}
      <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full border border-border opacity-15 group-hover:scale-[2] transition-transform duration-700" />
      <div className="relative z-10">
        <div
          className={`font-black tracking-tighter leading-none mb-1 tabular-nums ${
            highlight
              ? "text-primary text-6xl md:text-7xl"
              : "text-foreground text-5xl md:text-6xl"
          }`}
        >
          {step}
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">
          {label}
        </p>
        <div
          className={`h-px w-10 mb-3 ${highlight ? "bg-primary/40" : "bg-border"}`}
        />
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────
const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const { open, bind, trigger } = useTapReveal();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [0.96, 1.02]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative w-full py-28 md:py-36 overflow-hidden bg-transparent border-t border-border/40 select-none"
    >
      {/* Background ambient accents */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 rounded-full bg-primary/8 blur-[140px] pointer-events-none" />

      {/* Decorative vertical guide lines */}
      <div className="absolute inset-y-0 left-8 md:left-16 w-px bg-border/20 pointer-events-none hidden sm:block" />
      <div className="absolute inset-y-0 right-8 md:right-16 w-px bg-border/20 pointer-events-none hidden sm:block" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* ══════════ LEFT — Interactive Studio Core & Overview (Prompt 07 & 09) ══════════ */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Section Tag */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 w-fit px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-mono uppercase tracking-widest text-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Studio Overview
            </motion.div>

            {/* Prompt 07: Single clean surface .vt-ov .vt-reveal, preserving interactive digital logo on hover/focus/tap */}
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              className="vt-ov vt-reveal w-full max-w-[380px] mx-auto lg:mx-0 shadow-2xl backdrop-blur-xl"
              {...bind}
            >
              {/* Top Bar: Brand + Interactive */}
              <div className="vt-ov__bar">
                <span className="vt-label flex items-center gap-1.5 font-mono text-white/90">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {BRAND.name}
                </span>
                <span className="vt-label vt-label--red font-mono">
                  Interactive
                </span>
              </div>

              {/* Media Container: Preserves high-fidelity logo and ASCII character reveal */}
              <div className="vt-ov__media relative w-full aspect-[4/3.8] rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-inner group/ascii">
                {/* High-fidelity official logo base - revealed when open */}
                <div
                  className={`absolute inset-4 pointer-events-none z-0 flex items-center justify-center transition-opacity duration-500 ${
                    open ? "opacity-100" : "opacity-30 group-hover/ascii:opacity-100"
                  }`}
                >
                  <Image
                    src="/vtech-studios-logo.png"
                    alt="Official VTECH Studio Logo"
                    fill
                    className="object-contain p-2"
                    priority
                    referrerPolicy="no-referrer"
                  />
                </div>

                <AsciiReveal
                  image="/vtech-studios-logo.png"
                  columns={65}
                  contrast={28}
                  inkColor="#ff1f3d"
                  colorMode="image"
                  reveal={true}
                  revealOptions={{ size: 70, softness: 16 }}
                  className="relative z-10 w-full h-full"
                />

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-60 text-[9px] font-mono tracking-widest uppercase text-white/80 bg-black/80 px-2.5 py-0.5 rounded-full border border-white/15 backdrop-blur-sm z-20">
                  {open ? "Digital Logo Active" : "Reveal Active"}
                </div>
              </div>

              {/* Accessible interactive trigger for mobile tap & keyboard focus */}
              <button
                className="vt-btn vt-tap w-full text-xs font-mono tracking-wider justify-center"
                suppressHydrationWarning
                {...trigger}
              >
                {mounted && canUseFineHover()
                  ? "Hover or press to see the digital version"
                  : "Tap to see the digital version"}
              </button>

              {/* Meta: Studio logo + Available status */}
              <div className="vt-ov__meta">
                <span className="vt-label">Studio logo</span>
                <span className="vt-label vt-ov__status text-emerald-400 font-semibold">
                  Available for new projects
                </span>
              </div>
            </motion.div>

            {/* Name, designation & refined narrative */}
            <div className="space-y-3">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-4xl md:text-5xl font-black tracking-tighter leading-none"
              >
                {BRAND.name}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="font-mono text-sm uppercase tracking-widest text-primary"
              >
                Websites &amp; Digital Design
              </motion.p>

              {/* Supported studio overview description */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="space-y-2 text-muted-foreground text-[14px] leading-relaxed max-w-sm"
              >
                <p>
                  VTech Studio designs and builds custom websites with AI-powered tools. I turn your ideas and references into fast, polished sites for local businesses, clinics, salons, property professionals and freelancers worldwide.
                </p>
                <p className="text-xs text-neutral-400 pt-1">
                  <span className="text-white font-medium">What is vibe coding?</span> Three years of practice turning ideas into polished websites. I guide AI tools, then test and refine every detail by hand.
                </p>
              </motion.div>
            </div>

            {/* Expertise tags (Prompt 10: Clear service names) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {[
                "AI-Powered Building",
                "Interactive Web Experiences",
                "Websites for Professionals",
                "Web Animation",
                "Custom Websites",
                "Digital Design & Content",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-full border border-border bg-muted/60 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors duration-300 cursor-default"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ══════════ RIGHT — Process Cards (Prompt 10: Honest Process Block, No Unverified Numbers) ══════════ */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-10">
            {/* Headline */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4"
              >
                HOW I WORK
              </motion.p>

              <motion.h3
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-4xl md:text-5xl lg:text-[3.5rem] font-black tracking-tighter leading-[0.93] uppercase"
              >
                A Hands-On Process,
                <br />
                <span className="text-primary">Start to Finish.</span>
              </motion.h3>
            </div>

            {/* Process cards — Honest 3-card flow replacing unverified numbers with sequential steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ProcessCard
                step="01"
                label="Direct contact"
                description="Clients work directly with me, from the first message to launch day."
                delay={0.15}
              />

              <ProcessCard
                step="02"
                label="Clear steps"
                description="Idea, design, build, test, launch. Clients always know what comes next."
                delay={0.25}
              />

              {/* Full-width highlighted card */}
              <div className="sm:col-span-2">
                <ProcessCard
                  step="03"
                  label="Design and development together"
                  description="Layout, animation and code come from one person, so every detail works as one."
                  highlight
                  delay={0.35}
                />
              </div>
            </div>

            {/* Footnote */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-xs font-mono text-muted-foreground/60 uppercase tracking-widest border-t border-border pt-6"
            >
              Careful design, clear communication, and a website your customers can trust.
            </motion.p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
