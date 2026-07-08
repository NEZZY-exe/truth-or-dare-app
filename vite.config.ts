import { defineConfig } from "@Lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",

        manifest: {
          name: "Ocean Truth or Dare",
          short_name: "Ocean",
          description:
            "A premium mobile Truth or Dare with modes for couples, friends, party, family, and custom.",
          theme_color: "#0a1428",
          background_color: "#0a1428",
          display: "standalone",
          start_url: "/",

          icons: [
            {
              src: "/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icon-512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/icon-maskable.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
  },
});