/**
 * Corporate Color Palette
 * These are the official brand colors defined in /admin/settings/style
 */
export const CORPORATE_COLORS = {
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  MAGENTA: '#F4007A',
  PASTEL_BLUE: '#E2F3FD',
  PASTEL_GREEN: '#E1F6EB',
  PASTEL_PINK: '#FEEAF1',
  PASTEL_ORANGE: '#FEC6A1',  // New color for warnings
  PASTEL_LIGHT_BLUE: '#D3E4FD',  // New color for inactive states
} as const;

/**
 * HSL Values for Tailwind CSS
 * These are the HSL equivalents of our corporate colors
 */
export const TAILWIND_COLORS = {
  black: '0 0% 0%',       // #000000
  white: '0 0% 100%',     // #FFFFFF
  magenta: '328 100% 48%', // #F4007A
  pastel: {
    blue: '201 89% 94%',   // #E2F3FD
    green: '152 50% 92%',  // #E1F6EB
    pink: '341 95% 95%',   // #FEEAF1
    orange: '24 96% 81%',  // #FEC6A1
    lightBlue: '217 89% 91%', // #D3E4FD
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