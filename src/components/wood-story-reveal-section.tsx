"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { GlyphMatrix } from "@/components/glyph-matrix";
import { TextAnimate } from "@/registry/magicui/text-animate";

const BG_IMAGE_1 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";

const BG_IMAGE_2 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";

const SPOTLIGHT_R = 260;

const TEXT_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 30,
    rotate: 45,
    scale: 0.5,
  },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      delay: i * 0.012,
      duration: 0.35,
      y: {
        type: "spring",
        damping: 12,
        stiffness: 200,
        mass: 0.8,
      },
      rotate: {
        type: "spring",
        damping: 8,
        stiffness: 150,
      },
      scale: {
        type: "spring",
        damping: 10,
        stiffness: 300,
      },
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: 30,
    rotate: 45,
    scale: 0.5,
    transition: {
      delay: i * 0.006,
      duration: 0.25,
    },
  }),
};

interface CutoutData {
  baseUrl: string;
  revealUrl: string;
  imgW: number;
  imgH: number;
  woodGrid: Uint8Array;
  gridW: number;
  gridH: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("SSR environment"));
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Flood-fills ONLY the exterior pure-black background from top and bottom borders
 * while preserving 100% of the wood branch from left edge to right edge,
 * including all dark charred bark crevices inside the wood silhouette.
 */
async function buildWoodCutout(): Promise<CutoutData | null> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return null;
  }
  try {
    const [img1, img2] = await Promise.all([
      loadImage(BG_IMAGE_1),
      loadImage(BG_IMAGE_2),
    ]);

    const w = img1.naturalWidth || 1280;
    const h = img1.naturalHeight || 724;

    const c1 = document.createElement("canvas");
    const c2 = document.createElement("canvas");
    c1.width = w;
    c1.height = h;
    c2.width = w;
    c2.height = h;

    const ctx1 = c1.getContext("2d");
    const ctx2 = c2.getContext("2d");
    if (!ctx1 || !ctx2) return null;

    ctx1.drawImage(img1, 0, 0, w, h);
    ctx2.drawImage(img2, 0, 0, w, h);

    const data1 = ctx1.getImageData(0, 0, w, h);
    const data2 = ctx2.getImageData(0, 0, w, h);
    const p1 = data1.data;
    const p2 = data2.data;

    const gridW = 320;
    const gridH = 180;
    const rawFg = new Uint8Array(gridW * gridH);

    for (let gy = 0; gy < gridH; gy++) {
      const y0 = Math.floor((gy / gridH) * h);
      const y1 = Math.max(y0 + 1, Math.floor(((gy + 1) / gridH) * h));
      for (let gx = 0; gx < gridW; gx++) {
        const x0 = Math.floor((gx / gridW) * w);
        const x1 = Math.max(x0 + 1, Math.floor(((gx + 1) / gridW) * w));

        let maxLum = 0;
        for (let y = y0; y < y1; y += 2) {
          for (let x = x0; x < x1; x += 2) {
            const idx = (y * w + x) * 4;
            const lum = Math.max(
              p1[idx],
              p1[idx + 1],
              p1[idx + 2],
              p2[idx],
              p2[idx + 1],
              p2[idx + 2]
            );
            if (lum > maxLum) maxLum = lum;
          }
        }
        if (maxLum > 5) {
          rawFg[gy * gridW + gx] = 1;
        }
      }
    }

    const dilatedFg = new Uint8Array(gridW * gridH);
    for (let gy = 0; gy < gridH; gy++) {
      for (let gx = 0; gx < gridW; gx++) {
        let found = 0;
        for (let dy = -2; dy <= 2 && !found; dy++) {
          const ny = gy + dy;
          if (ny < 0 || ny >= gridH) continue;
          for (let dx = -2; dx <= 2; dx++) {
            const nx = gx + dx;
            if (nx < 0 || nx >= gridW) continue;
            if (rawFg[ny * gridW + nx]) {
              found = 1;
              break;
            }
          }
        }
        dilatedFg[gy * gridW + gx] = found;
      }
    }

    const exteriorBg = new Uint8Array(gridW * gridH);
    const queue = new Int32Array(gridW * gridH);
    let head = 0;
    let tail = 0;

    for (let gx = 0; gx < gridW; gx++) {
      const topIdx = gx;
      if (!dilatedFg[topIdx]) {
        exteriorBg[topIdx] = 1;
        queue[tail++] = topIdx;
      }
      const botIdx = (gridH - 1) * gridW + gx;
      if (!dilatedFg[botIdx]) {
        exteriorBg[botIdx] = 1;
        queue[tail++] = botIdx;
      }
    }

    while (head < tail) {
      const curr = queue[head++];
      const cx = curr % gridW;
      const cy = (curr - cx) / gridW;

      const neighbors = [
        cy > 0 ? curr - gridW : -1,
        cy < gridH - 1 ? curr + gridW : -1,
        cx > 0 ? curr - 1 : -1,
        cx < gridW - 1 ? curr + 1 : -1,
      ];

      for (let i = 0; i < 4; i++) {
        const nIdx = neighbors[i];
        if (nIdx >= 0 && !exteriorBg[nIdx] && !dilatedFg[nIdx]) {
          exteriorBg[nIdx] = 1;
          queue[tail++] = nIdx;
        }
      }
    }

    const woodGrid = new Uint8Array(gridW * gridH);
    for (let gy = 0; gy < gridH; gy++) {
      for (let gx = 0; gx < gridW; gx++) {
        const gIdx = gy * gridW + gx;
        if (exteriorBg[gIdx]) continue;

        let nearExterior = false;
        for (let dy = -2; dy <= 2 && !nearExterior; dy++) {
          const ny = gy + dy;
          if (ny < 0 || ny >= gridH) continue;
          for (let dx = -2; dx <= 2; dx++) {
            const nx = gx + dx;
            if (nx < 0 || nx >= gridW) continue;
            if (exteriorBg[ny * gridW + nx]) {
              nearExterior = true;
              break;
            }
          }
        }
        woodGrid[gIdx] = nearExterior ? 2 : 1;
      }
    }

    for (let y = 0; y < h; y++) {
      const gy = Math.min(gridH - 1, Math.floor((y / h) * gridH));
      for (let x = 0; x < w; x++) {
        const gx = Math.min(gridW - 1, Math.floor((x / w) * gridW));
        const cellState = woodGrid[gy * gridW + gx];
        const idx = (y * w + x) * 4;

        if (cellState === 0) {
          p1[idx + 3] = 0;
          p2[idx + 3] = 0;
        } else if (cellState === 2) {
          const lum = Math.max(
            p1[idx],
            p1[idx + 1],
            p1[idx + 2],
            p2[idx],
            p2[idx + 1],
            p2[idx + 2]
          );
          const alpha = Math.max(0, Math.min(255, Math.round((lum - 2) * 16)));
          p1[idx + 3] = alpha;
          p2[idx + 3] = alpha;
        } else {
          p1[idx + 3] = 255;
          p2[idx + 3] = 255;
        }
      }
    }

    ctx1.putImageData(data1, 0, 0);
    ctx2.putImageData(data2, 0, 0);

    return {
      baseUrl: c1.toDataURL("image/png"),
      revealUrl: c2.toDataURL("image/png"),
      imgW: w,
      imgH: h,
      woodGrid,
      gridW,
      gridH,
    };
  } catch {
    return null;
  }
}

export interface WoodStoryRevealSectionProps {
  className?: string;
  style?: React.CSSProperties;
}

export function WoodStoryRevealSection({
  className,
  style,
}: WoodStoryRevealSectionProps) {
  const stageRef = useRef<HTMLElement | null>(null);
  const baseImageRef = useRef<HTMLDivElement | null>(null);
  const revealDivRef = useRef<HTMLDivElement | null>(null);

  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const targetRadiusRef = useRef(0);
  const currentRadiusRef = useRef(0);
  const hasInitializedPosition = useRef(false);
  const isOverWoodRef = useRef(false);
  const woodHoverTimer = useRef<NodeJS.Timeout | null>(null);
  const cutoutRef = useRef<CutoutData | null>(null);
  const rafRef = useRef<number>(0);

  // Text state management:
  // "idle": Cursor not on wood, neither text active.
  // "before": Cursor just entered wood, upper-left BEFORE text active.
  // "reveal": Cursor moving on wood and spotlight reveals, lower-right REVEAL text active.
  const [textState, setTextState] = useState<"idle" | "before" | "reveal">("idle");
  const [cutoutUrls, setCutoutUrls] = useState<{
    base: string;
    reveal: string;
    ready: boolean;
  }>({
    base: BG_IMAGE_1,
    reveal: BG_IMAGE_2,
    ready: false,
  });

  useEffect(() => {
    let mounted = true;
    buildWoodCutout().then((res) => {
      if (!mounted || !res) return;
      cutoutRef.current = res;
      setCutoutUrls({
        base: res.baseUrl,
        reveal: res.revealUrl,
        ready: true,
      });
    });
    return () => {
      mounted = false;
    };
  }, []);

  const checkPointOnWood = useCallback(
    (localX: number, localY: number, viewW: number, viewH: number): boolean => {
      if (viewW <= 0 || viewH <= 0) return false;
      if (localX < 0 || localX > viewW || localY < 0 || localY > viewH) {
        return false;
      }

      const cutout = cutoutRef.current;
      const imgW = cutout ? cutout.imgW : 1280;
      const imgH = cutout ? cutout.imgH : 724;

      const scale = Math.max(viewW / imgW, viewH / imgH);
      const renderedW = imgW * scale;
      const renderedH = imgH * scale;
      const offsetX = (viewW - renderedW) / 2;
      const offsetY = (viewH - renderedH) / 2;

      const nx = (localX - offsetX) / renderedW;
      const ny = (localY - offsetY) / renderedH;

      if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return false;

      if (cutout) {
        const { woodGrid, gridW, gridH } = cutout;
        const gx = Math.min(gridW - 1, Math.max(0, Math.floor(nx * gridW)));
        const gy = Math.min(gridH - 1, Math.max(0, Math.floor(ny * gridH)));
        return woodGrid[gy * gridW + gx] > 0;
      }

      // Proportional fallback silhouette: diagonal center line through image
      const centerY = 0.52 - (nx - 0.5) * 0.22;
      const halfThickness = 0.22;
      return Math.abs(ny - centerY) <= halfThickness;
    },
    []
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const getResponsiveRadius = () =>
      window.innerWidth < 640 ? 190 : SPOTLIGHT_R;

    const handlePointerAt = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;

      const onWood = checkPointOnWood(localX, localY, rect.width, rect.height);

      if (!hasInitializedPosition.current) {
        smooth.current.x = localX;
        smooth.current.y = localY;
        hasInitializedPosition.current = true;
      }

      mouse.current.x = localX;
      mouse.current.y = localY;

      if (onWood) {
        targetRadiusRef.current = getResponsiveRadius();

        if (!isOverWoodRef.current) {
          isOverWoodRef.current = true;
          // Step 1: Cursor enters wood -> BEFORE text is visible
          setTextState("before");

          if (woodHoverTimer.current) clearTimeout(woodHoverTimer.current);
          // Step 2: Smoothly transition to REVEAL text as cursor moves across wood
          woodHoverTimer.current = setTimeout(() => {
            if (isOverWoodRef.current) {
              setTextState("reveal");
            }
          }, 450);
        }
      } else {
        targetRadiusRef.current = 0;
        if (isOverWoodRef.current) {
          isOverWoodRef.current = false;
          if (woodHoverTimer.current) clearTimeout(woodHoverTimer.current);
          // Step 3: When cursor leaves wood -> active text smoothly fades away
          setTextState("idle");
        }
      }
    };

    const deactivate = () => {
      targetRadiusRef.current = 0;
      if (isOverWoodRef.current) {
        isOverWoodRef.current = false;
        if (woodHoverTimer.current) clearTimeout(woodHoverTimer.current);
        setTextState("idle");
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handlePointerAt(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      deactivate();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        handlePointerAt(t.clientX, t.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        handlePointerAt(t.clientX, t.clientY);
      }
    };

    const handleTouchEnd = () => {
      deactivate();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    stage.addEventListener("touchstart", handleTouchStart, { passive: true });
    stage.addEventListener("touchmove", handleTouchMove, { passive: true });
    stage.addEventListener("touchend", handleTouchEnd);

    let isSectionInView = true;
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          isSectionInView = entries[0]?.isIntersecting ?? true;
          if (isSectionInView && !rafRef.current) {
            rafRef.current = requestAnimationFrame(animate);
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(stage);
    }

    let stageWidth = stage.clientWidth || 1200;
    let stageHeight = stage.clientHeight || 700;

    const updateStageDimensions = () => {
      if (!stage) return;
      stageWidth = stage.clientWidth || 1200;
      stageHeight = stage.clientHeight || 700;
    };

    window.addEventListener("resize", updateStageDimensions, { passive: true });

    const animate = () => {
      if (!isSectionInView) {
        rafRef.current = 0;
        return;
      }

      const dx = mouse.current.x - smooth.current.x;
      const dy = mouse.current.y - smooth.current.y;
      const dist = Math.hypot(dx, dy);

      // Fast responsiveness: high lerp factor with slight distance acceleration
      const lerp = Math.min(0.85, 0.45 + dist * 0.009);
      smooth.current.x += dx * lerp;
      smooth.current.y += dy * lerp;

      const rDiff = targetRadiusRef.current - currentRadiusRef.current;
      const rLerp =
        targetRadiusRef.current > currentRadiusRef.current ? 0.35 : 0.28;
      currentRadiusRef.current += rDiff * rLerp;

      const maxR = getResponsiveRadius();
      const progress = Math.max(
        0,
        Math.min(1, currentRadiusRef.current / Math.max(1, maxR))
      );

      const normX =
        stageWidth > 0 ? (smooth.current.x / stageWidth - 0.5) * 2 : 0;
      const normY =
        stageHeight > 0 ? (smooth.current.y / stageHeight - 0.5) * 2 : 0;

      // Soft circular cursor-following mask matching exact stops:
      // 0 -> 1, 0.4 -> 1, 0.6 -> 0.75, 0.75 -> 0.4, 0.88 -> 0.12, 1 -> 0
      if (revealDivRef.current) {
        const r = Math.max(0, currentRadiusRef.current);
        const x = smooth.current.x.toFixed(1);
        const y = smooth.current.y.toFixed(1);
        const spotlightMask = `radial-gradient(circle ${r.toFixed(
          1
        )}px at ${x}px ${y}px, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.4) 75%, rgba(255,255,255,0.12) 88%, rgba(255,255,255,0) 100%)`;

        revealDivRef.current.style.maskImage = spotlightMask;
        revealDivRef.current.style.webkitMaskImage = spotlightMask;

        // Subtle, refined zoom / depth without distortion
        const revealScale = 1.05 - progress * 0.025;
        const shiftX = -normX * 5 * progress;
        const shiftY = -normY * 5 * progress;
        revealDivRef.current.style.transform = `translate3d(${shiftX.toFixed(
          2
        )}px, ${shiftY.toFixed(2)}px, 0) scale(${revealScale.toFixed(4)})`;
      }

      if (baseImageRef.current) {
        const baseScale = 1.01 + progress * 0.02;
        const baseShiftX = -normX * 2.5 * progress;
        const baseShiftY = -normY * 2.5 * progress;
        baseImageRef.current.style.transform = `translate3d(${baseShiftX.toFixed(
          2
        )}px, ${baseShiftY.toFixed(2)}px, 0) scale(${baseScale.toFixed(4)})`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("resize", updateStageDimensions);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      stage.removeEventListener("touchstart", handleTouchStart);
      stage.removeEventListener("touchmove", handleTouchMove);
      stage.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(rafRef.current);
      if (woodHoverTimer.current) clearTimeout(woodHoverTimer.current);
    };
  }, [checkPointOnWood]);

  return (
    <section
      ref={stageRef}
      className={`relative w-full overflow-hidden bg-neutral-950 select-none tracking-[-0.02em] ${className || ""}`}
      style={{
        minHeight: "520px",
        height: "72vh",
        maxHeight: "820px",
        ...style,
      }}
    >
      {/* 1. Main Background Image */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-0 pointer-events-none opacity-40 brightness-75 scale-105"
        style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
      />

      {/* 2. GlyphMatrix Atmospheric Background Layer */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        <GlyphMatrix
          glyphs="01·•+*/\<>="
          cellSize={14}
          mutationRate={0.04}
          interval={90}
          fadeBottom={0.6}
        />
      </div>

      {/* 3. Isolated Wood Cutout Foreground: Base State */}
      <div
        ref={baseImageRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 pointer-events-none will-change-transform"
        style={{
          backgroundImage: `url(${cutoutUrls.base})`,
          mixBlendMode: cutoutUrls.ready ? "normal" : "lighten",
        }}
      />

      {/* 4. Second Wood State (Revealed only through soft circular spotlight) */}
      <div
        ref={revealDivRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-20 pointer-events-none will-change-transform"
        style={{
          backgroundImage: `url(${cutoutUrls.reveal})`,
          mixBlendMode: cutoutUrls.ready ? "normal" : "lighten",
          maskImage:
            "radial-gradient(circle 0px at -999px -999px, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(circle 0px at -999px -999px, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      />

      {/* Subtle vignette border gradient */}
      <div className="absolute inset-0 pointer-events-none z-30 bg-radial from-transparent via-transparent to-black/70" />

      {/* 5. Upper-Left BEFORE Text:
          Activates when cursor enters the wood; smoothly transitions out when moving to reveal */}
      <div
        className={`absolute top-6 left-6 sm:top-10 sm:left-10 md:top-12 md:left-12 z-40 max-w-sm sm:max-w-md pointer-events-none transition-opacity duration-300 ease-out ${
          textState === "before" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <TextAnimate
          animate={textState === "before" ? "show" : "exit"}
          startOnView={false}
          className="font-stranger text-white/90 text-xs sm:text-sm md:text-base font-light uppercase tracking-[0.22em] sm:tracking-[0.26em] leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
          segmentClassName="font-stranger"
          variants={TEXT_VARIANTS}
          by="character"
        >
          THEY LEFT ME WITH REASONS TO STOP.
        </TextAnimate>
      </div>

      {/* 6. Lower-Right REVEAL Text:
          Appears as cursor explores the reveal area of the wood */}
      <div
        className={`absolute bottom-6 right-6 sm:bottom-10 sm:right-10 md:bottom-12 md:right-12 z-40 max-w-sm sm:max-w-md text-right pointer-events-none transition-opacity duration-300 ease-out ${
          textState === "reveal" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <TextAnimate
          animate={textState === "reveal" ? "show" : "exit"}
          startOnView={false}
          className="font-stranger text-white text-xs sm:text-sm md:text-base font-normal uppercase tracking-[0.22em] sm:tracking-[0.26em] leading-relaxed drop-shadow-[0_2px_14px_rgba(0,0,0,0.98)]"
          segmentClassName="font-stranger"
          variants={TEXT_VARIANTS}
          by="character"
        >
          I TURNED THEM INTO REASONS TO CONTINUE.
        </TextAnimate>
      </div>
    </section>
  );
}

export default WoodStoryRevealSection;
