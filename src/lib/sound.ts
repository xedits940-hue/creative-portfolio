/**
 * Safe client-side audio player utility.
 */
export function playSound(src: string, volume = 0.5): void {
  if (typeof window === "undefined") return;
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
