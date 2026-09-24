"use client";

import React, { useEffect, useRef } from "react";

/**
 * LiquidSilkBackground
 * Minimal integration wrapper for the authoritative Liquid Silk WebGL background.
 * Mounts the verbatim background in a fixed, non-blocking visual layer.
 */
export default function LiquidSilkBackground() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

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

  return (
    <iframe
      ref={iframeRef}
      id="liquid-silk-background"
      src="/liquid-silk.html"
      title="Liquid Silk Background"
      aria-hidden="true"
      tabIndex={-1}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none border-0 select-none"
      style={{
        zIndex: -10,
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
