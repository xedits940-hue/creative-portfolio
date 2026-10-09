"use client";

import React, { useEffect, useRef } from "react";
import "./sound-toggle.css";
import { useSoundContext } from "@/providers/sound-provider";

export default function SoundToggle() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isSoundActive, toggleSound } = useSoundContext();
  const setActiveRef = useRef<((nextActive: boolean) => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const toggleBtn = container.querySelector("#soundToggle") as HTMLButtonElement | null;
    const wavePath = container.querySelector("#wavePath") as SVGPathElement | null;
    if (!toggleBtn || !wavePath) return;

    const N = 7,
      CY = 24,
      X_START = 10,
      X_END = 38,
      AMP_MAX = 7;
    const BASE_SPEED = 0.0021;
    const TRANSITION_MS = 460;
    const REDUCED_TRANSITION_MS = 1;

    const weights: number[] = [],
      xPositions: number[] = [];
    for (let i = 0; i < N; i++) {
      weights.push(Math.sin((Math.PI * i) / (N - 1)));
      xPositions.push(X_START + (i * (X_END - X_START)) / (N - 1));
    }

    const reducedMotionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

    let currentActive = isSoundActive;
    let ampStart = 0;
    let ampTarget = isSoundActive ? 1 : 0;
    let ampStartTime = performance.now();
    let phase = 0;
    let lastFrameTime = performance.now();
    let rafId: number | null = null;

    function easeInOutCubic(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function transitionDuration() {
      return reducedMotionMQ.matches ? REDUCED_TRANSITION_MS : TRANSITION_MS;
    }

    function currentAmplitude(now: number) {
      const dur = transitionDuration();
      const t = Math.min(1, (now - ampStartTime) / dur);
      return ampStart + (ampTarget - ampStart) * easeInOutCubic(t);
    }

    function catmullRomToPath(pts: { x: number; y: number }[]) {
      let d = "M" + pts[0].x.toFixed(2) + "," + pts[0].y.toFixed(2);
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] || pts[i],
          p1 = pts[i],
          p2 = pts[i + 1],
          p3 = pts[i + 2] || p2;
        const c1x = p1.x + (p2.x - p0.x) / 6,
          c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6,
          c2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
      }
      return d;
    }

    function buildPathD(amp: number, ph: number) {
      const modulation = 0.85 + 0.15 * Math.sin(ph * 0.35);
      const pts: { x: number; y: number }[] = [];
      for (let i = 0; i < N; i++) {
        const w = weights[i];
        pts.push({
          x: xPositions[i],
          y: CY + amp * w * AMP_MAX * modulation * Math.sin(ph + i * 0.9),
        });
      }
      return catmullRomToPath(pts);
    }

    function tick(now: number) {
      const dt = now - lastFrameTime;
      lastFrameTime = now;
      if (!reducedMotionMQ.matches) phase += dt * BASE_SPEED;

      const amp = currentAmplitude(now);
      wavePath?.setAttribute("d", buildPathD(amp, phase));

      const dur = transitionDuration();
      const done = now - ampStartTime >= dur;
      const needsMotion = ampTarget === 1 && !reducedMotionMQ.matches;

      if (done && !needsMotion) {
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(tick);
    }

    function ensureLoop() {
      if (rafId === null) {
        lastFrameTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    }

    function setActive(nextActive: boolean) {
      currentActive = nextActive;
      const now = performance.now();
      ampStart = currentAmplitude(now);
      ampStartTime = now;
      ampTarget = nextActive ? 1 : 0;
      toggleBtn?.setAttribute("aria-pressed", String(nextActive));
      ensureLoop();
    }

    setActiveRef.current = setActive;

    function handleClick(e: MouseEvent) {
      e.preventDefault();
      e.stopPropagation();
      toggleSound();
    }

    toggleBtn.addEventListener("click", handleClick);

    function handleReducedMotionChange() {
      if (currentActive) ensureLoop();
    }
    if (typeof reducedMotionMQ.addEventListener === "function") {
      reducedMotionMQ.addEventListener("change", handleReducedMotionChange);
    } else if (typeof reducedMotionMQ.addListener === "function") {
      reducedMotionMQ.addListener(handleReducedMotionChange);
    }

    // Set initial visually
    toggleBtn.setAttribute("aria-pressed", String(isSoundActive));
    wavePath.setAttribute("d", buildPathD(isSoundActive ? 1 : 0, phase));
    if (isSoundActive) {
      ensureLoop();
    }

    return () => {
      toggleBtn.removeEventListener("click", handleClick);
      if (typeof reducedMotionMQ.removeEventListener === "function") {
        reducedMotionMQ.removeEventListener("change", handleReducedMotionChange);
      } else if (typeof reducedMotionMQ.removeListener === "function") {
        reducedMotionMQ.removeListener(handleReducedMotionChange);
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleSound]);

  // Sync external state changes (e.g. from the modal prompt)
  useEffect(() => {
    if (setActiveRef.current) {
      setActiveRef.current(isSoundActive);
    }
  }, [isSoundActive]);

  return (
    <div
      ref={containerRef}
      className="fixed top-4 left-3 sm:top-5 sm:left-4 md:left-5 z-[9999] pointer-events-auto"
      style={{ zIndex: 9999 }}
    >
      <button
        type="button"
        className="sound-toggle"
        id="soundToggle"
        aria-pressed={isSoundActive ? "true" : "false"}
        aria-label="Toggle sound"
      >
        <svg
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path id="wavePath" d="M10,24 L38,24" />
        </svg>
      </button>
    </div>
  );
}
