"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "@/components/common/preloader";
import AboutMe from "@/components/sections/about/about-me";
import CalBooking from "@/components/sections/home/cal-booking";
import Testimonials from "@/components/sections/home/testimonials";
import { TimelineDemo } from "@/components/sections/home/timeline-demo";
import ShowReel from "@/components/sections/showreel";
import CollabSec from "@/components/sections/home/collab-section";
import AboutSection from "@/components/sections/about/about-section";
import WoodStoryRevealSection from "@/components/wood-story-reveal-section";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center scroll-smooth bg-transparent">
        {/* 1. Hero Section - Immediately Visible with Rich High-End Visuals */}
        <section id="hero" className="w-full scroll-mt-24 bg-transparent">
          <AboutMe />
        </section>

        {/* 2. Showreel Showcase */}
        <ShowReel />

        {/* 3. About Section */}
        <section id="about" className="w-full scroll-mt-24 bg-transparent">
          <AboutSection />
        </section>

        {/* 4. Interactive Wood Story Reveal */}
        <section id="story-reveal" className="w-full scroll-mt-24 bg-transparent">
          <WoodStoryRevealSection />
        </section>

        {/* 5. Verified Credentials & Certificates Timeline */}
        <section id="projects" className="w-full scroll-mt-24 bg-transparent">
          <TimelineDemo />
        </section>

        {/* 6. Collaboration & Partners */}
        <CollabSec />

        {/* 7. Client Testimonials */}
        <Testimonials />

        {/* 8. Calendar Booking */}
        <section id="booking" className="w-full scroll-mt-24 bg-transparent">
          <CalBooking />
        </section>
      </main>
    </>
  );
}
