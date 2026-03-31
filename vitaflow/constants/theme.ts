export const Colors = {
  // Brand
  primary: '#00C896',
  primaryDark: '#009E77',
  purple: '#7C5CFC',
  orange: '#F5A623',
  red: '#FF4757',
  blue: '#3A86FF',

  // Backgrounds
  bg: '#0A0D14',
  surface: '#13172A',
  surface2: '#1C2140',
  card: '#1E2437',
  border: 'rgba(255,255,255,0.07)',

  // Text
  textPrimary: '#F0F2FF',
  textSecondary: '#9BA3C7',
  textMuted: '#5A6490',

  // Gradients
  gradientStart: '#00C896',
  gradientEnd: '#7C5CFC',
};

export const Gradients = {
  primary: ['#00C896', '#7C5CFC'] as const,
  card: ['#1E2437', '#13172A'] as const,
  surface: ['rgba(28,33,64,0.95)', 'rgba(19,23,42,0.95)'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 42,
};

export const Shadow = {
  card: {
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#00C896',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
};
