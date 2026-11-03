import React from 'react';
import { enterpriseTheme } from '../../theme/tokens';

export interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  action,
  footer,
  style,
  className,
  onClick,
  hoverable = false
}) => {
  return (
    <div
      className={`${className || ''} ${hoverable ? 'sap-card-interactive' : ''}`}
      onClick={onClick}
      style={{
        backgroundColor: enterpriseTheme.colors.card,
        border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
        borderRadius: enterpriseTheme.radii.md,
        boxShadow: enterpriseTheme.shadows.card,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : undefined,
        ...style
      }}
    >
      {(title || subtitle || action) && (
        <div
          style={{
            padding: '1.15rem 1.35rem',
            borderBottom: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            backgroundColor: '#FAFCFE'
          }}
        >
          <div>
            {title && (
              <h3
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: enterpriseTheme.colors.textPrimary,
                  lineHeight: 1.3
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <div
                style={{
                  fontSize: '0.82rem',
                  color: enterpriseTheme.colors.textSecondary,
                  marginTop: '0.2rem'
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
          {action && <div style={{ flexShrink: 0 }}>{action}</div>}
        </div>
      )}

      <div style={{ padding: '1.35rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>

      {footer && (
        <div
          style={{
            padding: '0.85rem 1.35rem',
            backgroundColor: enterpriseTheme.colors.canvas,
            borderTop: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
            fontSize: '0.85rem'
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
