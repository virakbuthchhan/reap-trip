'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Home, MapPin, Search, ArrowLeft, Tent } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        background: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0) 70%)',
      }}
    >
      <div
        style={{
          maxWidth: '580px',
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'var(--card-bg, #ffffff)',
          border: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
          borderRadius: '24px',
          padding: '3rem 2rem',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Floating 404 Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            fontWeight: 700,
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
          }}
        >
          <Compass className="animate-spin-slow" size={18} />
          <span>ERROR 404 • ROUTE UNEXPLORED</span>
        </div>

        {/* Big Animated Icon */}
        <div
          style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(14, 165, 233, 0.15) 100%)',
            borderRadius: '50%',
            color: 'var(--primary, #059669)',
          }}
        >
          <Tent size={56} />
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              backgroundColor: '#ef4444',
              color: '#fff',
              borderRadius: '50%',
              padding: '6px',
              display: 'flex',
            }}
          >
            <MapPin size={18} />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--text-main, #0f172a)',
            marginBottom: '0.75rem',
            lineHeight: 1.25,
          }}
        >
          {language === 'km' ? 'វង្វេងផ្លូវក្នុងព្រៃ? (404 រកមិនឃើញទំព័រ)' : 'Lost Off the Trail? Page Not Found'}
        </h1>

        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-muted, #64748b)',
            lineHeight: 1.6,
            marginBottom: '2rem',
          }}
        >
          {language === 'km'
            ? 'ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមាន ឬត្រូវ បានផ្លាស់ប្តូរទីតាំង។ សូមត្រឡប់ទៅកាន់ទំព័រដើម ឬស្វែងរកតំបន់កម្សាន្តផ្សេងទៀត។'
            : 'The mountain trail or page you are looking for does not exist or has been moved. Let’s get you back on the right map!'}
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '2rem',
          }}
        >
          <Link
            href="/"
            className="btn btn-primary"
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
            <span>{language === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Home'}</span>
          </Link>

          <Link
            href="/destinations"
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
            <Search size={18} />
            <span>{language === 'km' ? 'រករមណីយដ្ឋាន' : 'Explore Destinations'}</span>
          </Link>
        </div>

        {/* Helpful Shortcut Links */}
        <div
          style={{
            borderTop: '1px solid var(--border-color, #e2e8f0)',
            paddingTop: '1.25rem',
            fontSize: '0.875rem',
            color: 'var(--text-muted, #64748b)',
            display: 'flex',
            justifyContent: 'center',
            gap: '1.25rem',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/guides" style={{ color: 'inherit', textDecoration: 'underline' }}>
            👥 {language === 'km' ? 'មគ្គុទ្ទេសក៍' : 'Local Guides'}
          </Link>
          <Link href="/expenses" style={{ color: 'inherit', textDecoration: 'underline' }}>
            🧮 {language === 'km' ? 'ចែករំលែកចំណាយ' : 'Trip Expenses'}
          </Link>          <Link href="/checklist" style={{ color: 'inherit', textDecoration: 'underline' }}>
            📋 {language === 'km' ? 'បញ្ជីសម្ភារៈ' : 'Packing List'}
          </Link>
          <Link href="/api-doc" style={{ color: 'inherit', textDecoration: 'underline' }}>
            📄 {language === 'km' ? 'ឯកសារ API' : 'Swagger API'}
          </Link>
        </div>
      </div>
    </div>
  );
}
