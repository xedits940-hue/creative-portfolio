"use client";

import { useEffect } from "react";
import { playSound } from "@/lib/sound";

export default function GlobalClickSound() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Elements marked with data-sound-exclude will NOT trigger this
      // universal click sound.
      if (target.closest("[data-sound-exclude]")) return;

      playSound("/switch-sound.mp3", 0.35);
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
