import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '1.25rem' }}>
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.5rem',
          listStyle: 'none',
          fontSize: '0.85rem'
        }}
      >
        <li>
          <Link to="/" style={{ color: '#5B6876', textDecoration: 'none' }}>
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li style={{ color: '#8492A0' }}>/</li>
              <li>
                {isLast || !item.path ? (
                  <span style={{ color: '#001A47', fontWeight: 600 }}>{item.label}</span>
                ) : (
                  <Link to={item.path} style={{ color: '#5B6876', textDecoration: 'none' }}>
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
