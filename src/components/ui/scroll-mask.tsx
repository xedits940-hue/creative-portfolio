"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useId,
  ReactNode,
} from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type ScrollMaskVariant =
  | "iris"
  | "wipe"
  | "curtain"
  | "slats"
  | "grid"
  | "type";

export interface ScrollMaskProps {
  /** Which mask geometry drives the reveal: iris | wipe | curtain | slats | grid | type */
  variant?: ScrollMaskVariant;
  /** Image revealed through the mask */
  src: string;
  /** Alternative text for image */
  alt?: string;
  /** Word carved out of the frame when using variant="type" */
  word?: string;
  /** Edge softness of the mask in pixels or percentage */
  feather?: number;
  /** Staggering between slats or grid tiles (0 to 1) */
  stagger?: number;
  /** Number of slats or grid columns (default 6) */
  columns?: number;
  /** Center X origin for iris (0 to 100, default 50) */
  originX?: number;
  /** Center Y origin for iris (0 to 100, default 50) */
  originY?: number;
  /** Angle for wipe in degrees (default 90) */
  angle?: number;
  /** Subtle zoom effect during reveal (e.g. 1.05 to 1) */
  zoom?: number;
  /** How image fills frame: cover | contain */
  fit?: "cover" | "contain";
  /** Border radius of frame */
  radius?: number | string;
  /** Dark overlay opacity behind/over the frame (0 to 1) */
  overlay?: number;
  /** Background color behind frame */
  background?: string;
  /** Whether to fade children in as reveal completes */
  revealContent?: boolean;
  /** Keep reveal steady instead of damping */
  calm?: boolean;
  /** Automatically animate reveal without user scroll (default true) */
  autoPlay?: boolean;
  /** Delay in milliseconds before auto reveal starts (default 2200ms ~ 2-3s) */
  autoPlayDelay?: number;
  /** Duration of programmatic reveal in milliseconds (default 2400ms) */
  autoPlayDuration?: number;
  /** Optional manual progress override (0 to 1) */
  progress?: number;
  /** Content rendered over the mask */
  children?: ReactNode;
  /** Additional container classes */
  className?: string;
}

export function ScrollMask({
  variant = "iris",
  src,
  alt = "Revealed content",
  word = "VTECH",
  feather = 20,
  stagger = 0.08,
  columns = 6,
  originX = 50,
  originY = 50,
  angle = 90,
  zoom = 1.06,
  fit = "cover",
  radius = 0,
  overlay = 0,
  background = "transparent",
  revealContent = true,
  autoPlay = true,
  autoPlayDelay = 150,
  autoPlayDuration = 1800,
  progress: externalProgress,
  children,
  className,
}: ScrollMaskProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const maskId = useId();

  // Internal animated progress (0 -> 1)
  const [internalProgress, setInternalProgress] = useState(0);
  const [hasSettled, setHasSettled] = useState(false);

  // Determine active progress value
  const progress =
    externalProgress !== undefined ? externalProgress : internalProgress;

  useEffect(() => {
    if (externalProgress !== undefined) return;
    if (!autoPlay) {
      setInternalProgress(1);
      setHasSettled(true);
      return;
    }

    // Check prefers-reduced-motion: if enabled, skip transition immediately
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInternalProgress(1);
      setHasSettled(true);
      return;
    }

    let animationFrameId: number;
    let startTime: number | null = null;

    // Wait initial delay (approximately 2–3 seconds after mount)
    const timeoutId = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const rawProgress = Math.min(elapsed / autoPlayDuration, 1);

        // Smooth cubic-bezier damping curve mimicking manual scroll deceleration
        // Equivalent to easeOutCubic: 1 - Math.pow(1 - t, 3)
        const easedProgress = 1 - Math.pow(1 - rawProgress, 3);

        setInternalProgress(easedProgress);

        if (rawProgress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          setInternalProgress(1);
          setHasSettled(true);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, autoPlayDelay);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [autoPlay, autoPlayDelay, autoPlayDuration, externalProgress]);

  // Compute CSS mask and clip-path based on variant and progress
  const getMaskStyle = (): React.CSSProperties => {
    const p = Math.max(0, Math.min(1, progress));

    switch (variant) {
      case "iris": {
        // Circular iris expanding outward from (originX, originY)
        // At p = 0: 0% radius, At p = 1: 150% radius to fully clear all corners
        const irisRadius = p * 150;
        const featherPx = Math.max(0, feather);
        if (featherPx > 0 && p < 0.99) {
          const mask = `radial-gradient(circle ${irisRadius}% at ${originX}% ${originY}%, black calc(${irisRadius}% - ${featherPx}px), transparent ${irisRadius}%)`;
          return {
            WebkitMaskImage: mask,
            maskImage: mask,
          };
        }
        return {
          clipPath: `circle(${irisRadius}% at ${originX}% ${originY}%)`,
        };
      }

      case "wipe": {
        // Angled linear sweep across frame
        const wipeEdge = p * (100 + feather) - feather / 2;
        const mask = `linear-gradient(${angle}deg, black ${Math.max(
          0,
          wipeEdge - feather
        )}%, transparent ${Math.min(100, wipeEdge + feather)}%)`;
        return {
          WebkitMaskImage: mask,
          maskImage: mask,
        };
      }

      case "curtain": {
        // Center split opening outward to left and right
        const openPercent = p * 50;
        const leftInset = 50 - openPercent;
        const rightInset = 50 - openPercent;
        return {
          clipPath: `inset(0% ${rightInset.toFixed(2)}% 0% ${leftInset.toFixed(
            2
          )}%)`,
        };
      }

      case "slats": {
        // Multiple horizontal/vertical slat apertures opening
        const slatWidth = 100 / Math.max(1, columns);
        // Build SVG or gradient slats with stagger
        const stops: string[] = [];
        for (let i = 0; i < columns; i++) {
          const slatProgress = Math.max(
            0,
            Math.min(1, (p - i * stagger) / (1 - (columns - 1) * stagger || 1))
          );
          const start = i * slatWidth;
          const openSize = (slatWidth * slatProgress) / 2;
          const center = start + slatWidth / 2;
          const openStart = Math.max(start, center - openSize);
          const openEnd = Math.min(start + slatWidth, center + openSize);

          stops.push(
            `transparent ${start.toFixed(2)}%`,
            `transparent ${openStart.toFixed(2)}%`,
            `black ${openStart.toFixed(2)}%`,
            `black ${openEnd.toFixed(2)}%`,
            `transparent ${openEnd.toFixed(2)}%`,
            `transparent ${(start + slatWidth).toFixed(2)}%`
          );
        }
        const mask = `linear-gradient(to right, ${stops.join(", ")})`;
        return {
          WebkitMaskImage: mask,
          maskImage: mask,
        };
      }

      case "grid": {
        // Handled via inner SVG mask for exact tile geometries
        return {
          WebkitMaskImage: `url(#${maskId}-grid)`,
          maskImage: `url(#${maskId}-grid)`,
        };
      }

      case "type": {
        // Handled via inner SVG typographic mask with expansion
        return {
          WebkitMaskImage: `url(#${maskId}-type)`,
          maskImage: `url(#${maskId}-type)`,
        };
      }

      default:
        return {};
    }
  };

  // Zoom calculation: subtle scale settling smoothly to 1.0 as progress reaches 1
  const imageScale = zoom - (zoom - 1) * progress;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden select-none",
        className
      )}
      style={{
        borderRadius: radius,
        backgroundColor: background,
      }}
    >
      {/* SVG Masks for Grid & Type variants */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          {variant === "grid" && (
            <mask id={`${maskId}-grid`} maskUnits="objectBoundingBox">
              <rect width="1" height="1" fill="black" />
              {Array.from({ length: 4 }).flatMap((_, row) =>
                Array.from({ length: columns }).map((_, col) => {
                  const tileIndex = row * columns + col;
                  const totalTiles = 4 * columns;
                  const tileStagger = stagger * 0.5;
                  const tileProgress = Math.max(
                    0,
                    Math.min(
                      1,
                      (progress - (tileIndex / totalTiles) * tileStagger) /
                        (1 - tileStagger || 1)
                    )
                  );
                  const w = 1 / columns;
                  const h = 1 / 4;
                  const x = col * w + (w * (1 - tileProgress)) / 2;
                  const y = row * h + (h * (1 - tileProgress)) / 2;
                  return (
                    <rect
                      key={`${row}-${col}`}
                      x={x}
                      y={y}
                      width={w * tileProgress}
                      height={h * tileProgress}
                      fill="white"
                    />
                  );
                })
              )}
            </mask>
          )}

          {variant === "type" && (
            <mask id={`${maskId}-type`} maskUnits="objectBoundingBox">
              <rect width="1" height="1" fill="black" />
              {/* As progress approaches 1, the typographic cutout expands until it fills the whole frame */}
              {progress < 0.95 ? (
                <text
                  x="0.5"
                  y="0.58"
                  textAnchor="middle"
                  fill="white"
                  fontSize={Math.max(0.18, 0.18 + progress * 2.2)}
                  fontWeight="900"
                  fontFamily="var(--font-anton, Anton, Impact, sans-serif)"
                  letterSpacing="0.08em"
                  style={{
                    transformOrigin: "center",
                  }}
                >
                  {word}
                </text>
              ) : (
                <rect width="1" height="1" fill="white" />
              )}
            </mask>
          )}
        </defs>
      </svg>

      {/* Background Frame Base */}
      <div className="absolute inset-0 bg-neutral-950 pointer-events-none" />

      {/* Masked Image Layer */}
      <div
        className="relative w-full h-full will-change-[mask-image,clip-path,transform]"
        style={getMaskStyle()}
      >
        <div
          className="relative w-full h-full transition-transform duration-100 ease-out will-change-transform"
          style={{
            transform: `scale(${imageScale.toFixed(4)})`,
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            className={cn(
              "w-full h-full",
              fit === "cover" ? "object-cover" : "object-contain"
            )}
            priority
          />
        </div>

        {/* Ambient Dark Overlay */}
        {overlay > 0 && (
          <div
            className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
            style={{ opacity: overlay }}
          />
        )}
      </div>

      {/* Children Content (smoothly reveals with progress or remains on top) */}
      {children && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 transition-opacity duration-700 pointer-events-auto"
          style={{
            opacity: revealContent ? Math.max(0.1, progress) : 1,
          }}
        >
          {children}
        </div>
      )}

      {/* Settled state subtle indicator or ambient border glow */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none border border-white/10 transition-colors duration-700"
        style={{
          borderColor: hasSettled
            ? "rgba(255, 255, 255, 0.18)"
            : "rgba(255, 255, 255, 0.08)",
        }}
      />
    </div>
  );
}

export default ScrollMask;
