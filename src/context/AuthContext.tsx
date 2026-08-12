'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types';

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
    savedDestinationIds: ['dest_khnong_phsar', 'dest_kirirom', 'dest_tatai'],
    createdRecipeIds: ['rec_1', 'rec_2'],
    createdExperienceIds: ['exp_1'],
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
    savedDestinationIds: ['dest_phnom_aural', 'dest_chi_phat'],
    createdRecipeIds: ['rec_3'],
    createdExperienceIds: ['exp_2'],
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
    savedDestinationIds: ['dest_khnong_phsar'],
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
  login: (email: string) => boolean;
  register: (userData: Partial<UserProfile>) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  toggleSaveDestination: (destId: string) => void;
  switchDemoUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // Load stored user or default to first demo user (Bopha Chan)
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
  }, []);

  const saveUserSession = (u: UserProfile | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('reap-trip-auth-user', JSON.stringify(u));
    } else {
      localStorage.removeItem('reap-trip-auth-user');
    }
  };

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  const login = (email: string): boolean => {
    const found = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      saveUserSession(found);
      setAuthModalOpen(false);
      return true;
    }
    // If unknown email, auto-create a user session
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
      stats: { tripsCompleted: 0 }
    };
    saveUserSession(newUser);
    setAuthModalOpen(false);
    return true;
  };

  const register = (userData: Partial<UserProfile>) => {
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
      stats: { tripsCompleted: 0 }
    };
    saveUserSession(newUser);
    setAuthModalOpen(false);
  };

  const logout = () => {
    saveUserSession(null);
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    saveUserSession(updated);
  };

  const toggleSaveDestination = (destId: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    const currentSaved = user.savedDestinationIds || [];
    const isSaved = currentSaved.includes(destId);
    const newSaved = isSaved
      ? currentSaved.filter(id => id !== destId)
      : [...currentSaved, destId];

    updateProfile({ savedDestinationIds: newSaved });
  };

  const switchDemoUser = (userId: string) => {
    const found = DEMO_USERS.find(u => u.id === userId);
    if (found) {
      saveUserSession(found);
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
        switchDemoUser
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
