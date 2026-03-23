import { buildTheme } from "@sanity/ui/theme";
import { color } from "@sanity/color";

// Warm gray — linen-tinted light end, espresso-tinted dark end.
// Replaces Sanity's default cool gray, which controls backgrounds, borders,
// text, and surface tones throughout both light and dark modes.
const warmGray = {
  title: "Warm Gray",
  // 50–200 unchanged — light mode backgrounds stay identical
  "50":  { title: "Warm Gray 50",  hex: "#FAF8F5" },
  "100": { title: "Warm Gray 100", hex: "#F2EDE5" },
  "200": { title: "Warm Gray 200", hex: "#E5DDD0" },
  // 300–600 brightened — these become muted text colours in dark mode;
  // in light mode they're subtle borders/hover states (barely perceptible change)
  "300": { title: "Warm Gray 300", hex: "#DAD0C0" },
  "400": { title: "Warm Gray 400", hex: "#C0B2A2" },
  "500": { title: "Warm Gray 500", hex: "#9E8E7F" },
  "600": { title: "Warm Gray 600", hex: "#7D6D60" },
  // 700 — transition point, kept close to original
  "700": { title: "Warm Gray 700", hex: "#574840" },
  // 800–950 cooler and slightly lighter — creates chromatic distance from
  // warm terracotta text so they stop blending; light mode text unaffected
  "800": { title: "Warm Gray 800", hex: "#302826" },
  "900": { title: "Warm Gray 900", hex: "#201B1A" },
  "950": { title: "Warm Gray 950", hex: "#151111" },
};

// Terracotta replaces blue, which is the hue Sanity uses for the "primary"
// tone — buttons, active states, focus rings, selections.
const terracotta = {
  title: "Terracotta",
  "50":  { title: "Terracotta 50",  hex: "#fdf4ef" },
  "100": { title: "Terracotta 100", hex: "#fae4d7" },
  "200": { title: "Terracotta 200", hex: "#fad4b8" },
  "300": { title: "Terracotta 300", hex: "#f4b490" },
  "400": { title: "Terracotta 400", hex: "#e8926A" },
  "500": { title: "Terracotta 500", hex: "#C4653A" },
  "600": { title: "Terracotta 600", hex: "#a5502c" },
  "700": { title: "Terracotta 700", hex: "#843d20" },
  "800": { title: "Terracotta 800", hex: "#632d17" },
  "900": { title: "Terracotta 900", hex: "#3f1c0e" },
  "950": { title: "Terracotta 950", hex: "#2a1109" },
};

// Font metrics are Inter defaults — close enough for DM Sans / Playfair.
// These are needed by Sanity for baseline-grid calculations.
const textSizes = [
  { ascenderHeight: 4,   descenderHeight: 4,   fontSize: 10, iconSize: 17, lineHeight: 15, letterSpacing: 0 },
  { ascenderHeight: 5,   descenderHeight: 5,   fontSize: 13, iconSize: 21, lineHeight: 19, letterSpacing: 0 },
  { ascenderHeight: 6,   descenderHeight: 6,   fontSize: 15, iconSize: 25, lineHeight: 23, letterSpacing: 0 },
  { ascenderHeight: 7,   descenderHeight: 7,   fontSize: 18, iconSize: 29, lineHeight: 27, letterSpacing: 0 },
  { ascenderHeight: 8,   descenderHeight: 8,   fontSize: 21, iconSize: 33, lineHeight: 31, letterSpacing: 0 },
];
const labelSizes = [
  { ascenderHeight: 2, descenderHeight: 2, fontSize: 8.1,  iconSize: 13, lineHeight: 10, letterSpacing: 0.5 },
  { ascenderHeight: 2, descenderHeight: 2, fontSize: 9.5,  iconSize: 15, lineHeight: 11, letterSpacing: 0.5 },
  { ascenderHeight: 2, descenderHeight: 2, fontSize: 10.8, iconSize: 17, lineHeight: 12, letterSpacing: 0.5 },
  { ascenderHeight: 2, descenderHeight: 2, fontSize: 12.25,iconSize: 19, lineHeight: 13, letterSpacing: 0.5 },
  { ascenderHeight: 2, descenderHeight: 2, fontSize: 13.6, iconSize: 21, lineHeight: 14, letterSpacing: 0.5 },
  { ascenderHeight: 2, descenderHeight: 2, fontSize: 15,   iconSize: 23, lineHeight: 15, letterSpacing: 0.5 },
];
const headingSizes = [
  { ascenderHeight: 5,   descenderHeight: 5,   fontSize: 13, iconSize: 17, lineHeight: 19, letterSpacing: 0 },
  { ascenderHeight: 6,   descenderHeight: 6,   fontSize: 16, iconSize: 25, lineHeight: 23, letterSpacing: 0 },
  { ascenderHeight: 7,   descenderHeight: 7,   fontSize: 21, iconSize: 33, lineHeight: 29, letterSpacing: 0 },
  { ascenderHeight: 8,   descenderHeight: 8,   fontSize: 27, iconSize: 41, lineHeight: 35, letterSpacing: 0 },
  { ascenderHeight: 9.5, descenderHeight: 8.5, fontSize: 33, iconSize: 49, lineHeight: 41, letterSpacing: 0 },
  { ascenderHeight: 10.5,descenderHeight: 9.5, fontSize: 38, iconSize: 53, lineHeight: 47, letterSpacing: 0 },
];
const codeSizes = [
  { ascenderHeight: 4, descenderHeight: 4, fontSize: 10, iconSize: 17, lineHeight: 15, letterSpacing: 0 },
  { ascenderHeight: 5, descenderHeight: 5, fontSize: 13, iconSize: 21, lineHeight: 19, letterSpacing: 0 },
  { ascenderHeight: 6, descenderHeight: 6, fontSize: 16, iconSize: 25, lineHeight: 23, letterSpacing: 0 },
  { ascenderHeight: 7, descenderHeight: 7, fontSize: 19, iconSize: 29, lineHeight: 27, letterSpacing: 0 },
  { ascenderHeight: 8, descenderHeight: 8, fontSize: 22, iconSize: 33, lineHeight: 31, letterSpacing: 0 },
];

export const studioTheme = buildTheme({
  // Warmer palette — linen light mode, espresso dark mode
  palette: { ...color, gray: warmGray, blue: terracotta },

  // Softer border radius throughout — inputs, buttons, cards, dropdowns
  // Default: [0, 1, 3, 6, 9, 12, 21]
  radius: [0, 2, 6, 12, 18, 24, 999],

  // Brand fonts — DM Sans for UI text, Playfair Display for headings
  // CSS variables are injected by the root Next.js layout
  font: {
    text: {
      family: "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif",
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
      sizes: textSizes,
    },
    label: {
      family: "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif",
      weights: { regular: 600, medium: 700, semibold: 800, bold: 900 },
      sizes: labelSizes,
    },
    heading: {
      family: "var(--font-playfair), 'Playfair Display', Georgia, serif",
      weights: { regular: 700, medium: 800, semibold: 900, bold: 900 },
      sizes: headingSizes,
    },
    code: {
      family: "'Fira Code', 'Cascadia Code', 'Menlo', monospace",
      weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
      sizes: codeSizes,
    },
  },
});
