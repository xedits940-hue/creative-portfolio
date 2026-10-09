"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import PhraseAnimation from "@/components/common/phrase-reveal";
import { MapPin, Star, ArrowUpRight, CheckCircle2 } from "lucide-react";

const SIYA_GOOGLE_URL = "https://share.google/FIoVVdysoXxxmJjUa";

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -100px 0px",
  });
  const headerInView = useInView(headerRef, {
    once: true,
    margin: "0px 0px -60px 0px",
  });

  return (
    <section
      ref={sectionRef}
      id="clients"
      className="relative flex w-full flex-col items-center justify-center py-24 overflow-hidden isolate bg-transparent"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/15 blur-[130px] rounded-full pointer-events-none -z-10 opacity-60" />

      {/* Section Header */}
      <div
        ref={headerRef}
        className="container relative z-10 mb-14 px-6 text-center mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={
            headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
          }
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-4 w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium text-primary uppercase tracking-widest font-mono"
        >
          Featured Client Reference
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={
            headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
          }
          transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <PhraseAnimation phrase="Real    Businesses.    Measurable" className="" />
            <span className="block bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              <PhraseAnimation phrase="Impact." className="text-primary" />
            </span>
          </h3>
        </motion.div>

        {/* Sweeping rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={headerInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0 }}
          className="mx-auto mt-6 h-px max-w-xs bg-linear-to-r from-primary/60 via-primary/20 to-transparent"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg"
        >
          We build digital experiences that drive genuine footfall, brand equity, and customer trust for growing businesses.
        </motion.div>
      </div>

      {/* Featured Real Client Showcase Card — Siya Beauty Parlour & Spa */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl px-4 sm:px-6 z-10"
      >
        <div className="relative rounded-3xl border border-white/15 bg-neutral-950/80 backdrop-blur-2xl p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden group transition-all duration-500 hover:border-primary/40">
          {/* Ambient Card Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Top Bar Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono uppercase tracking-widest font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff1f3d] animate-pulse" />
                Verified Client
              </span>
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                Beauty &amp; Wellness Industry
              </span>
            </div>

            <div className="flex items-center gap-1 text-amber-400 text-xs font-mono">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="ml-1 text-white/80 font-bold">5.0 Star Rating</span>
            </div>
          </div>

          {/* Business Core Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5" />
                <span>Verified Google Business Presence</span>
              </div>

              <h4 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Siya Beauty Parlour &amp; Spa
              </h4>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Full-spectrum digital positioning and local discovery strategy executed by VTECH STUDIO. Empowering a premier local salon with modern visual identity, customer acquisition pathways, and verified search visibility.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {[
                  "Local SEO Discovery",
                  "Brand Elevation",
                  "Visual Production",
                  "Client Acquisition Strategy",
                ].map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-[11px] font-mono text-white/80"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Google Listing Link CTA */}
            <div className="md:col-span-4 flex flex-col items-center md:items-end justify-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-8">
              <a
                href={SIYA_GOOGLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-red-600 to-[#ff1f3d] hover:from-red-500 hover:to-[#ff3b55] text-white font-medium text-xs sm:text-sm transition-all duration-300 shadow-[0_0_25px_rgba(255,31,61,0.4)] hover:shadow-[0_0_35px_rgba(255,31,61,0.6)] hover:scale-105 active:scale-95 text-center"
              >
                <span>View Google Listing</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <span className="text-[11px] font-mono text-muted-foreground text-center md:text-right">
                Official Google Business Link
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;
