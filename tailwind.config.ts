import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import {
  clampGenerator,
  tokensToTailwind,
} from "@chriswilliams/tokens-to-tailwind";

// Design Tokens
import colorTokens from "./src/design-tokens/colors.json";
import fontTokens from "./src/design-tokens/fonts.json";
import viewports from "./src/design-tokens/viewports.json";
import spacingTokens from "./src/design-tokens/spacing.json";
import textWeightTokens from "./src/design-tokens/text-weights.json";
import textSizeTokens from "./src/design-tokens/text-sizes.json";
import textLeadingTokens from "./src/design-tokens/text-leading.json";

// Process tokens
const colors = tokensToTailwind(colorTokens.items);
const fontFamily = tokensToTailwind(fontTokens.items);
const fontWeight = tokensToTailwind(textWeightTokens.items);
const spacing = tokensToTailwind(
  clampGenerator(spacingTokens.items, viewports)
);
const fontSize = tokensToTailwind(
  clampGenerator(textSizeTokens.items, viewports)
);
const lineHeight = tokensToTailwind(textLeadingTokens.items);

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    backgroundColor: ({ theme }) => theme("colors"),
    borderColor: ({ theme }) => theme("colors"),
    colors,
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    margin: ({ theme }) => ({
      auto: "auto",
      ...theme("spacing"),
    }),
    padding: ({ theme }) => theme("spacing"),
    spacing,
    textColor: ({ theme }) => theme("colors"),
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
  corePlugins: {
    // Disables Tailwind's reset
    preflight: false,
    borderColor: false,
    borderOpacity: false,
    borderSpacing: false,
    boxShadow: false,
    display: false,
    filter: false,
    fontVariantNumeric: false,
    backdropFilter: false,
    ringWidth: false,
    ringColor: false,
    ringOffsetWidth: false,
    ringOffsetColor: false,
    textOpacity: false,
    transform: false,
    touchAction: false,
    scrollSnapType: false,
  },
  plugins: [
    // Generates custom property values from tailwind config
    plugin(({ addBase, config }) => {
      const currentConfig = config();

      const groups = [
        { key: "fontFamily", prefix: "font" },
        { key: "spacing", prefix: "space" },
        { key: "fontSize", prefix: "size" },
        { key: "colors", prefix: "color" },
        { key: "fontWeight", prefix: "font" },
      ];

      const cssVars: Record<string, string> = {};

      for (const { key, prefix } of groups) {
        if (currentConfig.theme) {
          const group = currentConfig.theme[key];

          if (!group) {
            return;
          }

          for (const [key] of Object.entries(group)) {
            if (Array.isArray(group[key])) {
              // If the value is an array, join its elements into a comma-separated string
              cssVars[`--${prefix}-${key}`] = group[key].join(", ");
            } else {
              // Otherwise, assign the value as is
              cssVars[`--${prefix}-${key}`] = group[key];
            }
          }
        }
      }

      addBase({
        ":root": cssVars,
      });
    }),

    // Generates custom utility classes
    plugin(({ addUtilities, config }) => {
      const currentConfig = config();
      const customUtilities = [
        { key: "spacing", prefix: "flow-space", property: "--flow-space" },
        { key: "spacing", prefix: "region-space", property: "--region-space" },
        { key: "spacing", prefix: "gutter", property: "--gutter" },
      ];

      const utilities: Record<string, Record<string, string>> = {};

      for (const { key, prefix, property } of customUtilities) {
        if (currentConfig.theme) {
          const group = currentConfig.theme[key];

          if (!group) {
            return;
          }

          for (const [key] of Object.entries(group)) {
            utilities[`.${prefix}-${key}`] = { [property]: group[key] };
          }
        }
      }
      // console.log(utilities);
      addUtilities(utilities);
    }),
  ],
} satisfies Config;
