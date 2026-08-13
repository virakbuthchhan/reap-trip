'use client';

import React, { useState, useRef } from 'react';
import { Destination, TransportType, TripReport } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { InputField } from './ui/InputField';
import { TextAreaField } from './ui/TextAreaField';
import { SelectField, SelectOption } from './ui/SelectField';
import { MediaUpload } from './ui/MediaUpload';
import { X, Send, User, Compass, DollarSign, UploadCloud, Image as ImageIcon, Camera, Lightbulb, Trash2, Plus, Maximize2, Minimize2 } from 'lucide-react';

interface AddExperienceModalProps {
  destinations: Destination[];
  preselectedDestId?: string;
  onClose: () => void;
  onSubmitReport: (newReport: TripReport) => void;
}

export const AddExperienceModal: React.FC<AddExperienceModalProps> = ({
  destinations,
  preselectedDestId,
  onClose,
  onSubmitReport
}) => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  const [destId, setDestId] = useState<string>(preselectedDestId || destinations[0]?.id || '');
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [transportUsed, setTransportUsed] = useState<TransportType>('motorbike');
  const [costPerPerson, setCostPerPerson] = useState('');
  const [difficultyRating, setDifficultyRating] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [tipsForNewbies, setTipsForNewbies] = useState('');
  
  // Attachments State (up to 5 images/videos)
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
  ]);

  const destOptions: SelectOption[] = destinations.map((d) => ({
    value: d.id,
    label: `${language === 'km' ? d.nameKm : d.nameEn} (${language === 'km' ? d.provinceKm : d.provinceEn})`,
    icon: '📍'
  }));

  const transportOptions: SelectOption[] = [
    { value: 'motorbike', label: t.motorbike, icon: '🛵' },
    { value: 'sedan_car', label: t.sedan_car, icon: '🚗' },
    { value: 'suv_4x4', label: t.suv_4x4, icon: '🛻' },
    { value: 'foot', label: t.foot, icon: '🥾' },
    { value: 'boat', label: t.boat, icon: '🚤' }
  ];

  const difficultyOptions: SelectOption[] = [
    { value: '1', label: '1/5 - Easy / Beginner', icon: '⭐' },
    { value: '2', label: '2/5 - Moderate', icon: '⭐⭐' },
    { value: '3', label: '3/5 - Challenging', icon: '⭐⭐⭐' },
    { value: '4', label: '4/5 - Tough Mountain Trek', icon: '⭐⭐⭐⭐' },
    { value: '5', label: '5/5 - Extreme Endurance', icon: '⭐⭐⭐⭐⭐' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReport: TripReport = {
      id: `report_${Date.now()}`,
      destinationId: destId,
      authorName: authorName.trim() || 'Hiker ' + Math.floor(Math.random() * 900 + 100),
      authorAvatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 500)}?auto=format&fit=crop&w=150&q=80`,
      authorRole: 'Community Contributor • 1 Trip Shared',
      travelDate: new Date().toISOString().split('T')[0],
      titleEn: title,
      titleKm: title,
      contentEn: content,
      contentKm: content,
      transportUsed: transportUsed,
      costPerPersonUSD: parseFloat(costPerPerson) || 25,
      difficultyRating: difficultyRating,
      roadConditionUpdate: 'Trail condition recorded.',
      tipsForNewbiesEn: tipsForNewbies || 'Bring enough water and pack your trash out.',
      tipsForNewbiesKm: tipsForNewbies || 'សូមយកទឹកស្អាតគ្រប់គ្រាន់ និងប្រមូលសំរាមត្រឡប់មកវិញ។',
      photos: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'],
      helpfulCount: 1,
      comments: []
    };

    onSubmitReport(newReport);
    onClose();
  };

  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content experience-modal-box ${isMaximized ? 'is-maximized' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Sticky Fixed Header */}
        <div className="modal-header-sticky">
          <div className="modal-header-title-wrap">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={20} color="var(--primary)" />
              <span>{language === 'km' ? 'ចែករំលែកបទពិសោធន៍ដើរព្រៃ' : 'Share Your Trip Experience'}</span>
            </h3>
            <p className="text-muted">
              {language === 'km' ? 'ជួយអ្នកដើរព្រៃជំនាន់ក្រោយ ដោយចែករំលែកបច្ចុប្បន្នភាពផ្លូវ និងអនុសាសន៍ល្អៗ។' : 'Help newbies with real route updates, costs, and practical tips!'}
            </p>
          </div>

          <div className="modal-header-actions">
            <button
              type="button"
              className="modal-icon-btn"
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? 'Minimize' : 'Expand Fullscreen'}
            >
              {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button type="button" className="modal-icon-btn close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modern-form" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          {/* Scrollable Body Content */}
          <div className="modal-body-scrollable">
          <SelectField
            label={language === 'km' ? 'ជ្រើសរើសទីតាំងកម្សាន្ត' : 'Select Destination'}
            icon={<Compass size={17} />}
            value={destId}
            onChange={(val) => setDestId(val)}
            options={destOptions}
            required
          />

          <div className="form-grid-2">
            <InputField
              label={language === 'km' ? 'ឈ្មោះ ឬរៀបរាប់ខ្លួនអ្នក' : 'Your Name'}
              placeholder="e.g. Dara / Kampong Speu Trekker"
              icon={<User size={17} />}
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />

            <SelectField
              label={language === 'km' ? 'មធ្យោបាយធ្វើដំណើរ' : 'Transport Used'}
              value={transportUsed}
              onChange={(val) => setTransportUsed(val as TransportType)}
              options={transportOptions}
            />
          </div>

          <InputField
            label={language === 'km' ? 'ចំណងជើងបទពិសោធន៍' : 'Report Title'}
            placeholder="e.g. Weekend at Khnong Phsar: Clear trail & cold night!"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextAreaField
            label={language === 'km' ? 'ការរៀបរាប់លម្អិតពីដំណើរ' : 'Full Trip Details & Experience'}
            rows={3}
            required
            placeholder="Describe your itinerary, guide experience, campsite atmosphere..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="form-grid-2">
            <InputField
              label={language === 'km' ? 'ចំណាយសរុបម្នាក់ ($)' : 'Cost Per Person ($)'}
              type="number"
              placeholder="35"
              icon={<DollarSign size={17} />}
              value={costPerPerson}
              onChange={(e) => setCostPerPerson(e.target.value)}
            />

            <SelectField
              label={`${t.difficulty} (1-5)`}
              value={difficultyRating}
              onChange={(val) => setDifficultyRating(parseInt(val) as any)}
              options={difficultyOptions}
            />
          </div>

          <TextAreaField
            label={t.newbieTips}
            rows={2}
            placeholder="e.g. Bring extra drinking water, register with guide Sokha first..."
            value={tipsForNewbies}
            onChange={(e) => setTipsForNewbies(e.target.value)}
          />

          <MediaUpload
            label={language === 'km' ? 'រូបភាព និងវីដេអូភ្ជាប់ (អតិបរមា ៥)' : 'Trip Media Attachments (Photos & Videos)'}
            value={photos}
            onChange={(val) => setPhotos(Array.isArray(val) ? val : [val])}
            multiple={true}
            maxFiles={5}
            helperText={language === 'km' ? 'គាំទ្ររូបភាព JPG, PNG, WEBP និងវីដេអូ MP4 (អតិបរមា ៥)' : 'Supports photos JPG, PNG, WEBP and MP4 videos (Up to 5 files)'}
          />
          </div>

          {/* Sticky Fixed Bottom Actions Bar */}
          <div className="modal-actions-sticky">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t.close}
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} />
              <span>{language === 'km' ? 'បោះពុម្ពផ្សាយ' : 'Publish Report'}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .experience-modal-box {
          max-width: 680px;
        }

        .attachment-upload-section {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 1rem;
          margin-top: 0.5rem;
          margin-bottom: 1rem;
        }

        [data-theme="light"] .attachment-upload-section {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .attachment-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .photo-counter-badge {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--primary);
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid var(--border-glow);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
        }

        .photo-counter-badge.full {
          color: var(--accent-amber);
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.4);
        }

        .dropzone-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 2px dashed rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.04);
          border-radius: var(--radius-md);
          padding: 1.25rem 1rem;
          cursor: pointer;
          transition: var(--transition);
          text-align: center;
        }

        [data-theme="light"] .dropzone-box {
          background: rgba(5, 150, 105, 0.04);
          border-color: rgba(5, 150, 105, 0.3);
        }

        .dropzone-box:hover {
          border-color: var(--primary);
          background: rgba(16, 185, 129, 0.08);
          transform: translateY(-1px);
        }

        .dropzone-icon {
          color: var(--primary);
        }

        .dropzone-text strong {
          display: block;
          font-size: 0.9rem;
          color: var(--text-main);
        }

        .dropzone-text span {
          display: block;
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }

        .url-photo-add-row {
          display: flex;
          align-items: flex-end;
          gap: 0.6rem;
        }

        .image-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .preview-tile {
          position: relative;
          height: 85px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-glow);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }

        .preview-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-photo-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0, 0, 0, 0.75);
          border: 1px solid var(--border-light);
          color: #ffffff;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .remove-photo-btn:hover {
          background: var(--accent-red);
          border-color: var(--accent-red);
        }

        .tile-number-badge {
          position: absolute;
          bottom: 4px;
          left: 4px;
          background: rgba(0, 0, 0, 0.7);
          color: var(--primary);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.1rem 0.35rem;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};
