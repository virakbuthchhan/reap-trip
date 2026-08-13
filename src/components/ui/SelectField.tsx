'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import {
  ChevronDown, Check, MapPin, Bike, Car, Truck, Footprints, Anchor,
  Tent, Mountain, Waves, Trees, DollarSign, Coins, User, UserCheck,
  Fuel, Utensils, Package, ShieldAlert, Sparkles, Star
} from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  icon?: ReactNode | string;
}

interface SelectFieldProps {
  label?: string;
  icon?: ReactNode;
  value: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  className?: string;
}

// Helper to resolve icon strings or emojis into clean Lucide Vector Icons
const renderOptionIcon = (icon?: ReactNode | string) => {
  if (!icon) return null;
  if (typeof icon !== 'string') return icon;

  switch (icon) {
    case '📍': return <MapPin size={16} color="var(--primary)" />;
    case '🛵': return <Bike size={16} color="var(--accent-cyan)" />;
    case '🚗': return <Car size={16} color="var(--primary)" />;
    case '🛻': return <Truck size={16} color="var(--accent-amber)" />;
    case '🥾': return <Footprints size={16} color="var(--accent-amber)" />;
    case '🚤': return <Anchor size={16} color="var(--accent-cyan)" />;
    case '⛺': return <Tent size={16} color="var(--primary)" />;
    case '⛰️': return <Mountain size={16} color="var(--accent-amber)" />;
    case '🌊': return <Waves size={16} color="var(--accent-cyan)" />;
    case '🌲': return <Trees size={16} color="var(--primary)" />;
    case '🚣': return <Anchor size={16} color="var(--accent-cyan)" />;
    case '💵': return <DollarSign size={16} color="var(--primary)" />;
    case '៛': return <Coins size={16} color="var(--accent-amber)" />;
    case '👤': return <User size={16} color="var(--text-muted)" />;
    case '⛽': return <Fuel size={16} color="var(--accent-red)" />;
    case '🍲': return <Utensils size={16} color="var(--accent-amber)" />;
    case '📦': return <Package size={16} color="var(--text-muted)" />;
    case '🌟': return <Sparkles size={16} color="var(--accent-amber)" />;
    case '⭐': return <Star size={16} color="var(--accent-amber)" />;
    default: return <span className="option-text-icon">{icon}</span>;
  }
};

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  icon,
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  error,
  helperText,
  fullWidth = true,
  required,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optValue: string | number) => {
    onChange(String(optValue));
    setIsOpen(false);
  };

  return (
    <div className={`form-field-group ${fullWidth ? 'full-width' : ''} ${error ? 'has-error' : ''}`} ref={dropdownRef}>
      {label && (
        <label className="form-field-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}

      <div className="custom-select-container">
        {/* Input Trigger Button */}
        <button
          type="button"
          className={`custom-select-trigger ${isOpen ? 'is-open' : ''} ${className}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="trigger-content">
            {icon && <span className="input-icon-left-custom">{icon}</span>}
            {selectedOption ? (
              <span className="selected-value-wrap">
                {selectedOption.icon && <span className="option-icon">{renderOptionIcon(selectedOption.icon)}</span>}
                <span className="selected-label">{selectedOption.label}</span>
              </span>
            ) : (
              <span className="placeholder-text">{placeholder}</span>
            )}
          </div>
          <ChevronDown size={18} className={`chevron-indicator ${isOpen ? 'rotated' : ''}`} />
        </button>

        {/* Custom Modern Dropdown Menu */}
        {isOpen && (
          <div className="custom-dropdown-menu">
            <div className="dropdown-options-list">
              {options.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <div
                    key={opt.value}
                    className={`custom-option-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <div className="option-item-content">
                      {opt.icon && <span className="option-icon">{renderOptionIcon(opt.icon)}</span>}
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <Check size={16} className="check-icon" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {error && <span className="form-field-error">{error}</span>}
      {helperText && !error && <span className="form-field-helper">{helperText}</span>}

    </div>
  );
};
