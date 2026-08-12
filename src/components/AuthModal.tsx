'use client';

import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { InputField } from './ui/InputField';
import { TextAreaField } from './ui/TextAreaField';
import { X, LogIn, UserPlus, ShieldCheck, Compass, Users, Tent, Home, Check, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, switchDemoUser } = useAuth();
  const { language } = useLanguage();
  const { showToast } = useToast();
  useBodyScrollLock(isOpen);

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('traveller');
  const [regPhone, setRegPhone] = useState('');
  const [regTelegram, setRegTelegram] = useState('');
  const [regProvince, setRegProvince] = useState('Phnom Penh');
  const [regBio, setRegBio] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      showToast(language === 'km' ? 'សូមបញ្ចូលអ៊ីមែល!' : 'Please enter your email!', 'error');
      return;
    }
    login(loginEmail);
    showToast(language === 'km' ? 'ចូលប្រព័ន្ធជោគជ័យ!' : 'Signed in successfully!', 'success');
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      showToast(language === 'km' ? 'សូមបំពេញឈ្មោះ និងអ៊ីមែល!' : 'Please enter your name and email!', 'error');
      return;
    }

    register({
      name: regName,
      email: regEmail,
      role: regRole,
      phone: regPhone,
      telegram: regTelegram,
      province: regProvince,
      bio: regBio
    });

    showToast(language === 'km' ? 'បង្កើតគណនីជោគជ័យ!' : 'Account registered successfully!', 'success');
    onClose();
  };

  const rolesList: { role: UserRole; titleEn: string; titleKm: string; descEn: string; descKm: string; icon: any }[] = [
    {
      role: 'traveller',
      titleEn: 'Traveller / Hiker',
      titleKm: 'អ្នកដើរព្រៃ/អ្នកទេសចរ',
      descEn: 'Explore spots, save campsites & plan meals',
      descKm: 'ស្វែងរកទីតាំង បោះជំរុំ និងរៀបចំម្ហូប',
      icon: Compass
    },
    {
      role: 'tour_leader',
      titleEn: 'Tour Expedition Leader',
      titleKm: 'ប្រធានក្រុម/អ្នករៀបចំ',
      descEn: 'Organize group trips & split trip expenses',
      descKm: 'រៀបចំដំណើរកម្សាន្ត និងចែករំលែកការចំណាយ',
      icon: Users
    },
    {
      role: 'local_guide',
      titleEn: 'Local Guide & Ranger',
      titleKm: 'អ្នកនាំផ្លូវសហគមន៍',
      descEn: 'Offer trail guiding & community support',
      descKm: 'ផ្តល់សេវានាំផ្លូវព្រៃ និងព័ត៌មានសហគមន៍',
      icon: Tent
    },
    {
      role: 'homestay_provider',
      titleEn: 'Homestay & Transport Host',
      titleKm: 'អ្នកផ្ទះសំណាក់/មធ្យោបាយ',
      descEn: 'Provide local stays & moto/boat transfers',
      descKm: 'ផ្តល់ផ្ទះសំណាក់សហគមន៍ និងការធ្វើដំណើរ',
      icon: Home
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Sticky Header */}
        <div className="modal-header-sticky">
          <div className="modal-header-title-wrap">
            <h3>
              <Sparkles size={20} color="var(--primary)" />
              <span>{language === 'km' ? 'ចូលប្រព័ន្ធ ឬ ចុះឈ្មោះ' : 'Sign In or Join Reap Trip'}</span>
            </h3>
            <p>{language === 'km' ? 'ជ្រើសរើសគណនី ឬ បង្កើតព័ត៌មានរូបរាងរបស់អ្នក' : 'Select a persona role or register your outdoor profile'}</p>
          </div>
          <div className="modal-header-actions">
            <button type="button" className="modal-icon-btn close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="modal-body-scrollable">
          {/* Quick Demo Account Switcher */}
          <div className="demo-accounts-box">
            <span className="demo-box-label">
              ⚡ {language === 'km' ? 'ចុចចូលប្រព័ន្ធលឿន (គណនីគំរូ):' : 'Instant One-Click Demo Switcher:'}
            </span>
            <div className="demo-user-pills">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  className="demo-user-pill"
                  onClick={() => {
                    switchDemoUser(u.id);
                    showToast(language === 'km' ? `បានប្តូរទៅ: ${u.name}` : `Switched to ${u.name}`, 'info');
                    onClose();
                  }}
                >
                  <img src={u.avatar} alt={u.name} className="demo-avatar" />
                  <div className="demo-pill-text">
                    <strong>{u.name.split(' ')[0]}</strong>
                    <span className="demo-role-tag">{u.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Auth Mode Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              <LogIn size={16} />
              <span>{language === 'km' ? 'ចូលប្រព័ន្ធ (Sign In)' : 'Sign In'}</span>
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              <UserPlus size={16} />
              <span>{language === 'km' ? 'ចុះឈ្មោះបង្កើតគណនី' : 'Register New Profile'}</span>
            </button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="auth-form mt-4">
              <InputField
                label={language === 'km' ? 'អាសយដ្ឋានអ៊ីមែល' : 'Email Address'}
                type="email"
                placeholder="your.email@example.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <div className="form-field-group">
                <label className="form-field-label">
                  {language === 'km' ? 'ពាក្យសម្ងាត់' : 'Password'}
                </label>
                <input
                  type="password"
                  className="custom-modern-input"
                  placeholder="••••••••"
                  defaultValue="demo123"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full mt-3">
                <LogIn size={18} />
                <span>{language === 'km' ? 'ចូលប្រព័ន្ធ' : 'Sign In Now'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="auth-form mt-4">
              {/* Role Persona Picker */}
              <div className="form-field-group">
                <label className="form-field-label">
                  {language === 'km' ? 'ជ្រើសរើសប្រភេទគណនីរបស់អ្នក (Role Persona)' : 'Select Your Outdoor Persona Role'}
                </label>
                <div className="role-cards-grid">
                  {rolesList.map((item) => {
                    const Icon = item.icon;
                    const isSelected = regRole === item.role;
                    return (
                      <div
                        key={item.role}
                        className={`role-select-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setRegRole(item.role)}
                      >
                        <div className="role-card-header">
                          <Icon size={20} className="role-icon" />
                          {isSelected && <Check size={16} className="check-badge" />}
                        </div>
                        <h4>{language === 'km' ? item.titleKm : item.titleEn}</h4>
                        <p>{language === 'km' ? item.descKm : item.descEn}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-grid-2">
                <InputField
                  label={language === 'km' ? 'ឈ្មោះពេញ' : 'Full Name'}
                  type="text"
                  placeholder={language === 'km' ? 'ឧ. សុខា ចាន់' : 'e.g. Sokha Chan'}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
                <InputField
                  label={language === 'km' ? 'អាសយដ្ឋានអ៊ីមែល' : 'Email Address'}
                  type="email"
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid-2">
                <InputField
                  label={language === 'km' ? 'លេខទូរស័ព្ទ' : 'Phone Number'}
                  type="text"
                  placeholder="+855 12 345 678"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />
                <InputField
                  label={language === 'km' ? 'គណនី Telegram' : 'Telegram Handle'}
                  type="text"
                  placeholder="@username"
                  value={regTelegram}
                  onChange={(e) => setRegTelegram(e.target.value)}
                />
              </div>

              <InputField
                label={language === 'km' ? 'រាជធានី / ខេត្តរស់នៅ' : 'Province / City'}
                type="text"
                placeholder="Phnom Penh / Koh Kong / Kampong Speu"
                value={regProvince}
                onChange={(e) => setRegProvince(e.target.value)}
              />

              <TextAreaField
                label={language === 'km' ? 'ជីវប្រវត្តិសង្ខេប (Bio)' : 'Short Bio & Outdoor Experience'}
                placeholder={language === 'km' ? 'រៀបរាប់អំពីបទពិសោធន៍ដើរព្រៃរបស់អ្នក...' : 'Share a few words about your hiking/guiding background...'}
                value={regBio}
                onChange={(e) => setRegBio(e.target.value)}
              />

              <button type="submit" className="btn btn-primary btn-full mt-3">
                <UserPlus size={18} />
                <span>{language === 'km' ? 'បង្កើតគណនីឥឡូវនេះ' : 'Complete Registration'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
