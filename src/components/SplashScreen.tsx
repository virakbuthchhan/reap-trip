'use client';

import React, { useState, useEffect } from 'react';
import { Tent, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SplashScreen: React.FC = () => {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if splash screen has already been shown in this session
    if (typeof window !== 'undefined') {
      const hasSeen = sessionStorage.getItem('reaptrip_splash_seen');
      if (!hasSeen) {
        setVisible(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          triggerDismiss();
          return 100;
        }
        return prev + 10;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [visible]);

  const triggerDismiss = () => {
    setFadingOut(true);
    setTimeout(() => {
      setVisible(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('reaptrip_splash_seen', 'true');
      }
    }, 500); // 500ms fade duration
  };

  if (!visible) return null;

  const loadingText = language === 'km' 
    ? 'កំពុងរៀបចំទីតាំងបោះជំរុំ និងអ្នកនាំផ្លូវ...' 
    : 'Preparing camping spots & local guides...';

  return (
    <div className={`splash-screen-overlay ${fadingOut ? 'fade-out' : ''}`}>
      {/* Skip Action */}
      <button className="splash-skip-btn" onClick={triggerDismiss}>
        <span>{language === 'km' ? 'រំលង' : 'Skip'}</span>
        <ArrowRight size={14} />
      </button>

      {/* Ambient Radial Lights */}
      <div className="splash-ambient-glow" />
      <div className="splash-ambient-glow secondary" />

      {/* Content Center Box */}
      <div className="splash-content-box">
        {/* Animated Brand Icon */}
        <div className="splash-logo-container">
          <div className="splash-logo-ring" />
          <div className="splash-logo-icon">
            <Tent size={48} color="#059669" />
          </div>
          <div className="splash-sparkle-badge">
            <Sparkles size={16} color="#f59e0b" />
          </div>
        </div>

        {/* Brand Titles */}
        <div className="splash-text-container">
          <h1 className="splash-brand-title">
            Reap Trip
            <span className="splash-brand-subtitle-km">ដំណើរកម្សាន្តកម្ពុជា</span>
          </h1>
          <p className="splash-brand-tagline">
            {language === 'km' 
              ? 'ស្វែងរក ភ្នំ បឹង និងរៀបចំដំណើរកម្សាន្តបោះជំរុំ' 
              : 'Cambodia Camping, Hiking & Outdoor Adventure Planner'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="splash-progress-wrapper">
          <div className="splash-progress-track">
            <div className="splash-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <div className="splash-status-row">
            <span className="splash-status-text">{loadingText}</span>
            <span className="splash-status-percent">{progress}%</span>
          </div>
        </div>
      </div>

    </div>
  );
};
