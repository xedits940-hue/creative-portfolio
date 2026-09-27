"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import Preloader from "./preloader";

/**
 * CinematicStartGate & Intro Sequence
 *
 * Flow:
 * 1. Website opens → NEW 0–100 loader immediately active with multilingual greetings
 *    and bottom-right percentage counter.
 * 2. Center VTECH STUDIO logo appears during loading with ambient crimson pulse.
 * 3. On 100% completion: Floating logo smoothly glides/docks into the navbar logo's
 *    intended position using the reference 2.0s cubic-bezier(.16, 1, .3, 1) transition.
 * 4. Preloader exits smoothly with curved slide-up; floating logo settles seamlessly into navbar.
 * 5. Main VTECH STUDIO website is revealed with all 3D effects, cards, text, and interactions intact.
 */
export default function CinematicStartGate() {
  const entryRef = useRef<HTMLDivElement | null>(null);
  const gateRef = useRef<HTMLButtonElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Flow: Website opens → NEW 0–100 loader → VTECH logo intro animation → intro finishes → website appears
  const [phase, setPhase] = useState<"loading" | "gate" | "done">("loading");
  const [showPreloader, setShowPreloader] = useState(true);
  const [isDocked, setIsDocked] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [activated, setActivated] = useState(false);
  const transitionStartedRef = useRef(false);

  const [logoCoords, setLogoCoords] = useState<{
    left: string;
    top: string;
    width: string;
    height: string;
    transform: string;
  }>({
    left: "50%",
    top: "calc(50% - 24px)",
    width: "76px",
    height: "76px",
    transform: "translate(-50%, -50%)",
  });

  // Support ?gate=1 if manual gate is explicitly tested
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("gate") === "1") {
        setPhase("gate");
      }
    }
  }, []);

  // Lock scroll while on gate or loading
  useEffect(() => {
    if (phase !== "done") {
      document.documentElement.classList.add("vs-lock-scroll");
      document.body.classList.add("vs-lock-scroll");
    } else {
      document.documentElement.classList.remove("vs-lock-scroll");
      document.body.classList.remove("vs-lock-scroll");
    }

    return () => {
      document.documentElement.classList.remove("vs-lock-scroll");
      document.body.classList.remove("vs-lock-scroll");
    };
  }, [phase]);

  // Handle click on the card to open and proceed to 0→100 loading
  const handleOpen = useCallback(() => {
    if (transitionStartedRef.current || phase !== "gate") return;
    transitionStartedRef.current = true;
    setActivated(true);

    window.dispatchEvent(
      new CustomEvent("vishal:start-intro", {
        detail: { source: "cinematic-start-gate" },
      })
    );

    setTimeout(() => {
      try {
        videoRef.current?.pause();
      } catch {
        // ignore
      }
      setPhase("loading");
    }, 450);
  }, [phase]);

  const handleSkip = () => {
    if (transitionStartedRef.current || phase !== "gate") return;
    transitionStartedRef.current = true;
    try {
      videoRef.current?.pause();
    } catch {
      // ignore
    }
    setPhase("loading");
  };

  // Preloader finished (0→100 done):
  // 1. Floating logo smoothly glides/docks into the navbar position (2s cubic-bezier(.16, 1, .3, 1))
  // 2. Preloader executes its curved slide-up exit
  // 3. Intro finishes after 2000ms, seamlessly revealing the full website
  const handlePreloaderComplete = useCallback(() => {
    setShowPreloader(false);
    setIsDocked(true);

    const navLogo =
      document.getElementById("navbar-logo-container") ||
      document.getElementById("navbar-logo-img");

    if (navLogo) {
      const rect = navLogo.getBoundingClientRect();
      setLogoCoords({
        left: `${rect.left + rect.width / 2}px`,
        top: `${rect.top + rect.height / 2}px`,
        width: `${Math.max(38, rect.width)}px`,
        height: `${Math.max(38, rect.height)}px`,
        transform: "translate(-50%, -50%)",
      });
    } else {
      setLogoCoords({
        left: "50%",
        top: "56px",
        width: "48px",
        height: "48px",
        transform: "translate(-50%, -50%)",
      });
    }

    setTimeout(() => {
      setIsSettled(true);
      setPhase("done");
      document.documentElement.classList.remove("vs-lock-scroll");
      document.body.classList.remove("vs-lock-scroll");
      document.body.classList.add("preload-complete", "intro-ready");

      window.dispatchEvent(
        new CustomEvent("vishal:cinematic-complete", {
          detail: { source: "cinematic-start-gate" },
        })
      );

      setTimeout(() => {
        const main =
          document.getElementById("main") || document.querySelector("main");
        if (main instanceof HTMLElement) {
          main.setAttribute("tabindex", "-1");
          main.focus({ preventScroll: true });
        }
      }, 300);
    }, 2000);
  }, []);

  // Keyboard accessibility on gate
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (phase === "gate") {
        if (
          event.key === "Escape" ||
          event.key === "Enter" ||
          event.key === " "
        ) {
          handleOpen();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [phase, handleOpen]);

  // High-precision 3D tilt tracking that follows mouse movement smoothly
  const handlePointerMove = (
    event: React.PointerEvent<HTMLElement> | React.MouseEvent<HTMLElement>
  ) => {
    if (!gateRef.current) return;
    const rect = gateRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = event.clientX - centerX;
    const mouseY = event.clientY - centerY;

    const normX = mouseX / (rect.width / 2);
    const normY = mouseY / (rect.height / 2);

    const clampedX = Math.max(-1.5, Math.min(1.5, normX));
    const clampedY = Math.max(-1.5, Math.min(1.5, normY));

    // Smooth tilt angles
    const maxTilt = 12;
    const rotY = clampedX * maxTilt;
    const rotX = -clampedY * maxTilt;

    gateRef.current.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;

    // Specular light coordinates
    const mx = ((event.clientX - rect.left) / rect.width) * 100;
    const my = ((event.clientY - rect.top) / rect.height) * 100;
    gateRef.current.style.setProperty(
      "--mx",
      `${Math.max(0, Math.min(100, mx)).toFixed(1)}%`
    );
    gateRef.current.style.setProperty(
      "--my",
      `${Math.max(0, Math.min(100, my)).toFixed(1)}%`
    );
  };

  const handlePointerLeave = () => {
    if (!gateRef.current) return;
    gateRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    gateRef.current.style.setProperty("--mx", "50%");
    gateRef.current.style.setProperty("--my", "50%");
  };

  return (
    <>
      <style jsx global>{`
        html.vs-lock-scroll,
        body.vs-lock-scroll {
          overflow: hidden !important;
          height: 100% !important;
        }

        .vs-entry {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: grid;
          place-items: center;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(
              circle at 50% 55%,
              rgba(179, 19, 46, 0.22),
              transparent 34%
            ),
            radial-gradient(
              circle at 20% 84%,
              rgba(179, 19, 46, 0.07),
              transparent 34%
            ),
            radial-gradient(
              circle at 82% 16%,
              rgba(255, 45, 71, 0.05),
              transparent 36%
            ),
            #050505;
          transition:
            opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            visibility 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }

        .vs-gate-bg-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
          pointer-events: none;
          opacity: 0.58;
          filter: saturate(1.15) contrast(1.1);
          transform: scale(1.02);
          will-change: transform;
        }

        .vs-entry__video-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(5, 5, 5, 0.3) 0%,
              rgba(5, 5, 5, 0.65) 60%,
              #050505 100%
            ),
            linear-gradient(
              180deg,
              rgba(5, 5, 5, 0.45) 0%,
              transparent 35%,
              transparent 65%,
              rgba(5, 5, 5, 0.75) 100%
            );
        }

        .vs-entry::before {
          content: "";
          position: absolute;
          inset: -20%;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(255, 45, 71, 0.14),
              transparent 22%
            ),
            radial-gradient(
              circle at 50% 50%,
              rgba(179, 19, 46, 0.18),
              transparent 38%
            );
          filter: blur(28px);
          opacity: 0.65;
          animation: vsAmbient 6s ease-in-out infinite;
        }

        @keyframes vsAmbient {
          0%,
          100% {
            transform: scale(0.92);
            opacity: 0.42;
          }
          50% {
            transform: scale(1.06);
            opacity: 0.78;
          }
        }

        .vs-entry::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          background: radial-gradient(
            circle at center,
            transparent 32%,
            rgba(0, 0, 0, 0.34) 67%,
            rgba(0, 0, 0, 0.9) 100%
          );
        }

        .vs-entry__grain {
          position: absolute;
          inset: -50%;
          z-index: 3;
          pointer-events: none;
          opacity: 0.045;
          background-image: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.12) 0px,
            rgba(255, 255, 255, 0.12) 1px,
            transparent 1px,
            transparent 3px
          );
          transform: rotate(8deg);
        }

        .vs-entry__grid {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          opacity: 0.05;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
          background-size: 82px 82px;
          mask-image: radial-gradient(
            circle at center,
            black 0%,
            transparent 72%
          );
        }

        .vs-entry__flash {
          position: absolute;
          inset: 0;
          z-index: 40;
          pointer-events: none;
          opacity: 0;
          background: radial-gradient(
            circle at center,
            rgba(255, 90, 110, 0.5) 0%,
            rgba(255, 45, 71, 0.36) 28%,
            rgba(179, 19, 46, 0.2) 52%,
            transparent 74%
          );
          mix-blend-mode: screen;
        }

        .vs-entry.is-opening .vs-entry__flash {
          animation: vsEntryFlash 0.78s cubic-bezier(0.76, 0, 0.24, 1) both;
        }

        @keyframes vsEntryFlash {
          0% {
            opacity: 0;
            transform: scale(0.6);
          }
          24% {
            opacity: 0.8;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.5);
          }
        }

        /* 3D Perspective Card Wrapper */
        .vs-gate-wrap {
          position: relative;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
          animation: vsGateIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes vsGateIn {
          from {
            opacity: 0;
            transform: translateY(22px) scale(0.96);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        /* Center Card Element */
        .vs-gate {
          --mx: 50%;
          --my: 50%;
          position: relative;
          z-index: 20;
          width: min(420px, 88vw);
          height: 232px;
          padding: 2px;
          border: 0;
          outline: 0;
          border-radius: 6px;
          background: transparent;
          color: inherit;
          cursor: pointer;
          transform-style: preserve-3d;
          will-change: transform;
          transition: transform 0.15s cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .vs-gate:not(:hover) {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vs-gate__aura {
          position: absolute;
          inset: -80px;
          z-index: -2;
          pointer-events: none;
          background:
            radial-gradient(
              circle at center,
              rgba(255, 45, 71, 0.2),
              transparent 34%
            ),
            radial-gradient(
              circle at center,
              rgba(179, 19, 46, 0.18),
              transparent 52%
            );
          filter: blur(24px);
          opacity: 0.68;
          transform: scale(0.9);
          animation: vsGateAura 4.8s ease-in-out infinite;
        }

        @keyframes vsGateAura {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.88);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.04);
          }
        }

        /* EXACT PREMIUM CORNER/BORDER WHITE SHIMMER (Matching user screenshot: small, soft, elegant white glint) */
        .vs-card-border-beam {
          position: absolute;
          inset: 0;
          border-radius: 6px;
          padding: 1.5px;
          pointer-events: none;
          z-index: 10;
          overflow: hidden;
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
        }

        .vs-card-beam-light {
          position: absolute;
          width: 65px;
          height: 65px;
          offset-anchor: 50% 50%;
          offset-path: rect(0 auto auto 0 round 6px);
          animation: vsCardBeamOrbit 4s linear infinite;
          background: radial-gradient(
            circle at center,
            #ffffff 0%,
            rgba(255, 255, 255, 0.95) 25%,
            rgba(255, 255, 255, 0.45) 50%,
            transparent 75%
          );
          filter: drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 8px rgba(255, 255, 255, 0.9));
          will-change: offset-distance;
        }

        @keyframes vsCardBeamOrbit {
          0% {
            offset-distance: 0%;
          }
          100% {
            offset-distance: 100%;
          }
        }

        @supports not (offset-path: rect(0 auto auto 0 round 6px)) {
          .vs-card-beam-light {
            position: absolute;
            top: -100%;
            left: -100%;
            width: 300%;
            height: 300%;
            background: conic-gradient(
              from 0deg,
              transparent 0deg,
              transparent 346deg,
              rgba(255, 255, 255, 0.5) 354deg,
              #ffffff 357deg,
              rgba(255, 255, 255, 0.5) 360deg
            );
            animation: vsCardBeamFallback 4s linear infinite;
          }

          @keyframes vsCardBeamFallback {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        }

        /* CARD MAIN SURFACE (Inside 2px Shimmer Border, Covers Interior) */
        .vs-gate__surface {
          position: absolute;
          inset: 2px;
          z-index: 2;
          display: block;
          overflow: hidden;
          border-radius: 4px;
          background:
            radial-gradient(
              280px circle at var(--mx) var(--my),
              rgba(255, 45, 71, 0.16),
              transparent 48%
            ),
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.055),
              rgba(255, 255, 255, 0.01)
            ),
            #080808;
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.1),
            0 26px 100px rgba(0, 0, 0, 0.72),
            0 0 90px rgba(179, 19, 46, 0.24),
            inset 0 0 46px rgba(255, 45, 71, 0.035);
          backdrop-filter: blur(16px) saturate(1.1);
          transform-style: preserve-3d;
          transition:
            box-shadow 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vs-gate__surface::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 45, 71, 0.18),
            transparent
          );
          transform: translateX(-120%);
          opacity: 0;
        }

        .vs-gate:hover .vs-gate__surface::before {
          animation: vsSurfaceSweep 1.1s cubic-bezier(0.76, 0, 0.24, 1) both;
        }

        @keyframes vsSurfaceSweep {
          0% {
            opacity: 0;
            transform: translateX(-120%);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(120%);
          }
        }

        .vs-gate:hover .vs-gate__surface {
          box-shadow:
            0 0 0 1px rgba(255, 45, 71, 0.3),
            0 30px 120px rgba(0, 0, 0, 0.68),
            0 0 130px rgba(179, 19, 46, 0.38),
            inset 0 0 54px rgba(255, 45, 71, 0.05);
        }

        .vs-gate:focus-visible .vs-gate__surface {
          outline: 1px solid rgba(255, 45, 71, 0.75);
          outline-offset: 8px;
        }

        /* CARD CONTENT: STABLE, CORRECTLY ALIGNED, WITH PARALLAX Z-DEPTH */
        .vs-gate__badge {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 6;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 45, 71, 0.42);
          background: radial-gradient(
            circle at 32% 30%,
            rgba(179, 19, 46, 0.22),
            rgba(0, 0, 0, 0.4)
          );
          box-shadow:
            0 0 18px rgba(179, 19, 46, 0.3),
            inset 0 0 10px rgba(255, 45, 71, 0.15);
          font-family:
            var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco,
            Consolas, monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.03em;
          color: #ff2d47;
          transform: translateZ(26px);
          pointer-events: none;
          transition:
            transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vs-gate:hover .vs-gate__badge {
          box-shadow:
            0 0 26px rgba(179, 19, 46, 0.44),
            inset 0 0 12px rgba(255, 45, 71, 0.22);
        }

        .vs-gate__status {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 6;
          display: flex;
          align-items: center;
          gap: 7px;
          font-family:
            var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco,
            Consolas, monospace;
          font-size: 8.5px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(243, 238, 232, 0.6);
          transform: translateZ(20px);
          pointer-events: none;
        }

        .vs-gate__dot {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: #ff2d47;
          box-shadow:
            0 0 10px rgba(255, 45, 71, 0.9),
            0 0 24px rgba(179, 19, 46, 0.6);
          animation: vsDot 2.4s ease-in-out infinite;
        }

        @keyframes vsDot {
          0%,
          100% {
            transform: scale(0.7);
            opacity: 0.55;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }

        .vs-gate__title {
          position: absolute;
          left: 50%;
          top: 46%;
          z-index: 6;
          transform: translate(-50%, -50%) translateZ(32px);
          width: 100%;
          text-align: center;
          pointer-events: none;
          font-family:
            var(--font-accent), "Playfair Display", Georgia, serif;
          font-style: italic;
          font-weight: 600;
          font-size: clamp(27px, 6.2vw, 36px);
          letter-spacing: 0.008em;
          background: linear-gradient(
            180deg,
            #ffffff 5%,
            #f3eee8 42%,
            #ff2d47 130%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 22px rgba(255, 45, 71, 0.22));
          transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vs-gate:hover .vs-gate__title {
          filter: drop-shadow(0 0 32px rgba(255, 45, 71, 0.36));
        }

        .vs-gate__rule {
          position: absolute;
          left: 50%;
          top: calc(46% + 28px);
          z-index: 6;
          width: 46px;
          height: 1px;
          transform: translateX(-50%) translateZ(26px);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 45, 71, 0.85),
            transparent
          );
          box-shadow: 0 0 10px rgba(179, 19, 46, 0.55);
          pointer-events: none;
          transition:
            width 0.45s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vs-gate:hover .vs-gate__rule {
          width: 74px;
        }

        .vs-gate__seam {
          position: absolute;
          left: 50%;
          top: 28px;
          bottom: 28px;
          z-index: 1;
          width: 1px;
          transform: translateX(-50%) translateZ(12px);
          opacity: 0.3;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(179, 19, 46, 0.3),
            rgba(255, 45, 71, 0.78),
            rgba(179, 19, 46, 0.3),
            transparent
          );
          animation: vsSeam 3.4s ease-in-out infinite;
        }

        @keyframes vsSeam {
          0%,
          100% {
            opacity: 0.22;
            transform: translateX(-50%) scaleY(0.7) translateZ(12px);
          }
          50% {
            opacity: 0.55;
            transform: translateX(-50%) scaleY(1.05) translateZ(12px);
          }
        }

        /* ENTER STUDIO BUTTON/TEXT: ORIGINAL POSITION, ALIGNMENT & SIZE */
        .vs-gate__footer {
          position: absolute;
          left: 22px;
          right: 22px;
          bottom: 20px;
          z-index: 6;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          font-family:
            var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco,
            Consolas, monospace;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(255, 45, 71, 0.88);
          transform: translateZ(24px);
          pointer-events: none;
        }

        .vs-gate__arrow {
          display: inline-block;
          transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1);
        }

        .vs-gate:hover .vs-gate__arrow {
          transform: translateX(5px);
        }

        .vs-preview {
          position: absolute;
          inset: 62px 34px 56px;
          z-index: 2;
          display: block;
          opacity: 0.28;
          transform: scale(0.98) translateZ(10px);
          pointer-events: none;
          transition:
            opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vs-gate:hover .vs-preview {
          opacity: 0.48;
          transform: scale(1.01) translateZ(10px);
        }

        .vs-preview__nav {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-between;
        }
        .vs-preview__nav i {
          display: block;
          width: 44px;
          height: 1px;
          background: rgba(243, 238, 232, 0.3);
        }

        .vs-entry.is-opening .vs-gate {
          pointer-events: none;
          animation: vsGateOpen 0.78s cubic-bezier(0.76, 0, 0.24, 1) both;
        }

        @keyframes vsGateOpen {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          30% {
            opacity: 1;
            transform: scale(1.045);
          }
          100% {
            opacity: 0;
            transform: scale(0.94);
          }
        }

        .vs-entry.is-opening .vs-gate__seam {
          animation: vsSeamOpen 0.68s cubic-bezier(0.76, 0, 0.24, 1) both;
        }

        @keyframes vsSeamOpen {
          0% {
            opacity: 0.3;
            transform: translateX(-50%) scaleY(1);
            width: 1px;
          }
          40% {
            opacity: 0.8;
            transform: translateX(-50%) scaleY(1.3);
            width: 2px;
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) scaleY(4.5);
            width: 2px;
          }
        }

        .vs-entry.is-opening .vs-gate__surface {
          border-color: rgba(255, 45, 71, 0.75);
          box-shadow:
            0 0 0 1px rgba(255, 45, 71, 0.2),
            0 0 100px rgba(179, 19, 46, 0.4),
            inset 0 0 60px rgba(255, 45, 71, 0.12);
        }

        @media (prefers-reduced-motion: reduce) {
          .vs-entry,
          .vs-entry *,
          .vs-gate,
          .vs-gate * {
            animation-duration: 0.001s !important;
            transition-duration: 0.2s !important;
          }
        }

        .vs-skip-button {
          position: absolute;
          bottom: 28px;
          z-index: 60;
          font-family:
            var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco,
            Consolas, monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.75);
          background: rgba(15, 15, 15, 0.85);
          border: 1px solid rgba(255, 45, 71, 0.4);
          padding: 8px 18px;
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.25s ease;
          backdrop-filter: blur(12px);
        }
        .vs-skip-button:hover {
          color: #ffffff;
          border-color: #ff2d47;
          background: rgba(255, 45, 71, 0.25);
          transform: translateY(-2px);
        }

        @media (max-width: 560px) {
          .vs-gate {
            width: min(340px, 88vw);
            height: 202px;
          }
          .vs-gate__title {
            font-size: 26px;
          }
          .vs-gate__status,
          .vs-gate__footer {
            font-size: 7.5px;
          }
          .vs-preview {
            inset: 54px 26px 50px;
          }
          .vs-skip-button {
            bottom: 18px;
            font-size: 9.5px;
            padding: 6px 14px;
          }
        }

        /* Floating VTECH Studio Logo (Planet Jumping Intro Behavior) */
        .vs-floating-logo {
          position: fixed;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          user-select: none;
          will-change: left, top, width, height, transform, filter, opacity;
          transition:
            left 2s cubic-bezier(0.16, 1, 0.3, 1),
            top 2s cubic-bezier(0.16, 1, 0.3, 1),
            width 2s cubic-bezier(0.16, 1, 0.3, 1),
            height 2s cubic-bezier(0.16, 1, 0.3, 1),
            transform 2s cubic-bezier(0.16, 1, 0.3, 1),
            filter 2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vs-floating-logo.is-loading-pulse {
          filter: drop-shadow(0 0 32px rgba(225, 29, 42, 0.55));
          animation: vsLogoPulse 3s ease-in-out infinite;
        }

        .vs-floating-logo.is-docked {
          filter: drop-shadow(0 0 8px rgba(225, 29, 42, 0.25));
          animation: none;
        }

        .vs-floating-logo.is-settled {
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        /* Hide static navbar logo until floating logo has docked and settled */
        body:not(.preload-complete) #navbar-logo-container {
          opacity: 0;
        }
        body.preload-complete #navbar-logo-container {
          opacity: 1;
          transition: opacity 0.35s ease;
        }

        @keyframes vsLogoPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            filter: drop-shadow(0 0 26px rgba(225, 29, 42, 0.45));
          }
          50% {
            transform: translate(-50%, -50%) scale(1.05);
            filter: drop-shadow(0 0 42px rgba(225, 29, 42, 0.7));
          }
        }
      `}</style>

      {/* VTECH FLOATING INTRO LOGO (Reference Planet Jumping behavior) */}
      {!isSettled && (
        <div
          id="vtech-floating-logo"
          className={`vs-floating-logo ${isDocked ? "is-docked" : "is-loading-pulse"}`}
          style={{
            left: logoCoords.left,
            top: logoCoords.top,
            width: logoCoords.width,
            height: logoCoords.height,
            transform: logoCoords.transform,
          }}
          aria-hidden="true"
        >
          <Image
            src="/vtech-studios-logo.png"
            alt="VTECH STUDIOS"
            width={96}
            height={96}
            priority
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain pointer-events-none select-none"
          />
        </div>
      )}

      {/* STAGE 1: FIRST SCREEN CENTER CARD WITH VIDEO BACKGROUND (Shown if ?gate=1) */}
      {phase === "gate" && (
        <div
          ref={entryRef}
          className={`vs-entry ${activated ? "is-opening" : ""}`}
          role="dialog"
          aria-label="Portfolio intro screen"
          onMouseMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
        >
          {/* Background video playing strictly inside the first screen card area */}
          <video
            ref={videoRef}
            className="vs-gate-bg-video"
            src="/VID-20260924-WA0001.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <div className="vs-entry__video-overlay" />
          <div className="vs-entry__grain" />
          <div className="vs-entry__grid" />
          <div className="vs-entry__flash" />

          {/* 3D Perspective Card Wrapper */}
          <div className="vs-gate-wrap">
            <button
              ref={gateRef}
              className="vs-gate"
              type="button"
              data-magnetic
              aria-label="Enter VTECH STUDIOS portfolio"
              onClick={handleOpen}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
            >
              {/* Crimson ambient aura behind card */}
              <span className="vs-gate__aura" aria-hidden="true" />

              {/* Exact White Corner/Border Shimmer (matching user screenshot) */}
              <div className="vs-card-border-beam" aria-hidden="true">
                <div className="vs-card-beam-light" />
              </div>

              {/* Card surface: covers interior, housing stable 3D content */}
              <span className="vs-gate__surface">
                <span className="vs-gate__badge">VTECH</span>

                <span className="vs-gate__status">
                  <span className="vs-gate__dot" />
                  Chandigarh, India
                </span>

                <span className="vs-preview" aria-hidden="true">
                  <span className="vs-preview__nav">
                    <i />
                    <i />
                    <i />
                  </span>
                </span>

                <span className="vs-gate__seam" aria-hidden="true" />

                <span className="vs-gate__title">VTECH STUDIOS</span>
                <span className="vs-gate__rule" aria-hidden="true" />

                {/* Original ENTER STUDIO text/button in exact position and alignment */}
                <span className="vs-gate__footer">
                  <span>Enter Studio</span>
                  <span className="vs-gate__arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </span>
            </button>
          </div>

          <button
            className="vs-skip-button"
            type="button"
            data-magnetic
            onClick={handleSkip}
            aria-label="Direct Access / Skip Intro"
          >
            Direct Access / Skip Intro →
          </button>
        </div>
      )}

      {/* STAGE 2: 0→100 PRELOADER SEQUENCE */}
      <AnimatePresence mode="wait">
        {showPreloader && phase === "loading" && (
          <Preloader
            key="gate-preloader"
            onComplete={handlePreloaderComplete}
          />
        )}
      </AnimatePresence>
    </>
  );
}
