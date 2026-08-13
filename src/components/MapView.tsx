'use client';

import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { Destination } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Maximize2, Minimize2 } from 'lucide-react';

interface MapViewProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  selectedDestination?: Destination | null;
}

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

export const MapView: React.FC<MapViewProps> = ({
  destinations,
  onSelectDestination,
  selectedDestination
}) => {
  const { language, t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize Leaflet Map safely with reset & cleanup
  useEffect(() => {
    if (!isMounted || !containerRef.current) return;

    // Reset _leaflet_id if container was already initialized by previous mount/HMR
    if ((containerRef.current as any)._leaflet_id) {
      (containerRef.current as any)._leaflet_id = null;
    }

    const defaultLat = selectedDestination ? selectedDestination.coordinates.lat : 11.56;
    const defaultLng = selectedDestination ? selectedDestination.coordinates.lng : 104.10;

    const map = L.map(containerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 8,
      scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isMounted]);

  // Update Markers dynamically when destinations or language change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Add markers
    destinations.forEach((dest) => {
      const name = language === 'km' ? dest.nameKm : dest.nameEn;
      const province = language === 'km' ? dest.provinceKm : dest.provinceEn;

      const popupHtml = `
        <div style="padding: 4px; max-width: 220px; font-family: sans-serif;">
          <img
            src="${dest.coverImage}"
            alt="${name}"
            style="width: 100%; height: 95px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;"
          />
          <strong style="font-size: 0.95rem; display: block; color: #111;">${name}</strong>
          <span style="font-size: 0.8rem; color: #666;">📍 ${province}</span>
          <div style="margin-top: 8px;">
            <a
              href="/destinations/${dest.id}"
              style="
                display: block;
                text-align: center;
                background: #10b981;
                color: #fff;
                text-decoration: none;
                padding: 6px 10px;
                border-radius: 4px;
                font-size: 0.78rem;
                font-weight: bold;
                cursor: pointer;
                width: 100%;
              "
            >
              ${t.viewDetails || 'View Details'} →
            </a>
          </div>
        </div>
      `;

      const marker = L.marker([dest.coordinates.lat, dest.coordinates.lng], {
        icon: getCustomPinIcon()
      })
        .addTo(map)
        .bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectDestination(dest);
      });

      markersRef.current[dest.id] = marker;
    });
  }, [destinations, language, isMounted, onSelectDestination, t.viewDetails]);

  // Fly to selected destination when prop changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedDestination) return;

    map.flyTo([selectedDestination.coordinates.lat, selectedDestination.coordinates.lng], 10, {
      duration: 1.2
    });

    const marker = markersRef.current[selectedDestination.id];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedDestination]);

  // Invalidate map size on fullscreen toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  // Handle Escape key exit fullscreen
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
        <div ref={containerRef} style={{ width: '100%', height: '100%', borderRadius: isFullscreen ? 0 : 'var(--radius-md)' }} />
      </div>
    </div>
  );
};
