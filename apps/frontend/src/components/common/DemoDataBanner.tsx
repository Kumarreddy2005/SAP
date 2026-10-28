import React from 'react';
import { AlertTriangleIcon } from './Icons';

export interface DemoDataBannerProps {
  featureName: string;
  backendStateText?: string;
  style?: React.CSSProperties;
}

export const DemoDataBanner: React.FC<DemoDataBannerProps> = ({
  featureName,
  backendStateText = 'Live backend extraction, persistent storage and real-time AI scoring will connect in subsequent phases.',
  style
}) => {
  return (
    <div
      style={{
        backgroundColor: '#FEF9F3',
        border: '1px solid #FCD4B2',
        borderRadius: '6px',
        padding: '0.65rem 1rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontSize: '0.85rem',
        color: '#873E04',
        ...style
      }}
    >
      <AlertTriangleIcon size={16} color="#E9730C" />
      <div>
        <strong>Demonstration View ({featureName}):</strong> The data shown on this screen is curated sample data to illustrate the user experience. {backendStateText}
      </div>
    </div>
  );
};
