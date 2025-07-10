import React from 'react';

const Skeleton = ({ 
  width = '100%', 
  height = '20px', 
  variant = 'rounded',
  className = '',
  lines = 1,
  ...props 
}) => {
  if (lines > 1) {
    return (
      <div className={`skeleton-container ${className}`} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`skeleton skeleton-${variant}`}
            style={{
              width: index === lines - 1 ? '75%' : width,
              height,
              marginBottom: index < lines - 1 ? '8px' : '0'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`skeleton skeleton-${variant} ${className}`}
      style={{ width, height }}
      {...props}
    />
  );
};

// Componentes específicos
export const SkeletonCard = ({ className = '', ...props }) => (
  <div className={`skeleton-card ${className}`} {...props}>
    <div className="skeleton-card-header">
      <Skeleton width="60%" height="24px" variant="rounded" />
      <Skeleton width="40%" height="16px" variant="rounded" />
    </div>
    <div className="skeleton-card-content">
      <Skeleton lines={3} height="16px" />
    </div>
    <div className="skeleton-card-footer">
      <Skeleton width="100px" height="36px" variant="rounded" />
      <Skeleton width="80px" height="36px" variant="rounded" />
    </div>
  </div>
);

export const SkeletonStat = ({ className = '', ...props }) => (
  <div className={`skeleton-stat ${className}`} {...props}>
    <Skeleton width="80px" height="48px" variant="rounded" />
    <Skeleton width="100%" height="16px" variant="rounded" />
  </div>
);

export default Skeleton;