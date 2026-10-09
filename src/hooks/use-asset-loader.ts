"use client";

import { useEffect, useState } from "react";

/**
 * High-precision linear smooth asset loader hook.
 * Drives 0 -> 100% with continuous linear increments so all 12 multilingual greetings
 * display evenly and legibly on all devices (mobile, tablets, laptops, desktops).
 */
export function useAssetLoader(targetDurationMs = 2400) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    let lastReported = -1;

    const loop = (now: number) => {
      const elapsed = now - start;
      const linearRatio = Math.min(1, elapsed / targetDurationMs);

      // Steady linear progression so every language word gets an equal time slice
      const current = Math.min(100, Math.max(0, linearRatio * 100));
      const shown = Math.floor(current);

      if (shown !== lastReported) {
        lastReported = shown;
        setProgress(shown);
      }

      if (linearRatio >= 1) {
        setProgress(100);
        setIsComplete(true);
        return;
      }

      raf = requestAnimationFrame(loop);
    };

    // Emergency watchdog: guarantees completion even if rAF is background-throttled
    const maxSafetyTimer = setTimeout(() => {
      setProgress(100);
      setIsComplete(true);
    }, targetDurationMs + 600);

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(maxSafetyTimer);
    };
  }, [targetDurationMs]);

  return { progress, isComplete };
}
