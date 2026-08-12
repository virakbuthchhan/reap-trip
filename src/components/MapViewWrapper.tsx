'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Destination } from '@/types';

// Dynamic import for Leaflet Map to disable SSR
const MapView = dynamic(
  () => import('./MapView').then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="map-view-card flex-center" style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)' }}>
        <p className="text-muted">🗺️ Loading Cambodia Interactive Map...</p>
      </div>
    )
  }
);

interface MapViewWrapperProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  selectedDestination?: Destination | null;
}

export const MapViewWrapper: React.FC<MapViewWrapperProps> = (props) => {
  return <MapView {...props} />;
};
