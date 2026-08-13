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
                  <span className="nav-user-name">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={13} className={`chevron-icon ${profileMenuOpen ? 'open' : ''}`} />
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

    </header>
  );
};
