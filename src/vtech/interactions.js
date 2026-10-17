"use client";

// src/vtech/interactions.js — hover on desktop, tap on phones, focus for keyboard. One hook, same markup.
import { useEffect, useRef, useState } from 'react';
import { canUseFineHover } from './tier.js';
 
/**
 * const { open, bind, trigger } = useTapReveal({ autoOnTouch: true });
 * <div className="vt-reveal" {...bind}>
 *   <button {...trigger}>Tap to switch view</button>
 *   ...your visuals; style them with  .vt-reveal[data-open="true"] { ... }
 * </div>
 * RULE: the interaction changes VISUALS only. Never hide information that only appears on hover.
 */
export function useTapReveal({ autoOnTouch = false, threshold = 0.6 } = {}) {
  const ref = useRef(null);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [auto, setAuto] = useState(false);
  const fine = canUseFineHover();
 
  useEffect(() => {
    if (!autoOnTouch || fine || !ref.current || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAuto(true); io.disconnect(); } }, { threshold });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [autoOnTouch, fine, threshold]);
 
  const open = pinned || hovered || focused || auto;
  const bind = {
    ref,
    'data-open': open ? 'true' : 'false',
    onPointerEnter: fine ? () => setHovered(true) : undefined,
    onPointerLeave: fine ? () => setHovered(false) : undefined,
    onFocus: (e) => { try { if (e.target.matches(':focus-visible')) setFocused(true); } catch { setFocused(true); } },
    onBlur: (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); },
    onKeyDown: (e) => { if (e.key === 'Escape') { setPinned(false); setHovered(false); setFocused(false); setAuto(false); } },
  };
  const trigger = { type: 'button', 'aria-pressed': pinned, onClick: () => setPinned((p) => !p) };
  return { open, bind, trigger };
}
