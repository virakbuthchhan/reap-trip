'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'system' | 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'dark' | 'light';
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('reap-trip-theme') as ThemeMode | null;
    if (stored && ['system', 'dark', 'light'].includes(stored)) {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      let active: 'dark' | 'light' = 'dark';

      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        active = systemPrefersDark ? 'dark' : 'light';
      } else {
        active = theme;
      }

      setResolvedTheme(active);
      root.setAttribute('data-theme', active);
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem('reap-trip-theme', mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
