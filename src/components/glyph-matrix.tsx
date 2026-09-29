"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface GlyphMatrixProps {
  glyphs?: string;
  cellSize?: number;
  mutationRate?: number;
  interval?: number;
  fadeBottom?: number;
  className?: string;
}

export function GlyphMatrix({
  glyphs = "01·•+*/\\<>=",
  cellSize = 14,
  mutationRate = 0.04,
  interval = 90,
  fadeBottom = 0.6,
  className,
}: GlyphMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cols = 0;
    let rows = 0;
    let grid: string[] = [];
    let alphas: number[] = [];
    let dpr = 1;
    let isVisible = true;
    let timer: number | null = null;

    const getThemeColor = () => {
      if (typeof document === "undefined") return "255, 255, 255";
      const root = document.documentElement;
      const isLight =
        root.classList.contains("light") ||
        root.getAttribute("data-theme") === "light";
      return isLight ? "15, 23, 42" : "255, 255, 255";
    };

    const randomGlyph = () =>
      glyphs[Math.floor(Math.random() * glyphs.length)] || "·";

    const initGrid = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      cols = Math.ceil(width / cellSize);
      rows = Math.ceil(height / cellSize);
      const total = cols * rows;

      grid = new Array(total);
      alphas = new Array(total);
      for (let i = 0; i < total; i++) {
        grid[i] = randomGlyph();
        alphas[i] = 0.08 + Math.random() * 0.24;
      }
    };

    const render = () => {
      if (!isVisible) return;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const rgb = getThemeColor();

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      ctx.font = `${Math.max(9, cellSize - 3)}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const fadeStartRow = Math.floor(rows * (1 - fadeBottom));

      for (let r = 0; r < rows; r++) {
        let rowFade = 1;
        if (fadeBottom > 0 && r >= fadeStartRow) {
          const progress = (r - fadeStartRow) / Math.max(1, rows - fadeStartRow);
          rowFade = Math.max(0, 1 - progress);
        }

        const y = r * cellSize + cellSize / 2;

        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const alpha = alphas[idx] * rowFade;
          if (alpha <= 0.01) continue;

          const x = c * cellSize + cellSize / 2;
          ctx.fillStyle = `rgba(${rgb}, ${alpha.toFixed(3)})`;
          ctx.fillText(grid[idx], x, y);
        }
      }

      ctx.restore();
    };

    initGrid();
    render();

    const startTimer = () => {
      if (timer !== null) return;
      timer = window.setInterval(() => {
        if (!isVisible) return;
        const total = grid.length;
        const mutations = Math.max(1, Math.floor(total * mutationRate));
        for (let m = 0; m < mutations; m++) {
          const idx = Math.floor(Math.random() * total);
          grid[idx] = randomGlyph();
          alphas[idx] = 0.08 + Math.random() * 0.26;
        }
        render();
      }, interval);
    };

    const stopTimer = () => {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    startTimer();

    // IntersectionObserver to pause rendering when out of viewport
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isVisible = entry.isIntersecting;
          if (isVisible) {
            render();
            startTimer();
          } else {
            stopTimer();
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(canvas);
    }

    const handleResize = () => {
      initGrid();
      render();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      stopTimer();
      if (observer) observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [glyphs, cellSize, mutationRate, interval, fadeBottom]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none block w-full h-full", className)}
    />
  );
}
