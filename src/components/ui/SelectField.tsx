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

      <style>{`
        .custom-select-container {
          position: relative;
          width: 100%;
        }

        .custom-select-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-card);
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 0.75rem 1rem;
          color: var(--text-main);
          font-family: var(--font-main);
          font-size: 0.95rem;
          cursor: pointer;
          transition: var(--transition);
          outline: none;
          user-select: none;
          box-shadow: var(--shadow-sm);
        }

        [data-theme="light"] .custom-select-trigger {
          background: #ffffff;
          border-color: rgba(15, 23, 42, 0.16);
          color: #0f172a;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }

        .custom-select-trigger:hover {
          border-color: var(--primary-glow);
          background: var(--bg-card-hover);
        }

        [data-theme="light"] .custom-select-trigger:hover {
          background: #f8fafc;
          border-color: rgba(5, 150, 105, 0.42);
        }

        .custom-select-trigger.is-open {
          border-color: var(--primary);
          background: var(--bg-card);
          box-shadow: 0 0 0 4px var(--primary-glow);
        }

        [data-theme="light"] .custom-select-trigger.is-open {
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.14), 0 1px 2px rgba(15, 23, 42, 0.06);
        }

        .trigger-content {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .input-icon-left-custom {
          color: var(--text-muted);
          display: flex;
          align-items: center;
        }

        .selected-value-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
        }

        .selected-label {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .placeholder-text {
          color: var(--text-dim);
          opacity: 0.7;
        }

        .chevron-indicator {
          color: var(--text-muted);
          transition: transform 0.25s ease;
        }

        .chevron-indicator.rotated {
          transform: rotate(180deg);
          color: var(--primary);
        }

        .custom-dropdown-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          z-index: 3000;
          background: var(--bg-card);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border-glow);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        [data-theme="light"] .custom-dropdown-menu {
          background: #ffffff;
          border-color: rgba(5, 150, 105, 0.28);
          box-shadow: 0 18px 36px rgba(15, 23, 42, 0.14);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-options-list {
          max-height: 240px;
          overflow-y: auto;
          padding: 0.4rem;
        }

        .custom-option-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-main);
          font-size: 0.9rem;
          color: var(--text-main);
          cursor: pointer;
          transition: var(--transition);
          user-select: none;
        }

        .custom-option-item:hover {
          background: rgba(16, 185, 129, 0.15);
          color: #ffffff;
        }

        [data-theme="light"] .custom-option-item:hover {
          background: #ecfdf5;
          color: #047857;
        }

        .custom-option-item.selected {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(4, 120, 87, 0.35) 100%);
          color: #ffffff;
          font-weight: 600;
        }

        [data-theme="light"] .custom-option-item.selected {
          background: #d1fae5;
          color: #064e3b;
        }

        .option-item-content {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .option-icon {
          display: flex;
          align-items: center;
        }

        .check-icon {
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};
