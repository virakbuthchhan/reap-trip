'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { UserProfile } from '../types';
import { useAuthStore } from '@/store/useAuthStore';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user_traveller_1',
    email: 'bopha.chan@reaptrip.com',
    name: 'Bopha Chan (បុប្ផា ចាន់)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    role: 'traveller',
    phone: '+855 12 345 678',
    telegram: '@bopha_hikes',
    province: 'Phnom Penh',
    bio: 'Avid weekend hiker, nature photographer, and camp cooking enthusiast exploring Cambodia wilderness.',
    languages: ['Khmer', 'English'],
    joinedDate: 'Jan 2024',
    verified: true,
    savedDestinationIds: ['khnong-phsar', 'kirirom-national-park', 'tatai-waterfall'],
    createdRecipeIds: ['recipe-beef-plea', 'recipe-somlar-machou-kroeung'],
    createdExperienceIds: ['report-1'],
    stats: {
      tripsCompleted: 14,
      rating: 4.9
    }
  },
  {
    id: 'user_tour_leader_1',
    email: 'dara.veng@reaptrip.com',
    name: 'Dara Veng (ដារ៉ា វ៉េង)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    role: 'tour_leader',
    phone: '+855 98 765 432',
    telegram: '@dara_expeditions',
    province: 'Kampong Speu',
    bio: 'Certified wilderness expedition leader with 6+ years organizing group summits to Phnom Aural & Khnong Phsar.',
    languages: ['Khmer', 'English', 'French'],
    joinedDate: 'Nov 2022',
    verified: true,
    savedDestinationIds: ['phnom-aural', 'chi-phat'],
    createdRecipeIds: ['recipe-noodle-upgrade'],
    createdExperienceIds: [],
    stats: {
      expeditionsLed: 38,
      tripsCompleted: 52,
      rating: 5.0
    }
  },
  {
    id: 'user_local_guide_1',
    email: 'sokha.chem@reaptrip.com',
    name: 'Sokha Chem (សុខា ជឹម)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    role: 'local_guide',
    phone: '+855 77 889 900',
    telegram: '@sokha_khnongphsar',
    province: 'Koh Kong / Kampong Speu',
    bio: 'Native community ranger and local trail guide for Khnong Phsar pine plateau. Born and raised in Tang Bamm village.',
    languages: ['Khmer'],
    joinedDate: 'Mar 2021',
    verified: true,
    savedDestinationIds: ['khnong-phsar'],
    createdRecipeIds: [],
    createdExperienceIds: [],
    stats: {
      toursGuided: 120,
      rating: 4.9,
      reviewCount: 42
    }
  }
];

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (userData: Partial<UserProfile> & { password?: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  toggleSaveDestination: (destId: string) => Promise<void>;
  switchDemoUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, authModalOpen, setUser, openAuthModal, closeAuthModal, toggleSaveDestinationId } = useAuthStore();

  useEffect(() => {
    // Check active session via API
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          // Fallback to local storage demo user if offline/unauthenticated
          const stored = localStorage.getItem('reap-trip-auth-user');
          if (stored) {
            try {
              setUser(JSON.parse(stored));
            } catch (e) {
              setUser(DEMO_USERS[0]);
            }
          } else {
            setUser(DEMO_USERS[0]);
          }
        }
      })
      .catch(() => {
        setUser(DEMO_USERS[0]);
      });
  }, [setUser]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'password123' }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        closeAuthModal();
        return true;
      }
    } catch (e) {
      console.warn('API Login failed, trying demo user fallback');
    }

    const found = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      localStorage.setItem('reap-trip-auth-user', JSON.stringify(found));
      closeAuthModal();
      return true;
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role: 'traveller',
      joinedDate: 'Just Now',
      verified: false,
      savedDestinationIds: [],
      createdRecipeIds: [],
      createdExperienceIds: [],
      stats: { tripsCompleted: 0 },
    };
    setUser(newUser);
    localStorage.setItem('reap-trip-auth-user', JSON.stringify(newUser));
    closeAuthModal();
    return true;
  };

  const register = async (userData: Partial<UserProfile> & { password?: string }): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email || 'adventurer@reaptrip.com',
          password: userData.password || 'password123',
          name: userData.name || 'New Adventurer',
          role: userData.role || 'traveller',
          phone: userData.phone || '',
          telegram: userData.telegram || '',
          province: userData.province || 'Phnom Penh',
          bio: userData.bio || 'Passionate about exploring Cambodian mountains and rivers.',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        closeAuthModal();
        return true;
      }
    } catch (e) {
      console.warn('API Register failed, using local session');
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      email: userData.email || 'adventurer@reaptrip.com',
      name: userData.name || 'New Adventurer',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      role: userData.role || 'traveller',
      phone: userData.phone || '',
      telegram: userData.telegram || '',
      province: userData.province || 'Phnom Penh',
      bio: userData.bio || 'Passionate about exploring Cambodian mountains and rivers.',
      languages: userData.languages || ['Khmer'],
      joinedDate: 'Just Now',
      verified: userData.role === 'local_guide' ? false : true,
      savedDestinationIds: [],
      createdRecipeIds: [],
      createdExperienceIds: [],
      stats: { tripsCompleted: 0 },
    };
    setUser(newUser);
    localStorage.setItem('reap-trip-auth-user', JSON.stringify(newUser));
    closeAuthModal();
    return true;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    setUser(null);
    localStorage.removeItem('reap-trip-auth-user');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('reap-trip-auth-user', JSON.stringify(updated));
  };

  const toggleSaveDestination = async (destId: string) => {
    if (!user) {
      openAuthModal();
      return;
    }
    toggleSaveDestinationId(destId);

    try {
      await fetch(`/api/destinations/${destId}/save`, { method: 'POST' });
    } catch (e) {}
  };

  const switchDemoUser = (userId: string) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (found) {
      setUser(found);
      localStorage.setItem('reap-trip-auth-user', JSON.stringify(found));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        updateProfile,
        toggleSaveDestination,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
