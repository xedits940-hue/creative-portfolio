"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useBackground } from "@/providers/background-provider";

export interface ThemeToggleButtonProps {
  className?: string;
  start?: string;
  variant?: string;
  blur?: boolean;
  gifUrl?: string;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  className = "",
}) => {
  const { isVideo, toggleBackground } = useBackground();

  return (
    <button
      type="button"
      className={cn(
        "size-10 cursor-pointer rounded-full bg-black/80 border border-white/20 p-0 transition-all duration-300 hover:border-white/50 active:scale-95 shadow-md flex items-center justify-center relative overflow-hidden",
        className
      )}
      onClick={toggleBackground}
      aria-label={isVideo ? "Switch to Red Background" : "Switch to Black Background"}
      title={isVideo ? "Switch to Red Background" : "Switch to Black Background"}
    >
      <span className="sr-only">Toggle background theme</span>
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-0.5"
      >
        <motion.g
          animate={{ rotate: isVideo ? 0 : 180 }}
          transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.65 }}
        >
          <path
            d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5"
            fill={isVideo ? "#ff2a4a" : "white"}
          />
          <path
            d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5"
            fill="black"
          />
        </motion.g>
        <motion.path
          animate={{ rotate: isVideo ? 0 : 180 }}
          transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.65 }}
          d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
          fill="white"
        />
      </svg>
    </button>
  );
};

export default ThemeToggleButton;
