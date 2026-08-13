'use client';

import React from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { SplashScreen } from '@/components/SplashScreen';
import QueryProvider from '@/lib/react-query/QueryProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <LanguageProvider>
            <ToastProvider>
              <SplashScreen />
              {children}
            </ToastProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
