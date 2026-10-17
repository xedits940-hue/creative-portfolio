import React from 'react';

export interface TapRevealOptions {
  autoOnTouch?: boolean;
  threshold?: number;
}

export interface TapRevealBindProps<T extends HTMLElement = HTMLDivElement> {
  ref: React.RefObject<T | null> | { current: T | null };
  'data-open': 'true' | 'false';
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onFocus: (e: React.FocusEvent<HTMLElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
}

export interface TapRevealTriggerProps {
  type: 'button';
  'aria-pressed': boolean;
  onClick: () => void;
}

export interface TapRevealResult<T extends HTMLElement = HTMLDivElement> {
  open: boolean;
  bind: TapRevealBindProps<T>;
  trigger: TapRevealTriggerProps;
}

export declare function useTapReveal<T extends HTMLElement = HTMLDivElement>(options?: TapRevealOptions): TapRevealResult<T>;
