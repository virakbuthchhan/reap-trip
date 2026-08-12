import React, { TextareaHTMLAttributes } from 'react';

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = '',
  id,
  required,
  rows = 3,
  ...props
}) => {
  const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`form-field-group ${fullWidth ? 'full-width' : ''} ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={textareaId} className="form-field-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        <textarea
          id={textareaId}
          rows={rows}
          className={`custom-modern-textarea ${className}`}
          required={required}
          {...props}
        />
      </div>

      {error && <span className="form-field-error">{error}</span>}
      {helperText && !error && <span className="form-field-helper">{helperText}</span>}
    </div>
  );
};
