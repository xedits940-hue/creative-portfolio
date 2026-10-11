/**
 * Safe client-side audio player utility that strictly honors the global sound toggle.
 */
let lastSoundTime = 0;

export function playSound(src: string, volume = 0.5): void {
  if (typeof window === "undefined") return;

  // Respect the master sound toggle: if user turned sound off, NEVER play sound!
  if (window.__VTECH_SOUND_ENABLED === false) return;

  const now = performance.now();
  // Prevent audio clipping and buffer overflow during rapid clicking
  if (now - lastSoundTime < 45) return;
  lastSoundTime = now;

  try {
    const audio = new Audio(src);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.play().catch(() => {
      // Audio playback prevented by autoplay policy or iframe restrictions
    });
  } catch {
    // Graceful fallback
  }
}
