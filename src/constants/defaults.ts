import { RoundStyle } from "../card/types/types";
import { getThemeColors } from "./theme";

export const DEFAULTS = {
  gradient: {
    backgroundOpacity: 0.25,
    resolution: "auto" as const,
    numericalResolution: 25,
    numericalResolutionMin: 1,
    numericalResolutionMax: 45,
  },

  values: {
    min: 0,
    max: 100,
  },

  ui: {
    animationSpeed: "normal",
    barHeight: "1.5rem",
    iconColor: "var(--primary-text-color)",
    minMaxIndicators: {
      opacity: 0.8,
      fill: "rgb(255, 255, 255)",
      labelColor: "#111111",
    },
    needleColor: "var(--primary-text-color)",
    orientation: "horizontal",
    roundStyle: "full",
    setpointNeedleColor: "var(--error-color)",
    titleColor: "var(--primary-text-color)",
    titleFontSizePrimary: "15px",
    titleFontSizeSecondary: "14px",
    valueTextColor: "var(--primary-text-color)",
  },

  severity: {
    colorMode: "basic" as const,
    // keep this lazy
    defaultColor: () => getThemeColors().info,
  },

  svg: {
    value: {
      single: `
        M 0 -0.75 
        A 0.75 0.75 0 0 1 0 0.75
        A 0.75 0.75 0 1 1 0 -0.75
        z
      `,
      dual: `
        M -0.4 -1
        L 0.4 -1
        L 0 -0.1
        L -0.4 -1
        z
      `,
    },
    setpoint: {
      single: `
        M 0 -0.4 
        A 0.4 0.4 0 0 1 0 0.4
        A 0.4 0.4 0 1 1 0 -0.4
        z
      `,
      dual: `
        M 0 -0.8
        A 0.3 0.3 90 0 1 0 -0.2 
        A 0.3 0.3 90 1 1 0 -0.8 
        z
      `,
    },
  },
} as const;

export const ROUND_FACTORS: Partial<Record<RoundStyle, number>> = {
  full: 2,
  medium: 3,
  small: 6,
};
