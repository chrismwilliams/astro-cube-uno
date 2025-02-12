import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { defineConfig, transformerDirectives, presetMini } from "unocss";
import {
  tokensToTailwind as tokensToUno,
  clampGenerator,
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
const colors = tokensToUno(colorTokens.items);
const fontFamily = tokensToUno(fontTokens.items);
const fontWeight = tokensToUno(textWeightTokens.items);
const spacing = tokensToUno(clampGenerator(spacingTokens.items, viewports));
const fontSize = tokensToUno(clampGenerator(textSizeTokens.items, viewports));
const lineHeight = tokensToUno(textLeadingTokens.items);

const resetCSS = await readFile(resolve("./src/css/global/reset.css"), "utf-8");
const globalCSS = await readFile(
  resolve("./src/css/global/global-styles.css"),
  "utf-8"
);
const fontCSS = await readFile(
  resolve("./src/css/global/font-face.css"),
  "utf-8"
);
// ! TODO: Remove some styles from astro-cube, Compare

export default defineConfig({
  transformers: [transformerDirectives()],
  presets: [presetMini({ preflight: "on-demand" })],
  layers: {
    reset: -1,
    base: 1,
    components: 2,
    default: 3,
  },
  outputToCssLayers: {
    cssLayerName: (layer) => {
      if (layer === "preflights" || layer === "default") return null;
      return layer;
    },
  },
  theme: {
    colors,
    fontFamily: Object.fromEntries(
      Object.entries(fontFamily).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(", ") : value,
      ])
    ),
    fontWeight,
    fontSize,
    lineHeight,
    spacing,
    breakpoints: {
      sm: `${viewports.min}px`,
      md: `${viewports.mid}px`,
      lg: `${viewports.max}px`,
    },
  },
  preflights: [
    {
      layer: "reset",
      getCSS: () => resetCSS,
    },
    {
      layer: "base",
      getCSS: () => globalCSS,
    },
    {
      layer: "base",
      getCSS: () => fontCSS,
    },
    {
      layer: "base",
      getCSS: () => {
        const groups = [
          { prefix: "color", tokens: colors },
          { prefix: "font", tokens: fontFamily },
          { prefix: "size", tokens: fontSize },
          { prefix: "font", tokens: fontWeight },
          { prefix: "leading", tokens: lineHeight },
          { prefix: "space", tokens: spacing },
        ];
        let cssVars = "";

        for (const { prefix, tokens } of groups) {
          if (!tokens) continue;

          for (const [key, value] of Object.entries(tokens)) {
            if (Array.isArray(value)) {
              cssVars += `--${prefix}-${key}:${value.join(", ")};`;
            } else {
              cssVars += `--${prefix}-${key}:${value};`;
            }
          }
        }
        return `:root {${cssVars}}`;
      },
    },
  ],
  rules: [
    [
      /^flow-space-(.+)$/,
      ([, d]) => ({ "--flow-space": `var(--space-${d})` }),
      { layer: "components" },
    ],
    [
      /^region-space-(.+)$/,
      ([, d]) => ({ "--region-space": `var(--space-${d})` }),
      { layer: "components" },
    ],
    [
      /^gutter-(.+)$/,
      ([, d]) => ({ "--gutter": `var(--space-${d})` }),
      { layer: "components" },
    ],
    [
      /^flow$/,
      (_, { symbols }) => {
        return {
          [symbols.selector]: (selector) => `${selector} > * + *`,
          "margin-top": "var(--flow-space, 1em)",
        };
      },
      { layer: "components" },
    ],
    [
      "cluster",
      {
        display: "flex",
        "flex-wrap": "wrap",
        gap: "var(--cluster-gap, 1rem)",
      },
      { layer: "components" },
    ],
    [
      "wrapper",
      {
        "margin-inline": "auto",
        "max-width": "clamp(16rem, var(--wrapper-max-width, 100vw), 80rem)",
        "padding-left": "var(--gutter)",
        "padding-right": "var(--gutter)",
        position: "relative",
      },
      { layer: "components" },
    ],
    [
      "region",
      {
        "padding-block": "var(--region-space, var(--space-xl-2xl))",
      },
      { layer: "components" },
    ],
    [
      "visually-hidden",
      {
        border: "0",
        clip: "rect(0 0 0 0)",
        height: "0",
        margin: "0",
        overflow: "hidden",
        padding: "0",
        position: "absolute",
        width: "1px",
        "white-space": "nowrap",
      },
      { layer: "components" },
    ],
    [
      /^switcher$/,
      function* (_, { symbols }) {
        yield {
          display: "flex",
          "flex-wrap": "wrap",
          gap: "var(--gutter, var(--space-s-l))",
          "align-items": "var(--switcher-vertical-alignment, flex-start)",
        };
        yield {
          [symbols.selector]: (selector) => `${selector} > *`,
          "flex-grow": "1",
          "flex-basis":
            "calc((var(--switcher-target-container-width, 40rem) - 100%) * 999)",
        };
        yield {
          [symbols.selector]: (selector) => `${selector} > :nth-child(n + 3)`,
          "flex-basis": "100%",
        };
      },
      { layer: "components" },
    ],
    [
      /^sidebar$/,
      function* (_, { symbols }) {
        yield {
          display: "flex",
          "flex-wrap": "wrap",
          gap: "var(--gutter, var(--space-s-l))",
        };
        yield {
          [symbols.selector]: (selector) => `${selector} > :first-child`,
          "flex-grow": "1",
          "flex-basis": "var(--sidebar-target-width, 20rem)",
        };
        yield {
          [symbols.selector]: (selector) => `${selector} > :last-child`,
          "flex-basis": 0,
          "flex-grow": 999,
          "min-width": "var(--sidebar-content-min-width, 50%)",
        };
      },
      { layer: "components" },
    ],
    [
      /^repel$/,
      function* (_, { symbols }) {
        yield {
          display: "flex",
          "flex-wrap": "wrap",
          gap: " var(--gutter, var(--space-s-m))",
          "justify-content": "space-between",
          "align-items": "var(--repel-vertical-alignment, center)",
        };
        yield {
          [symbols.selector]: (selector) => `${selector}[data-nowrap]`,
          "flex-wrap": "nowrap",
        };
      },
      { layer: "components" },
    ],
    [
      /^grid$/,
      function* (_, { symbols }) {
        yield {
          display: "grid",
          "grid-template-columns":
            "repeat(var(--grid-placement, auto-fill),minmax(var(--grid-min-item-size,16rem), 1fr))",
          gap: "var(--gutter, var(--space-s-l))",
        };
        yield {
          [symbols.selector]: (selector) => `${selector}[data-layout="50-50"]`,
          "--grid-placement": "auto-fit",
          "--grid-min-item-size": "clamp(16rem, 50vw, 33rem)",
        };
        yield {
          [symbols.selector]: (selector) => `${selector}[data-layout="thirds"]`,
          "--grid-placement": "auto-fit",
          "--grid-min-item-size": "clamp(16rem, 33%, 20rem)",
        };
      },
      { layer: "components" },
    ],
  ],
});
