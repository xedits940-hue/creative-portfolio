import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VTECH STUDIOS",
    short_name: "VTECH STUDIOS",
    description:
      "OFFICIAL STUDIO PORTFOLIO OF VTECH STUDIOS — DIGITAL PRODUCTION, MOTION, AND HIGH-END CREATIVE ENGINEERING.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      {
        src: "/favicon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/vtech-studios-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/vtech-studios-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
