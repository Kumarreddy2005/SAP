import React from 'react';
import { Button } from './Button';
import { enterpriseTheme } from '../../theme/tokens';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  style
}) => {
  return (
    <div
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        backgroundColor: enterpriseTheme.colors.card,
        borderRadius: enterpriseTheme.radii.md,
        border: `1px dashed ${enterpriseTheme.colors.surfaceBorderStrong}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        ...style
      }}
    >
      {icon && (
        <div
          style={{
            color: enterpriseTheme.colors.primary,
            backgroundColor: enterpriseTheme.colors.primarySubtle,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.25rem'
          }}
        >
          {icon}
        </div>
      )}
      <h4 style={{ fontSize: '1.1rem', color: enterpriseTheme.colors.textPrimary, fontWeight: 700 }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textSecondary, maxWidth: '460px', lineHeight: 1.5 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} style={{ marginTop: '0.5rem' }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
