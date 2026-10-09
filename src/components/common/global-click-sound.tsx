"use client";

import { useEffect } from "react";
import { playSound } from "@/lib/sound";

export default function GlobalClickSound() {
  useEffect(() => {
    let lastClickTime = 0;
    const handleClick = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastClickTime < 50) return;
      lastClickTime = now;

      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== "function") return;
      if (target.closest("[data-sound-exclude]")) return;

      playSound("/switch-sound.mp3", 0.35);
    };

    document.addEventListener("click", handleClick, { passive: true });

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
