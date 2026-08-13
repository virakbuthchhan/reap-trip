'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Destination } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Maximize2, Minimize2 } from 'lucide-react';

const getCustomPinIcon = () => {
  if (typeof window === 'undefined') return undefined as any;
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `<div style="
      background: linear-gradient(135deg, #10b981 0%, #047857 100%);
      width: 34px;
      height: 34px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
      border: 2px solid #ffffff;
    ">
      <span style="transform: rotate(45deg); font-size: 16px;">🏕️</span>
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34]
  });
};

interface MapViewProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  selectedDestination?: Destination | null;
}

const RecenterMap: React.FC<{ selected: Destination | null | undefined; isFullscreen?: boolean }> = ({ selected, isFullscreen }) => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    if (selected) {
      map.flyTo([selected.coordinates.lat, selected.coordinates.lng], 10, {
        duration: 1.2
      });
    }
    return () => clearTimeout(timer);
  }, [selected, isFullscreen, map]);
  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  destinations,
  onSelectDestination,
  selectedDestination
}) => {
  const { language, t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, isMounted]);

  if (!isMounted) {
    return (
      <div className="map-view-card flex-center" style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)' }}>
        <p className="text-muted">🗺️ Loading Cambodia Interactive Map...</p>
      </div>
    );
  }

  const centerLat = selectedDestination ? selectedDestination.coordinates.lat : 11.56;
  const centerLng = selectedDestination ? selectedDestination.coordinates.lng : 104.10;

  return (
    <div className={`map-view-card ${isFullscreen ? 'fullscreen-active' : ''}`}>
      <div className="map-header">
        <div className="map-title">
          <MapPin size={18} color="var(--primary)" />
          <h3>{language === 'km' ? 'ផែនទីទីតាំងកម្សាន្តកម្ពុជា' : 'Cambodia Destinations Map'}</h3>
          <span className="badge badge-emerald">{destinations.length} PINS</span>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm expand-map-btn"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          {isFullscreen ? (
            <>
              <Minimize2 size={15} />
              <span>{language === 'km' ? 'ចាកចេញពីពេញអេក្រង់' : 'Exit Fullscreen'}</span>
            </>
          ) : (
            <>
              <Maximize2 size={15} />
              <span>{language === 'km' ? 'ពង្រីកពេញអេក្រង់' : 'Fullscreen Map'}</span>
            </>
          )}
        </button>
      </div>

      <div className="map-container-wrapper">
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={8}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', borderRadius: isFullscreen ? 0 : 'var(--radius-md)' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap selected={selectedDestination} isFullscreen={isFullscreen} />

          {destinations.map((dest) => {
            const name = language === 'km' ? dest.nameKm : dest.nameEn;
            const province = language === 'km' ? dest.provinceKm : dest.provinceEn;
            return (
              <Marker
                key={dest.id}
                position={[dest.coordinates.lat, dest.coordinates.lng]}
                icon={getCustomPinIcon()}
                eventHandlers={{
                  click: () => onSelectDestination(dest)
                }}
              >
                <Popup className="custom-map-popup">
                  <div style={{ padding: '4px', maxWidth: '220px' }}>
                    <img
                      src={dest.coverImage}
                      alt={name}
                      style={{ width: '100%', height: '95px', objectFit: 'cover', borderRadius: '6px', marginBottom: '6px' }}
                    />
                    <strong style={{ fontSize: '0.95rem', display: 'block', color: '#111' }}>{name}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>📍 {province}</span>
                    <div style={{ marginTop: '8px' }}>
                      <a
                        href={`/destinations/${dest.id}`}
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          background: '#10b981',
                          color: '#fff',
                          textDecoration: 'none',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          fontSize: '0.78rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          width: '100%'
                        }}
                      >
                        {t.viewDetails} →
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
