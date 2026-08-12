'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Compass, Heart, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="brand-logo mb-2">
            <div className="brand-icon">🏕️</div>
            <div className="brand-text">
              <h1>{t.brandName}</h1>
              <span>{t.brandSubtitle}</span>
            </div>
          </div>
          <p className="footer-desc">
            {language === 'km'
              ? 'ប្រព័ន្ធព័ត៌មានធ្វើដំណើរ និងបោះជំរុំ សម្រាប់អ្នកស្រឡាញ់ធម្មជាតិនៅកម្ពុជា។ ផ្តល់ព័ត៌មានផ្លូវ ទំនាក់ទំនងសហគមន៍ គណនាចែកលុយ និងរៀបចំម្ហូប។'
              : 'The practical Cambodian nature excursion platform for beginners and hikers. Explore destinations, connect with local guides, split expenses, and plan camp meals.'}
          </p>
        </div>

        <div className="footer-links">
          <h4>{t.navDestinations}</h4>
          <ul>
            <li>ខ្នងផ្សារ (Khnong Phsar)</li>
            <li>គិរីរម្យ (Kirirom National Park)</li>
            <li>ជីផាត់ (Chi Phat Eco-Community)</li>
            <li>ភ្នំឱរ៉ាល់ (Phnom Aural Peak)</li>
            <li>ទឹកជ្រោះតាតៃ (Tatai Waterfall)</li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>{language === 'km' ? 'សហគមន៍' : 'Community'}</h4>
          <ul>
            <li>{t.localGuidesHeader}</li>
            <li>{t.expensesHeader}</li>
            <li>{t.mealsHeader}</li>
            <li>{t.checklistHeader}</li>
            <li>{t.experiencesHeader}</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container flex-between">
          <p>© {new Date().getFullYear()} Reap Trip (ដំណើរកម្សាន្ត). Built with <Heart size={14} color="var(--accent-red)" /> for Cambodia Nature Lovers.</p>
          <span className="badge badge-emerald">🍃 Eco-Friendly & Community First</span>
        </div>
      </div>

      <style>{`
        .site-footer {
          background: #050b07;
          border-top: 1px solid var(--border-light);
          padding: 3rem 0 0 0;
          margin-top: 4rem;
        }
        .footer-container {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }
        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
          }
        }
        .footer-desc {
          color: var(--text-muted);
          font-size: 0.9rem;
          line-height: 1.6;
          max-width: 480px;
        }
        .footer-links h4 {
          font-size: 1rem;
          margin-bottom: 1rem;
          color: var(--primary);
        }
        .footer-links ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-links li {
          color: var(--text-muted);
          font-size: 0.85rem;
        }
        .footer-bottom {
          border-top: 1px solid var(--border-light);
          padding: 1.25rem 0;
          background: rgba(0, 0, 0, 0.4);
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .mb-2 {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </footer>
  );
};
