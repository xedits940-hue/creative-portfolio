"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// Local 47-frame sequence.
// Files are stored directly inside /public as:
// frame_01.jpg ... frame_47.jpg
function buildImageUrl(index: number): string {
  const frameNumber = String(index + 1).padStart(2, "0");
  return `/frame_${frameNumber}.jpg`;
}

const aboutSectionImages = Array.from({ length: 47 }, (_, i) => ({
  index: i,
}));

const IMAGE_DURATION = 5;
const TEXT_DURATION = 2;

const redColor = "oklch(59.71% 0.23 23.86)";

const AboutScrollSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef({ value: 0 });

  useEffect(() => {
    let cancelled = false;

    const loadImages = async () => {
      const promises = aboutSectionImages.map((img, index) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new window.Image();

          image.src = buildImageUrl(img.index);

          image.onload = async () => {
            try {
              if ("decode" in image) {
                await image.decode();
              }
            } catch {
              // The image can still be used if decode fails.
            }

            if (!cancelled) {
              imagesRef.current[index] = image;
            }

            resolve(image);
          };

          image.onerror = () => {
            reject(
              new Error(`Failed to load frame: ${buildImageUrl(img.index)}`),
            );
          };
        });
      });

      try {
        await Promise.all(promises);

        if (!cancelled) {
          setImagesLoaded(true);
        }
      } catch (error) {
        console.error("Error loading 47-frame sequence:", error);
      }
    };

    loadImages();

    return () => {
      cancelled = true;
    };
  }, []);

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const safeIndex = Math.max(
      0,
      Math.min(index, imagesRef.current.length - 1),
    );

    const img = imagesRef.current[safeIndex];

    if (!img) return;

    if (canvas.width !== window.innerWidth) {
      canvas.width = window.innerWidth;
    }

    if (canvas.height !== window.innerHeight) {
      canvas.height = window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;

    let drawWidth: number;
    let drawHeight: number;
    let drawX: number;
    let drawY: number;

    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      drawX = 0;
      drawY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      drawX = (canvas.width - drawWidth) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
  };

  useGSAP(
    () => {
      if (
        !imagesLoaded ||
        !sectionRef.current ||
        !canvasRef.current ||
        !pinWrapperRef.current ||
        !textRef.current
      ) {
        return;
      }

      renderFrame(0);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: pinWrapperRef.current,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        frameIndexRef.current,
        {
          value: aboutSectionImages.length - 1,
          ease: "none",
          duration: IMAGE_DURATION,
          onUpdate: () => {
            renderFrame(Math.round(frameIndexRef.current.value));
          },
        },
        0,
      );

      const scrollHint =
        pinWrapperRef.current.querySelector<HTMLElement>(
          "[data-scroll-hint]",
        );

      if (scrollHint) {
        const lastFrame = aboutSectionImages.length - 1;

        const frameToTime = (frame: number) =>
          (IMAGE_DURATION * frame) / lastFrame;

        const fadeStart = frameToTime(0);
        const fadeEnd = frameToTime(30);

        tl.to(
          scrollHint,
          {
            opacity: 0,
            ease: "none",
            duration: fadeEnd - fadeStart,
          },
          fadeStart,
        );
      }

      const overlay = textRef.current.querySelector<HTMLElement>(
        "[data-reveal-overlay]",
      );

      if (overlay) {
        tl.fromTo(
          overlay,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            duration: TEXT_DURATION / 2,
          },
          IMAGE_DURATION,
        );
      }

      const textLines =
        textRef.current.querySelectorAll<HTMLElement>(
          "[data-reveal-line]",
        );

      tl.fromTo(
        textLines.length ? textLines : textRef.current,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          ease: "power2.out",
          duration: TEXT_DURATION,
          stagger: textLines.length
            ? TEXT_DURATION / (textLines.length * 2)
            : 0,
        },
        IMAGE_DURATION,
      );

      const handleResize = () => {
        renderFrame(Math.round(frameIndexRef.current.value));
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
    {
      scope: sectionRef,
      dependencies: [imagesLoaded],
    },
  );

  return (
    <div ref={sectionRef} className="relative h-[800vh]">
      {!imagesLoaded && (
        <div className="absolute inset-x-0 top-0 z-40 flex h-screen items-center justify-center bg-black">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
            <p className="text-lg text-white">Loading images...</p>
          </div>
        </div>
      )}

      <div
        ref={pinWrapperRef}
        className="relative h-screen w-full overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full"
        />

        <div
          data-scroll-hint
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 md:inset-y-auto md:bottom-10 md:justify-start"
        >
          <span
            className="text-[10px] uppercase tracking-[0.35em] text-white/70 md:text-xs"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            Scroll to play
          </span>

          <span
            className="flex h-9 w-5.5 items-start justify-center rounded-full border pt-2"
            style={{
              borderColor:
                "oklch(59.71% 0.23 23.86 / 0.6)",
            }}
          >
            <span
              className="h-1.5 w-1.5 animate-bounce rounded-full"
              style={{
                backgroundColor: redColor,
              }}
            />
          </span>
        </div>

        <div
          ref={textRef}
          className="pointer-events-none absolute inset-0"
        >
          <div
            data-reveal-overlay
            className="absolute inset-0 bg-linear-to-r from-black/80 via-black/35 to-transparent opacity-0"
          />

          <div className="absolute inset-y-0 left-0 flex w-full flex-col justify-center px-6 sm:w-[55%] sm:px-14 lg:px-20">
            <div className="relative max-w-xl p-8 sm:p-10">
              <div
                data-reveal-line
                className="absolute left-0 top-0 h-8 w-8 border-l border-t opacity-0"
                style={{
                  borderColor:
                    "oklch(59.71% 0.23 23.86 / 0.6)",
                }}
              />

              <div
                data-reveal-line
                className="absolute right-0 top-0 h-8 w-8 border-r border-t opacity-0"
                style={{
                  borderColor:
                    "oklch(59.71% 0.23 23.86 / 0.6)",
                }}
              />

              <div
                data-reveal-line
                className="absolute bottom-0 left-0 h-8 w-8 border-b border-l opacity-0"
                style={{
                  borderColor:
                    "oklch(59.71% 0.23 23.86 / 0.6)",
                }}
              />

              <div
                data-reveal-line
                className="absolute bottom-0 right-0 h-8 w-8 border-b border-r opacity-0"
                style={{
                  borderColor:
                    "oklch(59.71% 0.23 23.86 / 0.6)",
                }}
              />

              <p
                data-reveal-line
                className="mb-5 text-[10px] uppercase tracking-[0.3em] opacity-0 md:text-xs"
                style={{
                  fontFamily: "'DM Mono', monospace",
                  color: redColor,
                }}
              >
                ✦ About Me ✦
              </p>

              <h2
                data-reveal-line
                className="mb-5 text-3xl font-bold leading-[1.08] text-white opacity-0 sm:text-4xl lg:text-5xl"
              >
                I&apos;d rather let the{" "}
                <span
                  className="font-normal italic"
                  style={{
                    fontFamily:
                      "'DM Serif Display', Georgia, serif",
                    color: redColor,
                  }}
                >
                  vibe
                </span>{" "}
                do the building.
              </h2>

              <p
                data-reveal-line
                className="mb-6 max-w-md text-sm leading-relaxed text-white/60 opacity-0 sm:text-base"
              >
                1.5 years of self-taught building — no courses, no
                mentors, just prompts, iteration, and real projects
                that actually ship. Built on one simple rule: learn
                by doing, always.
              </p>

              <div
                data-reveal-line
                className="mb-8 flex flex-wrap items-center gap-3 opacity-0"
              >
                {[
                  "VIBE CODING",
                  "PROMPT ENGINEERING",
                  "RAPID PROTOTYPING",
                  "DEBUGGING WITH AI",
                ].map((discipline, i) => (
                  <span
                    key={discipline}
                    className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/50"
                    style={{
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {i !== 0 && (
                      <span
                        className="h-1 w-1 rounded-full"
                        style={{
                          backgroundColor: redColor,
                        }}
                      />
                    )}

                    {discipline}
                  </span>
                ))}
              </div>

              <p data-reveal-line className="opacity-0">
                <span
                  className="text-xs uppercase tracking-[0.25em] text-white"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  LET&apos;S BUILD YOUR WEBSITE
                </span>{" "}
                <span style={{ color: redColor }}>
                  ✦
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutScrollSection;
