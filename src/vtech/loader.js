"use client";

/* eslint-disable @typescript-eslint/no-unused-expressions, @typescript-eslint/no-unused-vars */
// src/vtech/loader.js — smooth loader counter + coordinated reveal. No dependencies, works with any framework.
 
/** Shared motion constants. Use these numbers in ANY animation library (GSAP / Framer Motion / CSS). */
export const VT_MOTION = Object.freeze({
  revealMs: 1200,                       // curtain / curve rise (about 20% slower than a typical 1.0s)
  ease: 'cubic-bezier(.76,0,.24,1)',    // CSS / WAAPI string
  easeArray: [0.76, 0, 0.24, 1],        // Framer Motion: transition={{ duration: 1.2, ease: VT_MOTION.easeArray }}
  easeOut: 'cubic-bezier(.22,1,.36,1)',
  easeOutArray: [0.22, 1, 0.36, 1],
  logoDelayMs: 450,                     // logo starts at ~40% of the curve travel
  logoMs: 700,
  heroDelayMs: 540,                     // hero fades in under the rising curve (opacity only, NO translateY)
  heroMs: 600,
  holdAt100Ms: 120,                     // tiny hold so "100" is readable, then reveal starts
});
 
const prefersReduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
 
/**
 * REAL progress: counts critical things that must be ready (fonts, images, window load).
 * Never hangs: after timeoutMs it reports 100 anyway.
 * images = array of URLs that appear above the fold (logo, hero image...).
 */
export function trackAssets({ images = [], fonts = true, windowLoad = true, timeoutMs = 8000, onProgress = () => {} } = {}) {
  const tasks = [];
  if (fonts && typeof document !== 'undefined' && document.fonts && document.fonts.ready) tasks.push(document.fonts.ready);
  if (windowLoad && typeof document !== 'undefined') {
    tasks.push(document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((r) => window.addEventListener('load', r, { once: true })));
  }
  images.forEach((src) => tasks.push(new Promise((res) => {
    if (typeof Image === 'undefined') return res();
    const im = new Image();
    im.src = src;
    const p = im.decode ? im.decode() : new Promise((r) => { im.onload = im.onerror = r; });
    p.then(res, res); // success or failure both count as "done" — never block the site on one image
  })));
 
  return new Promise((resolve) => {
    let done = 0, finished = false;
    const total = Math.max(tasks.length, 1);
    const finish = () => { if (finished) return; finished = true; onProgress(100); resolve(); };
    if (!tasks.length) return finish();
    tasks.forEach((t) => Promise.resolve(t).then(() => {
      done += 1; onProgress((done / total) * 100); if (done >= total) finish();
    }, () => {
      done += 1; onProgress((done / total) * 100); if (done >= total) finish();
    }));
    setTimeout(finish, timeoutMs);
  });
}
 
/**
 * Smooth counter. You feed it a TARGET (0-100); it eases the DISPLAYED number toward it.
 *  - never jumps (speed limited by maxPointsPerSec), never goes backwards, always ends exactly on 100
 *  - set maxPointsPerSec: Infinity to remove the speed limit (counter may then look fast on fast networks)
 *  - creepTo: 0 = off (honest). e.g. 70 = the number slowly drifts up to 70 while real progress is slow.
 * render(value) -> set  bar.style.transform = `scaleX(${value/100})`  and  text.textContent = Math.round(value)
 */
export function createCounter({
  render = () => {},
  onDone = () => {},
  smoothingMs = 140,
  maxPointsPerSec = 140,
  creepTo = 0,
  creepPointsPerSec = 5,
  holdAt100Ms = VT_MOTION.holdAt100Ms,
} = {}) {
  let target = 0, shown = 0, last = null, raf = 0, stopped = false, finished = false;
  const raf_ = (cb) => (typeof requestAnimationFrame === 'function' ? requestAnimationFrame(cb) : setTimeout(() => cb(Date.now()), 16));
 
  function frame(now) {
    if (stopped) return;
    if (last === null) last = now;
    const dt = Math.min(Math.max(now - last, 0), 50); // clamp: coming back from a hidden tab must not cause a jump
    last = now;
    let goal = target;
    if (creepTo > 0 && goal < creepTo) goal = Math.max(goal, Math.min(creepTo, shown + (creepPointsPerSec * dt) / 1000));
    const sm = goal >= 100 ? smoothingMs * 0.5 : smoothingMs; // finish a little faster so it never lingers at 99
    let step = (goal - shown) * (1 - Math.exp(-dt / sm));
    const cap = (maxPointsPerSec * dt) / 1000;
    if (step > cap) step = cap;
    if (step > 0) shown = Math.min(100, shown + step);
    if (goal >= 100 && shown >= 99.5) shown = 100;
    render && render(shown);
    if (shown >= 100) {
      if (!finished) { finished = true; setTimeout(() => onDone && onDone(), holdAt100Ms); }
      return;
    }
    raf = raf_(frame);
  }
  raf = raf_(frame);
  return {
    setTarget(v) { target = Math.max(target, Math.min(100, Number(v) || 0)); }, // never goes down
    stop() { stopped = true; if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(raf); },
    get value() { return shown; },
  };
}
 
// WAAPI wrapper that degrades safely on old TV browsers (no .animate => jump to final state)
function animate(el, keyframes, options) {
  if (!el) return { done: Promise.resolve() };
  if (typeof el.animate !== 'function') {
    const last = keyframes[keyframes.length - 1];
    Object.keys(last).forEach((k) => { if (k !== 'offset' && k !== 'easing') el.style[k] = last[k]; });
    return { done: Promise.resolve() };
  }
  const a = el.animate(keyframes, options);
  return { done: new Promise((r) => { a.onfinish = r; a.oncancel = r; }) };
}
 
/**
 * ONE coordinated timeline. Elements you pass in:
 *  loader : the full-screen loader/curtain element (it moves UP and disappears)
 *  logo   : the logo that appears (optional)
 *  hero   : the hero wrapper (optional) — it is revealed by OPACITY only, from its final position
 * Call it when the counter hits 100 (createCounter onDone).
 */
export function playReveal({ loader, logo, hero, onStart, onDone } = {}) {
  const reduced = prefersReduced();
  const D = VT_MOTION;
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('vt-intro'); // unlocks hero + scrolling (see boot snippet)
  }
  onStart && onStart();
 
  if (hero) animate(hero, [{ opacity: 0 }, { opacity: 1 }], { duration: reduced ? 1 : D.heroMs, delay: reduced ? 0 : D.heroDelayMs, easing: D.easeOut, fill: 'both' });
  if (logo) animate(logo, [{ opacity: 0, transform: 'translate3d(0,12px,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }],
    { duration: reduced ? 1 : D.logoMs, delay: reduced ? 0 : D.logoDelayMs, easing: D.easeOut, fill: 'both' });
  const curtain = animate(loader, [{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(0,-110%,0)' }],
    { duration: reduced ? 1 : D.revealMs, easing: D.ease, fill: 'forwards' });
  curtain.done.then(() => { if (loader) loader.style.display = 'none'; onDone && onDone(); });
}
 
/** Decide if the intro should play. 'always' | 'once-per-session' */
export function shouldPlayIntro(mode = 'once-per-session') {
  if (mode === 'always') return true;
  try { return sessionStorage.getItem('vt:introSeen') !== '1'; } catch (e) { return true; }
}
export function markIntroSeen() { try { sessionStorage.setItem('vt:introSeen', '1'); } catch (e) {} }
