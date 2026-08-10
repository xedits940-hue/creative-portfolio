"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { ThemeToggleButton } from "./theme-switcher";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, useAnimate, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Projects", href: "#projects", label: "Our Work" },
  { name: "Contact", href: "#contact", label: "Get In Touch" },
  { name: "About", href: "#about", label: "Who We Are" },
];

const socialLinks = [
  { name: "YouTube", href: "https://www.youtube.com/@yourusername" },
  { name: "Behance", href: "https://www.behance.net/yourusername" },
  { name: "Instagram", href: "https://www.instagram.com/yourusername" },
  { name: "Discord", href: "https://discord.gg/yourinvite" },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [scope, animate] = useAnimate();
  const closedWidthRef = useRef<number>(0);
  const closedHeightRef = useRef<number>(0);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = async (event: MouseEvent) => {
      if (
        !scope.current ||
        scope.current.contains(event.target as Node) ||
        isAnimating
      ) {
        return;
      }

      await closeMenu();
    };

    const timer = window.setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isAnimating]);

  const openMenu = async () => {
    if (!scope.current || isAnimating) return;

    setIsAnimating(true);

    closedWidthRef.current = scope.current.offsetWidth;
    closedHeightRef.current = scope.current.offsetHeight;

    scope.current.style.width = `${closedWidthRef.current}px`;
    scope.current.style.height = `${closedHeightRef.current}px`;

    setIsOpen(true);

    await animate(
      scope.current,
      {
        width: "min(92vw, 680px)",
        height: "min(62dvh, 520px)",
        borderRadius: "20px",
      },
      {
        duration: 0.72,
        ease: EASE,
      }
    );

    setShowContent(true);
    setIsAnimating(false);
  };

  const closeMenu = async () => {
    if (!scope.current || isAnimating) return;

    setIsAnimating(true);
    setShowContent(false);
    setHoveredIndex(null);

    await new Promise((resolve) => setTimeout(resolve, 80));

    await animate(
      scope.current,
      {
        width: `${closedWidthRef.current}px`,
        height: `${closedHeightRef.current}px`,
        borderRadius: "16px",
      },
      {
        duration: 0.65,
        ease: EASE,
      }
    );

    scope.current.style.width = "";
    scope.current.style.height = "";
    scope.current.style.borderRadius = "";

    setIsOpen(false);
    setIsAnimating(false);
  };

  const handleToggle = () => {
    if (isAnimating) return;

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center px-3 sm:px-4">
      <div
        ref={scope}
        className="
          relative
          w-[calc(100vw-24px)]
          max-w-[560px]
          h-[3.75rem]
          rounded-2xl
          border border-border/40
          bg-background/75
          dark:bg-background/55
          backdrop-blur-xl
          shadow-lg
          flex flex-col
          overflow-hidden
        "
      >
        {/* TOP BAR */}
        <div
          className="
            relative
            flex items-center justify-between
            h-[3.75rem]
            min-h-[3.75rem]
            shrink-0
            px-4 sm:px-5 md:px-6
          "
        >
          {/* MENU */}
          <motion.button
            type="button"
            onClick={handleToggle}
            disabled={isAnimating}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="
              flex items-center justify-center
              w-9 h-9
              sm:w-10 sm:h-10
              rounded-full
              cursor-pointer
              shrink-0
            "
            whileTap={{ scale: 0.92 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <X className="w-5 h-5 sm:w-[21px] sm:h-[21px]" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <Menu className="w-5 h-5 sm:w-[21px] sm:h-[21px]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* CENTER LOGO */}
          <Link
            href="/"
            aria-label="Home"
            onClick={(e) => {
              e.preventDefault();

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });

              if (isOpen && !isAnimating) {
                closeMenu();
              }
            }}
            className="
              absolute
              left-1/2
              -translate-x-1/2
              flex items-center justify-center
            "
          >
            <Image
              src="/md-red-logo.svg"
              alt="Logo"
              width={40}
              height={40}
              priority
              className="
                w-9 h-9
                sm:w-10 sm:h-10
                object-contain
                cursor-pointer
              "
            />
          </Link>

          {/* THEME BUTTON */}
          <div className="flex items-center justify-center shrink-0">
            <ThemeToggleButton
              start="left-right"
              variant="rectangle"
              className="
                !w-9
                !h-9
                sm:!w-10
                sm:!h-10
                !p-0
                !rounded-full
                bg-background/70
                border border-border/40
              "
            />
          </div>
        </div>

        {/* OPEN MENU */}
        <AnimatePresence initial={false}>
          {showContent && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{
                duration: 0.28,
                ease: EASE,
              }}
              className="
                flex flex-col
                flex-1
                min-h-0
                px-4 sm:px-6 md:px-8
                pt-2 sm:pt-3
                pb-4
                overflow-hidden
              "
            >
              {/* MAIN AREA */}
              <div className="flex flex-col md:flex-row flex-1 min-h-0">
                {/* NAVIGATION */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="
                      text-[10px]
                      sm:text-[11px]
                      uppercase
                      tracking-[0.24em]
                      text-muted-foreground
                      mb-3 sm:mb-4
                    "
                  >
                    Navigation
                  </motion.span>

                  <div>
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                          duration: 0.38,
                          delay: i * 0.05,
                          ease: EASE,
                        }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <Link
                          href={link.href}
                          onClick={() => closeMenu()}
                          className="
                            group
                            relative
                            flex items-center
                            gap-3 sm:gap-4
                            py-2.5 sm:py-3
                            pr-2
                            border-b
                            border-border/20
                            last:border-b-0
                          "
                        >
                          {/* NUMBER */}
                          <span
                            className="
                              text-[10px]
                              sm:text-xs
                              font-mono
                              text-muted-foreground/60
                              w-5 sm:w-6
                              shrink-0
                            "
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>

                          {/* TEXT */}
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <motion.div
                              className="flex items-baseline gap-2"
                              animate={{
                                x: hoveredIndex === i ? 5 : 0,
                              }}
                              transition={{
                                duration: 0.25,
                                ease: EASE,
                              }}
                            >
                              <span
                                className="
                                  text-2xl
                                  sm:text-3xl
                                  md:text-4xl
                                  lg:text-5xl
                                  font-bold
                                  tracking-tighter
                                  leading-none
                                "
                              >
                                {link.name}
                              </span>

                              <motion.span
                                className="
                                  hidden md:inline-block
                                  text-xs
                                  text-muted-foreground
                                  whitespace-nowrap
                                "
                                animate={{
                                  opacity: hoveredIndex === i ? 1 : 0,
                                  x: hoveredIndex === i ? 0 : -5,
                                }}
                              >
                                — {link.label}
                              </motion.span>
                            </motion.div>
                          </div>

                          {/* ARROW */}
                          <motion.div
                            className="shrink-0"
                            animate={{
                              opacity: hoveredIndex === i ? 1 : 0.35,
                              rotate: hoveredIndex === i ? 0 : -45,
                              scale: hoveredIndex === i ? 1 : 0.8,
                            }}
                            transition={{
                              duration: 0.22,
                              ease: EASE,
                            }}
                          >
                            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                          </motion.div>

                          {/* HOVER LINE */}
                          <motion.div
                            className="
                              absolute
                              -left-2 sm:-left-3
                              top-1 bottom-1
                              w-[2px]
                              bg-primary
                              rounded-full
                            "
                            initial={{ scaleY: 0 }}
                            animate={{
                              scaleY: hoveredIndex === i ? 1 : 0,
                            }}
                            transition={{
                              duration: 0.22,
                              ease: EASE,
                            }}
                          />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* DESKTOP INFO */}
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.1,
                    ease: EASE,
                  }}
                  className="
                    hidden md:flex
                    flex-col
                    justify-between
                    w-52 lg:w-60
                    pl-6
                    ml-6
                    border-l
                    border-border/20
                    py-1
                  "
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Let&apos;s Talk
                    </span>

                    <a
                      href="mailto:you@example.com"
                      className="text-xs lg:text-sm hover:text-primary transition-colors"
                    >
                      you@example.com
                    </a>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Socials
                    </span>

                    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          className="
                            text-xs
                            text-muted-foreground
                            hover:text-foreground
                            transition-colors
                          "
                        >
                          {social.name}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      Based In
                    </span>

                    <span className="text-xs lg:text-sm">
                      India
                    </span>

                    <span className="text-[10px] text-muted-foreground">
                      Available Worldwide
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* BOTTOM */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: 0.12,
                }}
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  pt-3
                  mt-2
                  border-t
                  border-border/20
                "
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className="
                      w-1.5 h-1.5
                      sm:w-2 sm:h-2
                      rounded-full
                      bg-green-500
                    "
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    Available for projects
                  </span>
                </div>

                {/* MOBILE SOCIALS */}
                <div className="flex gap-2.5 md:hidden">
                  {socialLinks.slice(0, 3).map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className="
                        text-[10px]
                        text-muted-foreground
                        hover:text-foreground
                        transition-colors
                      "
                    >
                      {social.name}
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
