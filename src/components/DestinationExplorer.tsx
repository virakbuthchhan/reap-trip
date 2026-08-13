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

      <style>{`
        .hero-banner {
          position: relative;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-light);
          padding: 3.5rem 0 3rem 0;
          overflow: hidden;
        }
        .hero-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-content {
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .hero-badge {
          margin-bottom: 1rem;
          display: inline-flex;
          align-items: center;
        }
        .hero-content h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-content p {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        .hero-search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-card);
          border: 1px solid var(--border-glow);
          border-radius: var(--radius-full);
          padding: 0.75rem 1.25rem;
          max-width: 650px;
          margin: 0 auto 2rem auto;
          box-shadow: var(--shadow-glow);
        }
        .hero-search-box input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-main);
          font-family: var(--font-main);
          font-size: 1rem;
        }
        .clear-search-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 1rem;
        }
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }
        .stat-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .stat-pill strong {
          font-size: 1.5rem;
          color: var(--primary);
        }
        .stat-pill span {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .main-controls-section {
          padding: 2rem 1.25rem;
        }
        .category-filter-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .category-scroll {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 4px;
        }
        .cat-chip {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          font-family: var(--font-main);
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          cursor: pointer;
          white-space: nowrap;
          transition: var(--transition);
        }
        .cat-chip:hover, .cat-chip.active {
          background: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
        }
        .view-mode-toggle {
          display: flex;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 3px;
        }
        .view-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-family: var(--font-main);
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }
        .view-btn.active {
          background: var(--primary);
          color: #ffffff;
        }
        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .dest-card-link {
          text-decoration: none;
          color: inherit;
        }
        .dest-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
          cursor: pointer;
          transition: var(--transition);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .dest-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-glow);
          box-shadow: var(--shadow-glow);
        }
        .dest-card-image-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .dest-card-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .dest-card:hover .dest-card-image-wrap img {
          transform: scale(1.06);
        }
        .dest-cat-badge {
          position: absolute;
          top: 0.85rem;
          left: 0.85rem;
          z-index: 2;
        }
        .dest-card-overlay {
          position: absolute;
          bottom: 0.85rem;
          left: 0.85rem;
          z-index: 2;
        }
        .dest-card-content {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .dest-card-content h3 {
          font-size: 1.15rem;
          margin-bottom: 0.5rem;
        }
        .dest-card-meta {
          display: flex;
          gap: 1rem;
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-bottom: 0.85rem;
        }
        .dest-card-meta span {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .dest-card-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }
        .dest-view-btn {
          width: 100%;
          margin-top: auto;
        }
      `}</style>
    </div>
  );
};
