"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

interface SoundContextType {
  isSoundActive: boolean;
  toggleSound: () => void;
  setSoundActive: (active: boolean) => void;
  hasPrompted: boolean;
  setHasPrompted: (prompted: boolean) => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundActive, setIsSoundActive] = useState<boolean>(false);
  const [hasPrompted, setHasPrompted] = useState<boolean>(true); // default true on SSR
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthGainRef = useRef<GainNode | null>(null);

  // Initialize client state and audio
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if user has answered the prompt in this session
    const answered = sessionStorage.getItem("vtech_sound_preference_set");
    if (!answered) {
      setHasPrompted(false);
    } else {
      const savedActive = sessionStorage.getItem("vtech_sound_active") === "true";
      if (savedActive) {
        setIsSoundActive(true);
      }
    }

    // Prepare ambient audio track
    const audio = new Audio("/universfield-swoosh-07-351043.mp3");
    audio.loop = true;
    audio.volume = 0.22;
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Web Audio ambient drone generator for deep cinematic high-end background sound
  const startAmbientSynth = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (!synthGainRef.current) {
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.2);
        masterGain.connect(ctx.destination);
        synthGainRef.current = masterGain;

        // Warm sub-bass atmospheric oscillator (43.65 Hz - F1 note)
        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(43.65, ctx.currentTime);

        // Harmonic shimmer oscillator (130.81 Hz - C3)
        const osc2 = ctx.createOscillator();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(130.81, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(240, ctx.currentTime);

        const osc2Gain = ctx.createGain();
        osc2Gain.gain.setValueAtTime(0.03, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(osc2Gain);
        osc2Gain.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();
      } else {
        const ctx = audioContextRef.current;
        synthGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
        synthGainRef.current.gain.setValueAtTime(synthGainRef.current.gain.value, ctx.currentTime);
        synthGainRef.current.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.8);
      }
    } catch {
      // Graceful fallback
    }
  }, []);

  const stopAmbientSynth = useCallback(() => {
    try {
      if (audioContextRef.current && synthGainRef.current) {
        const ctx = audioContextRef.current;
        synthGainRef.current.gain.cancelScheduledValues(ctx.currentTime);
        synthGainRef.current.gain.setValueAtTime(synthGainRef.current.gain.value, ctx.currentTime);
        synthGainRef.current.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
      }
    } catch {
      // Graceful fallback
    }
  }, []);

  const setSoundActive = useCallback(
    (active: boolean) => {
      setIsSoundActive(active);
      sessionStorage.setItem("vtech_sound_active", String(active));
      sessionStorage.setItem("vtech_sound_preference_set", "true");

      if (active) {
        startAmbientSynth();
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      } else {
        stopAmbientSynth();
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    },
    [startAmbientSynth, stopAmbientSynth]
  );

  const toggleSound = useCallback(() => {
    setSoundActive(!isSoundActive);
  }, [isSoundActive, setSoundActive]);

  return (
    <SoundContext.Provider
      value={{
        isSoundActive,
        toggleSound,
        setSoundActive,
        hasPrompted,
        setHasPrompted,
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
