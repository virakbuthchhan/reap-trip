'use client';

import React, { useState } from 'react';
import { LocalGuide, Destination } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { AddGuideModal } from './AddGuideModal';
import { Phone, Send, ShieldCheck, Star, MapPin, Search, MessageSquare, Check, Users, Sparkles, DollarSign, Globe, Grid, List, UserPlus, ThumbsUp, X } from 'lucide-react';
import { InputField } from './ui/InputField';
import { TextAreaField } from './ui/TextAreaField';
import { SelectField } from './ui/SelectField';

interface GuideDirectoryProps {
  guides: LocalGuide[];
  destinations: Destination[];
  onAddGuide?: (newGuide: LocalGuide) => void;
}

export const GuideDirectory: React.FC<GuideDirectoryProps> = ({ guides, destinations, onAddGuide }) => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  const [allGuides, setAllGuides] = useState<LocalGuide[]>(guides);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestId, setSelectedDestId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [inquiryGuide, setInquiryGuide] = useState<LocalGuide | null>(null);
  useBodyScrollLock(!!inquiryGuide);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [addGuideModalOpen, setAddGuideModalOpen] = useState(false);

  // Endorse / Upvote state map
  const [endorsedMap, setEndorsedMap] = useState<{ [guideId: string]: boolean }>({});

  const handleEndorseGuide = (guide: LocalGuide) => {
    const guideId = guide.id;
    const isAlready = endorsedMap[guideId];

    if (isAlready) {
      showToast(language === 'km' ? 'អ្នកបានបញ្ជាក់ការគាំទ្ររួចហើយ!' : 'You already endorsed this guide!', 'info');
      return;
    }

    setEndorsedMap({ ...endorsedMap, [guideId]: true });
    setAllGuides(allGuides.map((g) => (g.id === guideId ? { ...g, reviewCount: g.reviewCount + 1 } : g)));

    const name = language === 'km' ? guide.nameKm : guide.nameEn;
    showToast(language === 'km' ? `បានផ្ញើការគាំទ្រដល់មគ្គុទ្ទេសក៍ ${name} ជោគជ័យ!` : `Endorsed ${name} (+1 Community Verification)!`, 'success');
  };

  const handleAddNewGuide = (newGuide: LocalGuide) => {
    setAllGuides([newGuide, ...allGuides]);
    if (onAddGuide) onAddGuide(newGuide);
    const name = language === 'km' ? newGuide.nameKm : newGuide.nameEn;
    showToast(language === 'km' ? `បានបន្ថែមមគ្គុទ្ទេសក៍ ${name} រួចរាល់!` : `Added local guide ${name} to directory!`, 'success');
  };

  // Filtered guides
  const filteredGuides = allGuides.filter((g) => {
    const name = (language === 'km' ? g.nameKm : g.nameEn).toLowerCase();
    const village = (language === 'km' ? g.communityVillageKm : g.communityVillageEn).toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = name.includes(query) || village.includes(query);
    const matchesDest = selectedDestId === 'all' || g.destinationIds.includes(selectedDestId);

    return matchesSearch && matchesDest;
  });

  const sendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setInquiryGuide(null);
      setInquiryMessage('');
      showToast(language === 'km' ? 'បានផ្ញើសារសាកសួររួចរាល់!' : 'Inquiry sent to local guide!', 'success');
    }, 1500);
  };

  return (
    <div className="guide-directory-page container">
      {/* Page Header */}
      <div className="guide-page-header">
        <div className="guide-header-text">
          <h2 className="guide-header-title">
            <Users size={24} color="var(--primary)" />
            <span>{t.localGuidesHeader}</span>
          </h2>
          <p className="guide-header-sub">{t.guideSubtitle}</p>
        </div>

        {/* Add Guide Button Aligned Right */}
        <button className="btn btn-primary recommend-guide-btn" onClick={() => setAddGuideModalOpen(true)}>
          <UserPlus size={18} />
          <span>{language === 'km' ? 'បន្ថែមមគ្គុទ្ទេសក៍' : 'Recommend Local Guide'}</span>
        </button>
      </div>

      {/* Filter Controls & View Switcher Bar */}
      <div className="guide-filter-bar">
        <div className="filter-left-wrap">
          <div className="search-input-wrap">
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder={language === 'km' ? 'ស្វែងរកតាមឈ្មោះ ឬសហគមន៍...' : 'Search guide name or village...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="select-filter-wrap">
            <SelectField
              value={selectedDestId}
              onChange={(val) => setSelectedDestId(val)}
              fullWidth={false}
              options={[
                { value: 'all', label: language === 'km' ? 'គ្រប់ទីតាំង' : 'All Destinations', icon: '🌟' },
                ...destinations.map((d) => ({
                  value: d.id,
                  label: language === 'km' ? d.nameKm : d.nameEn,
                  icon: '📍'
                }))
              ]}
            />
          </div>
        </div>

        {/* View Mode Switcher on the FAR RIGHT */}
        <div className="view-mode-toggle">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <Grid size={16} />
            <span>{language === 'km' ? 'ប្រឡោះ' : 'Grid'}</span>
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <List size={16} />
            <span>{language === 'km' ? 'បញ្ជី' : 'List'}</span>
          </button>
        </div>
      </div>

      {/* Guide Cards Container */}
      <div className={viewMode === 'grid' ? 'guides-grid' : 'guides-list-view'}>
        {filteredGuides.map((guide) => {
          const name = language === 'km' ? guide.nameKm : guide.nameEn;
          const village = language === 'km' ? guide.communityVillageKm : guide.communityVillageEn;
          const bio = language === 'km' ? guide.bioKm : guide.bioEn;
          const price = language === 'km' ? guide.priceRangeKm : guide.priceRangeEn;
          const isEndorsed = endorsedMap[guide.id] || false;

          return (
            <div
              key={guide.id}
              className={`guide-card rounded-guide-card glass-card ${viewMode === 'list' ? 'clean-list-guide-card' : ''}`}
            >
              {/* Column 1: Guide Avatar & Identity */}
              <div className="guide-identity-col">
                <div className="avatar-wrap">
                  <img src={guide.avatar} alt={name} className="guide-avatar-img" />
                </div>
                <div className="guide-identity-info">
                  <div className="guide-title-badge-row">
                    <h3>{name}</h3>
                    {guide.verified && (
                      <span className="badge badge-emerald inline-verified-badge" title="Verified by Community">
                        <ShieldCheck size={11} /> {language === 'km' ? 'បានបញ្ជាក់' : 'Verified'}
                      </span>
                    )}
                  </div>
                  <span className="village-tag">📍 {village}</span>
                  <div className="rating-row">
                    <Star size={14} color="var(--accent-amber)" fill="var(--accent-amber)" />
                    <strong>{guide.rating}</strong>
                    <span>({guide.reviewCount} {language === 'km' ? 'ការគាំទ្រ' : 'endorsements'})</span>
                  </div>
                </div>
              </div>

              {/* Column 2: Bio & Metadata Pills */}
              <div className="guide-details-col">
                <p className="guide-bio-text">{bio}</p>

                <div className="guide-meta-pill-box">
                  <div className="meta-pill">
                    <span className="meta-label">
                      <DollarSign size={14} color="var(--primary)" /> {language === 'km' ? 'តម្លៃ:' : 'Rate:'}
                    </span>
                    <strong className="meta-val">{price}</strong>
                  </div>

                  <div className="meta-pill">
                    <span className="meta-label">
                      <Globe size={14} color="var(--primary)" /> {language === 'km' ? 'ភាសា:' : 'Languages:'}
                    </span>
                    <div className="lang-chips">
                      {guide.languages.map((lang: string, idx: number) => (
                        <span key={idx} className="badge badge-cyan">{lang}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: Contact & Action Buttons */}
              <div className="guide-actions-col">
                <a
                  href={`tel:${guide.phone.replace(/\s+/g, '')}`}
                  className="btn btn-primary btn-sm call-btn-full"
                >
                  <Phone size={15} />
                  <span>{guide.phone}</span>
                </a>

                <div className="sub-actions-row">
                  {guide.telegramHandle && (
                    <a
                      href={`https://t.me/${guide.telegramHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm flex-1"
                    >
                      <Send size={14} />
                      <span>Telegram</span>
                    </a>
                  )}

                  <button
                    className="btn btn-outline btn-sm icon-action-btn"
                    onClick={() => setInquiryGuide(guide)}
                    title="Send Message"
                  >
                    <MessageSquare size={15} />
                  </button>

                  <button
                    className={`btn btn-sm icon-action-btn ${isEndorsed ? 'btn-secondary' : 'btn-outline'}`}
                    onClick={() => handleEndorseGuide(guide)}
                    title="Verify Guide (+1)"
                  >
                    <ThumbsUp size={14} color={isEndorsed ? 'var(--primary)' : 'currentColor'} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Guide Modal */}
      {addGuideModalOpen && (
        <AddGuideModal
          destinations={destinations}
          onClose={() => setAddGuideModalOpen(false)}
          onSubmitGuide={handleAddNewGuide}
        />
      )}

      {/* Direct Inquiry Modal */}
      {inquiryGuide && (
        <div className="modal-overlay" onClick={() => setInquiryGuide(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            {/* Sticky Fixed Header */}
            <div className="modal-header-sticky">
              <div className="modal-header-title-wrap">
                <h3>💬 {language === 'km' ? 'ផ្ញើសារទៅកាន់' : 'Send Message to'} {language === 'km' ? inquiryGuide.nameKm : inquiryGuide.nameEn}</h3>
              </div>
              <div className="modal-header-actions">
                <button type="button" className="modal-icon-btn close-btn" onClick={() => setInquiryGuide(null)}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {inquirySuccess ? (
              <div className="modal-body-scrollable">
                <div className="success-alert">
                  <Check size={24} color="var(--primary)" />
                  <h4>{language === 'km' ? 'បានផ្ញើសារជោគជ័យ!' : 'Inquiry Sent Successfully!'}</h4>
                </div>
              </div>
            ) : (
              <form onSubmit={sendInquiry} className="modern-form" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div className="modal-body-scrollable">
                  <TextAreaField
                    label={language === 'km' ? 'សារសាកសួររបស់អ្នក' : 'Your Message / Inquiry'}
                    required
                    rows={4}
                    placeholder="Ask about availability, guide rates, camping gear rental..."
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                  />
                </div>

                <div className="modal-actions-sticky">
                  <button type="button" className="btn btn-secondary" onClick={() => setInquiryGuide(null)}>
                    {t.close}
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Send size={15} /> {language === 'km' ? 'ផ្ញើសារ' : 'Send Inquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .guide-directory-page {
          padding: 2.5rem 1.25rem;
        }

        .guide-page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .guide-header-text {
          flex: 1;
          min-width: 280px;
        }

        .guide-header-title {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 0.35rem;
        }

        .guide-header-sub {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .recommend-guide-btn {
          height: 44px;
          white-space: nowrap;
          box-shadow: var(--shadow-sm);
        }

        .guide-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .filter-left-wrap {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          min-width: 280px;
          flex-wrap: wrap;
        }

        .search-input-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 0 1rem;
          min-width: 260px;
          height: 44px;
          box-shadow: var(--shadow-sm);
        }

        .search-input-wrap input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-main);
          font-family: var(--font-main);
          font-size: 0.95rem;
        }

        .select-filter-wrap {
          min-width: 220px;
        }

        .view-mode-toggle {
          display: flex;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 3px;
          height: 44px;
          align-items: center;
          margin-left: auto;
          box-shadow: var(--shadow-sm);
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
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }

        .view-btn.active {
          background: var(--primary);
          color: #ffffff;
        }

        /* Rounded Guide Cards (20px border-radius) */
        .rounded-guide-card {
          border-radius: 20px !important;
          border: 1px solid var(--border-light);
          overflow: hidden;
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
          padding: 1.25rem;
        }

        .rounded-guide-card:hover {
          transform: translateY(-3px);
          border-color: rgba(16, 185, 129, 0.4);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        /* GRID VIEW LAYOUT */
        .guides-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
        }

        .guides-grid .guide-card {
          display: flex;
          flex-direction: column;
        }

        .guides-grid .guide-identity-col {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .guides-grid .guide-actions-col {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .guides-grid .sub-actions-row {
          display: flex;
          gap: 0.5rem;
        }

        /* LIST VIEW ULTRA-CLEAN 3-COLUMN LAYOUT */
        .guides-list-view {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .clean-list-guide-card {
          display: grid;
          grid-template-columns: 280px 1fr 220px;
          gap: 1.5rem;
          align-items: center;
        }

        @media (max-width: 992px) {
          .clean-list-guide-card {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        .guide-identity-col {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .avatar-wrap {
          flex-shrink: 0;
        }

        .guide-avatar-img {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary);
        }

        .guide-identity-info {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          flex: 1;
          min-width: 0;
        }

        .guide-title-badge-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .guide-title-badge-row h3 {
          font-size: 1.05rem;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .inline-verified-badge {
          font-size: 0.65rem;
          padding: 0.15rem 0.4rem;
        }

        .village-tag {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.82rem;
        }

        .guide-details-col {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0.65rem;
        }

        .guide-bio-text {
          color: var(--text-muted);
          font-size: 0.88rem;
          line-height: 1.5;
          margin: 0;
        }

        .guide-meta-pill-box {
          display: flex;
          gap: 1rem;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.85rem;
          font-size: 0.82rem;
          flex-wrap: wrap;
        }

        .meta-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .meta-label {
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .meta-val {
          color: #ffffff;
        }

        .lang-chips {
          display: flex;
          gap: 0.3rem;
        }

        .guide-actions-col {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          justify-content: center;
        }

        .call-btn-full {
          width: 100%;
          justify-content: center;
        }

        .sub-actions-row {
          display: flex;
          gap: 0.4rem;
        }

        .icon-action-btn {
          padding: 0.4rem 0.65rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .flex-1 { flex: 1; }

        .success-alert {
          text-align: center;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};
