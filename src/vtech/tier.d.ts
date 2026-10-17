export declare const canUseFineHover: () => boolean;
export declare const prefersReducedMotion: () => boolean;

export interface TierSignals {
  reduced: boolean;
  saveData: boolean;
  effectiveType: string;
  memory?: number;
  cores: number;
  tv: boolean;
  coarse: boolean;
  noHover: boolean;
}

export declare function readSignals(): TierSignals;
export declare function pickTier(s?: TierSignals): number;

export interface MeasureFramesOptions {
  frames?: number;
  skip?: number;
  maxMs?: number;
}

export declare function measureFrames(options?: MeasureFramesOptions): Promise<number | null>;
export declare function correctTier(tier: number, medianMs: number | null): number;
export declare function applyTier(tier: number): void;
export declare function getTier(): number;
export declare function initTier(): Promise<number>;

export interface GuardLoopOptions {
  start: () => void;
  stop: () => void;
}

export declare function guardLoop(el: HTMLElement | Element, options: GuardLoopOptions): () => void;
