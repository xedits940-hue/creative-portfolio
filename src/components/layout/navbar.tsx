"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { ThemeToggleButton } from "./theme-switcher";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Instagram } from "lucide-react";
import { motion, useAnimate, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Projects", href: "#projects", label: "Showcase & Work" },
  { name: "About", href: "#about", label: "Who We Are" },
  { name: "Contact", href: "#contact", label: "Let's Connect" },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/vtechstudio.dev/",
    handle: "@vtechstudio.dev",
  },
];

const EASE_SNAPPY: [number, number, number, number] = [0.16, 1, 0.3, 1];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scope, animate] = useAnimate();
  const closedWidthRef = useRef<number>(0);

  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (
        isOpen &&
        scope.current &&
        !scope.current.contains(event.target as Node)
      ) {
        if (isAnimating) return;
        setIsAnimating(true);
        setShowContent(false);
        setHoveredIndex(null);

        await animate(
          scope.current,
          { height: "4.25rem", borderRadius: "1rem" },
          { duration: 0.35, ease: EASE_SNAPPY },
        );

        await animate(
          scope.current,
          { width: `${closedWidthRef.current}px`, borderRadius: "1rem" },
          { duration: 0.35, ease: EASE_SNAPPY },
        );

        scope.current.style.width = "";
        scope.current.style.height = "";
        scope.current.style.borderRadius = "";
        setIsOpen(false);
        setIsAnimating(false);
      }
    };

    if (isOpen) {
      const timer = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isAnimating]);

  const handleToggle = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (!isOpen) {
      closedWidthRef.current = scope.current.offsetWidth;
      scope.current.style.width = `${closedWidthRef.current}px`;
      setIsOpen(true);

      const isMobile = window.innerWidth < 640;
      const targetWidth = isMobile
        ? `${Math.min(window.innerWidth - 24, 460)}px`
        : `${Math.min(window.innerWidth - 32, 680)}px`;
      const targetHeight = isMobile ? "430px" : "380px";

      await animate(
        scope.current,
        { width: targetWidth, borderRadius: "1.25rem" },
        { duration: 0.4, ease: EASE_SNAPPY },
      );

      setShowContent(true);

      await animate(
        scope.current,
        { height: targetHeight, borderRadius: "1.25rem" },
        { duration: 0.45, ease: EASE_SNAPPY },
      );
    } else {
      setShowContent(false);
      setHoveredIndex(null);

      await animate(
        scope.current,
        { height: "4.25rem", borderRadius: "1rem" },
        { duration: 0.35, ease: EASE_SNAPPY },
      );

      await animate(
        scope.current,
        { width: `${closedWidthRef.current}px`, borderRadius: "1rem" },
        { duration: 0.35, ease: EASE_SNAPPY },
      );

      scope.current.style.width = "";
      scope.current.style.height = "";
      scope.current.style.borderRadius = "";
      setIsOpen(false);
    }

    setIsAnimating(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isOpen) {
      handleToggle();
    }
    setTimeout(() => {
      if (href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 280);
  };

  const handleInstagramClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      window.open(
        "https://www.instagram.com/vtechstudio.dev/",
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <nav className="fixed top-4 sm:top-5 left-0 right-0 z-50 flex justify-center items-center px-3 sm:px-4 pointer-events-auto">
      <div
        ref={scope}
        className="w-[92%] sm:w-[85%] md:w-[680px] max-w-[680px] border border-border/40 h-[4.25rem] rounded-2xl bg-background/90 dark:bg-background/80 backdrop-blur-xl shadow-xl shadow-black/10 flex flex-col overflow-hidden transition-colors"
      >
        {/* Top Bar Header */}
        <div className="flex justify-between items-center h-[4.25rem] min-h-[4.25rem] shrink-0 px-5 sm:px-6">
          <motion.button
            data-magnetic
            onClick={handleToggle}
            className="cursor-pointer relative h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <X className="h-5 w-5 text-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <Menu className="h-5 w-5 text-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <Link
            id="navbar-logo-container"
            href={"/"}
            data-magnetic
            aria-label="VTECH STUDIOS Home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              if (isOpen) handleToggle();
            }}
          >
            <Image
              id="navbar-logo-img"
              src="/vtech-studios-logo.png"
              alt="VTECH STUDIOS Logo"
              className="h-9 w-9 sm:h-11 sm:w-11 cursor-pointer object-contain"
              width={88}
              height={88}
              priority
              referrerPolicy="no-referrer"
            />
          </Link>

          <ThemeToggleButton
            start="left-right"
            variant="rectangle"
            className="bg-background-foreground border border-border/40"
          />
        </div>

        {/* Drawer / Expanded Menu Content */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex flex-col flex-1 px-5 sm:px-8 pt-2 pb-5 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row flex-1 gap-6 sm:gap-8 justify-between">
                {/* Left: Nav Links */}
                <div className="flex-1 flex flex-col justify-center">
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE_SNAPPY }}
                    className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono mb-3 sm:mb-4"
                  >
                    Directory
                  </motion.span>

                  <div className="flex flex-col">
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{
                          duration: 0.35,
                          delay: i * 0.05,
                          ease: EASE_SNAPPY,
                        }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <a
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className="group relative flex items-center justify-between py-2 sm:py-2.5 border-b border-border/25 last:border-b-0 cursor-pointer"
                        >
                          <motion.div
                            className="absolute -left-3 top-1 bottom-1 w-[2.5px] bg-primary rounded-full origin-top"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: hoveredIndex === i ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                          />

                          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                            <span className="text-xs font-mono text-muted-foreground/60 w-5 shrink-0">
                              {String(i + 1).padStart(2, "0")}
                            </span>

                            <div className="flex items-baseline gap-2.5">
                              <span className="text-2xl sm:text-3xl md:text-3xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                                {link.name}
                              </span>

                              <span className="text-xs text-muted-foreground hidden md:inline-block font-normal">
                                — {link.label}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 pl-2">
                            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground transition-transform duration-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right: Studio Details (Desktop/Tablet) */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.35, delay: 0.12, ease: EASE_SNAPPY }}
                  className="hidden sm:flex flex-col justify-between w-56 md:w-60 pl-6 border-l border-border/25 py-1"
                >
                  {/* Let's Talk */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
                      Let&apos;s Talk
                    </span>
                    <motion.a
                      href="mailto:vtechprime01@gmail.com"
                      className="text-xs sm:text-sm font-medium hover:text-primary transition-colors select-all break-all"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      vtechprime01@gmail.com
                    </motion.a>
                  </div>

                  {/* Socials - Instagram */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
                      Socials
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleInstagramClick}
                          aria-label="Open Instagram Profile in New Tab"
                          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors py-1 px-3 rounded-full border border-border/50 bg-background/50 cursor-pointer"
                        >
                          <Instagram className="h-3.5 w-3.5 text-pink-500" />
                          <span className="font-medium">{social.name}</span>
                          <ArrowUpRight className="h-3 w-3 opacity-70" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Based In */}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
                      Based In
                    </span>
                    <span className="text-xs font-semibold">India</span>
                    <span className="text-[11px] text-muted-foreground">
                      Available Worldwide
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Mobile Info Strip (Only on small screens) */}
              <div className="flex sm:hidden flex-col gap-2 pt-2 border-t border-border/25 mt-2">
                <div className="flex items-center justify-between text-xs">
                  <a
                    href="mailto:vtechprime01@gmail.com"
                    className="text-xs font-medium text-foreground hover:text-primary transition-colors"
                  >
                    vtechprime01@gmail.com
                  </a>
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleInstagramClick}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium py-0.5 px-2 rounded-full border border-border/40"
                    >
                      <Instagram className="h-3 w-3 text-pink-500" />
                      <span>{social.name}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Bottom Status Footer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.2, ease: EASE_SNAPPY }}
                className="flex items-center justify-between pt-3 mt-auto border-t border-border/25 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Available for projects
                  </span>
                </div>

                <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                  VTECH STUDIOS © 2026
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
