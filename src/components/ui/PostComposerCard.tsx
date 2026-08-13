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

      <style>{`
        .fb-composer-card {
          padding: 1rem 1.25rem;
          border-radius: var(--radius-lg);
          margin-bottom: 1.5rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--border-light);
          background: var(--bg-card);
          box-shadow: var(--shadow-sm);
        }

        [data-theme="light"] .fb-composer-card {
          background: #ffffff;
          border-color: rgba(15, 23, 42, 0.12);
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
        }

        .fb-composer-card:hover {
          border-color: var(--primary);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.15);
          transform: translateY(-2px);
        }

        .fb-composer-main-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .fb-composer-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary);
          flex-shrink: 0;
        }

        .fb-composer-input-pill {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.04);
          border: 1.5px solid var(--border-light);
          border-radius: 30px;
          padding: 0.6rem 1.1rem;
          min-height: 44px;
          transition: var(--transition);
        }

        [data-theme="light"] .fb-composer-input-pill {
          background: #f1f5f9;
          border-color: rgba(15, 23, 42, 0.15);
        }

        .fb-composer-card:hover .fb-composer-input-pill {
          border-color: var(--primary);
          background: rgba(16, 185, 129, 0.05);
        }

        .fb-composer-placeholder {
          color: var(--text-muted);
          font-size: 0.93rem;
          font-weight: 400;
          user-select: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .fb-composer-quick-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .fb-action-btn {
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.35rem;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .fb-action-btn:hover {
          transform: scale(1.18);
        }

        .fb-action-btn.video-btn {
          color: #ef4444;
        }

        .fb-action-btn.photo-btn {
          color: #10b981;
        }

        .fb-action-btn.feeling-btn {
          color: #f59e0b;
        }

        .fb-composer-divider {
          height: 1px;
          background: var(--border-light);
          margin: 0.85rem 0 0.4rem 0;
        }

        .fb-composer-sub-actions {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding-top: 0.2rem;
        }

        .fb-sub-action {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: transparent;
          border: none;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .fb-sub-action:hover {
          background: rgba(16, 185, 129, 0.1);
          color: var(--text-main);
        }

        @media (max-width: 640px) {
          .fb-composer-card {
            padding: 0.85rem;
          }
          .fb-composer-sub-actions {
            flex-wrap: wrap;
            gap: 0.25rem;
          }
          .fb-sub-action {
            font-size: 0.78rem;
            padding: 0.4rem;
          }
        }
      `}</style>
    </div>
  );
};
