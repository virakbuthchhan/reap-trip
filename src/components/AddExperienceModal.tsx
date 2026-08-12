'use client';

import React, { useState, useRef } from 'react';
import { Destination, TransportType, TripReport } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { InputField } from './ui/InputField';
import { TextAreaField } from './ui/TextAreaField';
import { SelectField, SelectOption } from './ui/SelectField';
import { X, Send, User, Compass, DollarSign, UploadCloud, Image as ImageIcon, Trash2, Plus, Maximize2, Minimize2 } from 'lucide-react';

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
  
  // Attachments State (up to 5 images)
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
  ]);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Handle local file selection for static preview
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    
    // Convert to object URLs for preview
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    
    // Combine up to max 5 photos
    const updated = [...photos, ...newPreviews].slice(0, 5);
    setPhotos(updated);
  };

  // Add photo via URL
  const handleAddUrlPhoto = () => {
    if (!urlInput.trim()) return;
    if (photos.length >= 5) {
      showToast(language === 'km' ? 'អាចបង្ហោះបានអតិបរមា ៥ រូបភាព' : 'Maximum 5 photos allowed', 'warning');
      return;
    }
    setPhotos([...photos, urlInput.trim()].slice(0, 5));
    setUrlInput('');
  };

  // Remove photo
  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

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
            <h3>📸 {language === 'km' ? 'ចែករំលែកបទពិសោធន៍ដើរព្រៃ' : 'Share Your Trip Experience'}</h3>
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
            label={`💡 ${t.newbieTips}`}
            rows={2}
            placeholder="e.g. Bring extra drinking water, register with guide Sokha first..."
            value={tipsForNewbies}
            onChange={(e) => setTipsForNewbies(e.target.value)}
          />

          {/* Static Multi-Image Upload & Preview Section (Up to 5 images) */}
          <div className="form-field-group full-width attachment-upload-section">
            <div className="attachment-header-row">
              <label className="form-field-label">
                📷 {language === 'km' ? 'រូបភាពភ្ជាប់ (អតិបរមា ៥ រូប)' : 'Trip Photos Attachment'}
              </label>
              <span className={`photo-counter-badge ${photos.length >= 5 ? 'full' : ''}`}>
                {photos.length}/5 {language === 'km' ? 'រូប' : 'photos'}
              </span>
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            {/* Drag & Drop Upload Zone */}
            {photos.length < 5 && (
              <div
                className="dropzone-box"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={28} className="dropzone-icon" />
                <div className="dropzone-text">
                  <strong>{language === 'km' ? 'ចុចទីនេះដើម្បីជ្រើសរើសរូបភាព ឬទាញទម្លាក់' : 'Click to select or drag & drop trip photos'}</strong>
                  <span>{language === 'km' ? 'គាំទ្រ JPG, PNG, WEBP (អតិបរមា ៥ រូបភាព)' : 'Supports JPG, PNG, WEBP (Up to 5 images)'}</span>
                </div>
              </div>
            )}

            {/* URL Input Fallback Option */}
            {photos.length < 5 && (
              <div className="url-photo-add-row" style={{ marginTop: '0.75rem' }}>
                <InputField
                  placeholder="Or paste photo image URL..."
                  icon={<ImageIcon size={16} />}
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  fullWidth={true}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddUrlPhoto}
                  disabled={!urlInput.trim()}
                >
                  <Plus size={16} />
                  <span>{language === 'km' ? 'បន្ថែម' : 'Add'}</span>
                </button>
              </div>
            )}

            {/* Image Preview Grid */}
            {photos.length > 0 && (
              <div className="image-preview-grid">
                {photos.map((src, index) => (
                  <div key={index} className="preview-tile">
                    <img src={src} alt={`Attachment ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-photo-btn"
                      onClick={() => handleRemovePhoto(index)}
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                    <span className="tile-number-badge">#{index + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

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
          padding: 2rem !important;
          border-radius: var(--radius-lg);
          background: rgba(14, 24, 18, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-glow);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.15);
        }

        .modal-header-text {
          margin-bottom: 1.5rem;
        }

        .modal-header-text h3 {
          font-size: 1.4rem;
          margin-bottom: 0.35rem;
        }

        .attachment-upload-section {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 1rem;
          margin-top: 0.5rem;
          margin-bottom: 1.5rem;
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
          color: #ffffff;
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

        /* Form Actions Bar with Generous Spacing and Gap */
        .form-actions-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1.25rem;
          margin-top: 2rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-light);
        }

        .btn-modal-action {
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          border-radius: var(--radius-md);
        }

        @media (max-width: 640px) {
          .experience-modal-box {
            padding: 1.25rem !important;
          }
          .form-actions-bar {
            flex-direction: column-reverse;
            gap: 0.75rem;
            margin-top: 1.5rem;
            padding-top: 1rem;
          }
          .btn-modal-action {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
