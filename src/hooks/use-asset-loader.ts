"use client";

import { useEffect, useState } from "react";

/**
 * Deterministic, smooth, and robust asset loader.
 * Guarantees a swift, elegant 0 -> 100 progression in ~1.4 seconds.
 * Includes absolute safety caps so it CANNOT hang under any network,
 * iframe, or browser lifecycle condition.
 */
export function useAssetLoader() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const TOTAL_DURATION_MS = 1400; // Fast, snappy, cinematic counter
    const start = performance.now();
    let rafId = 0;
    let finished = false;

    // Hard fallback timeout: guarantees 100% completion in 1.8 seconds max
    const hardSafetyTimer = setTimeout(() => {
      if (!finished) {
        finished = true;
        setProgress(100);
        setIsComplete(true);
      }
    }, 1800);

    const tick = (now: number) => {
      if (finished) return;

      const elapsed = now - start;
      const progressRatio = Math.min(1, elapsed / TOTAL_DURATION_MS);
      // Smooth cubic ease-out
      const eased = 1 - Math.pow(1 - progressRatio, 2.8);
      const current = Math.min(100, Math.round(eased * 100));

      setProgress(current);

      if (progressRatio >= 1 || current >= 100) {
        finished = true;
        setProgress(100);
        setIsComplete(true);
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(hardSafetyTimer);
    };
  }, []);

  return { progress, isComplete };
}
