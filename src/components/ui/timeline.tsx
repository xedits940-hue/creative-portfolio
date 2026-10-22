"use client";

import { useScroll, useTransform, motion, useInView, useSpring } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import PhraseAnimation from "@/components/common/phrase-reveal";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(1000);

  const headerInView = useInView(headerRef, {
    once: true,
    margin: "0px 0px -80px 0px",
  });

  // Dynamically observe content height so images loading or resizing never breaks the line tracking
  useEffect(() => {
    if (!ref.current) return;

    const measureHeight = () => {
      if (ref.current) {
        const measured = ref.current.scrollHeight || ref.current.offsetHeight;
        if (measured > 0) {
          setHeight(measured);
        }
      }
    };

    measureHeight();

    const ro = new ResizeObserver(() => {
      measureHeight();
    });
    ro.observe(ref.current);

    window.addEventListener("resize", measureHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureHeight);
    };
  }, []);

  // Track scroll strictly across the milestones list (ref) from when it enters view to completion
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 20%", "end 80%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 35,
    restDelta: 0.001,
  });

  const heightTransform = useTransform(smoothProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(smoothProgress, [0, 0.04], [0, 1]);

  return (
    <div className="w-full bg-transparent md:px-10" ref={containerRef}>
      {/* ── Section header with staggered blur+slide reveals ── */}
      <div
        ref={headerRef}
        className="container relative z-10 mb-16 px-6 text-center mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={
            headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
          }
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-4 w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium text-primary uppercase tracking-widest"
        >
          Gallery
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 36, filter: "blur(10px)" }}
          animate={
            headerInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}
          }
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            <PhraseAnimation phrase="The   Gallery" />
            <span className="block bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              <PhraseAnimation phrase="Showcase" className="text-primary" />
            </span>
          </h2>
        </motion.div>
        {/* Sweeping accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={headerInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: 0 }}
          className="mx-auto mt-6 h-px max-w-xs bg-linear-to-r from-primary/60 via-primary/20 to-transparent"
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          <PhraseAnimation phrase="Transforming ideas into engaging digital journeys designed to stand out." />
        </motion.div>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <TimelineRow key={index} item={item} index={index} />
        ))}

        {/* Base Track Line */}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-neutral-800/80 [mask-image:linear-gradient(to_bottom,transparent_0%,black_5%,black_95%,transparent_100%)]"
        >
          {/* Active Glowing Crimson Line that fills down smoothly as you scroll */}
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-b from-primary via-[#ff1f3d] to-primary rounded-full shadow-[0_0_12px_#ff1f3d]"
          >
            {/* Glowing tracer beacon at the head of the progressing line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ff1f3d,0_0_20px_#ff1f3d]" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ── Per-row scroll-reveal wrapper ────────────────────────────────────────────
function TimelineRow({
  item,
  index,
}: {
  item: { title: string; content: React.ReactNode };
  index: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const rowInView = useInView(rowRef, {
    once: false,
    margin: "0px 0px -120px 0px",
  });

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, x: -20, filter: "blur(6px)" }}
      animate={rowInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="flex justify-start pt-10 md:pt-40 md:gap-10"
    >
      <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
        {/* Milestone Node Circle that glows when in view */}
        <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-neutral-900/95 border border-neutral-700/80 backdrop-blur-md flex items-center justify-center transition-all duration-500 shadow-lg">
          <div
            className={`h-4 w-4 rounded-full border transition-all duration-500 ${
              rowInView
                ? "bg-primary border-primary shadow-[0_0_12px_#ff1f3d]"
                : "bg-neutral-800 border-neutral-700"
            }`}
          />
        </div>
        <h3
          className={`hidden md:block text-xl md:pl-20 md:text-4xl font-bold transition-colors duration-500 ${
            rowInView ? "text-white" : "text-neutral-500"
          }`}
        >
          <PhraseAnimation phrase={item.title} />
        </h3>
      </div>
      <div className="relative pl-20 pr-4 md:pl-4 w-full">
        <h3
          className={`md:hidden block text-2xl mb-4 text-left font-bold transition-colors duration-500 ${
            rowInView ? "text-white" : "text-neutral-500"
          }`}
        >
          <PhraseAnimation phrase={item.title} />
        </h3>
        {item.content}
      </div>
    </motion.div>
  );
}
