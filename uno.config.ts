import { defineConfig, transformerDirectives, presetMini } from "unocss";
// import presetWind from "@unocss/preset-wind";
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

// ! TODO: Add CUBE.css

export default defineConfig({
  transformers: [transformerDirectives()],
  presets: [presetMini({ preflight: "on-demand" })],
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
  ],
});
