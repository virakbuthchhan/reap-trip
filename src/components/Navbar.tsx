'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { Compass, Users, Calculator, Utensils, CheckSquare, MessageSquare, Plus, ShieldAlert, ChevronDown, Menu, X, Tent, User as UserIcon, LogIn, LogOut, Sun, Moon, Laptop, Globe } from 'lucide-react';

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
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, authModalOpen, openAuthModal, closeAuthModal, logout, switchDemoUser } = useAuth();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  return (
    <header className="fb-navbar-wrapper">
      <div className="fb-navbar-container">
        {/* LEFT: Brand Logo & Title */}
        <div className="fb-nav-left">
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
        </div>

        {/* CENTER: Facebook-Style Horizontal Navigation Tabs */}
        <nav className="fb-nav-center desktop-only-flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname === '/' && item.id === 'destinations');
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`fb-tab-item ${isActive ? 'active' : ''}`}
                title={language === 'km' ? `${item.label} - ${item.descriptionKm}` : `${item.label} - ${item.descriptionEn}`}
              >
                <Icon size={20} className="fb-tab-icon" />
                <span className="fb-tab-label">{item.label}</span>
                <span className="fb-tab-tooltip">{item.label}</span>
                {isActive && <div className="fb-tab-indicator" />}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: Quick Action Buttons, Theme, Language & User Profile */}
        <div className="fb-nav-right">
          {/* Share Experience Quick Action Button */}
          {onOpenAddExperience && (
            <button className="btn btn-primary btn-sm desktop-only-btn" onClick={onOpenAddExperience}>
              <Plus size={16} />
              <span>{t.btnShareExperience}</span>
            </button>
          )}

          {/* Admin CMS Button */}
          {onOpenAdminCMS && (
            <button className="btn btn-secondary btn-sm desktop-only-btn" onClick={onOpenAdminCMS} title={t.btnAdminCMS}>
              <ShieldAlert size={15} />
            </button>
          )}

          {/* Theme Switcher Icon Toggle */}
          <button
            type="button"
            className="icon-action-btn"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Language Switcher Mini */}
          <div className="lang-switch-mini" title="Switch Language / ផ្លាស់ប្តូរភាសា">
            <button
              className={`lang-mini-btn ${language === 'km' ? 'active' : ''}`}
              onClick={() => setLanguage('km')}
            >
              ខ្មែរ
            </button>
            <button
              className={`lang-mini-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>

          {/* User Profile & Account Dropdown */}
          <div className="user-profile-dropdown-wrap" ref={dropdownRef}>
            {user ? (
              <button
                type="button"
                className="user-avatar-btn"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                title={user.name}
              >
                <img src={user.avatar} alt={user.name} className="nav-user-avatar" />
                <ChevronDown size={13} className={`chevron-icon ${profileMenuOpen ? 'open' : ''}`} />
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={openAuthModal}>
                <LogIn size={15} />
                <span>{language === 'km' ? 'ចូល' : 'Sign In'}</span>
              </button>
            )}

            {profileMenuOpen && (
              <div className="profile-dropdown-menu">
                {user ? (
                  <>
                    <div className="profile-menu-header">
                      <img src={user.avatar} alt={user.name} className="menu-header-avatar" />
                      <div>
                        <strong>{user.name}</strong>
                        <span className="menu-header-role">{user.role}</span>
                      </div>
                    </div>

                    <div className="menu-divider" />

                    <Link href="/profile" className="profile-menu-item" onClick={() => setProfileMenuOpen(false)}>
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
                        onClick={() => {
                          switchDemoUser(u.id);
                          setProfileMenuOpen(false);
                        }}
                      >
                        <img src={u.avatar} alt={u.name} className="mini-avatar" />
                        <span>{u.name.split(' ')[0]} ({u.role})</span>
                      </button>
                    ))}

                    <div className="menu-divider" />

                    <button
                      type="button"
                      className="profile-menu-item logout-item"
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                    >
                      <LogOut size={16} />
                      <span>{language === 'km' ? 'ចាកចេញ' : 'Sign Out'}</span>
                    </button>
                  </>
                ) : (
                  <div className="profile-menu-header guest-menu-header">
                    <Globe size={20} color="var(--primary)" />
                    <div>
                      <strong>{language === 'km' ? 'ការកំណត់' : 'Preferences'}</strong>
                      <span className="menu-header-role">{language === 'km' ? 'ភ្ញៀវ' : 'Guest'}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Burger Menu Button */}
          <button
            className="burger-menu-btn mobile-only-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer mobile-only-block">
          <div className="mobile-nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (pathname === '/' && item.id === 'destinations');
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {onOpenAddExperience && (
              <button
                className="btn btn-primary btn-sm btn-full mt-2"
                onClick={() => {
                  onOpenAddExperience();
                  setMobileMenuOpen(false);
                }}
              >
                <Plus size={16} />
                <span>{t.btnShareExperience}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />
    </header>
  );
};
