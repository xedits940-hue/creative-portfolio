"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "@/components/common/preloader";
import AboutMe from "@/components/sections/about/about-me";
import CalBooking from "@/components/sections/home/cal-booking";
import Testimonials from "@/components/sections/home/testimonials";
import { TimelineDemo } from "@/components/sections/home/timeline-demo";
import CollabSec from "@/components/sections/home/collab-section";
import AboutSection from "@/components/sections/about/about-section";
import WoodStoryRevealSection from "@/components/wood-story-reveal-section";
import AppsSection from "@/components/sections/home/apps-section";
import { initTier } from "@/vtech/tier.js";

export default function Home() {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("vt:introSeen") !== "1";
      } catch {
        return false;
      }
    }
    return true;
  });

  // Initialize adaptive quality tier on startup
  useEffect(() => {
    initTier();
    if (typeof window !== "undefined" && sessionStorage.getItem("vt:introSeen") === "1") {
      document.documentElement.classList.remove("vt-intro");
      setIsLoading(false);
    }
  }, []);

  // Safety fallback: release after timeout
  useEffect(() => {
    if (!isLoading) return;
    const fallback = setTimeout(() => {
      document.documentElement.classList.remove("vt-intro");
      setIsLoading(false);
    }, 3600);
    return () => clearTimeout(fallback);
  }, [isLoading]);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          if (typeof document !== "undefined") {
            document.documentElement.classList.remove("vt-intro");
          }
        }}
      >
        {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center scroll-smooth bg-transparent">
        {/* 1. Hero Section - Immediately Visible with Rich High-End Visuals */}
        <section id="hero" className="w-full scroll-mt-24 bg-transparent vt-hero-hold">
          <AboutMe />
        </section>

        {/* 2. About Section */}
        <section id="about" className="w-full scroll-mt-24 bg-transparent">
          <AboutSection />
        </section>

        {/* 3. Interactive Wood Story Reveal */}
        <section id="story-reveal" className="w-full scroll-mt-24 bg-transparent">
          <WoodStoryRevealSection />
        </section>

        {/* 4. Verified Credentials & Certificates Timeline */}
        <section id="projects" className="w-full scroll-mt-24 bg-transparent">
          <TimelineDemo />
        </section>

        {/* 5. Collaboration & Partners */}
        <CollabSec />

        {/* 6. Interactive Apps Showcase (CardSwap 3D Effect) - Right above Siya Beauty */}
        <AppsSection />

        {/* 7. Featured Client Case Reference (Siya Beauty Parlour) */}
        <Testimonials />

        {/* 8. Collaboration Channel */}
        <section id="booking" className="w-full scroll-mt-24 bg-transparent">
          <CalBooking />
        </section>
      </main>
    </>
  );
}
