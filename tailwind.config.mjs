/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const postcss = require("postcss");
const postcssJs = require("postcss-js");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    margin: () => ({
      auto: "auto",
    }),
  },
  variantOrder: [
    "first",
    "last",
    "odd",
    "even",
    "visited",
    "checked",
    "empty",
    "read-only",
    "group-hover",
    "group-focus",
    "focus-within",
    "hover",
    "focus",
    "focus-visible",
    "active",
    "disabled",
  ],

  // Disables Tailwind's reset and usage of rgb/opacity
  corePlugins: {
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
  },

  // Prevents Tailwind's core components
  blocklist: ["container"],

  // Prevents Tailwind from generating that wall of empty custom properties
  experimental: {
    optimizeUniversalDefaults: true,
  },

  plugins: [
    // Generates custom utility classes
    plugin(function ({ addUtilities, config }) {
      const currentConfig = config();
      const customUtilities = [
        { key: "spacing", prefix: "flow-space", property: "--flow-space" },
        { key: "spacing", prefix: "region-space", property: "--region-space" },
        { key: "spacing", prefix: "gutter", property: "--gutter" },
      ];

      customUtilities.forEach(({ key, prefix, property }) => {
        const group = currentConfig.theme[key];

        if (!group) {
          return;
        }

        Object.keys(group).forEach((key) => {
          addUtilities({
            [`.${prefix}-${key}`]: postcssJs.objectify(
              postcss.parse(`${property}: ${group[key]}`)
            ),
          });
        });
      });
    }),
  ],
};
