'use client';

import React from 'react';
import Link from 'next/link';
import { Destination } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Clock, Bike, Truck, Car, Footprints, Tent } from 'lucide-react';

export interface DestinationCardProps {
  destination: Destination;
  className?: string;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  className = ''
}) => {
  const { language, t } = useLanguage();

  const name = language === 'km' ? destination.nameKm : destination.nameEn;
  const province = language === 'km' ? destination.provinceKm : destination.provinceEn;

  return (
    <Link href={`/destinations/${destination.id}`} className={`dest-card-link ${className}`}>
      <div className="dest-card">
        <div className="dest-card-image-wrap">
          <img src={destination.coverImage} alt={name} loading="lazy" />
          <span className="badge badge-emerald dest-cat-badge">{destination.category}</span>
          <div className="dest-card-overlay">
            <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} /> {province}
            </span>
          </div>
        </div>

        <div className="dest-card-content">
          <h3>{name}</h3>
          <div className="dest-card-meta">
            <span>
              <MapPin size={14} /> {destination.distanceFromPhnomPenhKm} {t.km} {language === 'km' ? 'ពីភ្នំពេញ' : 'from PP'}
            </span>
            <span>
              <Clock size={14} /> ~{destination.estimatedTravelTimeHours} {t.hours}
            </span>
          </div>

          <div className="dest-card-badges">
            {destination.allowedTransport.map((tr, i) => (
              <span key={i} className="badge badge-emerald" style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {tr === 'motorbike' ? <Bike size={12} /> : tr === 'suv_4x4' ? <Truck size={12} /> : tr === 'sedan_car' ? <Car size={12} /> : <Footprints size={12} />}
                <span>{tr}</span>
              </span>
            ))}
            {destination.campingRules.allowed && (
              <span className="badge badge-amber" style={{ fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Tent size={12} /> Camping
              </span>
            )}
          </div>

          <button type="button" className="btn btn-outline btn-sm dest-view-btn">
            {t.viewDetails} →
          </button>
        </div>
      </div>
    </Link>
  );
};
