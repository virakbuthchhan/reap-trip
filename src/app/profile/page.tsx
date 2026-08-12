'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { initialDestinations, initialTripReports, initialRecipes } from '@/data/mockData';
import { InputField } from '@/components/ui/InputField';
import { TextAreaField } from '@/components/ui/TextAreaField';
import Link from 'next/link';
import {
  User, ShieldCheck, MapPin, Phone, Send, Calendar, Star, Compass,
  Utensils, MessageSquare, Bookmark, CheckSquare, Edit3, LogOut, Sparkles,
  Users, Flame, ArrowRight, Heart, UserPlus
} from 'lucide-react';
import { UserRole } from '@/types';

export default function ProfilePage() {
  const { user, logout, updateProfile, openAuthModal, switchDemoUser } = useAuth();
  const { language, t } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'experiences' | 'recipes' | 'settings'>('overview');

  // Edit profile state
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editTelegram, setEditTelegram] = useState(user?.telegram || '');
  const [editProvince, setEditProvince] = useState(user?.province || 'Phnom Penh');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editRole, setEditRole] = useState<UserRole>(user?.role || 'traveller');

  if (!user) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <User size={64} color="var(--primary)" style={{ marginBottom: '1.5rem', opacity: 0.8 }} />
        <h2>{language === 'km' ? 'សូមចូលប្រព័ន្ធដើម្បីមើលព័ត៌មានរូបរាងរបស់អ្នក' : 'Please Sign In to Access Your Personal Dashboard'}</h2>
        <p className="text-muted mb-4" style={{ maxWidth: '500px' }}>
          {language === 'km'
            ? 'រក្សាទុកទីតាំងបោះជំរុំ មើលការចំណាយក្រុម គ្រប់គ្រងសេវានាំផ្លូវ និងរៀបចំបញ្ជីសម្ភារៈរបស់អ្នក។'
            : 'Save campsites, track group expense splitters, manage lead inquiries, and organize your trip packing lists.'}
        </p>
        <button className="btn btn-primary" onClick={openAuthModal}>
          <Sparkles size={18} />
          <span>{language === 'km' ? 'ចូលប្រព័ន្ធ / បង្កើតគណនី' : 'Sign In / Register Account'}</span>
        </button>
      </div>
    );
  }

  const savedDestinations = initialDestinations.filter((d) => user.savedDestinationIds?.includes(d.id));
  const userReports = initialTripReports.filter((r) => r.authorName.includes(user.name.split(' ')[0]));
  const userRecipes = initialRecipes.filter((rc) => rc.authorName?.includes(user.name.split(' ')[0]));

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'traveller': return language === 'km' ? '🎒 អ្នកដើរព្រៃ/អ្នកទេសចរ' : '🎒 Traveller / Hiker';
      case 'tour_leader': return language === 'km' ? '🚩 ប្រធានក្រុម/អ្នករៀបចំ' : '🚩 Tour Expedition Leader';
      case 'local_guide': return language === 'km' ? '🏕️ អ្នកនាំផ្លូវសហគមន៍' : '🏕️ Local Guide & Ranger';
      case 'homestay_provider': return language === 'km' ? '🏡 អ្នកផ្ទះសំណាក់/មធ្យោបាយ' : '🏡 Homestay & Transport Host';
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      phone: editPhone,
      telegram: editTelegram,
      province: editProvince,
      bio: editBio,
      role: editRole
    });
    showToast(language === 'km' ? 'បានធ្វើបច្ចុប្បន្នភាពព័ត៌មានរួចរាល់!' : 'Profile updated successfully!', 'success');
  };

  return (
    <div className="profile-page-wrapper container py-4">
      {/* Profile Header Hero Card */}
      <div className="profile-hero-card glass-card">
        <div className="profile-hero-top">
          <div className="profile-avatar-box">
            <img src={user.avatar} alt={user.name} className="profile-avatar-img" />
            {user.verified && (
              <span className="profile-verified-badge" title="Verified Member">
                <ShieldCheck size={16} />
              </span>
            )}
          </div>

          <div className="profile-main-info">
            <div className="profile-name-row">
              <h2>{user.name}</h2>
              <span className="badge badge-emerald role-badge">{getRoleLabel(user.role)}</span>
            </div>

            <div className="profile-meta-row">
              <span className="profile-meta-chip"><MapPin size={15} color="var(--primary)" /> {user.province || 'Cambodia'}</span>
              <span className="profile-meta-chip"><Calendar size={15} color="var(--primary)" /> Joined {user.joinedDate}</span>
              {user.phone && <span className="profile-meta-chip"><Phone size={15} color="var(--primary)" /> {user.phone}</span>}
              {user.telegram && <span className="profile-meta-chip"><Send size={15} color="var(--primary)" /> {user.telegram}</span>}
            </div>

            {user.bio && <p className="profile-bio">{user.bio}</p>}
          </div>

          <div className="profile-hero-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('settings')}>
              <Edit3 size={15} />
              <span>{language === 'km' ? 'កែប្រែព័ត៌មាន' : 'Edit Profile'}</span>
            </button>
            <button className="btn btn-outline btn-sm logout-btn" onClick={logout}>
              <LogOut size={15} />
              <span>{language === 'km' ? 'ចាកចេញ' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stat Bar */}
        <div className="profile-stat-bar">
          <div className="profile-stat-item">
            <strong>{user.stats?.tripsCompleted || user.stats?.expeditionsLed || user.stats?.toursGuided || 8}</strong>
            <span>{language === 'km' ? 'ដំណើរកម្សាន្ត' : 'Trips & Expeditions'}</span>
          </div>
          <div className="profile-stat-item">
            <strong>{savedDestinations.length}</strong>
            <span>{language === 'km' ? 'ទីតាំងបានរក្សាទុក' : 'Saved Campsites'}</span>
          </div>
          <div className="profile-stat-item">
            <strong>{userReports.length}</strong>
            <span>{language === 'km' ? 'បទពិសោធន៍បានចែករំលែក' : 'Trip Reports'}</span>
          </div>
          <div className="profile-stat-item">
            <strong>{user.stats?.rating || 4.9} ★</strong>
            <span>{language === 'km' ? 'ពិន្ទុការវាយតម្លៃ' : 'Community Rating'}</span>
          </div>
        </div>
      </div>

      {/* Role Persona Specific Highlight Banner */}
      {user.role === 'local_guide' && (
        <div className="role-banner guide-banner glass-card mt-3">
          <div className="role-banner-content">
            <div className="role-banner-icon">🏕️</div>
            <div>
              <h4>{language === 'km' ? 'ផ្ទាំងគ្រប់គ្រងមគ្គុទ្ទេសក៍សហគមន៍ (Local Guide Dashboard)' : 'Local Community Guide Dashboard'}</h4>
              <p>{language === 'km' ? 'អ្នកទទួលបានសំណើសាកសួរផ្លូវ និងការកក់សេវាកម្មដោយផ្ទាល់ពីអ្នកដើរព្រៃ។' : 'You are visible in the Local Guide Directory. Adventurers can contact you directly for trail leading & homestays.'}</p>
            </div>
          </div>
          <Link href="/guides" className="btn btn-primary btn-sm">
            <span>{language === 'km' ? 'មើលបញ្ជីអ្នកនាំផ្លូវ' : 'Manage Guide Directory'}</span>
          </Link>
        </div>
      )}

      {user.role === 'tour_leader' && (
        <div className="role-banner leader-banner glass-card mt-3">
          <div className="role-banner-content">
            <div className="role-banner-icon">🚩</div>
            <div>
              <h4>{language === 'km' ? 'ផ្ទាំងប្រធានក្រុមដំណើរកម្សាន្ត (Expedition Leader Hub)' : 'Tour Expedition Leader Hub'}</h4>
              <p>{language === 'km' ? 'រៀបចំដំណើរកម្សាន្តជាក្រុម គណនាចែករំលែកការចំណាយ និងរៀបចំសម្ភារៈ។' : 'Organize group expeditions, manage team members, and split trip expenses seamlessly.'}</p>
            </div>
          </div>
          <Link href="/expenses" className="btn btn-primary btn-sm">
            <span>{language === 'km' ? 'ទៅកាន់ការចែករំលែកការចំណាយ' : 'Open Expense Splitter'}</span>
          </Link>
        </div>
      )}

      {/* Dashboard Main Content Tabs */}
      <div className="profile-tabs-bar mt-4">
        <button
          className={`profile-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Compass size={16} />
          <span>{language === 'km' ? 'ទិដ្ឋភាពទូទៅ' : 'Overview'}</span>
        </button>

        <button
          className={`profile-tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          <Bookmark size={16} />
          <span>{language === 'km' ? `ទីតាំងរក្សាទុក (${savedDestinations.length})` : `Saved Spots (${savedDestinations.length})`}</span>
        </button>

        <button
          className={`profile-tab ${activeTab === 'experiences' ? 'active' : ''}`}
          onClick={() => setActiveTab('experiences')}
        >
          <MessageSquare size={16} />
          <span>{language === 'km' ? `បទពិសោធន៍របស់ខ្ញុំ (${userReports.length})` : `My Reports (${userReports.length})`}</span>
        </button>

        <button
          className={`profile-tab ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          <Utensils size={16} />
          <span>{language === 'km' ? `មុខម្ហូបរបស់ខ្ញុំ (${userRecipes.length})` : `My Recipes (${userRecipes.length})`}</span>
        </button>

        <button
          className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <Edit3 size={16} />
          <span>{language === 'km' ? 'ការកំណត់គណនី' : 'Settings'}</span>
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="profile-tab-content mt-3">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="overview-grid">
            <div className="overview-card glass-card">
              <h3>{language === 'km' ? 'ទីតាំងបោះជំរុំបានរក្សាទុកថ្មីៗ' : 'Recently Saved Campsites'}</h3>
              {savedDestinations.length > 0 ? (
                <div className="mini-dest-list">
                  {savedDestinations.slice(0, 3).map((d) => (
                    <Link key={d.id} href={`/destinations/${d.id}`} className="mini-dest-item">
                      <img src={d.coverImage} alt={d.nameEn} className="mini-dest-img" />
                      <div className="mini-dest-info">
                        <strong>{language === 'km' ? d.nameKm : d.nameEn}</strong>
                        <span>📍 {language === 'km' ? d.provinceKm : d.provinceEn} • {d.distanceFromPhnomPenhKm} km</span>
                      </div>
                      <ArrowRight size={16} color="var(--primary)" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="empty-overview-box">
                  <Bookmark size={32} color="var(--primary)" style={{ opacity: 0.8 }} />
                  <p>{language === 'km' ? 'មិនទាន់មានទីតាំងបានរក្សាទុកនៅឡើយទេ។ ចូលមើលទីតាំងបោះជំរុំ ហើយចុចរក្សាទុក!' : 'No saved campsites yet. Explore wild destinations and click bookmark!'}</p>
                  <Link href="/destinations" className="btn btn-outline btn-sm">
                    <Compass size={15} />
                    <span>{language === 'km' ? 'ស្វែងរកទីតាំង' : 'Explore Campsites'}</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="overview-card glass-card">
              <h3>{language === 'km' ? 'ឧបករណ៍ និងសេវាកម្មរហ័ស' : 'Quick Outdoor Tools'}</h3>
              <div className="quick-tools-grid">
                <Link href="/checklist" className="quick-tool-btn">
                  <CheckSquare size={20} color="var(--primary)" />
                  <span>{language === 'km' ? 'បញ្ជីសម្ភារៈ' : 'Packing List'}</span>
                </Link>
                <Link href="/expenses" className="quick-tool-btn">
                  <Users size={20} color="var(--primary)" />
                  <span>{language === 'km' ? 'គណនាចែកលុយ' : 'Expense Splitter'}</span>
                </Link>
                <Link href="/meals" className="quick-tool-btn">
                  <Utensils size={20} color="var(--primary)" />
                  <span>{language === 'km' ? 'រៀបចំម្ហូបផ្សារ' : 'Camp Meals'}</span>
                </Link>
                <Link href="/guides" className="quick-tool-btn">
                  <Compass size={20} color="var(--primary)" />
                  <span>{language === 'km' ? 'អ្នកនាំផ្លូវសហគមន៍' : 'Local Guides'}</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Saved Spots */}
        {activeTab === 'saved' && (
          <div className="saved-spots-grid">
            {savedDestinations.length > 0 ? (
              savedDestinations.map((dest) => (
                <div key={dest.id} className="dest-card glass-card">
                  <div className="dest-card-image-wrap">
                    <img src={dest.coverImage} alt={dest.nameEn} />
                    <span className="dest-cat-badge badge badge-emerald">{dest.category}</span>
                  </div>
                  <div className="dest-card-content">
                    <h3>{language === 'km' ? dest.nameKm : dest.nameEn}</h3>
                    <p className="text-muted">📍 {language === 'km' ? dest.provinceKm : dest.provinceEn}</p>
                    <Link href={`/destinations/${dest.id}`} className="btn btn-outline btn-sm btn-full mt-2">
                      <span>{language === 'km' ? 'មើលព័ត៌មានលម្អិត' : 'View Camping Details'}</span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card text-center py-5" style={{ gridColumn: '1 / -1' }}>
                <Bookmark size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h4>{language === 'km' ? 'មិនទាន់មានទីតាំងបានរក្សាទុក' : 'No Saved Campsites Yet'}</h4>
                <p className="text-muted mb-3">{language === 'km' ? 'ចូលទៅកាន់ទំព័រទីតាំង ដើម្បីរក្សាទុកកន្លែងបោះជំរុំដែលអ្នកពេញចិត្ត។' : 'Browse our destinations directory and click bookmark on spots you wish to visit.'}</p>
                <Link href="/destinations" className="btn btn-primary">
                  <Compass size={16} />
                  <span>{t.navDestinations}</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: My Experiences */}
        {activeTab === 'experiences' && (
          <div className="user-experiences-list">
            {userReports.length > 0 ? (
              userReports.map((report) => (
                <div key={report.id} className="report-card glass-card mb-3">
                  <h4>{language === 'km' ? report.titleKm : report.titleEn}</h4>
                  <p className="text-muted">{language === 'km' ? report.contentKm : report.contentEn}</p>
                  <div className="report-meta mt-2">
                    <span>📅 {report.travelDate}</span>
                    <span>💵 ${report.costPerPersonUSD}/person</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card text-center py-5">
                <MessageSquare size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h4>{language === 'km' ? 'មិនទាន់មានបទពិសោធន៍បានចែករំលែក' : 'No Shared Trip Reports Yet'}</h4>
                <p className="text-muted mb-3">{language === 'km' ? 'ចែករំលែកបទពិសោធន៍ដើរព្រៃរបស់អ្នក ដើម្បីជួយដល់អ្នកដើរព្រៃជំនាន់ក្រោយ។' : 'Share your trail experiences and advice for fellow Cambodian adventurers.'}</p>
                <Link href="/experiences" className="btn btn-primary">
                  <Sparkles size={16} />
                  <span>{t.btnShareExperience}</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: My Recipes */}
        {activeTab === 'recipes' && (
          <div className="user-recipes-grid">
            {userRecipes.length > 0 ? (
              userRecipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card glass-card">
                  <img src={recipe.image} alt={recipe.titleEn} className="recipe-img" />
                  <div className="recipe-content">
                    <h4>{language === 'km' ? recipe.titleKm : recipe.titleEn}</h4>
                    <p className="text-muted">{language === 'km' ? recipe.descriptionKm : recipe.descriptionEn}</p>
                    <Link href={`/meals/${recipe.id}`} className="btn btn-outline btn-sm btn-full mt-2">
                      <span>{language === 'km' ? 'មើលរបៀបធ្វើ' : 'View Recipe'}</span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card text-center py-5" style={{ gridColumn: '1 / -1' }}>
                <Utensils size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                <h4>{language === 'km' ? 'មិនទាន់មានមុខម្ហូបបានចែករំលែក' : 'No Created Recipes Yet'}</h4>
                <p className="text-muted mb-3">{language === 'km' ? 'ចែករំលែករូបមន្តធ្វើម្ហូបបោះជំរុំដ៏ឈ្ងុយឆ្ងាញ់របស់អ្នក។' : 'Share your favorite camp recipes and market ingredient buying guides.'}</p>
                <Link href="/meals" className="btn btn-primary">
                  <Utensils size={16} />
                  <span>{t.navMeals}</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Settings & Profile Edit */}
        {activeTab === 'settings' && (
          <div className="profile-settings-card glass-card">
            <h3>{language === 'km' ? 'កែប្រែព័ត៌មានរូបរាងគណនី' : 'Edit Profile & Contact Details'}</h3>
            <form onSubmit={handleSaveProfile} className="mt-3">
              <div className="form-grid-2">
                <InputField
                  label={language === 'km' ? 'ឈ្មោះបង្ហាញ' : 'Display Name'}
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
                <InputField
                  label={language === 'km' ? 'លេខទូរស័ព្ទ' : 'Phone Number'}
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </div>

              <div className="form-grid-2">
                <InputField
                  label={language === 'km' ? 'គណនី Telegram' : 'Telegram Handle'}
                  type="text"
                  value={editTelegram}
                  onChange={(e) => setEditTelegram(e.target.value)}
                />
                <InputField
                  label={language === 'km' ? 'រាជធានី / ខេត្ត' : 'Province / Location'}
                  type="text"
                  value={editProvince}
                  onChange={(e) => setEditProvince(e.target.value)}
                />
              </div>

              <TextAreaField
                label={language === 'km' ? 'ជីវប្រវត្តិសង្ខេប (Bio)' : 'Bio / Experience Description'}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
              />

              <div className="form-field-group">
                <label className="form-field-label">
                  {language === 'km' ? 'ប្រភេទគណនី (Persona Role)' : 'Account Persona Role'}
                </label>
                <select
                  className="custom-modern-select"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                >
                  <option value="traveller">🎒 Traveller / Hiker (អ្នកដើរព្រៃ/អ្នកទេសចរ)</option>
                  <option value="tour_leader">🚩 Tour Expedition Leader (ប្រធានក្រុម)</option>
                  <option value="local_guide">🏕️ Local Guide & Ranger (អ្នកនាំផ្លូវសហគមន៍)</option>
                  <option value="homestay_provider">🏡 Homestay & Transport Host (អ្នកផ្ទះសំណាក់)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary mt-2">
                <Sparkles size={16} />
                <span>{language === 'km' ? 'រក្សាទុកការប្រែប្រួល' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
