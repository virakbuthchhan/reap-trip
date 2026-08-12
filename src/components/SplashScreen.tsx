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

      <style>{`
        .splash-screen-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: #09130e;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }

        .splash-screen-overlay.fade-out {
          opacity: 0;
          transform: scale(1.04);
          pointer-events: none;
        }

        .splash-skip-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 10;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.8);
          padding: 0.45rem 0.9rem;
          border-radius: var(--radius-full, 9999px);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all 0.25s ease;
        }

        .splash-skip-btn:hover {
          background: rgba(16, 185, 129, 0.2);
          color: #ffffff;
          border-color: #10b981;
        }

        .splash-ambient-glow {
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0) 70%);
          animation: splashGlowPulse 4s infinite alternate ease-in-out;
          pointer-events: none;
        }

        .splash-ambient-glow.secondary {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0) 70%);
          animation: splashGlowPulse 3s infinite alternate-reverse ease-in-out;
        }

        @keyframes splashGlowPulse {
          0% { transform: scale(0.85) translate(-10px, -10px); opacity: 0.6; }
          100% { transform: scale(1.15) translate(10px, 10px); opacity: 1; }
        }

        .splash-content-box {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem;
          max-width: 440px;
          width: 100%;
        }

        .splash-logo-container {
          position: relative;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .splash-logo-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px dashed rgba(16, 185, 129, 0.4);
          animation: splashSpin 12s linear infinite;
        }

        @keyframes splashSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .splash-logo-icon {
          width: 80px;
          height: 80px;
          border-radius: 24px;
          background: rgba(16, 185, 129, 0.15);
          border: 1.5px solid rgba(16, 185, 129, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.35);
          animation: splashBounce 2s ease-in-out infinite alternate;
        }

        @keyframes splashBounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }

        .splash-sparkle-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.2);
          border: 1px solid rgba(245, 158, 11, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .splash-brand-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin: 0 0 0.4rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          background: linear-gradient(135deg, #ffffff 30%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .splash-brand-subtitle-km {
          font-size: 1.15rem;
          font-weight: 700;
          color: #a7f3d0;
          background: none;
          -webkit-text-fill-color: initial;
        }

        .splash-brand-tagline {
          font-size: 0.88rem;
          color: #94a3b8;
          margin: 0 0 2rem 0;
          line-height: 1.5;
        }

        .splash-progress-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .splash-progress-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .splash-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #059669 0%, #10b981 50%, #34d399 100%);
          border-radius: 9999px;
          transition: width 0.15s ease-out;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
        }

        .splash-status-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.76rem;
          color: #64748b;
        }

        .splash-status-percent {
          font-weight: 700;
          color: #34d399;
        }
      `}</style>
    </div>
  );
};
