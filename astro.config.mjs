import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [sitemap()],
  vite: {
    // option applyBaseStyles doesn't seem to do much atm
    plugins: [tailwindcss({ applyBaseStyles: false })],
    css: {
      transformer: "lightningcss",
    },
  },
});
