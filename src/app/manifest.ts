import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Catat Uang",
    short_name: "CatatUang",
    description: "Aplikasi pencatatan keuangan pribadi",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f4",
    theme_color: "#2563eb",
    orientation: "portrait-primary",
    icons: [
      { src: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icon-192.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  };
}
