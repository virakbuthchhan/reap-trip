'use client';

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Video, Image as ImageIcon, Smile, MapPin } from 'lucide-react';

export interface PostComposerCardProps {
  onOpenModal: () => void;
  userAvatar?: string;
  placeholderKm?: string;
  placeholderEn?: string;
  className?: string;
}

export const PostComposerCard: React.FC<PostComposerCardProps> = ({
  onOpenModal,
  userAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  placeholderKm = 'តើអ្នកចង់ចែករំលែកបទពិសោធន៍អ្វីខ្លះ?',
  placeholderEn = "What's on your mind? Share your trip experience...",
  className = ''
}) => {
  const { language } = useLanguage();

  return (
    <div className={`fb-composer-card glass-card ${className}`} onClick={onOpenModal}>
      {/* Top Main Row */}
      <div className="fb-composer-main-row">
        <img
          src={userAvatar}
          alt="User Avatar"
          className="fb-composer-avatar"
        />
        <div className="fb-composer-input-pill">
          <span className="fb-composer-placeholder">
            {language === 'km' ? placeholderKm : placeholderEn}
          </span>
          <div className="fb-composer-quick-actions">
            <button type="button" className="fb-action-btn video-btn" title="Upload Video">
              <Video size={18} />
            </button>
            <button type="button" className="fb-action-btn photo-btn" title="Add Photos">
              <ImageIcon size={18} />
            </button>
            <button type="button" className="fb-action-btn feeling-btn" title="Feeling / Activity">
              <Smile size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="fb-composer-divider" />

      {/* Bottom Action Shortcuts */}
      <div className="fb-composer-sub-actions">
        <button
          type="button"
          className="fb-sub-action"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
        >
          <ImageIcon size={18} color="#10b981" />
          <span>{language === 'km' ? 'រូបភាព / វីដេអូ' : 'Photo / Video'}</span>
        </button>
        <button
          type="button"
          className="fb-sub-action"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
        >
          <MapPin size={18} color="#ef4444" />
          <span>{language === 'km' ? 'ទីតាំងកម្សាន្ត' : 'Check-in Spot'}</span>
        </button>
        <button
          type="button"
          className="fb-sub-action"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
        >
          <Smile size={18} color="#f59e0b" />
          <span>{language === 'km' ? 'អនុសាសន៍ល្អៗ' : 'Newbie Tips'}</span>
        </button>
      </div>
    </div>
  );
};
