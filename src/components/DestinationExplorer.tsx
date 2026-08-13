'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Destination } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { MapViewWrapper } from './MapViewWrapper';
import { DestinationCard } from './ui/DestinationCard';
import { Search, Map, Grid, Clock, MapPin, Mountain, Waves, Trees, Tent, Compass, Bike, Car, Truck, Footprints, Anchor, Sparkles, CheckCircle2 } from 'lucide-react';

interface DestinationExplorerProps {
  destinations: Destination[];
  onSelectDestination?: (dest: Destination) => void;
}

export const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  destinations,
  onSelectDestination
}) => {
  const { language, t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedMapDest, setSelectedMapDest] = useState<Destination | null>(null);

  // Categories with Lucide Icons
  const categories = [
    { id: 'all', label: t.allCategories, icon: Compass },
    { id: 'mountain', label: t.mountain, icon: Mountain },
    { id: 'waterfall', label: t.waterfall, icon: Waves },
    { id: 'forest', label: t.forest, icon: Trees },
    { id: 'campsite', label: t.campsite, icon: Tent },
    { id: 'lake', label: t.lake, icon: Anchor }
  ];

  // Filtered logic
  const filtered = destinations.filter((d) => {
    const name = (language === 'km' ? d.nameKm : d.nameEn).toLowerCase();
    const province = (language === 'km' ? d.provinceKm : d.provinceEn).toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = name.includes(query) || province.includes(query);
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="destinations-page">
      {/* Hero Section */}
      <section className="hero-banner">
        <div className="hero-overlay">
          <div className="container hero-content">
            <span className="badge badge-emerald hero-badge">
              <Sparkles size={13} style={{ marginRight: '4px' }} />
              {language === 'km' ? 'ដំណើរកម្សាន្តធម្មជាតិកម្ពុជា' : 'Cambodia Nature Excursions'}
            </span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroSub}</p>

            {/* Search Bar */}
            <div className="hero-search-box">
              <Search size={20} color="var(--text-muted)" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>

            {/* Stats Row */}
            <div className="hero-stats">
              <div className="stat-pill">
                <strong>8+</strong>
                <span>{language === 'km' ? 'តំបន់កម្សាន្តពេញនិយម' : 'Verified Spots'}</span>
              </div>
              <div className="stat-pill">
                <strong>100%</strong>
                <span>{language === 'km' ? 'ព័ត៌មានអ្នកនាំផ្លូវ & សហគមន៍' : 'Community Guides'}</span>
              </div>
              <div className="stat-pill">
                <strong>0$</strong>
                <span>{language === 'km' ? 'ប្រើប្រាស់ដោយឥតគិតថ្លៃ' : '100% Free Tool'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Control Bar: Categories & Grid/Map Toggle */}
      <div className="container main-controls-section">
        <div className="category-filter-row">
          <div className="category-scroll">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  className={`cat-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <Icon size={15} style={{ marginRight: '6px' }} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
              <span>{language === 'km' ? 'បញ្ជី' : 'Grid'}</span>
            </button>
            <button
              className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
              onClick={() => setViewMode('map')}
            >
              <Map size={16} />
              <span>{language === 'km' ? 'ផែនទី' : 'Map'}</span>
            </button>
          </div>
        </div>

        {/* View Mode Switcher Rendering */}
        {viewMode === 'map' ? (
          <div style={{ marginTop: '1.5rem' }}>
            <MapViewWrapper
              destinations={filtered}
              onSelectDestination={(dest) => {
                if (onSelectDestination) onSelectDestination(dest);
                setSelectedMapDest(dest);
              }}
              selectedDestination={selectedMapDest}
            />
          </div>
        ) : (
          <div className="destinations-grid">
            {filtered.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
