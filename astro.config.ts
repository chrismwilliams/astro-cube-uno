import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap()],
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
    css: {
      transformer: "lightningcss",
    },
  },
});
