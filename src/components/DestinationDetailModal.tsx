'use client';

import React from 'react';
import { Destination, LocalGuide, TripReport } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import {
  X, MapPin, Navigation, Bike, Car, ShieldAlert, Compass, Flame, BookOpen, Users, Camera,
  Clock, Award, Phone, Send, CheckCircle2, AlertTriangle, Droplets, Fuel, Utensils, MessageSquare, ThumbsUp, Calendar, Maximize2, Minimize2
} from 'lucide-react';

interface DestinationDetailModalProps {
  destination: Destination;
  guides: LocalGuide[];
  tripReports: TripReport[];
  onClose: () => void;
  onOpenAddExperienceForDest: (destId: string) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  guides,
  tripReports,
  onClose,
  onOpenAddExperienceForDest
}) => {
  const { language, t } = useLanguage();
  useBodyScrollLock(true);
  const [isMaximized, setIsMaximized] = React.useState(false);

  const name = language === 'km' ? destination.nameKm : destination.nameEn;
  const province = language === 'km' ? destination.provinceKm : destination.provinceEn;
  const description = language === 'km' ? destination.descriptionKm : destination.descriptionEn;
  const routeDesc = language === 'km' ? destination.routeDetails.descriptionKm : destination.routeDetails.descriptionEn;

  // Transport Icons
  const transportBadges = destination.allowedTransport.map((type) => {
    switch (type) {
      case 'motorbike': return { label: t.motorbike, icon: '🛵', color: 'badge-emerald' };
      case 'sedan_car': return { label: t.sedan_car, icon: '🚗', color: 'badge-cyan' };
      case 'suv_4x4': return { label: t.suv_4x4, icon: '🛻', color: 'badge-amber' };
      case 'foot': return { label: t.foot, icon: '🥾', color: 'badge-amber' };
      case 'boat': return { label: t.boat, icon: '🚤', color: 'badge-cyan' };
      default: return { label: type, icon: '📌', color: 'badge-emerald' };
    }
  });

  // Filter local guides for this destination
  const destGuides = guides.filter((g) => g.destinationIds.includes(destination.id));

  // Filter trip reports for this destination
  const destReports = tripReports.filter((r) => r.destinationId === destination.id);

  const { showToast } = useToast();

  const copyGps = () => {
    navigator.clipboard.writeText(destination.routeDetails.gpsPin);
    showToast(language === 'km' ? 'បានចម្លងកូអរដោនេ GPS រួចរាល់!' : 'GPS Coordinates copied to clipboard!', 'success');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content destination-modal ${isMaximized ? 'is-maximized' : ''}`} onClick={(e) => e.stopPropagation()}>
        {/* Sticky Fixed Header */}
        <div className="modal-header-sticky">
          <div className="modal-header-title-wrap">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={20} color="var(--primary)" />
              <span>{name}</span>
            </h3>
            <p className="text-muted">📍 {province} • {destination.distanceFromPhnomPenhKm} km from Phnom Penh</p>
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

        {/* Scrollable Body Content */}
        <div className="modal-body-scrollable" style={{ padding: 0 }}>

        {/* Cover Hero Banner */}
        <div className="dest-hero" style={{ backgroundImage: `url(${destination.coverImage})` }}>
          <div className="dest-hero-overlay">
            <div className="dest-category-badge">
              <span className="badge badge-emerald">{destination.category}</span>
              <span className="badge badge-amber">📍 {province}</span>
            </div>
            <h1>{name}</h1>
            <p className="dest-subtitle">
              <span>{destination.distanceFromPhnomPenhKm} {t.km} {language === 'km' ? 'ពីរាជធានីភ្នំពេញ' : 'from Phnom Penh'}</span>
              <span>•</span>
              <span>~{destination.estimatedTravelTimeHours} {t.hours} {t.travelTime}</span>
            </p>
          </div>
        </div>

        <div className="modal-body-padding">
          {/* Practical Summary Cards Grid */}
          <div className="summary-cards-grid">
            {/* Transport Badge Card */}
            <div className="info-card">
              <h4>🛵 {language === 'km' ? 'មធ្យោបាយធ្វើដំណើរ' : 'Possible Transport'}</h4>
              <div className="badge-row">
                {transportBadges.map((b, idx) => (
                  <span key={idx} className={`badge ${b.color}`}>
                    {b.icon} {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Camping Rules Card */}
            <div className="info-card">
              <h4>⛺ {t.campingAllowed}</h4>
              <div className="camping-status">
                {destination.campingRules.allowed ? (
                  <span className="badge badge-emerald">
                    <CheckCircle2 size={14} /> {t.allowed}
                  </span>
                ) : (
                  <span className="badge badge-red">
                    <AlertTriangle size={14} /> {t.notAllowed}
                  </span>
                )}
                {destination.campingRules.permitRequired && (
                  <span className="badge badge-amber">{t.permitRequired}</span>
                )}
              </div>
              <p className="small-text" style={{ marginTop: '6px' }}>
                {language === 'km' ? destination.campingRules.feeDescriptionKm : destination.campingRules.feeDescriptionEn}
              </p>
            </div>

            {/* Difficulty & Season */}
            <div className="info-card">
              <h4>⛰️ {t.difficulty} & {t.bestSeason}</h4>
              <span className="badge badge-amber">{destination.difficulty.toUpperCase()}</span>
              <p className="small-text" style={{ marginTop: '6px' }}>
                <strong>{language === 'km' ? destination.bestSeason.monthsKm : destination.bestSeason.monthsEn}</strong>
              </p>
            </div>
          </div>

          {/* Section 1: Overview & How to Get There */}
          <div className="detail-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={20} color="var(--primary)" />
              <span>{language === 'km' ? 'ព័ត៌មានទូទៅ & របៀបធ្វើដំណើរ' : 'Overview & How to Get There'}</span>
            </h3>
            <p className="description-p">{description}</p>

            <div className="route-box">
              <div className="route-box-header">
                <Navigation size={18} color="var(--primary)" />
                <strong>{language === 'km' ? 'ការពិពណ៌នាផ្លូវធ្វើដំណើរ' : 'Route Description'}</strong>
                <button className="btn btn-outline btn-sm" onClick={copyGps} style={{ marginLeft: 'auto' }}>
                  📍 {language === 'km' ? 'ចម្លង GPS' : 'Copy GPS Pin'}
                </button>
              </div>
              <p>{routeDesc}</p>
              <div className="road-condition-tag">
                <span>{t.roadCondition}: </span>
                <span className="badge badge-cyan">{t[destination.routeDetails.roadCondition] || destination.routeDetails.roadCondition}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Camping Regulations & Fire Safety */}
          <div className="detail-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Flame size={20} color="var(--accent-red)" />
              <span>{language === 'km' ? 'ច្បាប់បោះជំរុំ & សុវត្ថិភាព' : 'Camping Rules & Regulations'}</span>
            </h3>
            <div className="rules-list">
              <div className="rule-item">
                <ShieldAlert size={18} color="var(--accent-amber)" />
                <div>
                  <strong>{t.rangerNotice}</strong>
                  <p>{destination.campingRules.rangerRegistrationNeeded ? (language === 'km' ? 'ត្រូវរាយការណ៍ខ្លួននៅស្នាក់ការមន្ត្រីសហគមន៍/បរិស្ថានមុនឡើង។' : 'Must register with local community rangers before trekking up.') : (language === 'km' ? 'មិនតម្រូវឱ្យចុះឈ្មោះផ្លូវការទេ។' : 'No formal ranger registration needed.')}</p>
                </div>
              </div>
              <div className="rule-item">
                <Flame size={18} color="var(--accent-red)" />
                <div>
                  <strong>{language === 'km' ? 'ច្បាប់បង្កាត់ភ្លើង' : 'Fire Regulations'}</strong>
                  <p>{language === 'km' ? destination.campingRules.fireRulesKm : destination.campingRules.fireRulesEn}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Nearby Services */}
          <div className="detail-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Fuel size={20} color="var(--primary)" />
              <span>{t.nearbyServices}</span>
            </h3>
            <div className="services-grid">
              <div className="service-chip">
                <Fuel size={16} />
                <span>{t.fuelStation}: ~{destination.nearbyServices.fuelStationKm} {t.km}</span>
              </div>
              <div className="service-chip">
                <Utensils size={16} />
                <span>{t.foodStalls}: {destination.nearbyServices.foodStalls ? '✅' : '❌'}</span>
              </div>
              <div className="service-chip">
                <Droplets size={16} />
                <span>{t.waterSource}: {destination.nearbyServices.waterSourceAvailable ? '✅' : '❌'}</span>
              </div>
              <div className="service-chip">
                <Phone size={16} />
                <span>{t.cellSignal}: {destination.nearbyServices.cellSignalStrength}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Local Guides Contacts */}
          <div className="detail-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} color="var(--primary)" />
              <span>{language === 'km' ? 'មគ្គុទ្ទេសក៍សហគមន៍សម្រាប់ទីតាំងនេះ' : 'Local Community Contacts & Guides'}</span>
            </h3>
            {destGuides.length > 0 ? (
              <div className="modal-guides-list">
                {destGuides.map((guide) => (
                  <div key={guide.id} className="guide-card-inline">
                    <img src={guide.avatar} alt={guide.nameEn} className="guide-avatar" />
                    <div className="guide-info">
                      <div className="guide-name">
                        <strong>{language === 'km' ? guide.nameKm : guide.nameEn}</strong>
                        {guide.verified && <span className="badge badge-emerald">✓ Verified</span>}
                      </div>
                      <p className="guide-sub">{language === 'km' ? guide.communityVillageKm : guide.communityVillageEn}</p>
                      <p className="guide-price">💰 {language === 'km' ? guide.priceRangeKm : guide.priceRangeEn}</p>
                    </div>
                    <div className="guide-actions">
                      <a href={`tel:${guide.phone.replace(/\s+/g, '')}`} className="btn btn-primary btn-sm">
                        <Phone size={14} /> {guide.phone}
                      </a>
                      {guide.telegramHandle && (
                        <a href={`https://t.me/${guide.telegramHandle.replace('@', '')}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                          <Send size={14} /> Telegram
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">{language === 'km' ? 'មិនទាន់មានមគ្គុទ្ទេសក៍សហគមន៍ចុះឈ្មោះសម្រាប់ទីតាំងនេះនៅឡើយទេ' : 'No local guides registered for this location yet.'}</p>
            )}
          </div>

          {/* Section 5: Real Traveler Reports & Feedback */}
          <div className="detail-section">
            <div className="reports-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={20} color="var(--primary)" />
                <span>{language === 'km' ? 'បទពិសោធន៍ពិតពីអ្នកដើរព្រៃ' : 'Real Trip Reports & Route Updates'}</span>
              </h3>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onClose();
                  onOpenAddExperienceForDest(destination.id);
                }}
              >
                + {t.btnShareExperience}
              </button>
            </div>

            {destReports.length > 0 ? (
              <div className="modal-reports-list">
                {destReports.map((report) => (
                  <div key={report.id} className="report-card">
                    <div className="report-author-bar">
                      <img src={report.authorAvatar} alt={report.authorName} className="author-avatar" />
                      <div>
                        <strong>{report.authorName}</strong>
                        <span className="author-role">{report.authorRole} • 📅 {report.travelDate}</span>
                      </div>
                      <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>
                        ⭐ {report.difficultyRating}/5 {t.difficulty}
                      </span>
                    </div>

                    <h4>{language === 'km' ? report.titleKm : report.titleEn}</h4>
                    <p className="report-content">{language === 'km' ? report.contentKm : report.contentEn}</p>

                    {/* Newbie Tips Highlight Box */}
                    <div className="newbie-tips-box">
                      <strong>💡 {t.newbieTips}:</strong>
                      <p>{language === 'km' ? report.tipsForNewbiesKm : report.tipsForNewbiesEn}</p>
                    </div>

                    {/* Photo Gallery */}
                    {report.photos.length > 0 && (
                      <div className="report-gallery">
                        {report.photos.map((photo, pIdx) => (
                          <img key={pIdx} src={photo} alt="Trip photo" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-reports-box">
                <p>{language === 'km' ? 'មិនទាន់មានការចែករំលែកបទពិសោធន៍នៅឡើយទេ! ក្លាយជាអ្នកដំបូងដែលចែករំលែក។' : 'No trip reports posted yet! Be the first experienced traveler to share your journey.'}</p>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '8px' }}
                  onClick={() => {
                    onClose();
                    onOpenAddExperienceForDest(destination.id);
                  }}
                >
                  + {t.btnShareExperience}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Fixed Bottom Actions Bar */}
        <div className="modal-actions-sticky">
          <button
            className="btn btn-outline"
            onClick={() => {
              onClose();
              onOpenAddExperienceForDest(destination.id);
            }}
          >
            + {t.btnShareExperience}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
