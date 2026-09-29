"use client";

import React, { useRef } from "react";
import {
  motion,
  useInView,
  Variants,
  TargetAndTransition,
  VariantLabels,
} from "framer-motion";
import { cn } from "@/lib/utils";

type AnimationType = "text" | "word" | "character" | "line";

export interface TextAnimateProps {
  children: string;
  className?: string;
  segmentClassName?: string;
  delay?: number;
  duration?: number;
  variants?: Variants;
  by?: AnimationType;
  startOnView?: boolean;
  once?: boolean;
  animate?: TargetAndTransition | VariantLabels | boolean | string;
  style?: React.CSSProperties;
}

const defaultVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    rotate: 45,
    scale: 0.5,
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.35,
      y: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        mass: 0.8,
      },
      rotate: {
        type: "spring",
        damping: 8,
        stiffness: 150,
      },
      scale: {
        type: "spring",
        damping: 10,
        stiffness: 300,
      },
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: 30,
    rotate: 45,
    scale: 0.5,
    transition: {
      delay: i * 0.02,
      duration: 0.25,
    },
  }),
};

export function TextAnimate({
  children,
  className,
  segmentClassName,
  variants,
  by = "character",
  startOnView = true,
  once = false,
  animate: explicitAnimate,
  style,
}: TextAnimateProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { once });

  const activeAnimation =
    explicitAnimate !== undefined
      ? explicitAnimate
      : startOnView
      ? isInView
        ? "show"
        : "hidden"
      : "show";

  const activeVariants = variants || defaultVariants;

  if (by === "character") {
    const words = (children || "").split(" ");
    let charIndex = 0;

    return (
      <span
        ref={containerRef}
        className={cn("inline-flex flex-wrap items-center", className)}
        style={style}
      >
        {words.map((word, wordIdx) => {
          const chars = Array.from(word);
          return (
            <React.Fragment key={`word-wrap-${wordIdx}`}>
              <span className="inline-block whitespace-nowrap">
                {chars.map((char) => {
                  const currentIndex = charIndex++;
                  return (
                    <motion.span
                      key={`char-${currentIndex}`}
                      custom={currentIndex}
                      variants={activeVariants}
                      initial="hidden"
                      animate={activeAnimation}
                      exit="exit"
                      className={cn("inline-block", segmentClassName)}
                    >
                      {char}
                    </motion.span>
                  );
                })}
              </span>
              {wordIdx < words.length - 1 && (
                <span className="inline-block whitespace-pre"> </span>
              )}
            </React.Fragment>
          );
        })}
      </span>
    );
  }

  const segments =
    by === "word"
      ? (children || "").split(" ")
      : by === "line"
      ? (children || "").split("\n")
      : [children || ""];

  return (
    <span
      ref={containerRef}
      className={cn("inline-flex flex-wrap items-center", className)}
      style={style}
    >
      {segments.map((segment, index) => (
        <React.Fragment key={`seg-wrap-${index}`}>
          <motion.span
            custom={index}
            variants={activeVariants}
            initial="hidden"
            animate={activeAnimation}
            exit="exit"
            className={cn(
              by === "line" ? "block w-full" : "inline-block",
              segmentClassName
            )}
          >
            {segment}
          </motion.span>
          {by === "word" && index < segments.length - 1 && (
            <span className="inline-block whitespace-pre"> </span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}

export default TextAnimate;
