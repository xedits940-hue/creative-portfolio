"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

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
              ? "text-primary text-7xl md:text-8xl"
              : "text-foreground text-6xl md:text-7xl"
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

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -30]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [0.94, 1.02]);

  // Section-level entrance: subtle elevation
  const sectionY = useTransform(scrollYProgress, [0, 0.25], [30, 0]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ y: sectionY }}
      className="relative w-full py-28 md:py-40 bg-transparent overflow-hidden"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          {/* ══════════ LEFT — Identity ══════════ */}
          <div className="lg:col-span-5 flex flex-col gap-10">
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
              About
            </motion.div>

            {/* VTECH Interactive Studio Core Visual (Award-Winning Engineering Matrix) */}
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              className="relative w-full aspect-[4/4.6] max-w-[380px] mx-auto lg:mx-0 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#141417]/90 via-[#0c0c0e]/95 to-[#060607] shadow-2xl backdrop-blur-xl group transition-all duration-700 hover:border-primary/40"
            >
              {/* Corner crosshairs and technical markings */}
              <div className="absolute top-3 left-3 text-[10px] font-mono text-white/30 select-none z-20">+</div>
              <div className="absolute top-3 right-3 text-[10px] font-mono text-white/30 select-none z-20">+</div>
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-white/30 select-none z-20">+</div>
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/30 select-none z-20">+</div>

              {/* Ambient radial glow backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,31,61,0.18)_0%,rgba(0,243,255,0.06)_45%,transparent_75%)] pointer-events-none group-hover:opacity-100 transition-opacity duration-700" />

              {/* Top Telemetry Header Bar */}
              <div className="relative z-20 flex items-center justify-between px-5 pt-4 pb-2 border-b border-white/5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1.5 text-white/80">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  CORE // VTECH-01
                </span>
                <span className="text-[10px] text-primary/80 tracking-widest">
                  120 FPS // ACTIVE
                </span>
              </div>

              {/* Central Kinetic Gyroscope & Holographic Monogram */}
              <div className="relative z-10 flex flex-col items-center justify-center py-6 px-4">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  {/* Outer Orbit Ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-white/15"
                  >
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#ff1f3d]" />
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00f3ff] shadow-[0_0_8px_#00f3ff]" />
                  </motion.div>

                  {/* Mid Counter-Rotating Radar Ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 rounded-full border border-white/10"
                    style={{
                      borderTopColor: "rgba(255,31,61,0.6)",
                      borderRightColor: "rgba(0,243,255,0.4)",
                    }}
                  />

                  {/* Inner Glowing Core Ring */}
                  <motion.div
                    animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-10 rounded-full border border-primary/40 bg-gradient-to-tr from-primary/10 via-transparent to-[#00f3ff]/10 shadow-[0_0_24px_rgba(255,31,61,0.25)]"
                  />

                  {/* Stylized VTECH Center Monogram / Vector Emblem */}
                  <div className="relative z-10 flex flex-col items-center justify-center select-none">
                    <span className="text-2xl font-black tracking-tighter text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]">
                      V<span className="text-primary">T</span>
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/50 -mt-0.5">
                      STUDIO
                    </span>
                  </div>
                </div>

                {/* Live Equalizer / Waveform Frequency Bars */}
                <div className="flex items-center gap-1.5 mt-2 h-5">
                  {[18, 32, 14, 28, 40, 22, 36, 16, 30, 24, 38, 20].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [
                          `${Math.max(4, h * 0.25)}px`,
                          `${h * 0.45}px`,
                          `${Math.max(4, h * 0.25)}px`,
                        ],
                        opacity: [0.35, 0.9, 0.35],
                      }}
                      transition={{
                        duration: 1.2 + (i % 4) * 0.25,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.08,
                      }}
                      className="w-[2px] rounded-full bg-gradient-to-t from-primary/40 via-white/80 to-[#00f3ff]"
                    />
                  ))}
                </div>

                {/* Micro Telemetry Spec Grid */}
                <div className="w-full grid grid-cols-2 gap-2 mt-4 px-2">
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                    <span className="block font-mono text-[8px] uppercase tracking-widest text-muted-foreground/70">SPEC 01</span>
                    <span className="block font-mono text-[10px] font-bold text-white/90">3D MOTION / CGI</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                    <span className="block font-mono text-[8px] uppercase tracking-widest text-muted-foreground/70">SPEC 02</span>
                    <span className="block font-mono text-[10px] font-bold text-white/90">WEB ARCHITECTURE</span>
                  </div>
                </div>
              </div>

              {/* Bottom Availability Pill */}
              <div className="relative z-20 px-4 pb-4">
                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-background/80 backdrop-blur-md border border-white/10 text-xs font-medium">
                  <span className="flex items-center gap-2 text-white/90 font-mono text-[11px] tracking-wide">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    Available for Projects
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400/90 font-bold">
                    Q3 / Q4 OPEN
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
                VTECH STUDIOS
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="font-mono text-sm uppercase tracking-widest text-primary"
              >
                Digital Production & Creative Direction
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-muted-foreground text-[15px] leading-relaxed max-w-xs"
              >
                Crafting high-impact motion design, cinematic storytelling, and
                digital production for global brands. Turning bold concepts into
                compelling visual experiences that command attention.
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
                "Creative Direction",
                "Motion Design",
                "Video Editing",
                "Brand Strategy",
                "Digital Production",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-5 py-2 rounded border border-border bg-muted text-xs font-mono uppercase tracking-wider text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors duration-300 cursor-default"
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
                By the numbers
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
                <span className=" text-primary">Speak Loudly.</span>
              </motion.h3>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MetricCard
                value={5}
                suffix="+ yrs"
                label="Years of Experience"
                description="Half a decade honing the craft of visual storytelling across global brands and viral campaigns."
                delay={0.15}
              />

              <MetricCard
                value={100}
                suffix="+"
                label="Projects Completed"
                description="From FIFA tournaments to esports highlights — diverse, delivered, and always ahead of deadline."
                delay={0.25}
              />

              {/* Revenue — full-width highlighted */}
              <div className="sm:col-span-2">
                <MetricCard
                  prefix="$"
                  value={3}
                  suffix="M+"
                  label="Revenue Achieved"
                  description="Revenue generated for clients through high-conversion content, brand campaigns, and viral media strategies that move the needle."
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
              Numbers reflect verified client outcomes — not estimates.
            </motion.p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
