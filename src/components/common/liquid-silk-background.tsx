"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useBackground } from "@/providers/background-provider";

export default function LiquidSilkBackground() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { isVideo } = useBackground();

  // Forward pointer coordinates to the liquid silk WebGL canvas safely
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      try {
        const iframeWin = iframeRef.current?.contentWindow;
        if (iframeWin) {
          iframeWin.dispatchEvent(
            new PointerEvent("pointermove", {
              clientX: e.clientX,
              clientY: e.clientY,
              bubbles: true,
            })
          );
        }
      } catch {
        // Safe cross-context fallback
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // Ensure video auto-plays reliably when switched to video mode
  useEffect(() => {
    if (isVideo && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Auto-play policy handled cleanly
        });
      }
    }
  }, [isVideo]);

  return (
    <div
      id="app-background-container"
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0 bg-[#050505]"
      style={{ zIndex: 0 }}
    >
      {/* 1. Red Interactive WebGL Liquid Silk Layer */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={{
          opacity: isVideo ? 0 : 1,
          scale: isVideo ? 0.98 : 1,
        }}
        transition={{
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{
          pointerEvents: isVideo ? "none" : "auto",
        }}
      >
        <iframe
          ref={iframeRef}
          id="liquid-silk-background"
          src="/liquid-silk.html"
          title="Liquid Silk WebGL Background"
          aria-hidden="true"
          tabIndex={-1}
          className="w-full h-full border-0 pointer-events-none select-none"
        />
      </motion.div>

      {/* 2. Default Cinematic Black Video Background Layer */}
      <motion.div
        key="cinematic-video-bg"
        animate={{
          opacity: isVideo ? 1 : 0,
          scale: isVideo ? 1 : 1.02,
        }}
        transition={{
          duration: 0.8,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          pointerEvents: "none",
        }}
      >
        <video
          ref={videoRef}
          src="/hf_20260423_084718_72a17915-4964-4059-afcd-22d59399b72e.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center"
          style={{
            filter: "contrast(1.08) brightness(0.92)",
          }}
        >
          <source src="/hf_20260423_084718_72a17915-4964-4059-afcd-22d59399b72e.mp4" type="video/mp4" />
          <source src="/background-video.mp4" type="video/mp4" />
        </video>

        {/* Subtle cinematic gradient vignette to keep foreground typography crisp and legible */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, transparent 40%, rgba(5, 5, 5, 0.7) 85%, #050505 100%)",
          }}
        />
      </motion.div>

      {/* Subtle fine film grain overlay for cinematic texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}
