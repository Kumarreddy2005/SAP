import React from 'react';
import { enterpriseTheme } from '../../theme/tokens';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'critical' | 'neutral' | 'purple' | 'outline';
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'md',
  style
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'info':
        return {
          backgroundColor: enterpriseTheme.colors.infoSubtle,
          color: enterpriseTheme.colors.info,
          border: `1px solid ${enterpriseTheme.colors.infoBorder}`
        };
      case 'success':
        return {
          backgroundColor: enterpriseTheme.colors.successSubtle,
          color: enterpriseTheme.colors.success,
          border: `1px solid ${enterpriseTheme.colors.successBorder}`
        };
      case 'warning':
        return {
          backgroundColor: enterpriseTheme.colors.warningSubtle,
          color: enterpriseTheme.colors.warning,
          border: `1px solid ${enterpriseTheme.colors.warningBorder}`
        };
      case 'critical':
        return {
          backgroundColor: enterpriseTheme.colors.criticalSubtle,
          color: enterpriseTheme.colors.critical,
          border: `1px solid ${enterpriseTheme.colors.criticalBorder}`
        };
      case 'neutral':
        return {
          backgroundColor: enterpriseTheme.colors.subdued,
          color: enterpriseTheme.colors.textSecondary,
          border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`
        };
      case 'purple':
        return {
          backgroundColor: enterpriseTheme.colors.accentPurpleSubtle,
          color: enterpriseTheme.colors.accentPurple,
          border: '1px solid #DBC4F0'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: enterpriseTheme.colors.textSecondary,
          border: `1px solid ${enterpriseTheme.colors.surfaceBorderStrong}`
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '0.15rem 0.5rem', fontSize: '0.74rem', fontWeight: 600 };
      case 'md':
        return { padding: '0.25rem 0.65rem', fontSize: '0.8rem', fontWeight: 600 };
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
        lineHeight: 1.25,
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
      }}
    >
      {children}
    </span>
  );
};
