'use client';

import React from 'react';
import { LocalGuide } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Star, DollarSign, Globe, Phone, Send, MessageSquare, ThumbsUp } from 'lucide-react';

export interface GuideCardProps {
  guide: LocalGuide;
  viewMode?: 'grid' | 'list';
  isEndorsed?: boolean;
  onEndorse?: (guide: LocalGuide) => void;
  onInquiry?: (guide: LocalGuide) => void;
  className?: string;
}

export const GuideCard: React.FC<GuideCardProps> = ({
  guide,
  viewMode = 'grid',
  isEndorsed = false,
  onEndorse,
  onInquiry,
  className = ''
}) => {
  const { language } = useLanguage();

  const name = language === 'km' ? guide.nameKm : guide.nameEn;
  const village = language === 'km' ? guide.communityVillageKm : guide.communityVillageEn;
  const bio = language === 'km' ? guide.bioKm : guide.bioEn;
  const price = language === 'km' ? guide.priceRangeKm : guide.priceRangeEn;

  return (
    <div
      className={`guide-card rounded-guide-card glass-card ${viewMode === 'list' ? 'clean-list-guide-card' : ''} ${className}`}
    >
      {/* Column 1: Identity */}
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

      {/* Column 2: Bio & Metadata */}
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

      {/* Column 3: Contact & Actions */}
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

          {onInquiry && (
            <button
              type="button"
              className="btn btn-outline btn-sm icon-action-btn"
              onClick={() => onInquiry(guide)}
              title="Send Message"
            >
              <MessageSquare size={15} />
            </button>
          )}

          {onEndorse && (
            <button
              type="button"
              className={`btn btn-sm icon-action-btn ${isEndorsed ? 'btn-secondary' : 'btn-outline'}`}
              onClick={() => onEndorse(guide)}
              title="Verify Guide (+1)"
            >
              <ThumbsUp size={14} color={isEndorsed ? 'var(--primary)' : 'currentColor'} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
