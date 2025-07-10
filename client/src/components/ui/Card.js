import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  icon,
  headerContent,
  variant = 'default',
  className = '',
  ...props 
}) => {
  const baseClasses = 'card';
  const variantClasses = {
    default: '',
    gradient: 'card-gradient',
    outline: 'card-outline',
    flat: 'card-flat'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {(title || headerContent) && (
        <div className="card-header">
          {title && (
            <div className="card-title-section">
              <h3 className="card-title">
                {icon && <span className="emoji">{icon}</span>}
                {title}
              </h3>
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
          )}
          {headerContent}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;