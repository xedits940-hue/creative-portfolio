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

const EASE_OPEN: [number, number, number, number] = [0.76, 0, 0.24, 1];
const EASE_CLOSE: [number, number, number, number] = [0.76, 0, 0.24, 1];

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
          { height: "3rem", borderRadius: "8px" },
          { duration: 0.5, ease: EASE_CLOSE },
        );

        await animate(
          scope.current,
          { width: `${closedWidthRef.current}px`, borderRadius: "8px" },
          { duration: 0.5, ease: EASE_CLOSE },
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
  }, [isOpen, isAnimating, animate, scope]);

  const handleToggle = async () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (!isOpen) {
      closedWidthRef.current = scope.current.offsetWidth;
      scope.current.style.width = `${closedWidthRef.current}px`;
      setIsOpen(true);

      await animate(
        scope.current,
        { width: "92vw", borderRadius: "8px" },
        { duration: 0.55, ease: EASE_OPEN },
      );

      setShowContent(true);

      await animate(
        scope.current,
        { height: "auto", maxHeight: "55vh", borderRadius: "8px" },
        { duration: 0.55, ease: EASE_OPEN },
      );
    } else {
      setShowContent(false);
      setHoveredIndex(null);

      await animate(
        scope.current,
        { height: "3rem", borderRadius: "8px" },
        { duration: 0.5, ease: EASE_CLOSE },
      );

      await animate(
        scope.current,
        { width: `${closedWidthRef.current}px`, borderRadius: "8px" },
        { duration: 0.5, ease: EASE_CLOSE },
      );

      scope.current.style.width = "";
      scope.current.style.height = "";
      scope.current.style.borderRadius = "";
      setIsOpen(false);
    }

    setIsAnimating(false);
  };

  return (
    <nav className="fixed top-5 left-0 right-0 z-50 flex justify-center items-center px-4 sm:px-0">
      <div
        ref={scope}
        className="w-fit border h-12 sm:h-14 rounded bg-background/80 dark:bg-background/60 backdrop-blur-md flex flex-col overflow-hidden"
      >
        {/* Top bar */}
        <div className="flex justify-between items-center h-12 sm:h-14 shrink-0 px-4 sm:px-5 gap-3 sm:gap-4">
          <motion.button
            onClick={handleToggle}
            className="cursor-pointer relative h-5 w-5 sm:h-6 sm:w-6"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
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
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <Link
            href={"/"}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              if (isOpen) handleToggle();
            }}
          >
            <Image
              src="/md-red-logo.svg"
              alt="Md Logo"
              className="h-7 w-7 sm:h-8 sm:w-8 cursor-pointer"
              width={10}
              height={10}
            />
          </Link>

          <ThemeToggleButton
            start="left-right"
            variant="rectangle"
            className="bg-background-foreground border h-5 w-5 sm:h-6 sm:w-6"
          />
        </div>

        {/* Expandable content */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col flex-1 px-4 sm:px-5 pt-3 sm:pt-4 pb-4 sm:pb-5 overflow-y-auto max-h-[calc(55vh-3rem)]"
            >
              {/* Navigation links */}
              <div className="flex-1 flex flex-col justify-start md:justify-center">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 sm:mb-4"
                >
                  Navigation
                </motion.span>

                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 25, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{
                      opacity: 0,
                      y: -12,
                      filter: "blur(3px)",
                      transition: {
                        duration: 0.15,
                        delay: (navLinks.length - 1 - i) * 0.03,
                      },
                    }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link
                      href={link.href}
                      onClick={handleToggle}
                      className="group relative pr-3 sm:pr-4 flex items-center gap-2 sm:gap-3 py-2 sm:py-2.5 border-b border-border/20 last:border-b-0"
                    >
                      {/* Number */}
                      <motion.span
                        className="text-xs font-mono text-muted-foreground/60 w-5 sm:w-6 shrink-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: i * 0.06 + 0.15,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </motion.span>

                      {/* Link text */}
                      <div className="flex-1 overflow-hidden">
                        <motion.div
                          className="flex items-baseline gap-2 sm:gap-2"
                          animate={{
                            x: hoveredIndex === i ? 8 : 0,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <span className="text-base sm:text-lg md:text-2xl font-bold tracking-tighter leading-none">
                            {link.name}
                          </span>

                          <motion.span
                            className="text-xs text-muted-foreground hidden md:inline-block"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                              opacity: hoveredIndex === i ? 1 : 0,
                              x: hoveredIndex === i ? 0 : -10,
                            }}
                            transition={{
                              duration: 0.2,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                          >
                            — {link.label}
                          </motion.span>
                        </motion.div>
                      </div>

                      {/* Arrow */}
                      <motion.div
                        className="shrink-0"
                        animate={{
                          opacity: hoveredIndex === i ? 1 : 0.3,
                          rotate: hoveredIndex === i ? 0 : -45,
                          scale: hoveredIndex === i ? 1 : 0.7,
                        }}
                        transition={{
                          duration: 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </motion.div>

                      {/* Hover bar */}
                      <motion.div
                        className="absolute -left-3 sm:-left-4 top-0 bottom-0 w-[2px] bg-primary rounded-full origin-top"
                        initial={{ scaleY: 0 }}
                        animate={{
                          scaleY: hoveredIndex === i ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.2,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Bottom bar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                  delay: navLinks.length * 0.06 + 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col justify-between items-start gap-2 pt-2 sm:pt-3 mt-auto border-t border-border/20"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    Available for projects
                  </span>
                </div>

                {/* Mobile social links */}
                <div className="flex gap-2 md:hidden text-xs">
                  {socialLinks.slice(0, 3).map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
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
