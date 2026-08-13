'use client';

import React, { useState } from 'react';
import { TripReport, Destination } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Camera } from 'lucide-react';
import { PostComposerCard } from './ui/PostComposerCard';
import { TripExperienceCard } from './ui/TripExperienceCard';

interface TripExperienceSharingProps {
  reports: TripReport[];
  destinations: Destination[];
  onOpenAddModal: () => void;
  onAddComment: (reportId: string, commentText: string, authorName: string) => void;
  onLikeReport: (reportId: string) => void;
}

export const TripExperienceSharing: React.FC<TripExperienceSharingProps> = ({
  reports,
  destinations,
  onOpenAddModal,
  onAddComment,
  onLikeReport
}) => {
  const { t } = useLanguage();

  const [activeCommentsReportId, setActiveCommentsReportId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<{ [reportId: string]: string }>({});
  const [commentAuthor, setCommentAuthor] = useState<{ [reportId: string]: string }>({});

  const toggleComments = (reportId: string) => {
    setActiveCommentsReportId(activeCommentsReportId === reportId ? null : reportId);
  };

  return (
    <div className="trip-experiences-page container">
      {/* Header */}
      <div className="section-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={22} color="var(--primary)" />
            <span>{t.experiencesHeader}</span>
          </h2>
          <p>{t.experiencesSub}</p>
        </div>
      </div>

      {/* Reports Feed */}
      <div className="reports-feed">
        {/* Reusable Facebook-style Post Composer Bar */}
        <PostComposerCard onOpenModal={onOpenAddModal} />

        {/* Reusable Trip Experience Listing Feed */}
        {reports.map((report) => {
          const dest = destinations.find((d) => d.id === report.destinationId);
          return (
            <TripExperienceCard
              key={report.id}
              report={report}
              destination={dest}
              onLikeReport={onLikeReport}
              onAddComment={onAddComment}
              isCommentsOpen={activeCommentsReportId === report.id}
              onToggleComments={() => toggleComments(report.id)}
              commentText={commentText[report.id] || ''}
              setCommentText={(val) => setCommentText({ ...commentText, [report.id]: val })}
              commentAuthor={commentAuthor[report.id] || ''}
              setCommentAuthor={(val) => setCommentAuthor({ ...commentAuthor, [report.id]: val })}
            />
          );
        })}
      </div>

      <style>{`
        .trip-experiences-page {
          padding: 2.5rem 1.25rem;
        }

        .reports-feed {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 2rem;
          max-width: 820px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 640px) {
          .trip-experiences-page {
            padding: 1.5rem 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};
