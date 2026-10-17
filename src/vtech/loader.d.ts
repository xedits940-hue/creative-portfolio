export interface VTMotionConfig {
  readonly revealMs: number;
  readonly ease: string;
  readonly easeArray: readonly number[];
  readonly easeOut: string;
  readonly easeOutArray: readonly number[];
  readonly logoDelayMs: number;
  readonly logoMs: number;
  readonly heroDelayMs: number;
  readonly heroMs: number;
  readonly holdAt100Ms: number;
}

export declare const VT_MOTION: VTMotionConfig;

export interface TrackAssetsOptions {
  images?: string[];
  fonts?: boolean;
  windowLoad?: boolean;
  timeoutMs?: number;
  onProgress?: (progress: number) => void;
}

export declare function trackAssets(options?: TrackAssetsOptions): Promise<void>;

export interface CreateCounterOptions {
  render?: (value: number) => void;
  onDone?: () => void;
  smoothingMs?: number;
  maxPointsPerSec?: number;
  creepTo?: number;
  creepPointsPerSec?: number;
  holdAt100Ms?: number;
}

export interface CounterInstance {
  setTarget(value: number): void;
  stop(): void;
  readonly value: number;
}

export declare function createCounter(options?: CreateCounterOptions): CounterInstance;

export interface PlayRevealOptions {
  loader?: HTMLElement | null;
  logo?: HTMLElement | null;
  hero?: HTMLElement | null;
  onStart?: () => void;
  onDone?: () => void;
}

export declare function playReveal(options?: PlayRevealOptions): void;

export declare function shouldPlayIntro(mode?: 'always' | 'once-per-session' | string): boolean;

export declare function markIntroSeen(): void;
