/**
 * Primary Colors
 * These are the main brand colors used throughout the application
 */
export const PRIMARY_COLORS = {
  BLACK: '#000000',
  WHITE: '#FFFFFF',
} as const;

/**
 * Secondary Color
 * Used for interactive elements like buttons, links, and hover states
 */
export const SECONDARY_COLOR = '#F4007A' as const;

/**
 * Pastel Colors
 * Used for notifications, alerts, and status indicators
 */
export const PASTEL_COLORS = {
  // Info notifications
  INFO: '#E2F3FD',
  // Success notifications
  SUCCESS: '#E1F6EB',
  // Error or warning notifications
  ERROR: '#FEEAF1',
} as const;

/**
 * Tailwind CSS color values in HSL format
 * These values can be used in the tailwind.config.ts file
 */
export const TAILWIND_COLORS = {
  primary: {
    black: '0 0% 0%',      // #000000
    white: '0 0% 100%',    // #FFFFFF
  },
  secondary: '332 100% 48%',  // #F4007A
  pastel: {
    info: '204 89% 94%',    // #E2F3FD
    success: '151 50% 92%',  // #E1F6EB
    error: '341 95% 96%',    // #FEEAF1
  },
} as const;

/**
 * Get color with opacity
 * @param hex - Hex color code
 * @param opacity - Opacity value between 0 and 1
 * @returns - RGB color with opacity
 */
export const getColorWithOpacity = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};