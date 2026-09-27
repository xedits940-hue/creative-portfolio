"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

interface TextAnimateProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  variants?: Variants;
  by?: "character" | "word";
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function TextAnimate({
  children,
  className,
  style,
  variants,
  by = "character",
  once = false,
}: TextAnimateProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once });

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
        delay: i * 0.1,
        duration: 0.4,
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
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  };

  const finalVariants = variants || defaultVariants;
  const segments = by === "character" ? Array.from(children) : children.split(" ");

  return (
    <span
      ref={ref}
      className={`inline-flex flex-wrap items-center justify-center ${className || ""}`}
      style={style}
    >
      {segments.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          custom={index}
          variants={finalVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          exit="exit"
          className="inline-block"
          style={{ whiteSpace: segment === " " ? "pre" : "normal" }}
        >
          {segment}
        </motion.span>
      ))}
    </span>
  );
}

export default TextAnimate;
