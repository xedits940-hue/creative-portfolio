"use client";

import React, { useEffect, useRef, type CSSProperties } from "react";

const DEFAULT_IMAGE =
  "/vtech-studios-logo.png";

type ColorMode = "mono" | "image";
type Fit = "cover" | "contain";

interface RevealOptions {
  size: number;
  softness: number;
}

const DEFAULTS = {
  fit: "cover" as Fit,
  focusY: 19,
  columns: 90,
  ramp: " .:-=+*#%@",
  invert: false,
  contrast: 21,
  colorMode: "mono" as ColorMode,
  inkColor: "#FFFFFF",
  reveal: true,
  revealOptions: { size: 80, softness: 16 } as RevealOptions,
};

const contrastAt = (value: number) => 0.5 + (value / 100) * 2;

const clampFocus = (value: number) =>
  Math.min(100, Math.max(0, typeof value === "number" ? value : 50));

function placeRect(
  imgW: number,
  imgH: number,
  boxW: number,
  boxH: number,
  fit: Fit,
  focusY: number
) {
  const scale =
    fit === "contain"
      ? Math.min(boxW / imgW, boxH / imgH)
      : Math.max(boxW / imgW, boxH / imgH);
  const dw = imgW * scale;
  const dh = imgH * scale;
  const f = fit === "cover" ? clampFocus(focusY) / 100 : 0.5;
  return { dx: (boxW - dw) / 2, dy: (boxH - dh) * f, dw, dh };
}

export interface AsciiImageProps {
  image?: { src: string; alt?: string } | string;
  fit?: Fit;
  focusY?: number;
  columns?: number;
  ramp?: string;
  invert?: boolean;
  contrast?: number;
  colorMode?: ColorMode;
  inkColor?: string;
  reveal?: boolean;
  revealOptions?: RevealOptions;
  style?: CSSProperties;
  className?: string;
}

export function AsciiReveal(props: AsciiImageProps) {
  const {
    image,
    fit = DEFAULTS.fit,
    focusY = DEFAULTS.focusY,
    columns = DEFAULTS.columns,
    ramp = DEFAULTS.ramp,
    invert = DEFAULTS.invert,
    contrast = DEFAULTS.contrast,
    colorMode = DEFAULTS.colorMode,
    inkColor = DEFAULTS.inkColor,
    reveal = DEFAULTS.reveal,
    revealOptions = DEFAULTS.revealOptions,
    style,
    className,
  } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offRef = useRef<HTMLCanvasElement | null>(null);
  const samplerRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const revealRef = useRef<HTMLCanvasElement | null>(null);
  const maskRef = useRef<HTMLCanvasElement | null>(null);
  const blobsRef = useRef<Array<{ x: number; y: number }>>([]);
  const seededRef = useRef(false);
  const pointer = useRef({ x: -9999, y: -9999, inside: false });

  const src =
    typeof image === "string"
      ? image
      : image?.src || DEFAULT_IMAGE;
  const revealSize = revealOptions?.size ?? DEFAULTS.revealOptions.size;
  const revealSoftness =
    revealOptions?.softness ?? DEFAULTS.revealOptions.softness;

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    const canvas = canvasEl;
    const ctx = context;

    const chars = ramp && ramp.length > 0 ? ramp : DEFAULTS.ramp;
    const punch = contrastAt(contrast);

    let raf = 0;
    let alive = true;
    let coverRect = { dx: 0, dy: 0, dw: 0, dh: 0 };

    const BLOB_COUNT = 5;
    blobsRef.current = Array.from({ length: BLOB_COUNT }, () => ({
      x: 0,
      y: 0,
    }));
    seededRef.current = false;

    function getSize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 400;
      const h = canvas.clientHeight || 400;
      return { w, h, dpr };
    }

    function buildAscii() {
      const img = imgRef.current;
      if (!img) return;
      const { w, h, dpr } = getSize();
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));

      const cols = Math.max(8, Math.round(columns));
      const cellW = (w * dpr) / cols;
      const fontPx = cellW * 1.7;
      const cellH = fontPx;
      const rows = Math.max(1, Math.floor((h * dpr) / cellH));

      let sampler = samplerRef.current;
      if (!sampler) {
        sampler = document.createElement("canvas");
        samplerRef.current = sampler;
      }
      sampler.width = cols;
      sampler.height = rows;
      const sctx = sampler.getContext("2d", { willReadFrequently: true });
      if (!sctx) return;

      const place = placeRect(
        img.width,
        img.height,
        canvas.width,
        canvas.height,
        fit,
        focusY
      );
      sctx.clearRect(0, 0, cols, rows);
      sctx.drawImage(
        img,
        place.dx / cellW,
        place.dy / cellH,
        place.dw / cellW,
        place.dh / cellH
      );

      let data: Uint8ClampedArray;
      try {
        data = sctx.getImageData(0, 0, cols, rows).data;
      } catch {
        imgRef.current = null;
        return;
      }

      let off = offRef.current;
      if (!off) {
        off = document.createElement("canvas");
        offRef.current = off;
      }
      off.width = canvas.width;
      off.height = canvas.height;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.clearRect(0, 0, off.width, off.height);
      octx.font = fontPx.toFixed(2) + "px ui-monospace, monospace";
      octx.textBaseline = "top";

      const last = chars.length - 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 4;
          const rr = data[i] ?? 0;
          const gg = data[i + 1] ?? 0;
          const bb = data[i + 2] ?? 0;
          let lum = (0.299 * rr + 0.587 * gg + 0.114 * bb) / 255;
          lum = (lum - 0.5) * punch + 0.5;
          if (invert) lum = 1 - lum;
          lum = lum < 0 ? 0 : lum > 1 ? 1 : lum;
          const ch = chars[Math.round(lum * last)] ?? " ";
          if (ch === " ") continue;
          octx.fillStyle =
            colorMode === "image"
              ? `rgb(${Math.min(255, rr + 30)}, ${Math.min(
                  255,
                  gg + 30
                )}, ${Math.min(255, bb + 30)})`
              : inkColor;
          octx.fillText(ch, c * cellW, r * cellH);
        }
      }

      coverRect = place;
    }

    function ensureLayer(ref: { current: HTMLCanvasElement | null }) {
      let layer = ref.current;
      if (!layer) {
        layer = document.createElement("canvas");
        ref.current = layer;
      }
      if (
        layer.width !== canvas.width ||
        layer.height !== canvas.height
      ) {
        layer.width = canvas.width;
        layer.height = canvas.height;
      }
      return layer;
    }

    function updateBlobs() {
      const blobs = blobsRef.current;
      if (blobs.length === 0) return;
      const { dpr } = getSize();
      const tx = pointer.current.x * dpr;
      const ty = pointer.current.y * dpr;
      if (!seededRef.current) {
        for (const blob of blobs) {
          blob.x = tx;
          blob.y = ty;
        }
        seededRef.current = true;
        return;
      }
      const head = blobs[0];
      if (head) {
        head.x += (tx - head.x) * 0.35;
        head.y += (ty - head.y) * 0.35;
      }
      for (let i = 1; i < blobs.length; i++) {
        const cur = blobs[i];
        const prev = blobs[i - 1];
        if (!cur || !prev) continue;
        cur.x += (prev.x - cur.x) * 0.35;
        cur.y += (prev.y - cur.y) * 0.35;
      }
    }

    function paint() {
      const off = offRef.current;
      if (!off) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(off, 0, 0);

      const img = imgRef.current;
      if (!reveal || !pointer.current.inside || !img) return;

      const { dpr } = getSize();
      const blobs = blobsRef.current;
      const photo = ensureLayer(revealRef);
      const pctx = photo.getContext("2d");
      const mask = ensureLayer(maskRef);
      const mctx = mask.getContext("2d");
      if (!pctx || !mctx) return;

      pctx.globalCompositeOperation = "source-over";
      pctx.clearRect(0, 0, photo.width, photo.height);
      pctx.drawImage(
        img,
        coverRect.dx,
        coverRect.dy,
        coverRect.dw,
        coverRect.dh
      );

      mctx.clearRect(0, 0, mask.width, mask.height);
      mctx.save();
      mctx.filter = `blur(${(revealSoftness * dpr).toFixed(1)}px)`;
      mctx.fillStyle = "#FFFFFF";
      for (let i = 0; i < blobs.length; i++) {
        const t = blobs.length <= 1 ? 0 : i / (blobs.length - 1);
        const radius = revealSize * dpr * (1 - t * 0.5);
        const blob = blobs[i];
        if (!blob) continue;
        mctx.beginPath();
        mctx.arc(blob.x, blob.y, radius, 0, Math.PI * 2);
        mctx.fill();
      }
      mctx.restore();

      pctx.globalCompositeOperation = "destination-in";
      pctx.drawImage(mask, 0, 0);
      pctx.globalCompositeOperation = "source-over";
      ctx.drawImage(photo, 0, 0);
    }

    function loop() {
      if (!alive) return;
      updateBlobs();
      paint();
      raf = requestAnimationFrame(loop);
    }

    function onMove(event: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      pointer.current.x = x;
      pointer.current.y = y;
      pointer.current.inside =
        x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
    }
    function onLeave() {
      pointer.current.inside = false;
      seededRef.current = false;
    }

    const img = new Image();
    if (src && src.startsWith("http") && !src.includes(window.location.host)) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => {
      if (!alive) return;
      imgRef.current = img;
      buildAscii();
      paint();
      if (reveal) raf = requestAnimationFrame(loop);
    };
    img.onerror = () => {
      // Always fallback to official studio logo if custom path fails
      if (img.src !== "/vtech-studios-logo.png" && !img.src.endsWith("/vtech-studios-logo.png")) {
        img.removeAttribute("crossorigin");
        img.src = "/vtech-studios-logo.png";
      }
    };
    if (src) img.src = src;

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        buildAscii();
        paint();
      });
      ro.observe(canvas);
    }
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [
    src,
    fit,
    focusY,
    columns,
    ramp,
    invert,
    contrast,
    colorMode,
    inkColor,
    reveal,
    revealSize,
    revealSoftness,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label={
        typeof image === "object"
          ? (image?.alt ?? "ASCII art")
          : "ASCII art"
      }
      style={{
        ...style,
        display: "block",
        width: "100%",
        height: "100%",
        cursor: reveal ? "crosshair" : "default",
      }}
    />
  );
}

export default AsciiReveal;
