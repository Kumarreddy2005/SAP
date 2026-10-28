import React from 'react';
import { Button } from './Button';

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
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: '1px dashed #D9E1E8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        ...style
      }}
    >
      {icon && <div style={{ color: '#8492A0', marginBottom: '0.5rem' }}>{icon}</div>}
      <h4 style={{ fontSize: '1.15rem', color: '#001A47', fontWeight: 600 }}>{title}</h4>
      <p style={{ fontSize: '0.9rem', color: '#5B6876', maxWidth: '450px', lineHeight: 1.5 }}>
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
