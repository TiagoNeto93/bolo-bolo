import { buildTheme } from "@sanity/ui/theme";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const studioTheme = buildTheme({
  // `hues` is a runtime-supported config not yet reflected in the v3 types
  hues: {
    primary: { mid: "#C4653A", midPoint: 500 },
  },
} as any);
