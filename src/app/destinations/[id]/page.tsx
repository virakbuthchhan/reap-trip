'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { initialDestinations, initialGuides, initialTripReports } from '@/data/mockData';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/context/ToastContext';
import { AddExperienceModal } from '@/components/AddExperienceModal';
import {
  ArrowLeft, MapPin, Navigation, Bike, Car, Truck, Footprints, Anchor, ShieldAlert, Compass, Flame,
  Clock, Phone, Send, CheckCircle2, AlertTriangle, Droplets, Fuel, Utensils, MessageSquare, ThumbsUp, Calendar,
  Tent, Mountain, BookOpen, Users, Camera
} from 'lucide-react';
import { Destination, LocalGuide, TripReport } from '@/types';

export default function DestinationDetailPage() {
  const params = useParams();
  const { language, t } = useLanguage();

  const destId = params.id as string;

  const [destinations] = useState<Destination[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reaptrip_destinations');
      return saved ? JSON.parse(saved) : initialDestinations;
    }
    return initialDestinations;
  });

  const [guides] = useState<LocalGuide[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reaptrip_guides');
      return saved ? JSON.parse(saved) : initialGuides;
    }
    return initialGuides;
  });

  const [tripReports, setTripReports] = useState<TripReport[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reaptrip_reports');
      return saved ? JSON.parse(saved) : initialTripReports;
    }
    return initialTripReports;
  });

  const [addModalOpen, setAddModalOpen] = useState(false);

  const destination = destinations.find((d) => d.id === destId) || destinations[0];

  if (!destination) {
    return (
      <div className="container text-center" style={{ padding: '5rem 1rem' }}>
        <h2>Destination Not Found</h2>
        <Link href="/destinations" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          ← Back to Destinations
        </Link>
      </div>
    );
  }

  const name = language === 'km' ? destination.nameKm : destination.nameEn;
  const province = language === 'km' ? destination.provinceKm : destination.provinceEn;
  const description = language === 'km' ? destination.descriptionKm : destination.descriptionEn;
  const routeDesc = language === 'km' ? destination.routeDetails.descriptionKm : destination.routeDetails.descriptionEn;

  // Transport Badges
  const transportBadges = destination.allowedTransport.map((type) => {
    switch (type) {
      case 'motorbike': return { label: t.motorbike, icon: <Bike size={13} />, color: 'badge-emerald' };
      case 'sedan_car': return { label: t.sedan_car, icon: <Car size={13} />, color: 'badge-cyan' };
      case 'suv_4x4': return { label: t.suv_4x4, icon: <Truck size={13} />, color: 'badge-amber' };
      case 'foot': return { label: t.foot, icon: <Footprints size={13} />, color: 'badge-amber' };
      case 'boat': return { label: t.boat, icon: <Anchor size={13} />, color: 'badge-cyan' };
      default: return { label: type, icon: <MapPin size={13} />, color: 'badge-emerald' };
    }
  });

  const destGuides = guides.filter((g) => g.destinationIds.includes(destination.id));
  const destReports = tripReports.filter((r) => r.destinationId === destination.id);

  const { showToast } = useToast();

  const copyGps = () => {
    navigator.clipboard.writeText(destination.routeDetails.gpsPin);
    showToast(language === 'km' ? 'បានចម្លងកូអរដោនេ GPS រួចរាល់!' : 'GPS Coordinates copied to clipboard!', 'success');
  };

  const handleAddTripReport = (newReport: TripReport) => {
    setTripReports([newReport, ...tripReports]);
  };

  return (
    <div className="dest-detail-page container" style={{ padding: '2rem 1.25rem' }}>
      {/* Back Navigation Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/destinations" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={16} />
          <span>{language === 'km' ? 'ត្រឡប់ទៅទីតាំងទាំងអស់' : 'Back to All Destinations'}</span>
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="dest-hero-card glass-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
        <div className="dest-hero-image" style={{ backgroundImage: `url(${destination.coverImage})` }}>
          <div className="dest-hero-overlay">
            <div className="dest-category-badge">
              <span className="badge badge-emerald">{destination.category}</span>
              <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} /> {province}
              </span>
            </div>
            <h1>{name}</h1>
            <p className="dest-subtitle">
              <span>{destination.distanceFromPhnomPenhKm} {t.km} {language === 'km' ? 'ពីរាជធានីភ្នំពេញ' : 'from Phnom Penh'}</span>
              <span>•</span>
              <span>~{destination.estimatedTravelTimeHours} {t.hours} {t.travelTime}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="summary-cards-grid">
        <div className="info-card">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Bike size={16} color="var(--primary)" />
            <span>{language === 'km' ? 'មធ្យោបាយធ្វើដំណើរ' : 'Possible Transport'}</span>
          </h4>
          <div className="badge-row">
            {transportBadges.map((b, idx) => (
              <span key={idx} className={`badge ${b.color}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        </div>

        <div className="info-card">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Tent size={16} color="var(--primary)" />
            <span>{t.campingAllowed}</span>
          </h4>
          <div className="camping-status">
            {destination.campingRules.allowed ? (
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> {t.allowed}
              </span>
            ) : (
              <span className="badge badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={13} /> {t.notAllowed}
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

        <div className="info-card">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Mountain size={16} color="var(--primary)" />
            <span>{t.difficulty} & {t.bestSeason}</span>
          </h4>
          <span className="badge badge-amber">{destination.difficulty.toUpperCase()}</span>
          <p className="small-text" style={{ marginTop: '6px' }}>
            <strong>{language === 'km' ? destination.bestSeason.monthsKm : destination.bestSeason.monthsEn}</strong>
          </p>
        </div>
      </div>

      {/* Route & How to Get There */}
      <div className="glass-card detail-section-card">
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
              <MapPin size={14} /> {language === 'km' ? 'ចម្លង GPS' : 'Copy GPS Pin'}
            </button>
          </div>
          <p>{routeDesc}</p>
          <div className="road-condition-tag">
            <span>{t.roadCondition}: </span>
            <span className="badge badge-cyan">{t[destination.routeDetails.roadCondition] || destination.routeDetails.roadCondition}</span>
          </div>
        </div>
      </div>

      {/* Camping Rules */}
      <div className="glass-card detail-section-card">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={20} color="var(--accent-amber)" />
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

      {/* Services */}
      <div className="glass-card detail-section-card">
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

      {/* Local Guides */}
      <div className="glass-card detail-section-card">
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

      {/* Community Reports */}
      <div className="glass-card detail-section-card">
        <div className="reports-header flex-between" style={{ marginBottom: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={20} color="var(--primary)" />
            <span>{language === 'km' ? 'បទពិសោធន៍ពិតពីអ្នកដើរព្រៃ' : 'Real Trip Reports & Route Updates'}</span>
          </h3>
          <button className="btn btn-primary btn-sm" onClick={() => setAddModalOpen(true)}>
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

                <div className="newbie-tips-box">
                  <strong>💡 {t.newbieTips}:</strong>
                  <p>{language === 'km' ? report.tipsForNewbiesKm : report.tipsForNewbiesEn}</p>
                </div>

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
            <button className="btn btn-outline btn-sm" style={{ marginTop: '8px' }} onClick={() => setAddModalOpen(true)}>
              + {t.btnShareExperience}
            </button>
          </div>
        )}
      </div>

      {addModalOpen && (
        <AddExperienceModal
          destinations={destinations}
          preselectedDestId={destination.id}
          onClose={() => setAddModalOpen(false)}
          onSubmitReport={handleAddTripReport}
        />
      )}

    </div>
  );
}
