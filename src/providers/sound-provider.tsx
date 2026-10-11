"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface SoundContextType {
  isSoundActive: boolean;
  toggleSound: () => void;
  setSoundActive: (active: boolean) => void;
  hasPrompted: boolean;
  setHasPrompted: (prompted: boolean) => void;
  triggerSwitchSound: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundActive, setIsSoundActive] = useState<boolean>(false);
  const [hasPrompted, setHasPrompted] = useState<boolean>(true); // default true on SSR

  // Load preferences on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Listen to global sound check
    const answered = sessionStorage.getItem("vtech_sound_preference_set");
    if (!answered) {
      setHasPrompted(false);
    } else {
      const savedActive = sessionStorage.getItem("vtech_sound_active") === "true";
      setIsSoundActive(savedActive);
      window.__VTECH_SOUND_ENABLED = savedActive;
    }
  }, []);

  const setSoundActive = useCallback((active: boolean) => {
    setIsSoundActive(active);
    if (typeof window !== "undefined") {
      window.__VTECH_SOUND_ENABLED = active;
      sessionStorage.setItem("vtech_sound_active", String(active));
      sessionStorage.setItem("vtech_sound_preference_set", "true");
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundActive(!isSoundActive);
  }, [isSoundActive, setSoundActive]);

  // Plays the sleek switch sound ONLY when sound is ON
  const triggerSwitchSound = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!isSoundActive) return;

    try {
      const audio = new Audio("/universfield-swoosh-07-351043.mp3");
      audio.volume = 0.25;
      audio.play().catch(() => {});
    } catch {
      // Graceful fallback
    }
  }, [isSoundActive]);

  return (
    <SoundContext.Provider
      value={{
        isSoundActive,
        toggleSound,
        setSoundActive,
        hasPrompted,
        setHasPrompted,
        triggerSwitchSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export function useSoundContext() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSoundContext must be used within a SoundProvider");
  }
  return context;
}

declare global {
  interface Window {
    __VTECH_SOUND_ENABLED?: boolean;
  }
}
