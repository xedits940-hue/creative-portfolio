/**
 * Enterprise Security & Interaction Hardening
 * Input sanitization, click debounce, and idempotent execution handlers.
 */

/**
 * Sanitize strings against XSS and malicious scripts.
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Rapid-click debounce utility to prevent double submission and UI lag.
 */
export function debounceAction<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delayMs = 250
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delayMs);
  };
}

/**
 * Throttle function to guarantee execution at most once per time window.
 */
export function throttleAction<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limitMs = 150
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limitMs);
    }
  };
}

/**
 * Idempotent execution tracker for critical operations
 */
const executedOperations = new Set<string>();

export function runIdempotent<T>(
  key: string,
  operation: () => T,
  fallback: () => T
): T {
  if (executedOperations.has(key)) {
    return fallback();
  }
  executedOperations.add(key);
  try {
    return operation();
  } catch (error) {
    executedOperations.delete(key);
    throw error;
  }
}
