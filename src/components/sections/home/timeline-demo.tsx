import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { FeatureCard } from "./features";
import PhraseAnimation from "@/components/common/phrase-reveal";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudioMediaFrameProps {
  title: string;
  category: string;
  specs?: string;
  className?: string;
}

function StudioMediaFrame({
  title,
  category,
  specs = "4K HDR // 60 FPS",
  className,
}: StudioMediaFrameProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-neutral-950 flex flex-col justify-between p-6 border border-neutral-800/80 group-hover:border-primary/50 transition-colors duration-500",
        className
      )}
    >
      {/* Cinematic subtle grid & scanline texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-radial from-transparent via-black/40 to-black/90" />

      {/* Top Header info */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary/80 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {category}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
          {specs}
        </span>
      </div>

      {/* Center Studio Reel Badge / Play indicator */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-6">
        <div className="h-12 w-12 rounded-full border border-primary/40 bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
          <Play className="h-4 w-4 text-primary ml-0.5" />
        </div>
        <h4 className="text-base md:text-lg font-bold tracking-tight text-white/90">
          {title}
        </h4>
        <p className="text-[11px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">
          Production Reel // Active Studio Archive
        </p>
      </div>

      {/* Bottom Footer metadata */}
      <div className="relative z-10 flex items-center justify-between border-t border-neutral-800/60 pt-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">
          VTECH STUDIOS MEDIA FRAME
        </span>
        <span className="font-mono text-[9px] text-neutral-400">
          STANDBY // VERIFIED MASTER
        </span>
      </div>
    </div>
  );
}

export function TimelineDemo() {
  const data = [
    {
      title: "SaaS Product Video Editing",
      content: (
        <div>
          <h3 className="text-xs font-normal text-neutral-800 md:text-3xl dark:text-neutral-200">
            <PhraseAnimation phrase="Showcase  Your  Product  in  Motion" />
          </h3>
          <p className="mb-8 text-xs text-muted-foreground md:text-lg mt-1.5">
            <PhraseAnimation phrase="Transform your SaaS product into captivating demo videos. From feature highlights to onboarding tutorials, we create motion edits that convert viewers into customers and drive product adoption." />
          </p>
          <div className="mx-auto grid gap-4 lg:grid-cols-2">
            <FeatureCard className="p-0 w-full">
              <StudioMediaFrame
                title="SaaS Interactive Interface Walkthrough"
                category="SaaS Product Video"
                specs="4K PRORES 422"
                className="aspect-[20/16]"
              />
            </FeatureCard>

            <FeatureCard className="p-0 w-full">
              <StudioMediaFrame
                title="Feature Highlight & Growth Narrative"
                category="Conversion Promo"
                specs="1080P 60FPS"
                className="aspect-[20/16]"
              />
            </FeatureCard>

            <FeatureCard className="p-0 w-full lg:col-span-2">
              <StudioMediaFrame
                title="Platform Launch Cinematic Demo"
                category="Flagship Showcase"
                specs="CINEMATIC 4K WIDESCREEN"
                className="min-h-[250px]"
              />
            </FeatureCard>
          </div>
        </div>
      ),
    },
    {
      title: "2D Animation & Storytelling ",
      content: (
        <div>
          <h3 className="text-xs font-normal text-neutral-800 md:text-3xl dark:text-neutral-200">
            <PhraseAnimation phrase="Bringing  Stories  To  Motion" />
          </h3>
          <p className="mb-8 text-xs text-muted-foreground md:text-lg mt-1.5">
            <PhraseAnimation phrase="From original stories to scroll-stopping brand ads, transform concepts into 2D animations that simplify your message and capture your audience's attention instantly." />
          </p>
          <div className="mx-auto grid gap-4 lg:grid-cols-2">
            <FeatureCard className="p-0 w-full">
              <StudioMediaFrame
                title="Original Character Animation Sequence"
                category="2D Motion Story"
                specs="12-FRAME CEL / 4K"
                className="aspect-[20/16]"
              />
            </FeatureCard>

            <FeatureCard className="p-0 w-full">
              <StudioMediaFrame
                title="Commercial Vector Campaign Spot"
                category="Brand Campaign"
                specs="60FPS VECTOR MOTION"
                className="aspect-[20/16]"
              />
            </FeatureCard>

            <FeatureCard className="p-0 w-full lg:col-span-2">
              <StudioMediaFrame
                title="Explainer & Narrative Universe Reel"
                category="Narrative Animation"
                specs="PRORES HQ // 2.39:1"
                className="min-h-[250px]"
              />
            </FeatureCard>
          </div>
        </div>
      ),
    },
    // {
    //   title: "High-Impact Reels  for  Real Growth",
    //   content: (
    //     <div>
    //       <h3 className="text-xs font-normal text-neutral-800 md:text-3xl dark:text-neutral-200">
    //         <PhraseAnimation phrase="Fast.   Clean.   Hooked  from  the  first  second" />
    //       </h3>
    //       <p className="mb-8 text-xs text-muted-foreground md:text-lg mt-1.5">
    //         <PhraseAnimation phrase="fast, clean 2D reels designed to win the first second. Every edit is focused on holding attention and driving growth for your channel or brand." />
    //       </p>
    //       <div className="mx-auto grid gap-4 lg:grid-cols-3">
    //         <FeatureCard className="p-0 w-full">
    //           <div>
    //             <iframe
    //               loading="lazy"
    //               title="Youtube Video"
    //               src="https://www.youtube.com/embed/OlR9TWUJlSM"
    //               frameBorder="0"
    //               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    //               allowFullScreen
    //               className="w-full aspect-[9/16]"
    //             />
    //           </div>
    //         </FeatureCard>

    //         <FeatureCard className="p-0 w-full">
    //           <iframe
    //             width="100%"
    //             height="100%"
    //             src="https://www.youtube.com/embed/CpAIy_TVZqo"
    //             title="YouTube video player"
    //             frameBorder="0"
    //             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    //             referrerPolicy="strict-origin-when-cross-origin"
    //             allowFullScreen
    //           ></iframe>
    //         </FeatureCard>

    //         <FeatureCard className="p-0 w-full">
    //           <iframe
    //             width="100%"
    //             height="100%"
    //             src="https://www.youtube.com/embed/-h2KSW2kpxE"
    //             title="YouTube video player"
    //             frameBorder="0"
    //             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    //             referrerPolicy="strict-origin-when-cross-origin"
    //             allowFullScreen
    //             className="w-full aspect-[9/16]"
    //           ></iframe>
    //         </FeatureCard>
    //         {/* <FeatureCard className="p-0 w-full">
    //           <iframe
    //             width="100%"
    //             height="100%"
    //             src="https://www.youtube.com/embed/mvPQwLOXbB4"
    //             title="YouTube video player"
    //             frameBorder="0"
    //             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    //             referrerPolicy="strict-origin-when-cross-origin"
    //             allowFullScreen
    //             className="w-full aspect-[9/16]"
    //           ></iframe>
    //         </FeatureCard> */}
    //       </div>
    //     </div>
    //   ),
    // },
    // {
    //   title: "Our Video Editing Process",
    //   content: (
    //     <div>
    //       <img
    //         src="https://framerusercontent.com/images/3j4k9lOKgq5gCTabInH0bUlT0I.png?scale-down-to=2048"
    //         alt=""
    //       />
    //     </div>
    //   ),
    // },
  ];
  return (
    <div className="relative w-full overflow-clip mt-10">
      <Timeline data={data} />
    </div>
  );
}
