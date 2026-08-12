'use client';

import React, { useState } from 'react';
import { TripExperienceSharing } from '@/components/TripExperienceSharing';
import { AddExperienceModal } from '@/components/AddExperienceModal';
import { initialTripReports, initialDestinations } from '@/data/mockData';
import { TripReport, Destination } from '@/types';

export default function ExperiencesPage() {
  const [reports, setReports] = useState<TripReport[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reaptrip_reports');
      return saved ? JSON.parse(saved) : initialTripReports;
    }
    return initialTripReports;
  });

  const [destinations] = useState<Destination[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reaptrip_destinations');
      return saved ? JSON.parse(saved) : initialDestinations;
    }
    return initialDestinations;
  });

  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleAddTripReport = (newReport: TripReport) => {
    setReports([newReport, ...reports]);
  };

  const handleLikeReport = (reportId: string) => {
    setReports(
      reports.map((r) => (r.id === reportId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const handleAddComment = (reportId: string, commentText: string, authorName: string) => {
    setReports(
      reports.map((r) => {
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

  return (
    <>
      <TripExperienceSharing
        reports={reports}
        destinations={destinations}
        onOpenAddModal={() => setAddModalOpen(true)}
        onAddComment={handleAddComment}
        onLikeReport={handleLikeReport}
      />

      {addModalOpen && (
        <AddExperienceModal
          destinations={destinations}
          onClose={() => setAddModalOpen(false)}
          onSubmitReport={handleAddTripReport}
        />
      )}
    </>
  );
}
