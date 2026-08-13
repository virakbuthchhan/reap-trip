'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wrench, RefreshCw, Server, AlertTriangle, ShieldCheck, Home } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ServiceUnavailablePage() {
  const { language } = useLanguage();
  const [checking, setChecking] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{ status?: string; message?: string } | null>(null);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (res.ok && data.status === 'ok') {
        setHealthStatus({ status: 'ok', message: 'Services restored! Redirecting to home...' });
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setHealthStatus({
          status: 'degraded',
          message: `Service status: ${data.status || 'Degraded'}. Please try again shortly.`,
        });
      }
    } catch (err) {
      setHealthStatus({
        status: 'error',
        message: 'Could not connect to server gateway.',
      });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        background: 'radial-gradient(circle at 50% 20%, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0) 70%)',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'var(--card-bg, #ffffff)',
          border: '1px solid var(--border-color, rgba(226, 232, 240, 0.8))',
          borderRadius: '24px',
          padding: '3.5rem 2rem',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Floating 503 Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            color: '#d97706',
            fontWeight: 700,
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
          }}
        >
          <AlertTriangle size={18} />
          <span>ERROR 503 • SERVICE TEMPORARILY UNAVAILABLE</span>
        </div>

        {/* Animated Wrench / Server Icon */}
        <div
          style={{
            position: 'relative',
            width: '110px',
            height: '110px',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)',
            borderRadius: '50%',
            color: '#d97706',
          }}
        >
          <Server size={52} />
          <div
            style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              backgroundColor: '#d97706',
              color: '#fff',
              borderRadius: '50%',
              padding: '6px',
              display: 'flex',
            }}
          >
            <Wrench size={18} />
          </div>
        </div>

        {/* Header Text */}
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--text-main, #0f172a)',
            marginBottom: '0.75rem',
          }}
        >
          {language === 'km' ? 'សេវាកម្មកំពុងថែទាំ (503 Service Unavailable)' : 'Camp Trail Maintenance'}
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
            ? 'ម៉ាស៊ីនបម្រើ ឬទិន្នន័យប្រព័ន្ធកំពុងទទួលបានការអភិវឌ្ឍន៍/ថែទាំបណ្តោះអាសន្ន។ សូមព្យាយាមម្តងទៀតក្នុងពេលបន្តិចទៀត។'
            : 'Our servers or database are currently undergoing routine trail maintenance or temporary capacity checks. Please try refreshing in a few moments.'}
        </p>

        {/* Health status banner */}
        {healthStatus && (
          <div
            style={{
              padding: '0.875rem 1.25rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              fontSize: '0.9rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor:
                healthStatus.status === 'ok'
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(245, 158, 11, 0.1)',
              color: healthStatus.status === 'ok' ? '#059669' : '#b45309',
              border: `1px solid ${healthStatus.status === 'ok' ? '#10b981' : '#f59e0b'}`,
            }}
          >
            {healthStatus.status === 'ok' ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{healthStatus.message}</span>
          </div>
        )}

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={checkHealth}
            disabled={checking}
            className="btn btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: 600,
              cursor: checking ? 'not-allowed' : 'pointer',
            }}
          >
            <RefreshCw size={18} className={checking ? 'animate-spin' : ''} />
            <span>
              {checking
                ? language === 'km' ? 'កំពុងពិនិត្យ...' : 'Checking Service...'
                : language === 'km' ? 'ផ្ទៀងផ្ទាត់សេវាកម្មឡើងវិញ' : 'Retry Connection'}
            </span>
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
            <span>{language === 'km' ? 'ទំព័រដើម' : 'Home'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
