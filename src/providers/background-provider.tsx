"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { playSound } from "@/lib/sound";

export type BackgroundMode = "video" | "silk";

interface BackgroundContextType {
  bgMode: BackgroundMode;
  isVideo: boolean;
  toggleBackground: () => void;
  setBackgroundMode: (mode: BackgroundMode) => void;
}

const BackgroundContext = createContext<BackgroundContextType>({
  bgMode: "video",
  isVideo: true,
  toggleBackground: () => {},
  setBackgroundMode: () => {},
});

const STORAGE_KEY = "vtech_bg_theme_preference_v1";

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  // Default is "video" (the dark cinematic background)
  const [bgMode, setBgMode] = useState<BackgroundMode>("video");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as BackgroundMode | null;
      if (saved === "silk" || saved === "video") {
        setBgMode(saved);
      } else {
        // Default when first visiting is the black video background
        setBgMode("video");
      }
    } catch {
      // safe fallback if storage is restricted
    }
  }, []);

  const setBackgroundMode = useCallback((mode: BackgroundMode) => {
    setBgMode(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // safe fallback
    }
  }, []);

  const toggleBackground = useCallback(() => {
    setBgMode((prev) => {
      const next = prev === "video" ? "silk" : "video";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // safe fallback
      }
      try {
        playSound("/universfield-swoosh-07-351043.mp3", 0.18);
      } catch {
        // sound failure ignored
      }
      return next;
    });
  }, []);

  // True by default so the black video background shows immediately with zero flash
  const isVideo = bgMode === "video";

  return (
    <BackgroundContext.Provider
      value={{
        bgMode,
        isVideo,
        toggleBackground,
        setBackgroundMode,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackground must be used within a BackgroundProvider");
  }
  return context;
}
