import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VISHAL SHARMA",
    short_name: "VISHAL SHARMA",
    description:
      "PORTFOLIO OF VISHAL SHARMA, A SELF-TAUGHT VIBE CODER FROM CHANDIGARH, INDIA, TURNING IDEAS INTO IMMERSIVE DIGITAL EXPERIENCES THROUGH CREATIVITY, EXPERIMENTATION, AND AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
