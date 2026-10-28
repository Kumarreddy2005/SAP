import React from 'react';

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
      className={className}
      onClick={onClick}
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D9E1E8',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 26, 71, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: hoverable ? 'all 0.2s ease' : undefined,
        cursor: onClick ? 'pointer' : undefined,
        ...style
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.borderColor = '#0A6ED1';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 26, 71, 0.08)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.borderColor = '#D9E1E8';
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 26, 71, 0.05)';
          e.currentTarget.style.transform = 'none';
        }
      }}
    >
      {(title || subtitle || action) && (
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #EDF1F5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem'
          }}
        >
          <div>
            {title && (
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#001A47' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ fontSize: '0.875rem', color: '#5B6876', marginTop: '0.2rem' }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      <div style={{ padding: '1.5rem', flex: 1 }}>{children}</div>

      {footer && (
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#FAFBFD',
            borderTop: '1px solid #EDF1F5'
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};
