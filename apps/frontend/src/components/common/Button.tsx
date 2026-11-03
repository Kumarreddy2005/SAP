import React from 'react';
import { enterpriseTheme } from '../../theme/tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  disabled,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? '#A9C4E2' : enterpriseTheme.colors.primary,
          color: '#FFFFFF',
          border: '1px solid transparent',
          boxShadow: disabled ? 'none' : '0 1px 3px rgba(10, 110, 209, 0.25)'
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? '#CBD5E1' : enterpriseTheme.colors.shell,
          color: '#FFFFFF',
          border: '1px solid transparent',
          boxShadow: disabled ? 'none' : '0 1px 3px rgba(0, 26, 71, 0.2)'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: disabled ? enterpriseTheme.colors.textMuted : enterpriseTheme.colors.primary,
          border: `1px solid ${disabled ? enterpriseTheme.colors.surfaceBorder : enterpriseTheme.colors.primaryBorder}`
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: disabled ? enterpriseTheme.colors.textMuted : enterpriseTheme.colors.textPrimary,
          border: '1px solid transparent'
        };
      case 'danger':
        return {
          backgroundColor: disabled ? enterpriseTheme.colors.criticalSubtle : enterpriseTheme.colors.critical,
          color: disabled ? enterpriseTheme.colors.textMuted : '#FFFFFF',
          border: '1px solid transparent',
          boxShadow: disabled ? 'none' : '0 1px 3px rgba(187, 0, 0, 0.2)'
        };
      case 'success':
        return {
          backgroundColor: disabled ? enterpriseTheme.colors.successSubtle : enterpriseTheme.colors.success,
          color: disabled ? enterpriseTheme.colors.textMuted : '#FFFFFF',
          border: '1px solid transparent',
          boxShadow: disabled ? 'none' : '0 1px 3px rgba(16, 126, 62, 0.2)'
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '0.35rem 0.75rem', fontSize: '0.82rem', borderRadius: '4px' };
      case 'md':
        return { padding: '0.55rem 1.15rem', fontSize: '0.9rem', borderRadius: '6px' };
      case 'lg':
        return { padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 600, borderRadius: '8px' };
    }
  };

  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.45rem',
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        lineHeight: 1.25,
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === 'primary') e.currentTarget.style.backgroundColor = enterpriseTheme.colors.primaryHover;
        if (variant === 'secondary') e.currentTarget.style.backgroundColor = enterpriseTheme.colors.shellLight;
        if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = enterpriseTheme.colors.primarySubtle;
          e.currentTarget.style.borderColor = enterpriseTheme.colors.primary;
        }
        if (variant === 'ghost') e.currentTarget.style.backgroundColor = enterpriseTheme.colors.subdued;
        if (variant === 'danger') e.currentTarget.style.backgroundColor = '#990000';
        if (variant === 'success') e.currentTarget.style.backgroundColor = enterpriseTheme.colors.successHover;
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        if (variant === 'primary') e.currentTarget.style.backgroundColor = enterpriseTheme.colors.primary;
        if (variant === 'secondary') e.currentTarget.style.backgroundColor = enterpriseTheme.colors.shell;
        if (variant === 'outline') {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = enterpriseTheme.colors.primaryBorder;
        }
        if (variant === 'ghost') e.currentTarget.style.backgroundColor = 'transparent';
        if (variant === 'danger') e.currentTarget.style.backgroundColor = enterpriseTheme.colors.critical;
        if (variant === 'success') e.currentTarget.style.backgroundColor = enterpriseTheme.colors.success;
      }}
      {...props}
    >
      {icon && iconPosition === 'left' && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
    </button>
  );
};
