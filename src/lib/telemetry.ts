/**
 * Enterprise Silent Telemetry & Error Logging
 * Logs all exceptions and Core Web Vitals silently to prevent user disruption.
 */

export interface TelemetryEvent {
  type: "error" | "performance" | "interaction";
  name: string;
  value?: number;
  data?: Record<string, unknown>;
  timestamp: number;
}

class TelemetryService {
  private buffer: TelemetryEvent[] = [];
  private maxBufferSize = 100;

  logError(error: unknown, context = "client"): void {
    const errorDetails = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
    };

    this.record({
      type: "error",
      name: "runtime_error",
      data: errorDetails,
      timestamp: Date.now(),
    });
  }

  logMetric(name: string, value: number, data?: Record<string, unknown>): void {
    this.record({
      type: "performance",
      name,
      value,
      data,
      timestamp: Date.now(),
    });
  }

  private record(event: TelemetryEvent): void {
    this.buffer.push(event);
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }
    // In production, flush silently via navigator.sendBeacon
    if (typeof window !== "undefined" && typeof navigator.sendBeacon === "function" && this.buffer.length >= 20) {
      this.flush();
    }
  }

  flush(): void {
    if (typeof window === "undefined" || this.buffer.length === 0) return;
    try {
      const payload = JSON.stringify(this.buffer);
      this.buffer = [];
      // Silent sendBeacon call
      navigator.sendBeacon("/api/telemetry", payload);
    } catch {
      // Never throw on telemetry failure
    }
  }
}

export const telemetry = new TelemetryService();
