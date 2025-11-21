/**
 * TECHZONE DESIGN SYSTEM
 * ========================
 * Centralized design tokens, color palettes, and styling utilities
 * Ensures consistency across all pages and components
 */

// Color Palette
export const DESIGN_TOKENS = {
  colors: {
    primary: '#2C8B3D',      // Main Green
    secondary: '#88C140',    // Light Green
    accent: '#F2A024',       // Orange
    background: '#FDFDFD',   // Off-white
    surface: '#FFFFFF',      // Pure white
    text: {
      primary: '#1F2937',    // Dark gray
      secondary: '#6B7280',  // Medium gray
      light: '#9CA3AF',      // Light gray
      inverse: '#FFFFFF',    // White text on dark
    },
    border: '#E5E7EB',       // Border gray
    error: '#EF4444',        // Red
    success: '#10B981',      // Green
    warning: '#F59E0B',      // Amber
    info: '#3B82F6',         // Blue
    disabled: '#D1D5DB',     // Disabled gray
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
  },
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Reusable Style Classes
export const STYLE_CLASSES = {
  // Cards
  card: 'bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden',
  cardHover: 'hover:shadow-lg transition-shadow duration-200',
  
  // Buttons
  buttonBase: 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
  buttonPrimary: 'bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg',
  buttonSecondary: 'bg-secondary hover:bg-secondary/90 text-white',
  buttonOutline: 'border-2 border-primary text-primary hover:bg-primary/10',
  buttonGhost: 'text-primary hover:bg-primary/10',
  buttonDanger: 'bg-error hover:bg-error/90 text-white',
  
  // Inputs
  input: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors',
  inputError: 'border-error focus:ring-error/50 focus:border-error',
  
  // Forms
  formLabel: 'block text-sm font-medium text-gray-700 mb-2',
  formError: 'text-sm text-error mt-1',
  formHelper: 'text-sm text-gray-500 mt-1',
  
  // Layout
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  pageTitle: 'text-3xl font-bold text-gray-900 mb-8',
  sectionTitle: 'text-xl font-semibold text-gray-900 mb-4',
  
  // Badge
  badge: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  badgePrimary: 'bg-primary/10 text-primary',
  badgeSuccess: 'bg-success/10 text-success',
  badgeWarning: 'bg-warning/10 text-warning',
  badgeError: 'bg-error/10 text-error',
  
  // Grid
  gridResponsive: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
  gridTwoCol: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  
  // Text
  textBase: 'text-base leading-6 text-gray-700',
  textSmall: 'text-sm leading-5 text-gray-600',
  textMuted: 'text-gray-500',
  
  // Divider
  divider: 'border-t border-gray-200',
};
