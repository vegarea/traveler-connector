/**
 * Corporate Color Palette
 * These are the official brand colors defined in /admin/settings/style
 */
export const CORPORATE_COLORS = {
  PRIMARY_PURPLE: '#9b87f5',
  SECONDARY_PURPLE: '#7E69AB',
  TERTIARY_PURPLE: '#6E59A5',
  DARK_PURPLE: '#1A1F2C',
  LIGHT_PURPLE: '#D6BCFA',
  VIVID_PURPLE: '#8B5CF6',
  SOFT_PURPLE: '#E5DEFF',
} as const;

/**
 * HSL Values for Tailwind CSS
 * These are the HSL equivalents of our corporate colors
 */
export const TAILWIND_COLORS = {
  primary: {
    purple: '252 80% 74%',    // #9b87f5
    secondary: '262 24% 54%', // #7E69AB
    tertiary: '262 29% 50%',  // #6E59A5
    dark: '222 25% 14%',      // #1A1F2C
    light: '270 89% 86%',     // #D6BCFA
    vivid: '263 84% 66%',     // #8B5CF6
    soft: '252 100% 93%',     // #E5DEFF
  },
} as const;

/**
 * Get color with opacity
 * @param hex - Hex color code from CORPORATE_COLORS
 * @param opacity - Opacity value between 0 and 1
 * @returns - RGBA color string
 */
export const getColorWithOpacity = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};