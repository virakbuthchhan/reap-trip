'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import {
  Tent,
  Heart,
  Compass,
  Users,
  Calculator,
  Utensils,
  CheckSquare,
  MessageSquare,
  Send,
  ShieldCheck,
  PhoneCall,
  FileText,
  Leaf,
  HeartHandshake,
  Flag,
  MapPin,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Main Footer 4-Column Grid */}
        <div className="footer-grid">
          {/* Column 1: Brand & Community Bio */}
          <div className="footer-brand-col">
            <Link href="/" className="brand-logo mb-2">
              <div className="brand-icon-wrap">
                <Tent size={20} color="var(--primary)" />
              </div>
              <div className="brand-text">
                <h1>{t.brandName}</h1>
                <span className="brand-sub-text">{t.brandSubtitle}</span>
              </div>
            </Link>
            <p className="footer-brand-desc">
              {language === 'km'
                ? 'ប្រព័ន្ធព័ត៌មានធ្វើដំណើរ និងបោះជំរុំ សម្រាប់អ្នកស្រឡាញ់ធម្មជាតិនៅកម្ពុជា។ រៀបចំដំណើរកម្សាន្តដោយទំនុកចិត្ត និងនិរន្តរភាព។'
                : 'The practical Cambodian nature excursion platform for outdoor enthusiasts. Plan trips, connect with local guides, split expenses, and share experiences.'}
            </p>
            <div className="footer-social-links">
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="footer-social-btn">
                <Send size={14} />
                <span>Telegram Community</span>
              </a>
            </div>
          </div>

          {/* Column 2: Popular Destinations */}
          <div className="footer-col">
            <h4 className="footer-column-title">
              <Compass size={16} color="var(--primary)" />
              <span>{t.navDestinations}</span>
            </h4>
            <ul className="footer-links-list">
              <li>
                <Link href="/destinations" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={15} color="var(--primary)" />
                  <span>ខ្នងផ្សារ (Khnong Phsar)</span>
                </Link>
              </li>
              <li>
                <Link href="/destinations" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={15} color="var(--primary)" />
                  <span>គិរីរម្យ (Kirirom Park)</span>
                </Link>
              </li>
              <li>
                <Link href="/destinations" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={15} color="var(--primary)" />
                  <span>ជីផាត (Chi Phat Eco)</span>
                </Link>
              </li>
              <li>
                <Link href="/destinations" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={15} color="var(--primary)" />
                  <span>ភ្នំឱរ៉ាល់ (Phnom Aural)</span>
                </Link>
              </li>
              <li>
                <Link href="/destinations" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={15} color="var(--primary)" />
                  <span>ទឹកជ្រោះតាតៃ (Tatai Waterfall)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Trip Tools */}
          <div className="footer-col">
            <h4 className="footer-column-title">
              <CheckSquare size={16} color="var(--primary)" />
              <span>{language === 'km' ? 'ឧបករណ៍រៀបចំ' : 'Trip Tools'}</span>
            </h4>
            <ul className="footer-links-list">
              <li>
                <Link href="/expenses" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calculator size={15} color="var(--primary)" />
                  <span>{t.expensesHeader}</span>
                </Link>
              </li>
              <li>
                <Link href="/meals" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Utensils size={15} color="var(--primary)" />
                  <span>{t.mealsHeader}</span>
                </Link>
              </li>
              <li>
                <Link href="/checklist" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckSquare size={15} color="var(--primary)" />
                  <span>{t.checklistHeader}</span>
                </Link>
              </li>
              <li>
                <Link href="/experiences" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={15} color="var(--primary)" />
                  <span>{t.experiencesHeader}</span>
                </Link>
              </li>
              <li>
                <Link href="/guides" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={15} color="var(--primary)" />
                  <span>{t.localGuidesHeader}</span>
                </Link>
              </li>
              <li>
                <Link href="/api-doc" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={15} color="var(--primary)" />
                  <span>API Documentation (Swagger)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Community & Eco Safety */}
          <div className="footer-col">
            <h4 className="footer-column-title">
              <ShieldCheck size={16} color="var(--primary)" />
              <span>{language === 'km' ? 'សុវត្ថិភាព & សហគមន៍' : 'Safety & Community'}</span>
            </h4>
            <ul className="footer-links-list">
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Leaf size={15} color="#10b981" />
                  <span>Leave No Trace (រក្សាធម្មជាតិ)</span>
                </span>
              </li>
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <PhoneCall size={15} color="#0284c7" />
                  <span>ទំនាក់ទំនងអាសន្ន: 097 882 1234</span>
                </span>
              </li>
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <HeartHandshake size={15} color="#f59e0b" />
                  <span>គាំទ្រមគ្គុទ្ទេសក៍មូលដ្ឋាន</span>
                </span>
              </li>
              <li>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Flag size={15} color="#ef4444" />
                  <span>បង្កើតឡើងដោយកូនខ្មែរ</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Badges Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright-text">
            © {new Date().getFullYear()} Reap Trip (ដំណើរកម្សាន្ត). Built with{' '}
            <Heart size={14} fill="#ef4444" color="#ef4444" style={{ display: 'inline', margin: '0 2px' }} />{' '}
            for Cambodia Nature Lovers.
          </p>
          <div className="footer-eco-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Leaf size={14} color="#10b981" />
            <span>ECO-FRIENDLY & COMMUNITY FIRST</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
