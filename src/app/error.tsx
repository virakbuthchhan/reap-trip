'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home, Compass } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useLanguage();

  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'var(--card-bg, #ffffff)',
          border: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
          borderRadius: '24px',
          padding: '3rem 2rem',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            borderRadius: '50%',
          }}
        >
          <AlertCircle size={44} />
        </div>

        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-main, #0f172a)',
            marginBottom: '0.75rem',
          }}
        >
          {language === 'km' ? 'មានបញ្ហាបច្ចេកទេសបានកើតឡើង' : 'Something Went Wrong'}
        </h2>

        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted, #64748b)',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          {language === 'km'
            ? 'ប្រព័ន្ធបានជួបប្រទះការរំខានបន្តិចបន្តួច។ សូមចុចប៊ូតុងខាងក្រោមដើម្បីព្យាយាមម្តងទៀត។'
            : 'An unexpected application error occurred while processing your request.'}
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => reset()}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: 600,
            }}
          >
            <RefreshCw size={18} />
            <span>{language === 'km' ? 'ព្យាយាមម្តងទៀត' : 'Try Again'}</span>
          </button>

          <Link
            href="/"
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <Home size={18} />
            <span>{language === 'km' ? 'ទំព័រដើម' : 'Back Home'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
