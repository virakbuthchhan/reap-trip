'use client';

import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { openApiSpec } from '@/lib/swagger';

export default function SwaggerUIComponent() {
  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <SwaggerUI spec={openApiSpec} />
    </div>
  );
}
