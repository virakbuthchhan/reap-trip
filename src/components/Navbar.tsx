'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { AuthModal } from './AuthModal';
import { Compass, Users, Calculator, Utensils, CheckSquare, MessageSquare, Plus, ShieldAlert, ChevronDown, ChevronUp, Menu, X, Tent, User as UserIcon, LogIn, LogOut, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenAddExperience?: () => void;
  onOpenAdminCMS?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddExperience,
  onOpenAdminCMS
}) => {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, authModalOpen, openAuthModal, closeAuthModal, logout, switchDemoUser } = useAuth();

  // State to toggle Card Menu Bar & Profile Dropdown
  const [menuBarOpen, setMenuBarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'destinations',
      href: '/destinations',
      label: t.navDestinations,
      icon: Compass,
      descriptionEn: 'Explore Spots',
      descriptionKm: 'ស្វែងរក ភ្នំ & បឹង'
    },
    {
      id: 'guides',
      href: '/guides',
      label: t.navGuides,
      icon: Users,
      descriptionEn: 'Local Contacts',
      descriptionKm: 'អ្នកនាំផ្លូវ'
    },
    {
      id: 'expenses',
      href: '/expenses',
      label: t.navExpenses,
      icon: Calculator,
      descriptionEn: 'Split Expenses',
      descriptionKm: 'គណនាចែកលុយ'
    },
    {
      id: 'meals',
      href: '/meals',
      label: t.navMeals,
      icon: Utensils,
      descriptionEn: 'Camp Meal Recipes',
      descriptionKm: 'រៀបចំម្ហូបផ្សារ'
    },
    {
      id: 'checklist',
      href: '/checklist',
      label: t.navChecklist,
      icon: CheckSquare,
      descriptionEn: 'Packing List',
      descriptionKm: 'បញ្ជីសម្ភារៈ'
    },
    {
      id: 'experiences',
      href: '/experiences',
      label: t.navExperiences,
      icon: MessageSquare,
      descriptionEn: 'Trip Reports',
      descriptionKm: 'បទពិសោធន៍'
    }
  ];

  const toggleMenuBar = () => {
    setMenuBarOpen(!menuBarOpen);
  };

  return (
    <header className="sticky-header-wrapper">
      {/* Top Header Row */}
      <div className="top-navbar">
        <div className="container top-navbar-container">
          {/* Brand Logo links to Home Page */}
          <Link
            href="/"
            className="brand-logo interactive-logo-link"
            title={language === 'km' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Home'}
          >
            <div className="brand-icon-wrap">
              <Tent size={22} color="var(--primary)" />
            </div>
            <div className="brand-text">
              <div className="brand-title-row">
                <h1>{t.brandName}</h1>
              </div>
              <span className="brand-sub-text">{t.brandSubtitle}</span>
            </div>
          </Link>

          {/* Right Header Actions */}
          <div className="top-nav-actions">
            {/* User Profile Button / Auth Trigger */}
            {user ? (
              <div className="user-profile-dropdown-wrap">
                <button
                  type="button"
                  className="user-profile-nav-btn"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  title={user.name}
                >
                  <img src={user.avatar} alt={user.name} className="nav-user-avatar" />
                  <div className="nav-user-text">
                    <span className="nav-user-name">{user.name.split(' ')[0]}</span>
                    <span className="nav-user-role-badge">{user.role}</span>
                  </div>
                  <ChevronDown size={12} className={`chevron-icon ${profileMenuOpen ? 'open' : ''}`} />
                </button>

                {profileMenuOpen && (
                  <div className="profile-dropdown-menu" onClick={() => setProfileMenuOpen(false)}>
                    <div className="profile-menu-header">
                      <img src={user.avatar} alt={user.name} className="menu-header-avatar" />
                      <div>
                        <strong>{user.name}</strong>
                        <span className="menu-header-role">{user.role}</span>
                      </div>
                    </div>

                    <div className="menu-divider" />

                    <Link href="/profile" className="profile-menu-item">
                      <UserIcon size={16} />
                      <span>{language === 'km' ? 'ទំព័រគណនី (My Profile)' : 'My Dashboard'}</span>
                    </Link>

                    <div className="menu-divider" />

                    <span className="menu-section-label">⚡ {language === 'km' ? 'ប្តូរគណនីលឿន:' : 'Quick Switch Persona:'}</span>
                    {DEMO_USERS.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        className={`profile-menu-item demo-switch-item ${user.id === u.id ? 'active' : ''}`}
                        onClick={() => switchDemoUser(u.id)}
                      >
                        <img src={u.avatar} alt={u.name} className="mini-avatar" />
                        <span>{u.name.split(' ')[0]} ({u.role})</span>
                      </button>
                    ))}

                    <div className="menu-divider" />

                    <button type="button" className="profile-menu-item logout-item" onClick={logout}>
                      <LogOut size={16} />
                      <span>{language === 'km' ? 'ចាកចេញ' : 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={openAuthModal}>
                <LogIn size={15} />
                <span>{language === 'km' ? 'ចូលប្រព័ន្ធ' : 'Sign In'}</span>
              </button>
            )}

            {/* Theme Switcher Toggle */}
            <ThemeToggle />

            {/* Language Switcher */}
            <div className="lang-switch" title="Toggle Language / ផ្លាស់ប្តូរភាសា">
              <button
                className={`lang-btn ${language === 'km' ? 'active' : ''}`}
                onClick={() => setLanguage('km')}
              >
                ខ្មែរ
              </button>
              <button
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                EN
              </button>
            </div>

            {/* Desktop Quick Action Buttons */}
            {onOpenAddExperience && (
              <button className="btn btn-primary btn-sm desktop-only-btn" onClick={onOpenAddExperience}>
                <Plus size={16} />
                <span>{t.btnShareExperience}</span>
              </button>
            )}

            {onOpenAdminCMS && (
              <button className="btn btn-secondary btn-sm desktop-only-btn" onClick={onOpenAdminCMS} title={t.btnAdminCMS}>
                <ShieldAlert size={15} />
                <span>CMS</span>
              </button>
            )}

            {/* Desktop Menu Toggle Button */}
            <button
              className="desktop-menu-toggle-btn desktop-only-btn"
              onClick={toggleMenuBar}
              title={menuBarOpen ? 'Hide Menu' : 'Show Menu'}
            >
              {menuBarOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* Burger Menu Button on Mobile */}
            <button
              className="burger-menu-btn mobile-only-btn"
              onClick={toggleMenuBar}
              aria-label="Toggle Navigation Menu"
              title="Toggle Menu"
            >
              {menuBarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Toggleable Feature Card Menu Bar */}
      <nav className={`feature-card-menu-bar ${menuBarOpen ? 'open' : 'closed'}`}>
        <div className="container">
          <div className="card-menu-grid">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname === '/' && item.id === 'destinations');
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`menu-card-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
                      setMenuBarOpen(false);
                    }
                  }}
                >
                  <div className="menu-card-icon-wrap">
                    <Icon size={24} className="menu-card-icon" />
                  </div>
                  <div className="menu-card-text">
                    <span className="menu-card-label">{item.label}</span>
                    <span className="menu-card-sub">
                      {language === 'km' ? item.descriptionKm : item.descriptionEn}
                    </span>
                  </div>
                  {isActive && <div className="active-glow-indicator" />}
                </Link>
              );
            })}
          </div>

          {/* Quick Actions inside mobile menu bar */}
          <div className="mobile-menu-actions mobile-only-flex">
            {onOpenAddExperience && (
              <button className="btn btn-primary btn-sm btn-full" onClick={() => { onOpenAddExperience(); setMenuBarOpen(false); }}>
                <Plus size={16} />
                <span>{t.btnShareExperience}</span>
              </button>
            )}
            {onOpenAdminCMS && (
              <button className="btn btn-secondary btn-sm btn-full" onClick={() => { onOpenAdminCMS(); setMenuBarOpen(false); }}>
                <ShieldAlert size={15} />
                <span>{t.btnAdminCMS}</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Authentication Modal */}
      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />

      <style>{`
        .sticky-header-wrapper {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: var(--bg-dark);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .top-navbar {
          position: relative;
          z-index: 100;
          background: var(--bg-glass);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-light);
          padding: 0.75rem 0;
        }

        .top-navbar-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .interactive-logo-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
          color: inherit;
          padding: 0.2rem 0.4rem;
          border-radius: var(--radius-md);
          transition: var(--transition);
        }

        .interactive-logo-link:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .brand-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid var(--border-glow);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 12px rgba(16, 185, 129, 0.25);
        }

        .brand-title-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .brand-text h1 {
          font-size: 1.25rem;
          white-space: nowrap;
          background: linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-sub-text {
          font-size: 0.72rem;
          color: var(--primary);
          font-weight: 600;
          white-space: nowrap;
        }

        .top-nav-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .desktop-only-btn {
          display: inline-flex;
        }

        .desktop-menu-toggle-btn {
          background: var(--primary-light);
          border: 1px solid var(--border-light);
          color: var(--primary);
          padding: 0.4rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .desktop-menu-toggle-btn:hover {
          background: var(--primary-light);
          border-color: var(--primary);
        }

        .burger-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          background: var(--primary-light);
          border: 1px solid var(--border-glow);
          color: var(--text-main);
          padding: 0.5rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition);
        }

        .burger-menu-btn:hover {
          background: var(--primary);
          color: #ffffff;
        }

        .mobile-only-flex {
          display: none;
        }

        @media (max-width: 768px) {
          .desktop-only-btn {
            display: none !important;
          }
          .burger-menu-btn {
            display: flex !important;
          }
          .mobile-only-flex {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.75rem;
            padding-top: 0.75rem;
            border-top: 1px dashed var(--border-light);
          }
          .brand-sub-text {
            display: none;
          }
        }

        .feature-card-menu-bar {
          background: var(--bg-card);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-light);
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, padding 0.3s ease;
        }

        .feature-card-menu-bar.open {
          max-height: 320px;
          opacity: 1;
          padding: 0.65rem 0;
        }

        .feature-card-menu-bar.closed {
          max-height: 0;
          opacity: 0;
          padding: 0;
          border-bottom: none;
        }

        .card-menu-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.5rem;
        }

        @media (max-width: 992px) {
          .card-menu-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.5rem;
          }
          .menu-card-item {
            padding: 0.6rem 0.35rem;
          }
        }

        @media (max-width: 480px) {
          .card-menu-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .menu-card-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: var(--bg-dark);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 0.6rem 0.4rem;
          cursor: pointer;
          transition: var(--transition);
          outline: none;
          user-select: none;
          text-decoration: none;
        }

        .menu-card-item:hover {
          background: var(--bg-card-hover);
          border-color: var(--primary-glow);
        }

        .menu-card-item.active {
          background: var(--primary-light);
          border-color: var(--primary);
          box-shadow: 0 0 16px var(--primary-glow);
        }

        .menu-card-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.3rem;
          transition: var(--transition);
        }

        .menu-card-item.active .menu-card-icon-wrap {
          background: var(--primary);
          box-shadow: 0 0 10px var(--primary-glow);
        }

        .menu-card-icon {
          color: var(--primary);
          transition: var(--transition);
        }

        .menu-card-item.active .menu-card-icon {
          color: #ffffff;
        }

        .menu-card-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .menu-card-label {
          font-family: var(--font-main);
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-muted);
          transition: var(--transition);
          line-height: 1.15;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 110px;
        }

        .menu-card-item.active .menu-card-label {
          color: #ffffff;
        }

        .menu-card-sub {
          font-size: 0.65rem;
          color: var(--text-dim);
          margin-top: 0.1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 110px;
        }

        .menu-card-item.active .menu-card-sub {
          color: #a7f3d0;
        }

        .active-glow-indicator {
          position: absolute;
          bottom: 0;
          left: 20%;
          right: 20%;
          height: 3px;
          background: var(--primary);
          border-radius: 3px 3px 0 0;
          box-shadow: 0 -2px 8px var(--primary);
        }
      `}</style>
    </header>
  );
};
