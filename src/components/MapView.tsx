'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Destination } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Navigation, MapPin, Maximize2, Minimize2, X } from 'lucide-react';

// Custom SVG Icon for Leaflet Markers (Client-side helper)
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

// Component to dynamically re-center map when a destination is highlighted
const RecenterMap: React.FC<{ selected: Destination | null | undefined; isFullscreen?: boolean }> = ({ selected, isFullscreen }) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (selected) {
      map.flyTo([selected.coordinates.lat, selected.coordinates.lng], 10, {
        duration: 1.2
      });
    }
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="map-view-card flex-center" style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)' }}>
        <p className="text-muted">🗺️ Loading Cambodia Interactive Map...</p>
      </div>
    );
  }
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Cambodia Center Coords: Phnom Penh / Cardamom center ~ 11.5, 104.0
  const centerLat = selectedDestination ? selectedDestination.coordinates.lat : 11.56;
  const centerLng = selectedDestination ? selectedDestination.coordinates.lng : 104.10;

  // Toggle ESC key to exit fullscreen map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const mapContent = (
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
  );

  return (
    <>
      {/* Standard In-Page Map Card */}
      <div className="map-view-card">
        <div className="map-header">
          <div className="map-title">
            <MapPin size={18} color="var(--primary)" />
            <h3>{language === 'km' ? 'ផែនទីទីតាំងកម្សាន្តកម្ពុជា' : 'Cambodia Destinations Map'}</h3>
            <span className="badge badge-emerald">{destinations.length} PINS</span>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm expand-map-btn"
            onClick={() => setIsFullscreen(true)}
            title={language === 'km' ? 'ពង្រីកផែនទីពេញអេក្រង់' : 'Expand map fullscreen'}
          >
            <Maximize2 size={15} />
            <span>{language === 'km' ? 'ពង្រីកពេញអេក្រង់' : 'Fullscreen Map'}</span>
          </button>
        </div>

        <div className="map-container-wrapper">
          {mapContent}
        </div>
      </div>

      {/* Fullscreen Map Dialog Modal */}
      {isFullscreen && (
        <div className="fullscreen-map-overlay">
          <div className="fullscreen-map-header">
            <div className="fullscreen-map-title">
              <MapPin size={20} color="var(--primary)" />
              <h2>{language === 'km' ? 'ផែនទីទីតាំងកម្សាន្តកម្ពុជា' : 'Cambodia Destinations Map'}</h2>
              <span className="badge badge-emerald">{destinations.length} PINS</span>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm exit-fullscreen-btn"
              onClick={() => setIsFullscreen(false)}
            >
              <Minimize2 size={16} />
              <span>{language === 'km' ? 'ចាកចេញពីពេញអេក្រង់' : 'Exit Fullscreen'}</span>
            </button>
          </div>

          <div className="fullscreen-map-body">
            {mapContent}
          </div>
        </div>
      )}

      <style>{`
        .map-view-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          box-shadow: var(--shadow-md);
        }
        .map-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .map-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .expand-map-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(16, 185, 129, 0.1);
          border-color: var(--border-glow);
          color: var(--primary);
          transition: var(--transition);
        }
        .expand-map-btn:hover {
          background: var(--primary);
          color: #ffffff;
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
        }
        .map-container-wrapper {
          height: 420px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-light);
        }

        /* Fullscreen Map Modal Styles */
        .fullscreen-map-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #080d09;
          display: flex;
          flex-direction: column;
          animation: mapFadeIn 0.25s ease-out;
        }

        @keyframes mapFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        .fullscreen-map-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1.5rem;
          background: rgba(12, 20, 15, 0.96);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-glow);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          z-index: 10000;
        }

        .fullscreen-map-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .fullscreen-map-title h2 {
          font-size: 1.25rem;
          color: #ffffff;
          margin: 0;
        }

        .exit-fullscreen-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
        }

        .fullscreen-map-body {
          flex: 1;
          width: 100%;
          height: calc(100vh - 65px);
          position: relative;
        }

        @media (max-width: 640px) {
          .map-container-wrapper {
            height: 320px;
          }
          .fullscreen-map-header {
            padding: 0.75rem 1rem;
          }
          .fullscreen-map-title h2 {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
};
