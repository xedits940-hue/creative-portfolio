/**
 * Enterprise Resilience & Fault Tolerance Layer
 * Provides automatic retries with exponential backoff, circuit breakers,
 * and graceful degradation wrappers to prevent cascade failures.
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  shouldRetry?: (error: unknown) => boolean;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 200,
    maxDelayMs = 2000,
    backoffFactor = 2,
    shouldRetry = () => true,
  } = options;

  let attempt = 0;
  let delay = initialDelayMs;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt > maxRetries || !shouldRetry(error)) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffFactor, maxDelayMs);
    }
  }
}

/**
 * Circuit Breaker pattern implementation
 */
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private readonly threshold = 5,
    private readonly cooldownMs = 15000
  ) {}

  async execute<T>(fn: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T> {
    const now = Date.now();

    if (this.state === 'OPEN') {
      if (now - this.lastFailureTime > this.cooldownMs) {
        this.state = 'HALF_OPEN';
      } else {
        return fallback();
      }
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.reset();
      }
      return result;
    } catch {
      this.failureCount++;
      this.lastFailureTime = now;
      if (this.failureCount >= this.threshold) {
        this.state = 'OPEN';
      }
      return fallback();
    }
  }

  reset() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }
}

export const globalCircuitBreaker = new CircuitBreaker(5, 10000);
