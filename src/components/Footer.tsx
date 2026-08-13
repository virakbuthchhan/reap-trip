'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { Tent, Heart, Compass, Users, Calculator, Utensils, CheckSquare, MessageSquare, Send, ShieldCheck, PhoneCall } from 'lucide-react';

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
              <li><Link href="/destinations">ខ្នងផ្សារ (Khnong Phsar)</Link></li>
              <li><Link href="/destinations">គិរីរម្យ (Kirirom Park)</Link></li>
              <li><Link href="/destinations">ជីផាត (Chi Phat Eco)</Link></li>
              <li><Link href="/destinations">ភ្នំឱរ៉ាល់ (Phnom Aural)</Link></li>
              <li><Link href="/destinations">ទឹកជ្រោះតាតៃ (Tatai Waterfall)</Link></li>
            </ul>
          </div>

          {/* Column 3: Trip Tools */}
          <div className="footer-col">
            <h4 className="footer-column-title">
              <CheckSquare size={16} color="var(--primary)" />
              <span>{language === 'km' ? 'ឧបករណ៍រៀបចំ' : 'Trip Tools'}</span>
            </h4>
            <ul className="footer-links-list">
              <li><Link href="/expenses">🧮 {t.expensesHeader}</Link></li>
              <li><Link href="/meals">🍲 {t.mealsHeader}</Link></li>
              <li><Link href="/checklist">📋 {t.checklistHeader}</Link></li>
              <li><Link href="/experiences">💬 {t.experiencesHeader}</Link></li>
              <li><Link href="/guides">👥 {t.localGuidesHeader}</Link></li>
            </ul>
          </div>

          {/* Column 4: Community & Eco Safety */}
          <div className="footer-col">
            <h4 className="footer-column-title">
              <ShieldCheck size={16} color="var(--primary)" />
              <span>{language === 'km' ? 'សុវត្ថិភាព & សហគមន៍' : 'Safety & Community'}</span>
            </h4>
            <ul className="footer-links-list">
              <li><span>🌱 Leave No Trace (រក្សាធម្មជាតិ)</span></li>
              <li><span>📞 ទំនាក់ទំនងអាសន្ន: 097 882 1234</span></li>
              <li><span>🤝 គាំទ្រមគ្គុទ្ទេសក៍មូលដ្ឋាន</span></li>
              <li><span>🇰🇭 បង្កើតឡើងដោយកូនខ្មែរ</span></li>
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
          <div className="footer-eco-badge">
            🌱 ECO-FRIENDLY & COMMUNITY FIRST
          </div>
        </div>
      </div>
    </footer>
  );
};
