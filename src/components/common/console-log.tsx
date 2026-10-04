"use client";

import { useEffect } from "react";

export default function ConsoleLog() {
  useEffect(() => {
    // Get the primary color from CSS variables
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim();

    // Convert HSL to a format console.log can use, or just use a fallback if it's complex
    // Assuming primary is an HSL value like "0 72.2% 50.6%" in shadcn/ui
    const style = [
      `color: hsl(${primaryColor || "0, 100%, 50%"})`,
      "font-size: 20px",
      "font-weight: bold",
      "font-family: monospace",
      "padding: 10px",
    ].join(";");

    console.log("%cBuilt with Next.js", style);

    const handleWindowError = (e: ErrorEvent) => {
      if (
        e.message &&
        (e.message.includes("ResizeObserver loop") ||
          e.message.includes("ResizeObserver"))
      ) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    };

    const handleRejection = (e: PromiseRejectionEvent) => {
      if (!e.reason || e.reason instanceof Event) {
        e.preventDefault();
      }
    };

    window.addEventListener("error", handleWindowError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleWindowError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
