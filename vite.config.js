
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const base = "/princess-birthday/";

export default defineConfig({
  base,

  plugins: [
    react(),

    VitePWA({
      registerType: "prompt",

      includeAssets: [
        "data/*.json",
        "frames/*.png",
        "fonts/*",
        "audio/*.mp3",
        "images/**/*.{png,jpg,jpeg,webp,svg}"
      ],

      manifest: {
        name: "Princess Birthday",
        short_name: "My Princess",
        description: "A special birthday experience",
        start_url: base,
        scope: base,
        display: "standalone",
        background_color: "#FFF6F8",
        theme_color: "#EFA6C4",
        icons: [
          {
            src: `${base}icons/icon-192.png`,
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: `${base}icons/icon-512.png`,
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },

      workbox: {
        globPatterns: [
          "**/*.{js,css,html,svg,png,jpg,jpeg,webp,json,woff,woff2,mp3}"
        ],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024
      }
    })
  ]
});
