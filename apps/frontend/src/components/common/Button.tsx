import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
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
          backgroundColor: disabled ? '#A9C4E2' : '#0A6ED1',
          color: '#FFFFFF',
          border: '1px solid transparent',
          boxShadow: disabled ? 'none' : '0 1px 3px rgba(10, 110, 209, 0.2)'
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? '#EDF1F5' : '#001A47',
          color: '#FFFFFF',
          border: '1px solid transparent'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: disabled ? '#8492A0' : '#0A6ED1',
          border: `1px solid ${disabled ? '#D9E1E8' : '#0A6ED1'}`
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: disabled ? '#8492A0' : '#222B35',
          border: '1px solid transparent'
        };
      case 'danger':
        return {
          backgroundColor: disabled ? '#FDE8E8' : '#BB0000',
          color: '#FFFFFF',
          border: '1px solid transparent'
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '0.35rem 0.75rem', fontSize: '0.85rem' };
      case 'md':
        return { padding: '0.6rem 1.25rem', fontSize: '0.95rem' };
      case 'lg':
        return { padding: '0.85rem 1.75rem', fontSize: '1.05rem', fontWeight: 600 };
    }
  };

  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        borderRadius: '6px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.15s ease',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        if (variant === 'primary') e.currentTarget.style.backgroundColor = '#085CAF';
        if (variant === 'secondary') e.currentTarget.style.backgroundColor = '#1C2D42';
        if (variant === 'outline') e.currentTarget.style.backgroundColor = '#EBF3FB';
        if (variant === 'ghost') e.currentTarget.style.backgroundColor = '#EDF1F5';
      }}
      onMouseLeave={(e) => {
        if (disabled) return;
        if (variant === 'primary') e.currentTarget.style.backgroundColor = '#0A6ED1';
        if (variant === 'secondary') e.currentTarget.style.backgroundColor = '#001A47';
        if (variant === 'outline') e.currentTarget.style.backgroundColor = 'transparent';
        if (variant === 'ghost') e.currentTarget.style.backgroundColor = 'transparent';
      }}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
};
