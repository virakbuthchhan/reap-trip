'use client';

import React, { useState } from 'react';
import { Destination, LocalGuide } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { InputField } from './ui/InputField';
import { TextAreaField } from './ui/TextAreaField';
import { SelectField } from './ui/SelectField';
import { MediaUpload } from './ui/MediaUpload';
import { X, ShieldAlert, Check, MapPin, Compass, Image, DollarSign, Phone, Send, User } from 'lucide-react';

interface AdminCMSModalProps {
  onClose: () => void;
  onAddDestination: (dest: Destination) => void;
  onAddGuide: (guide: LocalGuide) => void;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  onClose,
  onAddDestination,
  onAddGuide
}) => {
  const { language, t } = useLanguage();
  useBodyScrollLock(true);

  const [activeTab, setActiveTab] = useState<'dest' | 'guide'>('dest');
  const [successMsg, setSuccessMsg] = useState(false);

  // New Destination Form state
  const [nameEn, setNameEn] = useState('');
  const [nameKm, setNameKm] = useState('');
  const [provinceEn, setProvinceEn] = useState('');
  const [provinceKm, setProvinceKm] = useState('');
  const [lat, setLat] = useState('11.5645');
  const [lng, setLng] = useState('104.0321');
  const [distanceKm, setDistanceKm] = useState('150');
  const [coverImage, setCoverImage] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descKm, setDescKm] = useState('');

  // New Guide Form state
  const [gNameEn, setGNameEn] = useState('');
  const [gNameKm, setGNameKm] = useState('');
  const [gVillageEn, setGVillageEn] = useState('');
  const [gVillageKm, setGVillageKm] = useState('');
  const [gPhone, setGPhone] = useState('');
  const [gTelegram, setGTelegram] = useState('');
  const [gPriceEn, setGPriceEn] = useState('$25/day');
  const [gPriceKm, setGPriceKm] = useState('$២៥/ថ្ងៃ');

  const handleAddDestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newD: Destination = {
      id: `dest_${Date.now()}`,
      nameEn: nameEn || 'New Camping Spot',
      nameKm: nameKm || 'ទីតាំងបោះជំរុំថ្មី',
      provinceEn: provinceEn || 'Kampong Speu',
      provinceKm: provinceKm || 'កំពង់ស្ពឺ',
      category: 'mountain',
      coordinates: { lat: parseFloat(lat) || 11.5, lng: parseFloat(lng) || 104.0 },
      distanceFromPhnomPenhKm: parseInt(distanceKm) || 120,
      estimatedTravelTimeHours: 3,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      gallery: [],
      descriptionEn: descEn || 'Newly added local excursion site.',
      descriptionKm: descKm || 'ទីតាំងបោះជំរុំថ្មីដែលបានបន្ថែម។',
      routeDetails: {
        descriptionEn: 'Follow main road to community center, then trek up.',
        descriptionKm: 'ធ្វើដំណើរតាមផ្លូវប្រធានទៅមជ្ឈមណ្ឌលសហគមន៍ រួចដើរឡើង។',
        roadCondition: 'dirt_good',
        gpsPin: `${lat},${lng}`
      },
      allowedTransport: ['motorbike', 'suv_4x4', 'foot'],
      campingRules: {
        allowed: true,
        permitRequired: false,
        feeDescriptionEn: 'Register with community',
        feeDescriptionKm: 'ចុះឈ្មោះជាមួយសហគមន៍',
        rangerRegistrationNeeded: false,
        fireRulesEn: 'No open fire in dry season',
        fireRulesKm: 'ហាមបង្កាត់ភ្លើងនៅរដូវប្រាំង'
      },
      difficulty: 'moderate',
      bestSeason: {
        monthsEn: 'November - February',
        monthsKm: 'វិច្ឆិកា - កុម្ភៈ',
        notesEn: 'Clear weather',
        notesKm: 'អាកាសធាតុល្អ'
      },
      nearbyServices: {
        fuelStationKm: 10,
        foodStalls: true,
        waterSourceAvailable: true,
        toiletAvailable: false,
        cellSignalStrength: 'weak'
      },
      featuredGuideIds: []
    };

    onAddDestination(newD);
    setSuccessMsg(true);
    setTimeout(() => { setSuccessMsg(false); onClose(); }, 1500);
  };

  const handleAddGuideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newG: LocalGuide = {
      id: `guide_${Date.now()}`,
      nameEn: gNameEn || 'Local Guide',
      nameKm: gNameKm || 'អ្នកនាំផ្លូវសហគមន៍',
      communityVillageEn: gVillageEn || 'Local Village',
      communityVillageKm: gVillageKm || 'ភូមិសហគមន៍',
      destinationIds: [],
      phone: gPhone || '012 000 000',
      telegramHandle: gTelegram || '@communityguide',
      languages: ['Khmer'],
      priceRangeEn: gPriceEn,
      priceRangeKm: gPriceKm,
      servicesOffered: ['guiding', 'homestay'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      reviewCount: 1,
      verified: true,
      bioEn: 'Local community guide available for trek leading.',
      bioKm: 'អ្នកនាំផ្លូវសហគមន៍ស្គាល់ផ្លូវច្បាស់។'
    };

    onAddGuide(newG);
    setSuccessMsg(true);
    setTimeout(() => { setSuccessMsg(false); onClose(); }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content cms-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>

        <div className="cms-header">
          <ShieldAlert color="var(--primary)" size={24} />
          <h3>Admin / Community Data CMS</h3>
        </div>

        {/* Tab Switcher */}
        <div className="cms-tabs">
          <button
            className={`btn btn-sm ${activeTab === 'dest' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dest')}
          >
            + Add Destination
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'guide' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('guide')}
          >
            + Add Local Guide Contact
          </button>
        </div>

        {successMsg ? (
          <div className="success-banner">
            <Check size={40} color="var(--primary)" />
            <h4>Successfully Saved to Reap Trip System!</h4>
          </div>
        ) : activeTab === 'dest' ? (
          <form onSubmit={handleAddDestSubmit} className="modern-form">
            <div className="form-grid-2">
              <InputField
                label="Name (English)"
                placeholder="e.g. Phnom Tumpor"
                required
                icon={<Compass size={17} />}
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
              />
              <InputField
                label="Name (Khmer ឈ្មោះទីតាំង)"
                placeholder="ឧទាហរណ៍៖ ភ្នំទំព័រ"
                required
                icon={<Compass size={17} />}
                value={nameKm}
                onChange={(e) => setNameKm(e.target.value)}
              />
            </div>

            <div className="form-grid-2">
              <InputField
                label="Province (English)"
                placeholder="Pursat"
                required
                icon={<MapPin size={17} />}
                value={provinceEn}
                onChange={(e) => setProvinceEn(e.target.value)}
              />
              <InputField
                label="Province (Khmer ខេត្ត)"
                placeholder="ពោធិ៍សាត់"
                required
                icon={<MapPin size={17} />}
                value={provinceKm}
                onChange={(e) => setProvinceKm(e.target.value)}
              />
            </div>

            <div className="form-grid-2">
              <InputField
                label="Latitude, Longitude"
                placeholder="11.5645, 104.0321"
                value={`${lat}, ${lng}`}
                onChange={(e) => {
                  const parts = e.target.value.split(',');
                  setLat(parts[0] || '11.5');
                  setLng(parts[1] || '104.0');
                }}
              />
              <InputField
                label="Distance from Phnom Penh (km)"
                type="number"
                placeholder="150"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
              />
            </div>

            <MediaUpload
              label="Destination Cover Photo / Video"
              value={coverImage}
              onChange={(val) => setCoverImage(typeof val === 'string' ? val : val[0] || '')}
              multiple={false}
              helperText="Upload destination cover photo or video banner"
            />

            <TextAreaField
              label="Description (Khmer / English)"
              rows={3}
              placeholder="Brief summary of destination, landscape, and campsite appeal..."
              value={descKm}
              onChange={(e) => {
                setDescKm(e.target.value);
                setDescEn(e.target.value);
              }}
            />

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                + Save Destination
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAddGuideSubmit} className="modern-form">
            <div className="form-grid-2">
              <InputField
                label="Guide Name (English)"
                placeholder="Uncle Vanna"
                required
                icon={<User size={17} />}
                value={gNameEn}
                onChange={(e) => setGNameEn(e.target.value)}
              />
              <InputField
                label="Guide Name (Khmer ឈ្មោះមគ្គុទ្ទេសក៍)"
                placeholder="ពូ វណ្ណា"
                required
                icon={<User size={17} />}
                value={gNameKm}
                onChange={(e) => setGNameKm(e.target.value)}
              />
            </div>

            <div className="form-grid-2">
              <InputField
                label="Community / Village (English)"
                placeholder="Tang Samraong Village"
                required
                icon={<MapPin size={17} />}
                value={gVillageEn}
                onChange={(e) => setGVillageEn(e.target.value)}
              />
              <InputField
                label="Community / Village (Khmer សហគមន៍)"
                placeholder="សហគមន៍តាំងសំរោង"
                required
                icon={<MapPin size={17} />}
                value={gVillageKm}
                onChange={(e) => setGVillageKm(e.target.value)}
              />
            </div>

            <div className="form-grid-2">
              <InputField
                label="Phone Number"
                placeholder="097 000 1234"
                required
                icon={<Phone size={17} />}
                value={gPhone}
                onChange={(e) => setGPhone(e.target.value)}
              />
              <InputField
                label="Telegram Handle"
                placeholder="@VannaGuide"
                icon={<Send size={17} />}
                value={gTelegram}
                onChange={(e) => setGTelegram(e.target.value)}
              />
            </div>

            <InputField
              label="Price Range ($ / ៛)"
              placeholder="$25/day"
              icon={<DollarSign size={17} />}
              value={gPriceEn}
              onChange={(e) => {
                setGPriceEn(e.target.value);
                setGPriceKm(e.target.value);
              }}
            />

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                + Save Guide Contact
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .cms-modal {
          max-width: 680px;
          padding: 1.75rem;
        }
        .cms-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .cms-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 0.75rem;
        }
        .modern-form {
          display: flex;
          flex-direction: column;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .success-banner {
          text-align: center;
          padding: 2.5rem 1rem;
        }
      `}</style>
    </div>
  );
};
