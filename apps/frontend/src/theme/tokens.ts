/**
 * Career Orchestrator — Enterprise Design Tokens (SAP Horizon Inspired)
 * Unified design language for colors, typography, elevations, spacing, and micro-interactions.
 */

export const enterpriseTheme = {
  colors: {
    // Brand & Shell
    shell: '#001A47',
    shellDark: '#00112F',
    shellLight: '#08255A',
    primary: '#0A6ED1',
    primaryHover: '#0854A0',
    primaryActive: '#063D75',
    primarySubtle: '#EBF3FB',
    primaryBorder: '#B9D5F5',
    accentIndigo: '#5B42F3',
    accentPurple: '#7C3AED',
    accentPurpleSubtle: '#F3E8FF',

    // Surfaces & Backgrounds
    canvas: '#F8FAFC',
    card: '#FFFFFF',
    subdued: '#F1F5F9',
    surfaceBorder: '#E2E8F0',
    surfaceBorderStrong: '#CBD5E1',

    // Text Hierarchy
    textPrimary: '#001A47',
    textSecondary: '#475569',
    textMuted: '#64748B',
    textInverse: '#FFFFFF',

    // Semantic States
    success: '#107E3E',
    successHover: '#0D6833',
    successSubtle: '#E8F5ED',
    successBorder: '#B8E3C8',

    warning: '#E9730C',
    warningSubtle: '#FEF3E8',
    warningBorder: '#FBD38D',

    critical: '#BB0000',
    criticalSubtle: '#FDEDED',
    criticalBorder: '#F5B5B2',

    info: '#0A6ED1',
    infoSubtle: '#EBF3FB',
    infoBorder: '#B9D5F5'
  },

  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    sizes: {
      h1: '1.75rem',    // 28px
      h2: '1.35rem',    // 21.6px
      h3: '1.1rem',     // 17.6px
      h4: '0.98rem',    // 15.6px
      body: '0.92rem',   // 14.7px
      caption: '0.8rem', // 12.8px
      micro: '0.72rem'   // 11.5px
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      heavy: 800
    }
  },

  shadows: {
    card: '0 2px 8px rgba(0, 26, 71, 0.04), 0 1px 2px rgba(0, 26, 71, 0.02)',
    cardHover: '0 8px 24px rgba(0, 26, 71, 0.08), 0 2px 6px rgba(0, 26, 71, 0.04)',
    elevated: '0 12px 32px rgba(0, 26, 71, 0.12), 0 2px 8px rgba(0, 26, 71, 0.06)',
    modal: '0 20px 48px rgba(0, 26, 71, 0.22), 0 4px 12px rgba(0, 26, 71, 0.08)'
  },

  radii: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    pill: '9999px'
  },

  transitions: {
    fast: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
    normal: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    slow: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
  }
};
