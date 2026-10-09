"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { AsciiReveal } from "@/components/AsciiReveal";

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCountUp(target: number, inView: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, target, duration]);

  return value;
}

// ─── Metric card ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
  description: string;
  highlight?: boolean;
  delay?: number;
}

const MetricCard = ({
  prefix = "",
  value,
  suffix = "",
  label,
  description,
  highlight = false,
  delay = 0,
}: MetricCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCountUp(value, inView, 1800);

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
          className={`font-black tracking-tighter leading-none mb-1 ${
            highlight
              ? "text-primary text-6xl md:text-7xl"
              : "text-foreground text-5xl md:text-6xl"
          }`}
        >
          {prefix}
          {count}
          {suffix}
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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [0.96, 1.02]);
  const sectionY = useTransform(scrollYProgress, [0, 0.25], [20, 0]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ y: sectionY }}
      className="relative w-full py-24 md:py-36 bg-transparent overflow-hidden"
    >
      {/* Subtle dot-grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Ambient glow behind metrics panel */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8 }}
        className="pointer-events-none absolute right-0 top-1/4 w-150 h-150 rounded-full bg-primary/10 blur-[140px]"
      />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-18 items-start">
          {/* ══════════ LEFT — Identity ══════════ */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Badge */}
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

            {/* VTECH Interactive Studio Core Visual */}
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              className="relative w-full aspect-[4/4.5] max-w-[360px] mx-auto lg:mx-0 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#141417]/90 via-[#0c0c0e]/95 to-[#060607] shadow-2xl backdrop-blur-xl group transition-all duration-700 hover:border-primary/40"
            >
              {/* Corner crosshairs */}
              <div className="absolute top-3 left-3 text-[10px] font-mono text-white/30 select-none z-20">+</div>
              <div className="absolute top-3 right-3 text-[10px] font-mono text-white/30 select-none z-20">+</div>
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-white/30 select-none z-20">+</div>
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/30 select-none z-20">+</div>

              {/* Ambient radial glow backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,31,61,0.18)_0%,transparent_75%)] pointer-events-none group-hover:opacity-100 transition-opacity duration-700" />

              {/* Top Bar */}
              <div className="relative z-20 flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1.5 text-white/80">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  CORE // VTECH STUDIO
                </span>
                <span className="text-[10px] text-primary/80 tracking-widest">
                  INTERACTIVE
                </span>
              </div>

              {/* Interactive ASCII Character Reveal Container with Official Logo */}
              <div className="relative z-10 flex flex-col items-center justify-center py-4 px-4 w-full">
                <div className="relative w-full aspect-[4/3.8] max-w-[290px] rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-inner group/ascii">
                  {/* High-fidelity official logo base */}
                  <div className="absolute inset-4 pointer-events-none z-0 flex items-center justify-center opacity-30 group-hover/ascii:opacity-100 transition-opacity duration-700">
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
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-40 group-hover/ascii:opacity-90 transition-opacity text-[9px] font-mono tracking-widest uppercase text-white/70 bg-black/75 px-2.5 py-0.5 rounded-full border border-white/15 backdrop-blur-sm z-20">
                    Hover to Reveal Logo
                  </div>
                </div>

                {/* Sub-label */}
                <div className="w-full text-center mt-3 font-mono text-[11px] text-muted-foreground tracking-wider uppercase">
                  Official Studio Mark // High-Fidelity
                </div>
              </div>

              {/* Bottom Status Pill */}
              <div className="relative z-20 px-4 pb-4">
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-background/80 backdrop-blur-md border border-white/10 text-xs font-medium">
                  <span className="flex items-center gap-2 text-white/90 font-mono text-[11px] tracking-wide">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    Available for Projects
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 font-bold">
                    ACTIVE
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Name & designation */}
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
                VTECH STUDIO
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="font-mono text-sm uppercase tracking-widest text-primary"
              >
                Creative Engineering &amp; Vibe Coding
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-muted-foreground text-[15px] leading-relaxed max-w-sm"
              >
                VTECH STUDIO pioneers modern vibe coding—rapidly transforming creative prompts, aesthetic vision, and architectural concepts into bespoke, high-performance web products. Specially designed for growing local businesses, boutique services, and ambitious digital creators.
              </motion.p>
            </div>

            {/* Expertise tags */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {[
                "Vibe Coding",
                "Creative Engineering",
                "Local Business Growth",
                "Motion Design",
                "Custom Web Systems",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full border border-border bg-muted/60 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors duration-300 cursor-default"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ══════════ RIGHT — Metrics ══════════ */}
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
                Studio Foundation
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
                Results that
                <br />
                <span className="text-primary">Speak Loudly.</span>
              </motion.h3>
            </div>

            {/* Metric cards — Refined to authentic studio metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                value={100}
                suffix="%"
                label="Client Commitment"
                description="Direct founder attention on every build — no outsourced middle layers, no generic templates, and zero communication drop-off."
                delay={0.15}
              />

              <MetricCard
                value={48}
                suffix="h"
                label="Rapid Vibe Coding Sprint"
                description="Accelerated turnaround from design direction to functional, interactive prototype ready for testing and deployment."
                delay={0.25}
              />

              {/* Full-width highlighted card */}
              <div className="sm:col-span-2">
                <MetricCard
                  prefix=""
                  value={1}
                  suffix=" Unified Creative Engine"
                  label="Bespoke Architecture"
                  description="Merging creative direction, digital motion, and agile vibe coding to solve real business bottlenecks and establish market-leading digital presence."
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
              className="text-xs font-mono text-muted-foreground/50 uppercase tracking-widest border-t border-border pt-6"
            >
              Precision craftsmanship backed by real business impact.
            </motion.p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
