"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
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
  const logoCardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isLogoInView = useInView(logoCardRef, { margin: "-20px" });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (isLogoInView) {
      if (video.paused) {
        video.play().catch(() => {});
      }
    } else {
      if (!video.paused) {
        try {
          video.pause();
        } catch {
          // safe fallback
        }
      }
    }
  }, [isLogoInView]);

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

            {/* Studio Logo: Clean, compact square card with ultra high quality video looping seamlessly */}
            <motion.div
              ref={logoCardRef}
              style={{ y: imageY, scale: imageScale }}
              className="relative w-full max-w-[240px] sm:max-w-[260px] aspect-square mx-auto lg:mx-0 rounded-2xl border border-white/10 bg-black backdrop-blur-xl shadow-2xl overflow-hidden flex items-center justify-center group"
            >
              <video
                ref={videoRef}
                src="/logo-video.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                controls={false}
                className="w-full h-full object-cover rounded-2xl pointer-events-none select-none"
                aria-label="VTECH Studio Logo Animation"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
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
