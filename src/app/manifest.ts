import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mens Corner — Premium Men's Fashion",
    short_name: "Mens Corner",
    description: "Premium men's suits, formal wear, and accessories for the modern South African man.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F7F8",
    theme_color: "#1A1D23",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
