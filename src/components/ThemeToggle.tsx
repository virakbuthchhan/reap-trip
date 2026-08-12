'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, Laptop, ChevronDown, Check } from 'lucide-react';

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

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case 'dark': return <Moon size={14} color="var(--primary)" />;
      case 'light': return <Sun size={14} color="var(--accent-gold)" />;
      case 'system': return <Laptop size={14} color="var(--text-main)" />;
    }
  };

  const getThemeLabel = (mode: ThemeMode) => {
    switch (mode) {
      case 'system': return language === 'km' ? 'ប្រព័ន្ធ' : 'System';
      case 'dark': return language === 'km' ? 'ងងឹត' : 'Dark';
      case 'light': return language === 'km' ? 'ភ្លឺ' : 'Light';
    }
  };

  return (
    <div className="theme-toggle-dropdown-wrap" ref={containerRef}>
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        title={language === 'km' ? 'ប្តូររូបរាង (ពន្លឺ/ងងឹត/ប្រព័ន្ធ)' : 'Toggle Theme (Light/Dark/System)'}
      >
        {getThemeIcon(activeTheme)}
        <span className="theme-btn-label">{getThemeLabel(activeTheme)}</span>
        <ChevronDown size={12} className={`chevron-icon ${dropdownOpen ? 'open' : ''}`} />
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
