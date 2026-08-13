'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, Laptop, Check } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { language } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeTheme = mounted ? theme : 'system';

  const handleToggleClick = () => {
    if (activeTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case 'dark': return <Moon size={17} className="theme-icon moon-icon" />;
      case 'light': return <Sun size={17} className="theme-icon sun-icon" />;
      case 'system': return <Laptop size={17} className="theme-icon system-icon" />;
    }
  };

  return (
    <div className="theme-toggle-dropdown-wrap" ref={containerRef}>
      <button
        type="button"
        className="theme-toggle-icon-btn"
        onClick={handleToggleClick}
        onContextMenu={(e) => {
          e.preventDefault();
          setDropdownOpen(!dropdownOpen);
        }}
        title={
          language === 'km'
            ? `ពន្លឺ: ${activeTheme === 'dark' ? 'ងងឹត (Dark)' : 'ភ្លឺ (Light)'} - ចុចដើម្បីប្តូរ`
            : `Theme: ${activeTheme} - Click to toggle`
        }
      >
        {getThemeIcon(activeTheme)}
      </button>

      {dropdownOpen && (
        <div className="theme-dropdown-menu">
          <button
            type="button"
            className={`theme-option ${activeTheme === 'system' ? 'active' : ''}`}
            onClick={() => { setTheme('system'); setDropdownOpen(false); }}
          >
            <Laptop size={15} />
            <span className="option-label">{language === 'km' ? 'ប្រព័ន្ធ' : 'System Default'}</span>
            {activeTheme === 'system' && <Check size={14} className="check-icon" />}
          </button>

          <button
            type="button"
            className={`theme-option ${activeTheme === 'dark' ? 'active' : ''}`}
            onClick={() => { setTheme('dark'); setDropdownOpen(false); }}
          >
            <Moon size={15} />
            <span className="option-label">{language === 'km' ? 'ងងឹត' : 'Dark Mode'}</span>
            {activeTheme === 'dark' && <Check size={14} className="check-icon" />}
          </button>

          <button
            type="button"
            className={`theme-option ${activeTheme === 'light' ? 'active' : ''}`}
            onClick={() => { setTheme('light'); setDropdownOpen(false); }}
          >
            <Sun size={15} />
            <span className="option-label">{language === 'km' ? 'ភ្លឺ' : 'Light Mode'}</span>
            {activeTheme === 'light' && <Check size={14} className="check-icon" />}
          </button>
        </div>
      )}
    </div>
  );
};
