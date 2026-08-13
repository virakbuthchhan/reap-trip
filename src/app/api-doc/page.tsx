'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const SwaggerUIComponent = dynamic(() => import('@/components/SwaggerUIComponent'), {
  ssr: false,
  loading: () => (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
      Loading Swagger API Documentation...
    </div>
  ),
});

export default function ApiDocPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
              🚀 Reap Trip API Documentation
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Interactive OpenAPI 3.0 specification & live testing console
            </p>
          </div>
          <a
            href="/api/doc"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0284c7',
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            Raw OpenAPI JSON
          </a>
        </div>
        <SwaggerUIComponent />
      </div>
    </div>
  );
}
