import primitiveTokensData from './primitive-tokens.json';

/**
 * Primitive Token Interface
 * Represents a single primitive design token with numeric value
 */
export interface PrimitiveToken {
  name: string;
  value: number;
  description: string;
}

/**
 * String Primitive Token Interface
 * Represents a single primitive design token with string value (e.g., font families)
 */
export interface StringPrimitiveToken {
  name: string;
  value: string;
  description: string;
}

/**
 * Spacing Primitive Tokens
 * Base tokens for spacing (margin, padding, gap)
 */
export interface SpacingPrimitives {
  '0': PrimitiveToken;
  '4': PrimitiveToken;
  '6': PrimitiveToken;
  '8': PrimitiveToken;
  '12': PrimitiveToken;
  '16': PrimitiveToken;
  '18': PrimitiveToken;
  '24': PrimitiveToken;
}

/**
 * Sizing Primitive Tokens
 * Base tokens for sizing (border radius, icon sizes)
 */
export interface SizingPrimitives {
  radiusSm: PrimitiveToken;
  radiusMd: PrimitiveToken;
  radiusLg: PrimitiveToken;
  radiusFull: PrimitiveToken;
  iconSm: PrimitiveToken;
  iconMd: PrimitiveToken;
}

/**
 * Typography Primitive Tokens
 * Base tokens for font families, weights, sizes, line heights, and letter spacing
 */
export interface TypographyPrimitives {
  fontFamily: {
    heading: StringPrimitiveToken;
    body: StringPrimitiveToken;
  };
  fontWeight: {
    regular: PrimitiveToken;
    strong: PrimitiveToken;
  };
  fontSize: {
    xs: PrimitiveToken;
    sm: PrimitiveToken;
    md: PrimitiveToken;
    lg: PrimitiveToken;
    xl: PrimitiveToken;
    '2xl': PrimitiveToken;
    '3xl': PrimitiveToken;
  };
  lineHeight: {
    xxs: PrimitiveToken;
    xs: PrimitiveToken;
    sm: PrimitiveToken;
    md: PrimitiveToken;
    lg: PrimitiveToken;
    xl: PrimitiveToken;
  };
  letterSpacing: {
    n050: PrimitiveToken;
    none: PrimitiveToken;
    n100: PrimitiveToken;
    n150: PrimitiveToken;
    n200: PrimitiveToken;
    n500: PrimitiveToken;
  };
}

/**
 * All Primitive Tokens
 */
export interface PrimitiveTokens {
  spacing: SpacingPrimitives;
  sizing: SizingPrimitives;
  typography: TypographyPrimitives;
}

/**
 * Raw primitive tokens data from JSON
 */
export const primitiveTokens: PrimitiveTokens = primitiveTokensData as PrimitiveTokens;

/**
 * Spacing scale for easy access
 */
export const spacingScale = {
  0: primitiveTokens.spacing['0'].value,
  4: primitiveTokens.spacing['4'].value,
  6: primitiveTokens.spacing['6'].value,
  8: primitiveTokens.spacing['8'].value,
  12: primitiveTokens.spacing['12'].value,
  16: primitiveTokens.spacing['16'].value,
  18: primitiveTokens.spacing['18'].value,
  24: primitiveTokens.spacing['24'].value,
} as const;

/**
 * Sizing scale for easy access
 */
export const sizingScale = {
  radiusSm: primitiveTokens.sizing.radiusSm.value,
  radiusMd: primitiveTokens.sizing.radiusMd.value,
  radiusLg: primitiveTokens.sizing.radiusLg.value,
  radiusFull: primitiveTokens.sizing.radiusFull.value,
  iconSm: primitiveTokens.sizing.iconSm.value,
  iconMd: primitiveTokens.sizing.iconMd.value,
} as const;

/**
 * Typography font family scale
 */
export const fontFamilyScale = {
  heading: primitiveTokens.typography.fontFamily.heading.value,
  body: primitiveTokens.typography.fontFamily.body.value,
} as const;

/**
 * Typography font weight scale
 */
export const fontWeightScale = {
  regular: primitiveTokens.typography.fontWeight.regular.value,
  strong: primitiveTokens.typography.fontWeight.strong.value,
} as const;

/**
 * Typography font size scale
 */
export const fontSizeScale = {
  xs: primitiveTokens.typography.fontSize.xs.value,
  sm: primitiveTokens.typography.fontSize.sm.value,
  md: primitiveTokens.typography.fontSize.md.value,
  lg: primitiveTokens.typography.fontSize.lg.value,
  xl: primitiveTokens.typography.fontSize.xl.value,
  '2xl': primitiveTokens.typography.fontSize['2xl'].value,
  '3xl': primitiveTokens.typography.fontSize['3xl'].value,
} as const;

/**
 * Typography line height scale
 */
export const lineHeightScale = {
  xxs: primitiveTokens.typography.lineHeight.xxs.value,
  xs: primitiveTokens.typography.lineHeight.xs.value,
  sm: primitiveTokens.typography.lineHeight.sm.value,
  md: primitiveTokens.typography.lineHeight.md.value,
  lg: primitiveTokens.typography.lineHeight.lg.value,
  xl: primitiveTokens.typography.lineHeight.xl.value,
} as const;

/**
 * Typography letter spacing scale
 */
export const letterSpacingScale = {
  n050: primitiveTokens.typography.letterSpacing.n050.value,
  none: primitiveTokens.typography.letterSpacing.none.value,
  n100: primitiveTokens.typography.letterSpacing.n100.value,
  n150: primitiveTokens.typography.letterSpacing.n150.value,
  n200: primitiveTokens.typography.letterSpacing.n200.value,
  n500: primitiveTokens.typography.letterSpacing.n500.value,
} as const;

/**
 * Get all font sizes in ascending order
 */
export function getFontSizes(): number[] {
  return Object.values(fontSizeScale).sort((a, b) => a - b);
}

/**
 * Get all line heights in ascending order
 */
export function getLineHeights(): number[] {
  return Object.values(lineHeightScale).sort((a, b) => a - b);
}

/**
 * Get all letter spacings in ascending order
 */
export function getLetterSpacings(): number[] {
  return Object.values(letterSpacingScale).sort((a, b) => a - b);
}

/**
 * Get all spacing values in ascending order
 */
export function getSpacings(): number[] {
  return Object.values(spacingScale).sort((a, b) => a - b);
}

/**
 * Get a specific spacing value
 * @param size - The spacing size (0, 4, 6, 8, 12, 16, 18, 24)
 * @returns The spacing value in pixels
 */
export function getSpacing(size: keyof typeof spacingScale): number {
  return spacingScale[size];
}

/**
 * Get a specific sizing value
 * @param name - The sizing name (radiusSm, radiusMd, radiusLg, radiusFull, iconSm, iconMd)
 * @returns The sizing value in pixels
 */
export function getSizing(name: keyof typeof sizingScale): number {
  return sizingScale[name];
}

// Export all primitive tokens as default
export default primitiveTokens;
