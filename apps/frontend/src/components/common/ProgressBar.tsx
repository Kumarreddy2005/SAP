import React from 'react';
import { enterpriseTheme } from '../../theme/tokens';

export interface ProgressBarProps {
  percentage: number;
  label?: string;
  sublabel?: string;
  color?: string;
  height?: number;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  sublabel,
  color = enterpriseTheme.colors.primary,
  height = 8,
  showPercentage = true
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div style={{ width: '100%' }}>
      {(label || showPercentage) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '0.35rem',
            fontSize: '0.85rem'
          }}
        >
          {label && (
            <span style={{ fontWeight: 600, color: enterpriseTheme.colors.textPrimary }}>
              {label} {sublabel && <span style={{ fontWeight: 400, color: enterpriseTheme.colors.textMuted }}>({sublabel})</span>}
            </span>
          )}
          {showPercentage && (
            <span style={{ fontWeight: 700, color: color, fontSize: '0.88rem' }}>
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: enterpriseTheme.colors.subdued,
          borderRadius: `${height / 2}px`,
          overflow: 'hidden',
          border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: `${height / 2}px`,
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </div>
    </div>
  );
};
