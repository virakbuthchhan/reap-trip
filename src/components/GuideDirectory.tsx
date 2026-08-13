'use client';

import React, { useState, useEffect } from 'react';
import { LocalGuide, Destination } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { AddGuideModal } from './AddGuideModal';
import { Send, MessageSquare, Check, Users, UserPlus, X, Search, Grid, List } from 'lucide-react';
import { TextAreaField } from './ui/TextAreaField';
import { SelectField } from './ui/SelectField';
import { GuideCard } from './ui/GuideCard';
import { useGuidesQuery } from '@/hooks/useApi';

interface GuideDirectoryProps {
  guides?: LocalGuide[];
  destinations?: Destination[];
  onAddGuide?: (newGuide: LocalGuide) => void;
}

export const GuideDirectory: React.FC<GuideDirectoryProps> = ({
  guides: propGuides,
  destinations = [],
  onAddGuide
}) => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  const [selectedDestId, setSelectedDestId] = useState<string>('all');
  const { data: apiGuides, isLoading } = useGuidesQuery(selectedDestId === 'all' ? undefined : selectedDestId);

  const [allGuides, setAllGuides] = useState<LocalGuide[]>(propGuides || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [inquiryGuide, setInquiryGuide] = useState<LocalGuide | null>(null);
  useBodyScrollLock(!!inquiryGuide);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [addGuideModalOpen, setAddGuideModalOpen] = useState(false);

  const [endorsedMap, setEndorsedMap] = useState<{ [guideId: string]: boolean }>({});

  useEffect(() => {
    if (apiGuides && !propGuides) {
      setAllGuides(apiGuides);
    }
  }, [apiGuides, propGuides]);

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

  const filteredGuides = allGuides.filter((g) => {
    const name = (language === 'km' ? g.nameKm : g.nameEn).toLowerCase();
    const village = (language === 'km' ? g.communityVillageKm : g.communityVillageEn).toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = name.includes(query) || village.includes(query);
    const matchesDest = selectedDestId === 'all' || (g.destinationIds || []).includes(selectedDestId);

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

      {isLoading && allGuides.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          {language === 'km' ? 'កំពុងទាញយកមគ្គុទ្ទេសក៍...' : 'Loading local guides...'}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'guides-grid' : 'guides-list-view'}>
          {filteredGuides.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              viewMode={viewMode}
              isEndorsed={endorsedMap[guide.id] || false}
              onEndorse={handleEndorseGuide}
              onInquiry={setInquiryGuide}
            />
          ))}
        </div>
      )}

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
            <div className="modal-header-sticky">
              <div className="modal-header-title-wrap">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={20} color="var(--primary)" />
                  <span>{language === 'km' ? 'ផ្ញើសារទៅកាន់' : 'Send Message to'} {language === 'km' ? inquiryGuide.nameKm : inquiryGuide.nameEn}</span>
                </h3>
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

    </div>
  );
};
