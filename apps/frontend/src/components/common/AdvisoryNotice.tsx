import React from 'react';
import { InfoIcon } from './Icons';

export interface AdvisoryNoticeProps {
  title?: string;
  message?: string;
  style?: React.CSSProperties;
}

export const AdvisoryNotice: React.FC<AdvisoryNoticeProps> = ({
  title = 'Advisory Career Intelligence Notice',
  message = 'Career Orchestrator provides advisory career recommendations and skill gap evaluations based on competencies you confirm. Skill match scores and readiness indicators represent educational and skill alignment; they do not guarantee employment, interviews, or hiring outcomes.',
  style
}) => {
  return (
    <div
      style={{
        backgroundColor: '#F5F8FC',
        border: '1px solid #CDE2F8',
        borderRadius: '6px',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        fontSize: '0.85rem',
        color: '#222B35',
        lineHeight: 1.5,
        ...style
      }}
    >
      <div style={{ color: '#0A6ED1', flexShrink: 0, marginTop: '2px' }}>
        <InfoIcon size={18} />
      </div>
      <div>
        <strong style={{ color: '#001A47', display: 'block', marginBottom: '0.2rem' }}>
          {title}
        </strong>
        <span>{message}</span>
      </div>
    </div>
  );
};
