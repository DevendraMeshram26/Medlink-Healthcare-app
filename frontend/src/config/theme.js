/**
 * Centralized theme configuration for the application.
 * Defines standard colors, spacing, and typography to maintain visual consistency.
 */
export const theme = {
  colors: {
    // 60% Background
    background: '#F8FAFC', // slate-50
    surface: '#FFFFFF',    // white
    
    // 30% Primary Brand
    primary: '#0F766E',    // teal-700
    primaryLight: '#ccfbf1', // teal-50
    
    // 10% Accent
    accent: '#0EA5E9',     // sky-500
    
    // Status
    success: '#10B981',    // emerald-500
    error: '#F43F5E',      // rose-500
    warning: '#F59E0B',    // amber-500
    
    // Text
    textPrimary: '#0F172A', // slate-900
    textSecondary: '#64748B', // slate-500
    textMuted: '#94A3B8',   // slate-400
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    fontFamilies: {
      black: 'Inter_900Black',
      bold: 'Inter_700Bold',
      semiBold: 'Inter_600SemiBold',
      medium: 'Inter_500Medium',
      regular: 'Inter_400Regular',
    },
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 30,
    },
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  }
};
