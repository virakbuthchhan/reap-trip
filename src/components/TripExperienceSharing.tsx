'use client';

import React, { useState } from 'react';
import { TripReport, Destination } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, ThumbsUp, Plus, MapPin, Calendar, Compass, UserCheck, Send, Camera, Lightbulb, Navigation, DollarSign, Star, Bike, Truck, Car } from 'lucide-react';

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
  const { language, t } = useLanguage();

  const [activeCommentsReportId, setActiveCommentsReportId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<{ [reportId: string]: string }>({});
  const [commentAuthor, setCommentAuthor] = useState<{ [reportId: string]: string }>({});

  const toggleComments = (reportId: string) => {
    setActiveCommentsReportId(activeCommentsReportId === reportId ? null : reportId);
  };

  const handleCommentSubmit = (e: React.FormEvent, reportId: string) => {
    e.preventDefault();
    const text = commentText[reportId]?.trim();
    const author = commentAuthor[reportId]?.trim() || (language === 'km' ? 'អ្នកដើរព្រៃ' : 'Camper');
    if (!text) return;

    onAddComment(reportId, text, author);
    setCommentText({ ...commentText, [reportId]: '' });
  };

  return (
    <div className="trip-experiences-page container">
      {/* Header */}
      <div className="section-header flex-between">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={22} color="var(--primary)" />
            <span>{t.experiencesHeader}</span>
          </h2>
          <p>{t.experiencesSub}</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span>{t.btnShareExperience}</span>
        </button>
      </div>

      {/* Reports Feed */}
      <div className="reports-feed">
        {reports.map((report) => {
          const dest = destinations.find((d) => d.id === report.destinationId);
          const destName = dest ? (language === 'km' ? dest.nameKm : dest.nameEn) : 'Cambodia Destination';
          const title = language === 'km' ? report.titleKm : report.titleEn;
          const content = language === 'km' ? report.contentKm : report.contentEn;
          const tips = language === 'km' ? report.tipsForNewbiesKm : report.tipsForNewbiesEn;

          return (
            <div key={report.id} className="feed-card glass-card">
              {/* Author Header Row */}
              <div className="feed-author-row">
                <img src={report.authorAvatar} alt={report.authorName} className="feed-author-avatar" />
                <div className="feed-author-info">
                  <div className="feed-author-name">
                    <strong>{report.authorName}</strong>
                    <span className="badge badge-emerald contributor-badge">
                      <UserCheck size={11} /> Contributor
                    </span>
                  </div>
                  <span className="feed-author-role">{report.authorRole} • 📅 {report.travelDate}</span>
                </div>
                <div className="dest-tag-badge">
                  <MapPin size={13} />
                  <span>{destName}</span>
                </div>
              </div>

              {/* Title & Body */}
              <h3 className="feed-title">{title}</h3>
              <p className="feed-body">{content}</p>

              {/* Tips Box */}
              {tips && (
                <div className="tips-highlight-box">
                  <div className="tip-row">
                    <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--accent-amber)' }}>
                      <Lightbulb size={15} /> {t.newbieTips}:
                    </strong>
                    <p>{tips}</p>
                  </div>
                  {report.roadConditionUpdate && (
                    <div className="tip-row" style={{ marginTop: '0.5rem' }}>
                      <strong style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}>
                        <Navigation size={15} /> {t.roadCondition}:
                      </strong>
                      <p>{report.roadConditionUpdate}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Photo Gallery Grid */}
              {report.photos && report.photos.length > 0 && (
                <div className="feed-photos-row">
                  {report.photos.map((img, idx) => (
                    <img key={idx} src={img} alt="Trip memory" loading="lazy" />
                  ))}
                </div>
              )}

              {/* Metadata Stats */}
              <div className="feed-stats-bar">
                <span className="badge badge-cyan" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {report.transportUsed === 'motorbike' ? <Bike size={13} /> : report.transportUsed === 'suv_4x4' ? <Truck size={13} /> : <Car size={13} />}
                  <span>{report.transportUsed}</span>
                </span>
                <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <DollarSign size={13} /> ${report.costPerPersonUSD} {language === 'km' ? '/ ម្នាក់' : '/ person'}
                </span>
                <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={13} /> {report.difficultyRating}/5 {t.difficulty}
                </span>
              </div>

              {/* Actions Footer */}
              <div className="feed-footer-actions">
                <button className="btn btn-outline btn-sm" onClick={() => onLikeReport(report.id)}>
                  <ThumbsUp size={15} />
                  <span>{language === 'km' ? 'មានប្រយោជន៍' : 'Helpful'} ({report.helpfulCount})</span>
                </button>

                <button className="btn btn-secondary btn-sm" onClick={() => toggleComments(report.id)}>
                  <MessageSquare size={15} />
                  <span>{language === 'km' ? 'មតិយោបល់' : 'Comments'} ({report.comments.length})</span>
                </button>
              </div>

              {/* Comments Section */}
              {activeCommentsReportId === report.id && (
                <div className="feed-comments-section">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MessageSquare size={16} color="var(--primary)" />
                    <span>{language === 'km' ? 'មតិយោបល់' : 'Comments'}</span>
                  </h4>

                  {report.comments.length > 0 ? (
                    <div className="comments-list">
                      {report.comments.map((c) => (
                        <div key={c.id} className="comment-item">
                          <img src={c.authorAvatar} alt={c.authorName} className="comment-avatar" />
                          <div className="comment-body">
                            <div className="comment-author-row">
                              <strong>{c.authorName}</strong>
                              <span>{c.date}</span>
                            </div>
                            <p>{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted small-text" style={{ marginBottom: '0.75rem' }}>
                      {language === 'km' ? 'មិនទាន់មានមតិយោបល់នៅឡើយទេ' : 'No comments yet.'}
                    </p>
                  )}

                  {/* Add Comment Form */}
                  <form onSubmit={(e) => handleCommentSubmit(e, report.id)} className="add-comment-form">
                    <input
                      type="text"
                      className="comment-name-input"
                      placeholder={language === 'km' ? 'ឈ្មោះអ្នក...' : 'Your name...'}
                      value={commentAuthor[report.id] || ''}
                      onChange={(e) => setCommentAuthor({ ...commentAuthor, [report.id]: e.target.value })}
                    />
                    <input
                      type="text"
                      className="comment-text-input"
                      placeholder={language === 'km' ? 'សរសេរមតិយោបល់...' : 'Add a comment...'}
                      value={commentText[report.id] || ''}
                      onChange={(e) => setCommentText({ ...commentText, [report.id]: e.target.value })}
                    />
                    <button type="submit" className="btn btn-primary btn-sm">
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              )}
            </div>
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

        .feed-card {
          padding: 1.5rem;
        }

        /* Feed Author Row (Responsive Layout) */
        .feed-author-row {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .feed-author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--primary);
          flex-shrink: 0;
        }

        .feed-author-info {
          flex: 1;
          min-width: 160px;
        }

        .feed-author-name {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .contributor-badge {
          font-size: 0.65rem;
          padding: 0.15rem 0.45rem;
          white-space: nowrap;
        }

        .feed-author-role {
          font-size: 0.8rem;
          color: var(--text-dim);
          display: block;
          margin-top: 0.15rem;
        }

        .dest-tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid var(--border-glow);
          color: var(--primary);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          white-space: normal;
          max-width: 100%;
          line-height: 1.25;
        }

        .feed-title {
          font-size: 1.3rem;
          margin-bottom: 0.75rem;
          line-height: 1.35;
        }

        .feed-body {
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 1rem;
        }

        .tips-highlight-box {
          background: rgba(245, 158, 11, 0.06);
          border: 1px dashed rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .tip-row p {
          margin-top: 0.2rem;
          color: var(--text-main);
        }

        .feed-photos-row {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin-bottom: 1rem;
          padding-bottom: 4px;
        }

        .feed-photos-row img {
          height: 150px;
          border-radius: var(--radius-md);
          object-fit: cover;
          flex-shrink: 0;
        }

        .feed-stats-bar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .feed-footer-actions {
          display: flex;
          gap: 0.75rem;
          border-top: 1px solid var(--border-light);
          padding-top: 1rem;
          flex-wrap: wrap;
        }

        .feed-comments-section {
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px dashed var(--border-light);
        }

        .feed-comments-section h4 {
          font-size: 1rem;
          margin-bottom: 0.75rem;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .comment-item {
          display: flex;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-md);
        }

        .comment-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .comment-body {
          flex: 1;
        }

        .comment-author-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
        }

        .comment-author-row span {
          color: var(--text-dim);
        }

        .comment-body p {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        .add-comment-form {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .comment-name-input,
        .comment-text-input {
          background: var(--input-bg);
          border: 1.5px solid var(--input-border);
          border-radius: var(--radius-md);
          padding: 0.5rem 0.75rem;
          color: var(--text-main);
          font-family: var(--font-main);
          font-size: 0.88rem;
          outline: none;
          transition: var(--transition);
          box-shadow: var(--input-shadow);
        }

        .comment-name-input {
          width: 130px;
        }

        .comment-text-input {
          flex: 1;
          min-width: 160px;
        }

        .comment-name-input::placeholder,
        .comment-text-input::placeholder {
          color: var(--text-dim);
          opacity: 0.85;
        }

        .comment-name-input:hover,
        .comment-text-input:hover {
          border-color: var(--input-border-hover);
          background: var(--input-bg-hover);
        }

        .comment-name-input:focus,
        .comment-text-input:focus {
          border-color: var(--primary);
          background: var(--input-bg-focus);
          box-shadow: var(--input-focus-shadow);
        }

        @media (max-width: 640px) {
          .trip-experiences-page {
            padding: 1.5rem 0.85rem;
          }
          .feed-card {
            padding: 1rem;
          }
          .dest-tag-badge {
            margin-top: 0.35rem;
            width: 100%;
            justify-content: flex-start;
          }
          .comment-name-input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
