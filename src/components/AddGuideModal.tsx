'use client';

import React, { useState } from 'react';
import { LocalGuide, Destination } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { InputField } from './ui/InputField';
import { TextAreaField } from './ui/TextAreaField';
import { SelectField } from './ui/SelectField';
import { X, Send, UserPlus, Phone, ShieldCheck, DollarSign, Image as ImageIcon, MapPin, Maximize2, Minimize2 } from 'lucide-react';

interface AddGuideModalProps {
  destinations: Destination[];
  onClose: () => void;
  onSubmitGuide: (newGuide: LocalGuide) => void;
}

export const AddGuideModal: React.FC<AddGuideModalProps> = ({
  destinations,
  onClose,
  onSubmitGuide
}) => {
  const { language, t } = useLanguage();
  useBodyScrollLock(true);
  const [isMaximized, setIsMaximized] = useState(false);

  const [name, setName] = useState('');
  const [village, setVillage] = useState('');
  const [destId, setDestId] = useState(destinations[0]?.id || '');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [price, setPrice] = useState('$25 / day for group up to 5 people');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [languagesText, setLanguagesText] = useState('Khmer, English');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !village.trim()) return;

    const langs = languagesText.split(',').map((l) => l.trim()).filter(Boolean);

    const newGuide: LocalGuide = {
      id: `guide_${Date.now()}`,
      nameEn: name.trim(),
      nameKm: name.trim(),
      communityVillageEn: village.trim(),
      communityVillageKm: village.trim(),
      destinationIds: [destId],
      phone: phone.trim(),
      telegramHandle: telegram.trim() ? (telegram.startsWith('@') ? telegram.trim() : `@${telegram.trim()}`) : '',
      languages: langs.length > 0 ? langs : ['Khmer'],
      priceRangeEn: price.trim(),
      priceRangeKm: price.trim(),
      servicesOffered: ['guiding', 'gear_rent'],
      avatar: avatarUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      reviewCount: 1,
      verified: true,
      bioEn: bio.trim() || 'Local community guide recommended by fellow travellers.',
      bioKm: bio.trim() || 'មគ្គុទ្ទេសក៍សហគមន៍ទទួលបានការណែនាំពីអ្នកដើរព្រៃ។'
    };

    onSubmitGuide(newGuide);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${isMaximized ? 'is-maximized' : ''}`} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        {/* Sticky Fixed Header */}
        <div className="modal-header-sticky">
          <div className="modal-header-title-wrap">
            <h3>👤 {language === 'km' ? 'បន្ថែម/ណែនាំមគ្គុទ្ទេសក៍សហគមន៍' : 'Recommend a Local Guide'}</h3>
            <p className="text-muted">
              {language === 'km' ? 'ជួយសម្រួលដល់អ្នកបោះជំរុំដោយចែករំលែកទំនាក់ទំនងមគ្គុទ្ទេសក៍ក្នុងតំបន់' : 'Help campers connect with verified local village guides and rangers!'}
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
            <InputField
              label={language === 'km' ? 'ឈ្មោះមគ្គុទ្ទេសក៍' : 'Guide Full Name'}
              placeholder="e.g. Uncle Sokha / Mr. Vanna"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="form-grid-2">
              <InputField
                label={language === 'km' ? 'ឈ្មោះភូមិ / សហគមន៍' : 'Community / Village'}
                placeholder="e.g. Tang Samraong Eco-Community"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
              />

              <SelectField
                label={language === 'km' ? 'ទីតាំងគោលដៅ' : 'Destination'}
                value={destId}
                onChange={(val) => setDestId(val)}
                options={destinations.map((d) => ({
                  value: d.id,
                  label: language === 'km' ? d.nameKm : d.nameEn,
                  icon: '📍'
                }))}
              />
            </div>

            <div className="form-grid-2">
              <InputField
                label={language === 'km' ? 'លេខទូរស័ព្ទទំនាក់ទំនង' : 'Phone Number'}
                placeholder="e.g. 012 345 678"
                icon={<Phone size={16} />}
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <InputField
                label="Telegram Handle (Optional)"
                placeholder="e.g. @SokhaGuide"
                icon={<Send size={16} />}
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
              />
            </div>

            <div className="form-grid-2">
              <InputField
                label={language === 'km' ? 'តម្លៃប៉ាន់ស្មាន' : 'Guide Service Rate'}
                placeholder="e.g. $20 - $25 / day"
                icon={<DollarSign size={16} />}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <InputField
                label={language === 'km' ? 'ភាសាអាចនិយាយបាន' : 'Languages Spoken'}
                placeholder="Khmer, English"
                value={languagesText}
                onChange={(e) => setLanguagesText(e.target.value)}
              />
            </div>

            <TextAreaField
              label={language === 'km' ? 'ព័ត៌មានពីបទពិសោធន៍ & សេវាកម្ម' : 'Guide Bio & Services'}
              rows={3}
              placeholder="Experienced ranger, offers tent rental, firewood, and waterfall guiding..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <InputField
              label="📷 Avatar Photo URL (Optional)"
              placeholder="https://images.unsplash.com/..."
              icon={<ImageIcon size={16} />}
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>

          {/* Sticky Fixed Bottom Actions Bar */}
          <div className="modal-actions-sticky">
            <button type="button" className="btn btn-secondary" onClick={onClose}>{t.close}</button>
            <button type="submit" className="btn btn-primary">
              <ShieldCheck size={16} /> {language === 'km' ? 'រក្សាទុកមគ្គុទ្ទេសក៍' : 'Register Local Guide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
