"use client";

import AboutMe from "@/components/sections/about/about-me";
import CalBooking from "@/components/sections/home/cal-booking";
import Testimonials from "@/components/sections/home/testimonials";
import { TimelineDemo } from "@/components/sections/home/timeline-demo";
import ShowReel from "@/components/sections/showreel";
import CollabSec from "@/components/sections/home/collab-section";
import AboutSection from "@/components/sections/about/about-section";

export default function Home() {
  return (
    <div className="relative z-0 flex min-h-screen w-full flex-col items-center justify-center scroll-smooth bg-transparent">
      <section id="hero" className="w-full scroll-mt-24 bg-transparent">
        <AboutMe />
      </section>

      <ShowReel />

      <section id="about" className="w-full scroll-mt-24 bg-transparent">
        <AboutSection />
      </section>

      <section id="projects" className="w-full scroll-mt-24 bg-transparent">
        <TimelineDemo />
      </section>

      <CollabSec />

      <Testimonials />

      <section id="contact" className="w-full scroll-mt-24 bg-transparent">
        <CalBooking />
      </section>
    </div>
  );
}
