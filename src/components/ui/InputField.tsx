import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  icon,
  error,
  helperText,
  fullWidth = true,
  className = '',
  id,
  required,
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`form-field-group ${fullWidth ? 'full-width' : ''} ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="form-field-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {icon && <span className="input-icon-left">{icon}</span>}
        <input
          id={inputId}
          className={`custom-modern-input ${icon ? 'has-icon-left' : ''} ${className}`}
          required={required}
          {...props}
        />
      </div>

      {error && <span className="form-field-error">{error}</span>}
      {helperText && !error && <span className="form-field-helper">{helperText}</span>}
    </div>
  );
};
