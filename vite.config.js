import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/offline-catalog-app/",
  resolve: {
    alias: {
      "react-router-dom": fileURLToPath(new URL("./src/shims/react-router-dom.jsx", import.meta.url)),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "font",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "catalog-app-shell",
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "catalog-images",
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxEntries: 450,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern:
             /^https:\/\/offline-catalog-backend\.onrender\.com\/api\/(products|categories)(\?.*)?$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "catalog-core-api",
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 10,
              },
            },
          },
          {
            urlPattern:
              /^https:\/\/offline-catalog-backend\.onrender\.com\/api\/(customers|orders)(\?.*)?$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "catalog-dynamic-api",
              networkTimeoutSeconds: 4,
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxEntries: 40,
                maxAgeSeconds: 60 * 5,
              },
            },
          },
        ],
      },
      manifest: {
        name: "Offline Catalog",
        short_name: "Catalog",
        theme_color: "#0EA5A4",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
