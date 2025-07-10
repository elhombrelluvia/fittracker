import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  error,
  helper,
  icon,
  className = '',
  ...props
}) => {
  const inputClasses = [
    'form-input',
    error ? 'form-input-error' : '',
    disabled ? 'form-input-disabled' : '',
    icon ? 'form-input-with-icon' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <div className="form-input-wrapper">
        {icon && <span className="form-input-icon">{icon}</span>}
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && <span className="form-error">{error}</span>}
      {helper && !error && <span className="form-helper">{helper}</span>}
    </div>
  );
};

export default Input;