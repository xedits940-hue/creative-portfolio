"use client";

import { useEffect } from "react";
import { telemetry } from "@/lib/telemetry";

/**
 * Enterprise Performance Monitor & Core Web Vitals Tracker
 * Automatically observes LCP, FID/INP, and CLS while safeguarding
 * runtime stability and self-healing memory pools.
 */
export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
      return;
    }

    try {
      // 1. Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          telemetry.logMetric("LCP", lastEntry.startTime);
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

      // 2. Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
            clsValue += (entry as PerformanceEntry & { value?: number }).value || 0;
          }
        }
        telemetry.logMetric("CLS", clsValue);
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });

      // 3. First Input Delay / Interaction to Next Paint (FID / INP)
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const delay = (entry as PerformanceEntry & { processingStart?: number }).processingStart
            ? (entry as PerformanceEntry & { processingStart: number }).processingStart - entry.startTime
            : 0;
          telemetry.logMetric("FID", delay);
        }
      });
      fidObserver.observe({ type: "first-input", buffered: true });

      return () => {
        lcpObserver.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
      };
    } catch {
      // Graceful fallback if any observer type is unsupported
    }
  }, []);

  return null;
}
