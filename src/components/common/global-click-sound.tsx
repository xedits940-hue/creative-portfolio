"use client";

import { useEffect } from "react";
import { playSound } from "@/lib/sound";

export default function GlobalClickSound() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Elements marked with data-sound-exclude will NOT trigger this
      // universal click sound (used for buttons that already have their
      // own dedicated sound, like theme-toggle, hamburger menu, etc.)
      if (target.closest("[data-sound-exclude]")) return;

      playSound(
        "https://www.myinstants.com/en/instant/nintendo-switch-click-69023/?utm_source=copy&utm_medium=share",
        0.35
      );
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
