import React from 'react';

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
  color = '#0A6ED1',
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
            marginBottom: '0.4rem',
            fontSize: '0.85rem'
          }}
        >
          {label && (
            <span style={{ fontWeight: 600, color: '#001A47' }}>
              {label} {sublabel && <span style={{ fontWeight: 400, color: '#5B6876' }}>({sublabel})</span>}
            </span>
          )}
          {showPercentage && (
            <span style={{ fontWeight: 700, color: color, fontSize: '0.9rem' }}>
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: '#EDF1F5',
          borderRadius: `${height / 2}px`,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: `${height / 2}px`,
            transition: 'width 0.4s ease'
          }}
        />
      </div>
    </div>
  );
};
