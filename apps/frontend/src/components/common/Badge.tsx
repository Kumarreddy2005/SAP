import React from 'react';

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
        return { backgroundColor: '#EBF3FB', color: '#0A6ED1', border: '1px solid #B4D7FA' };
      case 'success':
        return { backgroundColor: '#E8F5ED', color: '#107E3E', border: '1px solid #B8E3C8' };
      case 'warning':
        return { backgroundColor: '#FEF3E8', color: '#E9730C', border: '1px solid #FCD4B2' };
      case 'critical':
        return { backgroundColor: '#FDE8E8', color: '#BB0000', border: '1px solid #F8B4B4' };
      case 'neutral':
        return { backgroundColor: '#EDF1F5', color: '#5B6876', border: '1px solid #D9E1E8' };
      case 'purple':
        return { backgroundColor: '#F2ECFA', color: '#633CA3', border: '1px solid #DECFF2' };
      case 'outline':
        return { backgroundColor: 'transparent', color: '#5B6876', border: '1px solid #D9E1E8' };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '0.15rem 0.45rem', fontSize: '0.75rem', fontWeight: 500 };
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
        lineHeight: 1.2,
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
      }}
    >
      {children}
    </span>
  );
};
