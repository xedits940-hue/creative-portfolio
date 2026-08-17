"use client";

import React, { useRef } from "react";
import { useInView, motion, Variants } from "framer-motion";

interface PhraseAnimationProps {
  phrase: string;
  className?: string;
  wordClassName?: string;
  staggerDelay?: number;
  animationDuration?: number;
  /** Apply the secondary accent font (Cormorant Garamond italic) */
  accent?: boolean;
}

const PhraseAnimation: React.FC<PhraseAnimationProps> = ({
  phrase,
  className = "",
  wordClassName = "",
  staggerDelay = 0.01,
  animationDuration = 0.5,
  accent = false,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });

  const slideUp: Variants = {
    initial: {
      y: "100%",
    },
    open: (i: number) => ({
      y: "0%",
      transition: {
        duration: animationDuration,
        delay: staggerDelay * i,
        ease: [0.33, 1, 0.68, 1],
      },
    }),
    closed: {
      y: "100%",
      transition: {
        duration: animationDuration,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  return (
    <span
      ref={containerRef}
      className={`block leading-tight ${className}`}
      aria-label={phrase}
    >
      {phrase.split(" ").map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="relative inline-flex overflow-hidden mr-1"
          aria-hidden="true"
        >
          <motion.span
            variants={slideUp}
            custom={index}
            initial="initial"
            animate={isInView ? "open" : "closed"}
            className={`inline-block ${wordClassName} ${
              accent ? "font-accent italic tracking-tight" : ""
            }`}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

export default PhraseAnimation;
