"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShimmerButton } from "@/components/ui/shimmer-button";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  message: z.string().min(10, "Tell us a bit more (min 10 chars)"),
});

type FormData = z.infer<typeof schema>;

const PROJECT_TYPES = [
  {
    title: "BESPOKE PERSONAL PORTFOLIO WEBSITE",
    tiers: [
      "₹2,000 – 6,000",
      "₹6,000 – 10,000",
      "₹10,000 – 15,000",
      "₹15,000 – 40,000",
      "₹40,000 – 80,000",
      "₹80,000 – 1,00,000",
    ],
    duration: "10–12 Days [Student-Builder Adaptive Timeline]",
    description:
      "Engineering hyper-scalable, immersive digital resumes and interactive personal profiles. Featuring fluid layout animations, minimal architectural aesthetics, and seamless social cross-integration designed to command authority in your niche.",
  },
  {
    title: "CORPORATE ENTERPRISE ARCHITECTURE (5–6 PAGES)",
    tiers: [
      "₹8,000 – 15,000",
      "₹15,000 – 25,000",
      "₹25,000 – 40,000",
      "₹40,000 – 70,000",
      "₹70,000 – 1,00,000",
    ],
    duration: "10–12 Days [Student-Builder Adaptive Timeline]",
    description:
      "Architecting robust multi-page business infrastructures. Engineered with state-of-the-art lead-capturing nodes, optimized content arrays, performance-driven service showcases, and custom secure communication pipelines.",
  },
  {
    title: 'CUSTOM "BUILD YOUR DREAM PLATFORM" (UNRESTRICTED IDEATION)',
    tiers: [
      "₹15,000 – 25,000",
      "₹25,000 – 40,000",
      "₹40,000 – 60,000",
      "₹60,000 – 80,000",
      "₹80,000 – 1,00,000",
    ],
    duration: "10–12 Days [Student-Builder Adaptive Timeline]",
    description:
      "Transforming avant-garde abstract concepts into deployment-ready digital reality. Completely unconstrained execution leveraging elite AI prompt workflows to model complex, proprietary logic and tailor-made user experiences.",
  },
  {
    title: "CASUAL BROWSER ARCADE INFRASTRUCTURE (2D WEB CLONES)",
    tiers: [
      "₹2,000 – 8,000",
      "₹8,000 – 15,000",
      "₹15,000 – 30,000",
      "₹30,000 – 60,000",
      "₹60,000 – 1,00,000",
    ],
    duration: "10–12 Days [Student-Builder Adaptive Timeline]",
    description:
      "Deploying ultra-responsive 2D mini-game frameworks operating natively within HTML5 environments. Features micro-mechanics engineering, real-time physics calculations, and fluid asset rendering for timeless retro game models.",
  },
  {
    title: 'CUSTOM "NEXT-GEN GAME INTERACTIVE" (PROPRIETARY CONCEPT)',
    tiers: [
      "₹2,000 – 10,000",
      "₹10,000 – 25,000",
      "₹25,000 – 45,000",
      "₹45,000 – 70,000",
      "₹70,000 – 1,00,000",
    ],
    duration: "10–12 Days [Student-Builder Adaptive Timeline]",
    description:
      "Forging custom interactive environments based entirely on your unique gaming philosophy. Implementing specialized behavioral mechanics, bespoke procedural level logic, and custom win-state conditions engineered precisely to your blueprint.",
  },
  {
    title: "NEXT-GEN UTILITY APPLICATION MICRO-SUITE",
    tiers: [
      "₹15,000 – 25,000",
      "₹25,000 – 40,000",
      "₹40,000 – 60,000",
      "₹60,000 – 80,000",
      "₹80,000 – 1,00,000",
    ],
    duration: "10–12 Days [Student-Builder Adaptive Timeline]",
    description:
      "Constructing sophisticated web and mobile management utilities. Employs advanced state management, local data-caching vectors, intuitive habit/finance monitoring mechanics, and highly analytical workflow orchestration.",
  },
] as const;

const RED = "oklch(59.71% 0.23 23.86)";
const RED_RGBA = "rgba(201, 58, 42,";

const WORDS = [
  { text: "YOUR", accent: false },
  { text: "VISION.", accent: true },
  { text: "OUR", accent: false },
  { text: "CRAFT.", accent: true },
];

const SUCCESS_WORDS = [
  { text: "TRANS-", accent: false },
  { text: "MISSION", accent: true },
  { text: "SENT.", accent: false },
];

const CORNERS = [
  { id: "tl", top: 24, left: 24 },
  { id: "tr", top: 24, right: 24 },
  { id: "bl", bottom: 24, left: 24 },
  { id: "br", bottom: 24, right: 24 },
] as const;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CollabModal({ isOpen, onClose }: Props) {
  const [selectedType, setSelectedType] = useState("");
  const [selectedTier, setSelectedTier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState("");
  const [hasCopiedAgain, setHasCopiedAgain] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setIsSuccess(false);
        setSubmitError(false);
        reset();
        setSelectedType("");
        setSelectedTier("");
        setIsSubmitting(false);
        setCopiedMessage("");
        setHasCopiedAgain(false);
      }, 900);
      return () => clearTimeout(t);
    }
  }, [isOpen, reset]);

  const copyToClipboard = async (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fallback below
      }
    }
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      textArea.setAttribute("readonly", "");
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const res = document.execCommand("copy");
      document.body.removeChild(textArea);
      return res;
    } catch {
      return false;
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      // 1. Collect all entered information & format clean Instagram DM message
      const lines = [
        "New Collaboration Request",
        "",
        `Name: ${data.name.trim()}`,
        `Email: ${data.email.trim()}`,
      ];

      if (selectedType) {
        lines.push(`Project: ${selectedType}`);
      }
      if (selectedTier) {
        lines.push(`Budget: ${selectedTier}`);
      }

      lines.push("", "Message:", data.message.trim());

      const fullMessage = lines.join("\n");
      setCopiedMessage(fullMessage);

      // 2. Automatically copy complete generated message to clipboard
      await copyToClipboard(fullMessage);
      setShowToast(true);

      // 3. Immediately open official VTECH Studio Instagram destination
      window.open(
        "https://www.instagram.com/vtechstudio.dev/",
        "_blank",
        "noopener,noreferrer"
      );

      setIsSuccess(true);
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const borderBottom = (field: string) =>
    `1px solid ${focusedField === field ? RED : "rgba(255,255,255,0.13)"}`;

  const baseInput: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    borderTop: 0,
    borderLeft: 0,
    borderRight: 0,
    outline: "none",
    paddingBottom: "12px",
    paddingTop: "4px",
    fontFamily: "var(--font-poppins)",
    fontSize: "clamp(15px, 1.6vw, 19px)",
    color: "white",
    caretColor: RED,
    transition: "border-color 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-poppins)",
    fontSize: "9px",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.28)",
    marginBottom: "10px",
  };

  const errorStyle: React.CSSProperties = {
    color: RED,
    fontSize: "10px",
    marginTop: "6px",
    fontFamily: "var(--font-poppins)",
    letterSpacing: "0.1em",
  };

  return (
    <>
      <style>{`
        .collab-input::placeholder {
          color: rgba(255,255,255,0.16);
          font-size: 13px;
          letter-spacing: 0.04em;
        }
        .collab-input::-webkit-scrollbar { display: none; }
        .collab-input { scrollbar-width: none; }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            exit={{ clipPath: "circle(0% at 50% 50%)" }}
            transition={{ duration: 0.88, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-2xl"
            aria-modal="true"
            role="dialog"
            aria-label="Collaboration form"
          >

            {CORNERS.map((c, i) => (
              <motion.div
                key={c.id}
                aria-hidden="true"
                className="absolute w-9 h-9 z-10 pointer-events-none"
                style={{
                  ...("top" in c ? { top: (c as { top: number }).top } : {}),
                  ...("bottom" in c
                    ? { bottom: (c as { bottom: number }).bottom }
                    : {}),
                  ...("left" in c
                    ? { left: (c as { left: number }).left }
                    : {}),
                  ...("right" in c
                    ? { right: (c as { right: number }).right }
                    : {}),
                  borderTop: c.id.includes("t")
                    ? `1px solid ${RED_RGBA} 0.45)`
                    : "none",
                  borderBottom: c.id.includes("b")
                    ? `1px solid ${RED_RGBA} 0.45)`
                    : "none",
                  borderLeft: c.id.includes("l")
                    ? `1px solid ${RED_RGBA} 0.45)`
                    : "none",
                  borderRight: c.id.includes("r")
                    ? `1px solid ${RED_RGBA} 0.45)`
                    : "none",
                }}
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.6 + i * 0.06,
                  duration: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}

            <div className="relative z-10 h-full overflow-y-auto flex flex-col">
              <motion.header
                className="flex items-center justify-between px-8 md:px-16 pt-8 pb-5 shrink-0"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.52, duration: 0.5 }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-poppins)",
                    color: RED,
                    fontSize: "10px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                  }}
                >
                  ✦ VTECH STUDIOS
                </span>

                <motion.button
                  onClick={onClose}
                  className="flex items-center gap-3 cursor-pointer"
                  style={{ background: "none", border: "none", padding: 0 }}
                  aria-label="Close collaboration form"
                  whileHover="hov"
                >
                  <motion.span
                    variants={{ hov: { color: "rgba(255,255,255,0.6)" } }}
                    style={{
                      fontFamily: "var(--font-poppins)",
                      fontSize: "10px",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.25)",
                      transition: "color 0.2s",
                    }}
                  >
                    CLOSE
                  </motion.span>
                  <motion.span
                    variants={{ hov: { rotate: 90, color: RED } }}
                    transition={{ duration: 0.3 }}
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: "18px",
                      display: "block",
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </motion.span>
                </motion.button>
              </motion.header>

              <motion.div
                className="mx-8 md:mx-16 shrink-0"
                style={{
                  height: "1px",
                  background: "rgba(255,255,255,0.07)",
                  transformOrigin: "left",
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 0.52,
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
                aria-hidden="true"
              />

              <div className="flex-1 flex flex-col lg:flex-row px-5 sm:px-8 md:px-16 py-6 lg:py-0 gap-6 lg:gap-0 min-h-0">
                <div className="lg:w-[40%] flex flex-col justify-center lg:py-16 lg:pr-14">
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.66, duration: 0.5 }}
                    style={{
                      fontFamily: "var(--font-poppins)",
                      color: RED,
                      fontSize: "9px",
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      marginBottom: "28px",
                    }}
                  >
                    ✦ INITIATE COLLABORATION
                  </motion.p>

                  <div aria-hidden="true">
                    {WORDS.map(({ text, accent }, i) => (
                      <div key={text} style={{ overflow: "hidden" }}>
                        <motion.div
                          initial={{ y: "112%" }}
                          animate={{ y: "0%" }}
                          transition={{
                            delay: 0.62 + i * 0.095,
                            duration: 0.9,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          style={{
                            fontFamily: "var(--font-poppins)",
                            fontSize: "clamp(32px, 7.5vw, 104px)",
                            lineHeight: 0.87,
                            color: accent ? RED : "white",
                            fontWeight: "normal",
                            paddingBottom: "2px",
                          }}
                        >
                          {text}
                        </motion.div>
                      </div>
                    ))}
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.04, duration: 0.8 }}
                    style={{
                      fontFamily: "var(--font-poppins)",
                      fontSize: "11px",
                      lineHeight: "1.8",
                      color: "rgba(255,255,255,0.28)",
                      marginTop: "30px",
                      maxWidth: "260px",
                    }}
                  >
                    I build digital products that demand attention — powered
                    by vibe coding, one prompt at a time.
                  </motion.p>

                  <motion.div
                    aria-hidden="true"
                    style={{
                      height: "1px",
                      background: `linear-gradient(to right, ${RED}, transparent)`,
                      marginTop: "18px",
                      maxWidth: "260px",
                      transformOrigin: "left",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      delay: 1.14,
                      duration: 1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>

                <motion.div
                  aria-hidden="true"
                  className="hidden lg:block w-px self-stretch shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    transformOrigin: "top",
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    delay: 0.52,
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />

                <div className="lg:w-[60%] flex flex-col justify-center lg:py-16 lg:pl-14">
                  <AnimatePresence mode="wait">
                    {!isSuccess && (
                      <motion.form
                        key="form"
                        onSubmit={handleSubmit(onSubmit)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.35 }}
                        noValidate
                      >
                        <motion.div
                          className="mb-5 sm:mb-7"
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.76,
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <label htmlFor="collab-name" style={labelStyle}>
                            NAME <span style={{ color: RED }}>*</span>
                          </label>
                          <input
                            id="collab-name"
                            {...register("name")}
                            placeholder="Your name"
                            autoComplete="name"
                            className="collab-input"
                            style={{
                              ...baseInput,
                              borderBottom: borderBottom("name"),
                            }}
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                          />
                          {errors.name && (
                            <p style={errorStyle} role="alert">
                              ↳ {errors.name.message}
                            </p>
                          )}
                        </motion.div>

                        <motion.div
                          className="mb-5 sm:mb-7"
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.84,
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <label htmlFor="collab-email" style={labelStyle}>
                            EMAIL <span style={{ color: RED }}>*</span>
                          </label>
                          <input
                            id="collab-email"
                            {...register("email")}
                            type="email"
                            placeholder="your@email.com"
                            autoComplete="email"
                            className="collab-input"
                            style={{
                              ...baseInput,
                              borderBottom: borderBottom("email"),
                            }}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                          />
                          {errors.email && (
                            <p style={errorStyle} role="alert">
                              ↳ {errors.email.message}
                            </p>
                          )}
                        </motion.div>

                        <motion.div
                          className="mb-5 sm:mb-7"
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.92,
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <label style={labelStyle}>PROJECT TYPE</label>
                          <div
                            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                            role="group"
                            aria-label="Select project type"
                          >
                            {PROJECT_TYPES.map((type) => {
                              const active = selectedType === type.title;
                              return (
                                <motion.button
                                  key={type.title}
                                  type="button"
                                  onClick={() => {
                                    setSelectedType(active ? "" : type.title);
                                    setSelectedTier("");
                                  }}
                                  whileTap={{ scale: 0.96 }}
                                  aria-pressed={active}
                                  style={{
                                    fontFamily: "var(--font-poppins)",
                                    fontSize: "9px",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    padding: "10px 12px",
                                    border: `1px solid ${active ? RED : "rgba(255,255,255,0.16)"}`,
                                    background: active
                                      ? `oklch(59.71% 0.23 23.86 / 0.12)`
                                      : "transparent",
                                    color: active
                                      ? RED
                                      : "rgba(255,255,255,0.4)",
                                    cursor: "pointer",
                                    transition: "all 0.22s ease",
                                    textAlign: "left",
                                    lineHeight: "1.45",
                                  }}
                                >
                                  {type.title}
                                </motion.button>
                              );
                            })}
                          </div>

                          <AnimatePresence>
                            {selectedType && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                  overflow: "hidden",
                                  marginTop: "12px",
                                  padding: "12px 14px",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  background: "rgba(255,255,255,0.02)",
                                }}
                              >
                                {(() => {
                                  const selected = PROJECT_TYPES.find(
                                    (t) => t.title === selectedType,
                                  );
                                  if (!selected) return null;
                                  return (
                                    <>
                                      <p
                                        style={{
                                          fontFamily: "var(--font-poppins)",
                                          fontSize: "9px",
                                          letterSpacing: "0.08em",
                                          textTransform: "uppercase",
                                          color: "rgba(255,255,255,0.35)",
                                          marginBottom: "8px",
                                        }}
                                      >
                                        {selected.duration}
                                      </p>
                                      <p
                                        style={{
                                          fontFamily: "var(--font-poppins)",
                                          fontSize: "11px",
                                          lineHeight: "1.65",
                                          color: "rgba(255,255,255,0.45)",
                                          marginBottom: "12px",
                                        }}
                                      >
                                        {selected.description}
                                      </p>

                                      <p
                                        style={{
                                          ...labelStyle,
                                          marginBottom: "8px",
                                        }}
                                      >
                                        BUDGET TIER
                                      </p>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexWrap: "wrap",
                                          gap: "6px",
                                        }}
                                        role="group"
                                        aria-label="Select budget tier"
                                      >
                                        {selected.tiers.map((tier) => {
                                          const tierActive =
                                            selectedTier === tier;
                                          return (
                                            <button
                                              key={tier}
                                              type="button"
                                              onClick={() =>
                                                setSelectedTier(
                                                  tierActive ? "" : tier,
                                                )
                                              }
                                              aria-pressed={tierActive}
                                              style={{
                                                fontFamily:
                                                  "var(--font-poppins)",
                                                fontSize: "10px",
                                                padding: "7px 12px",
                                                border: `1px solid ${
                                                  tierActive
                                                    ? RED
                                                    : "rgba(255,255,255,0.16)"
                                                }`,
                                                background: tierActive
                                                  ? "oklch(59.71% 0.23 23.86 / 0.12)"
                                                  : "transparent",
                                                color: tierActive
                                                  ? RED
                                                  : "rgba(255,255,255,0.5)",
                                                cursor: "pointer",
                                                transition: "all 0.2s ease",
                                              }}
                                            >
                                              {tier}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </>
                                  );
                                })()}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>

                        <motion.div
                          className="mb-6 sm:mb-9"
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 1.0,
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <label htmlFor="collab-message" style={labelStyle}>
                            MESSAGE <span style={{ color: RED }}>*</span>
                          </label>
                          <textarea
                            id="collab-message"
                            {...register("message")}
                            rows={3}
                            placeholder="Tell us about your project..."
                            className="collab-input"
                            style={{
                              ...baseInput,
                              resize: "none",
                              display: "block",
                              lineHeight: "1.65",
                              borderBottom: borderBottom("message"),
                            }}
                            onFocus={() => setFocusedField("message")}
                            onBlur={() => setFocusedField(null)}
                          />
                          {errors.message && (
                            <p style={errorStyle} role="alert">
                              ↳ {errors.message.message}
                            </p>
                          )}
                        </motion.div>

                        {submitError && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ ...errorStyle, marginBottom: "12px" }}
                            role="alert"
                          >
                            ↳ Something went wrong. Please try again.
                          </motion.p>
                        )}

                        <motion.div
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 1.08,
                            duration: 0.6,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <ShimmerButton
                            type="submit"
                            disabled={isSubmitting}
                            shimmerColor="#ff2d47"
                            shimmerSize="2px"
                            borderRadius="6px"
                            shimmerDuration="3s"
                            background="rgba(15, 15, 15, 0.95)"
                            className="relative overflow-hidden w-full border border-[oklch(59.71%_0.23_23.86/0.5)] py-4 px-6 cursor-pointer"
                          >
                            <span
                              style={{
                                position: "relative",
                                zIndex: 1,
                                fontFamily: "var(--font-poppins)",
                                fontSize: "11px",
                                letterSpacing: "0.38em",
                                textTransform: "uppercase",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "12px",
                              }}
                            >
                              {isSubmitting ? (
                                <>
                                  <motion.span
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                    style={{
                                      display: "inline-block",
                                      fontSize: "11px",
                                    }}
                                  >
                                    ◌
                                  </motion.span>
                                  TRANSMITTING
                                </>
                              ) : (
                                "TRANSMIT →"
                              )}
                            </span>
                          </ShimmerButton>
                        </motion.div>
                      </motion.form>
                    )}

                    {isSuccess && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col"
                      >
                        {SUCCESS_WORDS.map(({ text, accent }, i) => (
                          <div key={text} style={{ overflow: "hidden" }}>
                            <motion.div
                              initial={{ y: "110%" }}
                              animate={{ y: "0%" }}
                              transition={{
                                delay: i * 0.085,
                                duration: 0.9,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              style={{
                                fontFamily: "var(--font-poppins)",
                                fontSize: "clamp(30px, 5.5vw, 76px)",
                                lineHeight: 0.88,
                                color: accent ? RED : "white",
                                fontWeight: "normal",
                                marginBottom: "2px",
                              }}
                            >
                              {text}
                            </motion.div>
                          </div>
                        ))}

                        <motion.div
                          aria-hidden="true"
                          style={{
                            height: "1px",
                            background: `linear-gradient(to right, ${RED}, transparent)`,
                            marginTop: "28px",
                            marginBottom: "24px",
                            transformOrigin: "left",
                          }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            delay: 0.35,
                            duration: 0.9,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />

                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                          style={{ marginBottom: "28px" }}
                        >
                          <p
                            style={{
                              fontFamily: "var(--font-poppins)",
                              fontSize: "13px",
                              lineHeight: "1.8",
                              color: "rgba(255,255,255,0.75)",
                              marginBottom: "12px",
                            }}
                          >
                            Transmission generated. Your message has been copied to your clipboard, and Instagram (@vtechstudio.dev) has opened in a new tab.
                          </p>
                          <p
                            style={{
                              fontFamily: "var(--font-poppins)",
                              fontSize: "11px",
                              lineHeight: "1.6",
                              color: RED,
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                            }}
                          >
                            ↳ Simply paste (Ctrl+V / Cmd+V) into the chat to send your DM!
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.65, duration: 0.5 }}
                          className="flex flex-wrap items-center gap-4 mb-8"
                        >
                          <button
                            type="button"
                            onClick={async () => {
                              if (copiedMessage) {
                                await copyToClipboard(copiedMessage);
                                setHasCopiedAgain(true);
                                setTimeout(() => setHasCopiedAgain(false), 2000);
                              }
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-colors text-[10px] tracking-wider uppercase cursor-pointer"
                            style={{ fontFamily: "var(--font-poppins)" }}
                          >
                            {hasCopiedAgain ? "✓ COPIED TO CLIPBOARD" : "📋 RE-COPY MESSAGE"}
                          </button>

                          <a
                            href="https://www.instagram.com/vtechstudio.dev/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[oklch(59.71%_0.23_23.86/0.5)] text-white hover:border-[oklch(59.71%_0.23_23.86)] transition-colors text-[10px] tracking-wider uppercase"
                            style={{ fontFamily: "var(--font-poppins)" }}
                          >
                            ↗ OPEN INSTAGRAM
                          </a>
                        </motion.div>

                        <motion.button
                          onClick={onClose}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.75, duration: 0.6 }}
                          whileHover={{ x: -5 }}
                          style={{
                            fontFamily: "var(--font-poppins)",
                            fontSize: "10px",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: RED,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            textAlign: "left",
                            width: "fit-content",
                          }}
                        >
                          ← RETURN TO SITE
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Popup Notification Banner when Message is Copied */}
            <AnimatePresence>
              {showToast && (
                <motion.div
                  initial={{ opacity: 0, y: -25, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-lg w-[92%] bg-neutral-950/95 border-2 border-[oklch(59.71%_0.23_23.86)] text-white p-4 sm:p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-start gap-3.5"
                >
                  <div className="size-9 rounded-xl bg-[oklch(59.71%_0.23_23.86)]/25 border border-[oklch(59.71%_0.23_23.86)] flex items-center justify-center shrink-0 text-base">
                    📋
                  </div>
                  <div className="flex-1 pr-1">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-xs tracking-wider uppercase text-[oklch(59.71%_0.23_23.86)] font-mono">
                        COPIED TO CLIPBOARD!
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowToast(false)}
                        className="text-white/50 hover:text-white text-xs px-1 cursor-pointer transition-colors"
                        aria-label="Close notification"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-white/95 mt-1 leading-relaxed">
                      You just copied the message! Just paste it in the Instagram message to the{" "}
                      <strong className="text-white underline decoration-[oklch(59.71%_0.23_23.86)]">
                        @vtechstudio.dev
                      </strong>{" "}
                      account.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
