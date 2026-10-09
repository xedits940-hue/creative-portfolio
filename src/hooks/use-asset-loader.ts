"use client";

import { useEffect, useState } from "react";

/**
 * Drives a silky smooth 0 to 100% counter for the signature studio preloader.
 * Guarantees steady, continuous progression so all multilingual greetings
 * cycle legibly, the curved line fills steadily, and finishes cleanly at 100%.
 */
export function useAssetLoader(targetDurationMs = 2200) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    let lastShown = -1;

    const loop = (now: number) => {
      const elapsed = now - start;
      const raw = Math.min(1, elapsed / targetDurationMs);

      // Smooth custom easing: starts gently, advances fluidly, smoothly settles into 100%
      const eased = raw < 0.5
        ? 2 * raw * raw
        : -1 + (4 - 2 * raw) * raw;

      const current = Math.min(100, Math.max(0, eased * 100));
      const shown = Math.round(current);

      if (shown !== lastShown) {
        lastShown = shown;
        setProgress(shown);
      }

      if (raw >= 1) {
        setProgress(100);
        setIsComplete(true);
        return;
      }

      raf = requestAnimationFrame(loop);
    };

    // Emergency safety timeout: ensure it NEVER gets stuck even in throttled background tabs
    const maxSafetyTimer = setTimeout(() => {
      setProgress(100);
      setIsComplete(true);
    }, Math.min(targetDurationMs + 800, 3000));

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(maxSafetyTimer);
    };
  }, [targetDurationMs]);

  return { progress, isComplete };
}
