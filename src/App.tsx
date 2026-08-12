import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DestinationExplorer } from './components/DestinationExplorer';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { GuideDirectory } from './components/GuideDirectory';
import { ExpenseSplitter } from './components/ExpenseSplitter';
import { MealPlanner } from './components/MealPlanner';
import { PackingChecklist } from './components/PackingChecklist';
import { TripExperienceSharing } from './components/TripExperienceSharing';
import { AddExperienceModal } from './components/AddExperienceModal';
import { AdminCMSModal } from './components/AdminCMSModal';

import {
  initialDestinations,
  initialGuides,
  initialRecipes,
  initialTripReports,
  initialPackingItems
} from './data/mockData';

import { Destination, LocalGuide, TripReport } from './types';

export const AppContent: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('destinations');

  // Application Data State
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    const saved = localStorage.getItem('reaptrip_destinations');
    return saved ? JSON.parse(saved) : initialDestinations;
  });

  const [guides, setGuides] = useState<LocalGuide[]>(() => {
    const saved = localStorage.getItem('reaptrip_guides');
    return saved ? JSON.parse(saved) : initialGuides;
  });

  const [tripReports, setTripReports] = useState<TripReport[]>(() => {
    const saved = localStorage.getItem('reaptrip_reports');
    return saved ? JSON.parse(saved) : initialTripReports;
  });

  // Modal States
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [addExperienceModalOpen, setAddExperienceModalOpen] = useState(false);
  const [preselectedReportDestId, setPreselectedReportDestId] = useState<string | undefined>(undefined);
  const [adminCMSModalOpen, setAdminCMSModalOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('reaptrip_destinations', JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem('reaptrip_guides', JSON.stringify(guides));
  }, [guides]);

  useEffect(() => {
    localStorage.setItem('reaptrip_reports', JSON.stringify(tripReports));
  }, [tripReports]);

  // Handlers
  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestination(dest);
  };

  const handleOpenAddExperienceForDest = (destId: string) => {
    setPreselectedReportDestId(destId);
    setAddExperienceModalOpen(true);
  };

  const handleAddTripReport = (newReport: TripReport) => {
    setTripReports([newReport, ...tripReports]);
  };

  const handleLikeReport = (reportId: string) => {
    setTripReports(
      tripReports.map((r) =>
        r.id === reportId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      )
    );
  };

  const handleAddComment = (reportId: string, commentText: string, authorName: string) => {
    setTripReports(
      tripReports.map((r) => {
        if (r.id === reportId) {
          const newC = {
            id: `c_${Date.now()}`,
            authorName: authorName,
            authorAvatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 400)}?auto=format&fit=crop&w=150&q=80`,
            text: commentText,
            date: 'Just now'
          };
          return { ...r, comments: [...r.comments, newC] };
        }
        return r;
      })
    );
  };

  const handleAddDestination = (newDest: Destination) => {
    setDestinations([newDest, ...destinations]);
  };

  const handleAddGuide = (newGuide: LocalGuide) => {
    setGuides([newGuide, ...guides]);
  };

  return (
    <div className="app-root">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddExperience={() => {
          setPreselectedReportDestId(undefined);
          setAddExperienceModalOpen(true);
        }}
        onOpenAdminCMS={() => setAdminCMSModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="app-main-content">
        {activeTab === 'destinations' && (
          <DestinationExplorer
            destinations={destinations}
            onSelectDestination={handleSelectDestination}
          />
        )}

        {activeTab === 'guides' && (
          <GuideDirectory
            guides={guides}
            destinations={destinations}
          />
        )}

        {activeTab === 'expenses' && <ExpenseSplitter />}

        {activeTab === 'meals' && <MealPlanner recipes={initialRecipes} />}

        {activeTab === 'checklist' && <PackingChecklist initialItems={initialPackingItems} />}

        {activeTab === 'experiences' && (
          <TripExperienceSharing
            reports={tripReports}
            destinations={destinations}
            onOpenAddModal={() => {
              setPreselectedReportDestId(undefined);
              setAddExperienceModalOpen(true);
            }}
            onAddComment={handleAddComment}
            onLikeReport={handleLikeReport}
          />
        )}
      </main>

      {/* Destination Detail Modal */}
      {selectedDestination && (
        <DestinationDetailModal
          destination={selectedDestination}
          guides={guides}
          tripReports={tripReports}
          onClose={() => setSelectedDestination(null)}
          onOpenAddExperienceForDest={handleOpenAddExperienceForDest}
        />
      )}

      {/* Add Trip Experience Modal */}
      {addExperienceModalOpen && (
        <AddExperienceModal
          destinations={destinations}
          preselectedDestId={preselectedReportDestId}
          onClose={() => setAddExperienceModalOpen(false)}
          onSubmitReport={handleAddTripReport}
        />
      )}

      {/* Admin CMS Modal */}
      {adminCMSModalOpen && (
        <AdminCMSModal
          onClose={() => setAdminCMSModalOpen(false)}
          onAddDestination={handleAddDestination}
          onAddGuide={handleAddGuide}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
