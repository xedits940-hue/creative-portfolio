"use client";

import { useState } from "react";
import Preloader from "@/components/common/preloader";
import AboutMe from "@/components/sections/about/about-me";
import CalBooking from "@/components/sections/home/cal-booking";
import Testimonials from "@/components/sections/home/testimonials";
import { TimelineDemo } from "@/components/sections/home/timeline-demo";
import ShowReel from "@/components/sections/showreel";
import CollabSec from "@/components/sections/home/collab-section";
import AboutSection from "@/components/sections/about/about-section";
import Features from "@/components/sections/home/features";
import WoodStoryRevealSection from "@/components/wood-story-reveal-section";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center scroll-smooth bg-transparent">
        {/* 1. Hero Section */}
        <section id="hero" className="w-full scroll-mt-24 bg-transparent">
          <AboutMe />
        </section>

        {/* 2. Showreel Showcase */}
        <ShowReel />

        {/* 3. About Section */}
        <section id="about" className="w-full scroll-mt-24 bg-transparent">
          <AboutSection />
        </section>

        {/* 4. 2D Animation Projects */}
        <section id="features" className="w-full scroll-mt-24 bg-transparent">
          <Features />
        </section>

        {/* 5. Interactive Wood Story Reveal */}
        <section id="story-reveal" className="w-full scroll-mt-24 bg-transparent">
          <WoodStoryRevealSection />
        </section>

        {/* 6. Verified Credentials & Certificates (GEMMI, CBITTS, certicate) */}
        <section id="projects" className="w-full scroll-mt-24 bg-transparent">
          <TimelineDemo />
        </section>

        {/* 7. Collaboration & Partners */}
        <CollabSec />

        {/* 8. Client Testimonials */}
        <Testimonials />

        {/* 9. Calendar Booking & Contact */}
        <section id="contact" className="w-full scroll-mt-24 bg-transparent">
          <CalBooking />
        </section>
      </div>
    </>
  );
}
