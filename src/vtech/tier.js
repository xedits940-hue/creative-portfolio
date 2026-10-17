"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */
// src/vtech/tier.js — adaptive quality (tier 0 = lite, 1 = balanced, 2 = full). No dependencies.
// Sets <html data-tier="0|1|2"> and fires window event "vt:tier". Test any tier with ?tier=0 / ?tier=1 / ?tier=2
 
const KEY = 'vt:tier';
const TV_RE = /(SMART-?TV|SmartTV|Tizen|Web0S|WebOS|HbbTV|Android ?TV|GoogleTV|BRAVIA|CrKey|AFT[A-Z0-9]*|AppleTV|NetCast|VIDAA|Roku)/i;
const mq = (q) => typeof matchMedia === 'function' && matchMedia(q).matches;
 
export const canUseFineHover = () => mq('(hover: hover) and (pointer: fine)');
export const prefersReducedMotion = () => mq('(prefers-reduced-motion: reduce)');
 
export function readSignals() {
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const c = nav.connection || nav.mozConnection || nav.webkitConnection || {}; // Chromium only; may be missing
  return {
    reduced: prefersReducedMotion(),
    saveData: !!c.saveData,
    effectiveType: c.effectiveType || '',
    memory: nav.deviceMemory,               // Chromium only, capped at 8, may be undefined
    cores: nav.hardwareConcurrency || 0,
    tv: TV_RE.test(nav.userAgent || ''),
    coarse: mq('(pointer: coarse)'),
    noHover: mq('(hover: none)'),
  };
}
 
/** Pure function: signals in, tier out. Static hints only — measureFrames() corrects it later. */
export function pickTier(s = readSignals()) {
  if (s.reduced || s.saveData || /(^|-)2g$/.test(s.effectiveType)) return 0;
  if (s.tv) return 0;
  if ((s.memory && s.memory <= 2) || (s.cores && s.cores <= 2)) return 0;
  const touch = s.coarse || s.noHover;
  const strong = (!s.memory || s.memory >= 6) && (s.cores === 0 || s.cores >= 8);
  if (touch && !strong) return 1;
  if ((s.memory && s.memory <= 4) || (s.cores && s.cores <= 4)) return 1;
  return 2;
}
 
/** Median frame time (ms) while your intro/animations are running. null = could not measure. */
export function measureFrames({ frames = 75, skip = 5, maxMs = 3000 } = {}) {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame !== 'function') return resolve(null);
    const d = [];
    let last = 0, n = 0;
    const t0 = performance.now();
    function tick(t) {
      if (typeof document !== 'undefined' && document.hidden) return resolve(null);
      if (last) { if (n++ >= skip) d.push(t - last); }
      last = t;
      if (d.length >= frames || t - t0 > maxMs) {
        d.sort((a, b) => a - b);
        return resolve(d.length ? d[d.length >> 1] : null);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
 
/** Turns a measured median into a corrected tier. */
export function correctTier(tier, medianMs) {
  if (medianMs == null) return tier;
  if (medianMs > 33) return Math.max(0, tier - 2);  // under ~30 fps
  if (medianMs > 22) return Math.max(0, tier - 1);  // under ~45 fps
  return tier;
}
 
export function applyTier(tier) {
  document.documentElement.dataset.tier = String(tier);
  try { sessionStorage.setItem(KEY, String(tier)); } catch (e) {}
  window.dispatchEvent(new CustomEvent('vt:tier', { detail: { tier } }));
}
 
export function getTier() {
  const v = typeof document !== 'undefined' ? document.documentElement.dataset.tier : undefined;
  return v === '0' || v === '1' || v === '2' ? Number(v) : 1; // safe default if init has not run yet
}
 
/**
 * Call ONCE, as early as possible, at the same moment your intro/loader starts animating
 * (frame time is only meaningful while something is animating).
 */
export async function initTier() {
  const forced = new URLSearchParams(location.search).get('tier');
  if (forced === '0' || forced === '1' || forced === '2') { applyTier(Number(forced)); return Number(forced); }
  let cached = null;
  try { cached = sessionStorage.getItem(KEY); } catch (e) {}
  if (cached === '0' || cached === '1' || cached === '2') { applyTier(Number(cached)); return Number(cached); }
  let tier = pickTier();
  applyTier(tier);                       // static guess applies immediately (first paint)
  if (tier > 0) {
    const median = await measureFrames();
    const fixed = correctTier(tier, median);
    if (fixed !== tier) { tier = fixed; applyTier(tier); }
  }
  return tier;
}
 
/** Pause expensive loops (canvas / WebGL / rAF) when off-screen or when the tab is hidden. Returns a dispose fn. */
export function guardLoop(el, { start, stop }) {
  let visible = true, running = false;
  const update = () => {
    const should = visible && !document.hidden;
    if (should && !running) { running = true; start(); }
    else if (!should && running) { running = false; stop(); }
  };
  const io = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; update(); }, { threshold: 0.01 })
    : null;
  if (io) io.observe(el);
  document.addEventListener('visibilitychange', update);
  update();
  return () => { if (io) io.disconnect(); document.removeEventListener('visibilitychange', update); if (running) stop(); };
}
