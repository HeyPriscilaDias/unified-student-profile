/**
 * This file should only contain the raw color ramps for your design system.
 * The semantic mapping (e.g., 'primary', 'error') is handled in `theme.ts`.
 */

/**
 * Converts a hex color to rgba format
 * @param hex The hex color (e.g. "#FFFFFF")
 * @param alpha The alpha value (0-1)
 * @returns The rgba color string (e.g. "rgba(255, 255, 255, 0.5)")
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const neutral = {
  25: "#FFFFFF", // White
  50: "#FAFAFA", // Neutral-50
  100: "#F5F5F5", // Neutral-100
  200: "#E9EAEB", // Neutral-200
  300: "#D5D7DA", // Neutral-300
  400: "#A4A7AE", // Neutral-400
  500: "#717680", // Neutral-500
  600: "#535862", // Neutral-600
  700: "#414651", // Neutral-700
  800: "#252B37", // Neutral-800
  900: "#181D27", // Neutral-900
};

export const Slate = {
  25: "#F8FBFA", // Slate-25
  50: "#E9EFEE", // Slate-50
  100: "#D1DBDB", // Slate-100
  200: "#B1C0BE", // Slate-200
  300: "#8FA29F", // Slate-300
  400: "#6E8884", // Slate-400
  500: "#4C6A66", // Slate-500
  600: "#2B4C46", // Slate-600
  700: "#062F29", // Slate-700
  800: "#052622", // Slate-800
  900: "#041D1A", // slate-900
};

// Backward compatibility alias; TODO: remove after updating all imports

export const blue = {
  25: "#EEF9FF", // Light Blue
  50: "#d9f0ff", // Light Blue
  100: "#bce5ff", // Light Blue
  200: "#8ed7ff", // Light Blue
  300: "#59beff", // Electric Blue AA FAIL
  400: "#3da5ff", // Electric Blue AA FAIL
  500: "#1b81f5", // Electric Blue AA FAIL
  600: "#146ae1", // Dark Blue
  700: "#1755b6", // Dark Blue
  800: "#19498f", // Dark Blue
  900: "#142d57", // Dark Blue
};

export const red = {
  // Corresponds to "Error" Palette from Figma
  25: "#FFFBFA",
  50: "#FEF3F2",
  100: "#FEE4E2",
  200: "#FECDCA",
  300: "#FDA296",
  400: "#F97066",
  500: "#F04438",
  600: "#D92D20",
  700: "#B42318",
  800: "#912018",
  900: "#7A271A",
};

export const yellow = {
  25: "#FFFCF5", // Light Orange
  50: "#FFFAEB", // Light Orange
  100: "#FEF0C7", // Light Orange
  200: "#FEDF89", // Light Orange 300
  300: "#FEC84B", // Light Orange 300
  400: "#FDB022", // Orange 700
  500: "#F79009", // Orange 700
  600: "#DC6803", // Medium Dark Orange
  700: "#B54708", // Dark Orange
  800: "#93370D", // Dark Orange
  900: "#7A2E0E", // Dark Orange
};

export const successGreen = {
  25: "#F6FEF9", // Light Green
  50: "#ECFDF3", // Light Green
  100: "#D1FADF", // Light Green
  200: "#A6F4C5", // Light Green
  300: "#6CE9A6", // Light Green
  400: "#32D583", // Light Green
  500: "#12B76A", // Dark Green
  600: "#039855", // Dark Green
  700: "#027A48", // Dark Green
  800: "#05603A", // Dark Green
  900: "#054F31", // Dark Green
};

export const lavender = {
  25:  "#F5F8FF",
  50:  "#EFF3FF",
  100: "#E0EBFF",
  200: "#C6D7FD",
  300: "#A5BCFD",
  400: "#7F99F9",
  500: "#6072F2",
  600: "#434CE6",
  700: "#3538CD",
  800: "#2E31A7",
  900: "#2D3383",
} as const;

// Essential colors that don't fit in the scale system
export const essentials = {
  white: "#FFFFFF",
  black: "#000000",
  chalk: "#F4F0DC",
  charcoal: "#171918",
  softWhite: "#FFF9F4",
};

// Specialized UI colors
export const ui = {
  background: "#FBFBFB", // Light Background Color
  mint: "#ACF7B2", // Mint
  editBackground: "#FCFBF5",
  altGreenSurface: "#EAF5EA", // Light Green Surface
  altGreenDark: "#1F5227", // Dark Green
};

// Reaction colors
export const reactions = {
  dislike: "#F92F2F",
  stroke: "#2E3230",
  bookmark: "#00A3FF",
};

// Re-export spacing, sizing, and typography primitives from primitive-tokens
export {
  primitiveTokens,
  spacingScale,
  sizingScale,
  fontFamilyScale,
  fontWeightScale,
  fontSizeScale,
  lineHeightScale,
  letterSpacingScale,
  getSpacing,
  getSizing,
  getSpacings,
  getFontSizes,
  getLineHeights,
  getLetterSpacings,
} from './primitive-tokens';
