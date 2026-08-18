"use client";

import React, { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/WhatsApp%20Video%202026-08-18%20at%208.19.40%20PM.mp4";

export default function CinematicStartGate() {
  const entryRef = useRef<HTMLDivElement | null>(null);
  const gateRef = useRef<HTMLButtonElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activated, setActivated] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [videoVisible, setVideoVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("vs-lock-scroll");
    document.body.classList.add("vs-lock-scroll");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleOpen();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.documentElement.classList.remove("vs-lock-scroll");
      document.body.classList.remove("vs-lock-scroll");
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!gateRef.current) return;
    const rect = gateRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    gateRef.current.style.setProperty("--mx", `${x}%`);
    gateRef.current.style.setProperty("--my", `${y}%`);
  };

  const handlePointerLeave = () => {
    if (!gateRef.current) return;
    gateRef.current.style.setProperty("--mx", "50%");
    gateRef.current.style.setProperty("--my", "50%");
  };

  const handleOpen = async () => {
    if (activated) return;

    setActivated(true);
    setVideoVisible(true);

    const entry = entryRef.current;
    const video = videoRef.current;

    entry?.classList.add("is-opening");
    window.dispatchEvent(
      new CustomEvent("vishal:start-intro", {
        detail: { source: "cinematic-start-gate" },
      }),
    );

    if (video) {
      video.currentTime = 0;
      video.muted = !soundOn;
      video.volume = 1;

      try {
        await video.play();
      } catch (error) {
        console.warn("Video playback could not start.", error);
      }
    }
  };

  const handleVideoEnded = () => {
    const entry = entryRef.current;
    const video = videoRef.current;

    entry?.classList.add("is-gone");
    video?.pause();

    window.dispatchEvent(
      new CustomEvent("vishal:cinematic-complete", {
        detail: { source: "cinematic-intro-video" },
      }),
    );

    setTimeout(() => {
      setVideoVisible(false);
      document.documentElement.classList.remove("vs-lock-scroll");
      document.body.classList.remove("vs-lock-scroll");

      const main = document.getElementById("main") || document.querySelector("main");
      if (main instanceof HTMLElement) {
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      }
    }, 750);
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);

    if (videoRef.current) {
      videoRef.current.muted = !next;
      if (!next) {
        videoRef.current.volume = 1;
      }
    }
  };

  return (
    <>
      <style jsx global>{`
        html.vs-lock-scroll,
        body.vs-lock-scroll {
          overflow: hidden;
          height: 100%;
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
            radial-gradient(circle at 50% 55%, rgba(179, 19, 46, 0.22), transparent 34%),
            radial-gradient(circle at 20% 84%, rgba(179, 19, 46, 0.07), transparent 34%),
            radial-gradient(circle at 82% 16%, rgba(255, 45, 71, 0.05), transparent 36%),
            #050505;
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
            visibility 0.7s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }

        .vs-entry.is-gone {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: scale(1.045);
        }

        .vs-entry::before {
          content: "";
          position: absolute;
          inset: -20%;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 50% 50%, rgba(255, 45, 71, 0.14), transparent 22%),
            radial-gradient(circle at 50% 50%, rgba(179, 19, 46, 0.18), transparent 38%);
          filter: blur(28px);
          opacity: 0.65;
          animation: vsAmbient 6s ease-in-out infinite;
        }

        @keyframes vsAmbient {
          0%, 100% { transform: scale(0.92); opacity: 0.42; }
          50% { transform: scale(1.06); opacity: 0.78; }
        }

        .vs-entry::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          background: radial-gradient(circle at center, transparent 32%, rgba(0,0,0,0.34) 67%, rgba(0,0,0,0.9) 100%);
        }

        .vs-entry__grain {
          position: absolute;
          inset: -50%;
          z-index: 3;
          pointer-events: none;
          opacity: 0.045;
          background-image: repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 3px);
          transform: rotate(8deg);
        }

        .vs-entry__grid {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          opacity: 0.05;
          background-image:
            linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px);
          background-size: 82px 82px;
          mask-image: radial-gradient(circle at center, black 0%, transparent 72%);
        }

        .vs-entry__flash {
          position: absolute;
          inset: 0;
          z-index: 40;
          pointer-events: none;
          opacity: 0;
          background:
            radial-gradient(circle at center,
              rgba(255, 90, 110, 0.5) 0%,
              rgba(255, 45, 71, 0.36) 28%,
              rgba(179, 19, 46, 0.2) 52%,
              transparent 74%);
          mix-blend-mode: screen;
        }

        .vs-entry.is-opening .vs-entry__flash {
          animation: vsEntryFlash 0.78s cubic-bezier(0.76, 0, 0.24, 1) both;
        }

        @keyframes vsEntryFlash {
          0% { opacity: 0; transform: scale(0.6); }
          24% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.5); }
        }

        .vs-sound {
          position: absolute;
          top: 22px;
          right: 24px;
          z-index: 30;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(243, 238, 232, 0.14);
          border-radius: 50%;
          color: rgba(243, 238, 232, 0.55);
          cursor: pointer;
          transition: border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 0;
          animation: vsFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
        }

        .vs-sound:hover {
          border-color: rgba(255,45,71,0.5);
          color: #ff2d47;
          transform: scale(1.06);
        }

        .vs-sound svg { width: 15px; height: 15px; }

        @keyframes vsFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .vs-gate {
          --mx: 50%;
          --my: 50%;
          position: relative;
          z-index: 20;
          width: min(420px, 88vw);
          height: 232px;
          padding: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          transform-style: preserve-3d;
          will-change: transform, opacity, filter;
          animation: vsGateIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes vsGateIn {
          from { opacity: 0; transform: translateY(22px) scale(0.96); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        .vs-gate__aura {
          position: absolute;
          inset: -80px;
          z-index: -2;
          pointer-events: none;
          background:
            radial-gradient(circle at center, rgba(255,45,71,0.2), transparent 34%),
            radial-gradient(circle at center, rgba(179,19,46,0.18), transparent 52%);
          filter: blur(24px);
          opacity: 0.68;
          transform: scale(0.9);
          animation: vsGateAura 4.8s ease-in-out infinite;
        }

        @keyframes vsGateAura {
          0%, 100% { opacity: 0.4; transform: scale(0.88); }
          50% { opacity: 0.85; transform: scale(1.04); }
        }

        .vs-gate__surface {
          position: absolute;
          inset: 0;
          display: block;
          overflow: hidden;
          border-radius: 2px;
          border: 1px solid rgba(255,45,71,0.28);
          background:
            radial-gradient(280px circle at var(--mx) var(--my), rgba(255,45,71,0.14), transparent 48%),
            linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.01)),
            rgba(8,8,8,0.64);
          box-shadow:
            0 0 0 1px rgba(179,19,46,0.05),
            0 26px 100px rgba(0,0,0,0.64),
            0 0 90px rgba(179,19,46,0.24),
            inset 0 0 46px rgba(255,45,71,0.035);
          backdrop-filter: blur(16px) saturate(1.1);
          transition: border-color 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1);
        }

        .vs-gate__surface::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(90deg, transparent, rgba(255,45,71,0.18), transparent);
          transform: translateX(-120%);
          opacity: 0;
        }

        .vs-gate:hover .vs-gate__surface::before { animation: vsSurfaceSweep 1.1s cubic-bezier(0.76,0,0.24,1) both; }

        @keyframes vsSurfaceSweep {
          0% { opacity: 0; transform: translateX(-120%); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translateX(120%); }
        }

        .vs-gate:hover .vs-gate__surface {
          border-color: rgba(255,45,71,0.55);
          box-shadow:
            0 0 0 1px rgba(179,19,46,0.1),
            0 30px 120px rgba(0,0,0,0.68),
            0 0 130px rgba(179,19,46,0.38),
            inset 0 0 54px rgba(255,45,71,0.05);
          transform: translateY(-3px);
        }

        .vs-gate:focus-visible .vs-gate__surface {
          outline: 1px solid rgba(255,45,71,0.75);
          outline-offset: 8px;
        }

        .vs-gate__badge {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 6;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,45,71,0.42);
          background: radial-gradient(circle at 32% 30%, rgba(179,19,46,0.22), rgba(0,0,0,0.4));
          box-shadow: 0 0 18px rgba(179,19,46,0.3), inset 0 0 10px rgba(255,45,71,0.15);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.03em;
          color: #ff2d47;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1);
        }

        .vs-gate:hover .vs-gate__badge {
          transform: rotate(10deg) scale(1.06);
          box-shadow: 0 0 26px rgba(179,19,46,0.44), inset 0 0 12px rgba(255,45,71,0.22);
        }

        .vs-gate__status {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 6;
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(243,238,232,0.48);
        }

        .vs-gate__dot {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: #ff2d47;
          box-shadow: 0 0 10px rgba(255,45,71,0.9), 0 0 24px rgba(179,19,46,0.6);
          animation: vsDot 2.4s ease-in-out infinite;
        }

        @keyframes vsDot {
          0%,100% { transform: scale(0.7); opacity: 0.55; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        .vs-gate__title {
          position: absolute;
          left: 50%;
          top: 46%;
          z-index: 6;
          transform: translate(-50%, -50%);
          width: 100%;
          text-align: center;
          font-family: "Playfair Display", Georgia, serif;
          font-style: italic;
          font-weight: 600;
          font-size: clamp(27px, 6.2vw, 36px);
          letter-spacing: 0.008em;
          background: linear-gradient(180deg, #ffffff 5%, #f3eee8 42%, #ff2d47 130%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 22px rgba(255,45,71,0.22));
          transition: filter 0.4s cubic-bezier(0.16,1,0.3,1);
        }

        .vs-gate:hover .vs-gate__title { filter: drop-shadow(0 0 32px rgba(255,45,71,0.36)); }

        .vs-gate__rule {
          position: absolute;
          left: 50%;
          top: calc(46% + 28px);
          z-index: 6;
          width: 46px;
          height: 1px;
          transform: translateX(-50%);
          background: linear-gradient(90deg, transparent, rgba(255,45,71,0.85), transparent);
          box-shadow: 0 0 10px rgba(179,19,46,0.55);
          transition: width 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.45s cubic-bezier(0.16,1,0.3,1);
        }

        .vs-gate:hover .vs-gate__rule { width: 74px; }

        .vs-gate__seam {
          position: absolute;
          left: 50%;
          top: 28px;
          bottom: 28px;
          z-index: 1;
          width: 1px;
          transform: translateX(-50%);
          opacity: 0.3;
          background: linear-gradient(to bottom, transparent, rgba(179,19,46,0.3), rgba(255,45,71,0.78), rgba(179,19,46,0.3), transparent);
          animation: vsSeam 3.4s ease-in-out infinite;
        }

        @keyframes vsSeam {
          0%,100% { opacity: 0.22; transform: translateX(-50%) scaleY(0.7); }
          50% { opacity: 0.55; transform: translateX(-50%) scaleY(1.05); }
        }

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
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(255,45,71,0.82);
        }

        .vs-gate__arrow {
          display: inline-block;
          transition: transform 0.4s cubic-bezier(0.76,0,0.24,1);
        }

        .vs-gate:hover .vs-gate__arrow { transform: translateX(5px); }

        .vs-preview {
          position: absolute;
          inset: 62px 34px 56px;
          z-index: 2;
          display: block;
          opacity: 0.28;
          transform: scale(0.98);
          transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1);
        }

        .vs-gate:hover .vs-preview { opacity: 0.48; transform: scale(1.01); }

        .vs-preview__nav { position: absolute; top: 0; left: 0; right: 0; display: flex; justify-content: space-between; }
        .vs-preview__nav i { display: block; width: 44px; height: 1px; background: rgba(243,238,232,0.3); }

        .vs-entry.is-opening .vs-gate {
          pointer-events: none;
          animation: vsGateOpen 0.78s cubic-bezier(0.76,0,0.24,1) both;
        }

        @keyframes vsGateOpen {
          0% { opacity: 1; transform: scale(1); }
          30% { opacity: 1; transform: scale(1.045); }
          100% { opacity: 0; transform: scale(0.94); }
        }

        .vs-entry.is-opening .vs-gate__seam { animation: vsSeamOpen 0.68s cubic-bezier(0.76,0,0.24,1) both; }

        @keyframes vsSeamOpen {
          0% { opacity: 0.3; transform: translateX(-50%) scaleY(1); width: 1px; }
          40% { opacity: 0.8; transform: translateX(-50%) scaleY(1.3); width: 2px; }
          100% { opacity: 0; transform: translateX(-50%) scaleY(4.5); width: 2px; }
        }

        .vs-entry.is-opening .vs-gate__surface {
          border-color: rgba(255,45,71,0.75);
          box-shadow:
            0 0 0 1px rgba(255,45,71,0.2),
            0 0 100px rgba(179,19,46,0.4),
            inset 0 0 60px rgba(255,45,71,0.12);
        }

        .vs-entry.is-opening .vs-sound { opacity: 0; pointer-events: none; }

        .vs-video {
          position: fixed;
          inset: 0;
          z-index: 10000;
          width: 100vw;
          height: 100vh;
          display: block;
          object-fit: cover;
          background: #000;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.25s ease;
          will-change: opacity;
        }

        .vs-video.is-visible { opacity: 1; }

        .vs-video.is-hidden { opacity: 0; visibility: hidden; }

        @media (prefers-reduced-motion: reduce) {
          .vs-entry,
          .vs-entry *,
          .vs-gate,
          .vs-gate * {
            animation-duration: 0.001s !important;
            transition-duration: 0.2s !important;
          }
        }

        @media (max-width: 560px) {
          .vs-gate { width: min(340px, 88vw); height: 202px; }
          .vs-gate__title { font-size: 26px; }
          .vs-gate__status,
          .vs-gate__footer { font-size: 7.5px; }
          .vs-preview { inset: 54px 26px 50px; }
          .vs-sound { top: 14px; right: 14px; width: 34px; height: 34px; }
        }
      `}</style>

      <video
        ref={videoRef}
        className={`vs-video ${videoVisible ? "is-visible" : "is-hidden"}`}
        src={VIDEO_SRC}
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        aria-hidden={!videoVisible}
      />

      <div
        ref={entryRef}
        className={`vs-entry ${activated ? "is-opening" : ""}`}
        role="dialog"
        aria-label="Portfolio intro screen"
      >
        <div className="vs-entry__grain" />
        <div className="vs-entry__grid" />
        <div className="vs-entry__flash" />

        <button
          className="vs-sound"
          type="button"
          aria-pressed={soundOn}
          aria-label={soundOn ? "Mute intro video" : "Unmute intro video"}
          onClick={toggleSound}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 9v6h4l5 5V4L8 9H4z" />
            {soundOn ? (
              <>
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18 6a9 9 0 0 1 0 12" />
              </>
            ) : (
              <>
                <line x1="16" y1="9" x2="21" y2="15" />
                <line x1="21" y1="9" x2="16" y2="15" />
              </>
            )}
          </svg>
        </button>

        <button
          ref={gateRef}
          className="vs-gate"
          type="button"
          aria-label="Enter Vishal Sharma portfolio"
          onClick={handleOpen}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <span className="vs-gate__aura" aria-hidden="true" />

          <span className="vs-gate__surface">
            <span className="vs-gate__badge">VS</span>

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

            <span className="vs-gate__title">Vishal Sharma</span>
            <span className="vs-gate__rule" aria-hidden="true" />

            <span className="vs-gate__footer">
              <span>Enter Portfolio</span>
              <span className="vs-gate__arrow" aria-hidden="true">→</span>
            </span>
          </span>
        </button>
      </div>
    </>
  );
}
