import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import UnoCSS from "unocss/astro";

// https://astro.build/config
export default defineConfig({
  // site: "",
  integrations: [
    sitemap(),
    UnoCSS({
      injectReset: false,
    }),
  ],
  build: {
    inlineStylesheets: "never",
  },
});
