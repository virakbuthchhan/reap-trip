'use client';

import React from 'react';
import { TripReport, Destination } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  MapPin,
  UserCheck,
  Lightbulb,
  Navigation,
  Bike,
  Truck,
  Car,
  DollarSign,
  Star,
  ThumbsUp,
  MessageSquare,
  Send
} from 'lucide-react';

export interface TripExperienceCardProps {
  report: TripReport;
  destination?: Destination;
  onLikeReport: (reportId: string) => void;
  onAddComment: (reportId: string, commentText: string, authorName: string) => void;
  isCommentsOpen: boolean;
  onToggleComments: () => void;
  commentText: string;
  setCommentText: (text: string) => void;
  commentAuthor: string;
  setCommentAuthor: (author: string) => void;
}

export const TripExperienceCard: React.FC<TripExperienceCardProps> = ({
  report,
  destination,
  onLikeReport,
  onAddComment,
  isCommentsOpen,
  onToggleComments,
  commentText,
  setCommentText,
  commentAuthor,
  setCommentAuthor
}) => {
  const { language, t } = useLanguage();

  const destName = destination
    ? language === 'km' ? destination.nameKm : destination.nameEn
    : 'Cambodia Destination';

  const title = language === 'km' ? report.titleKm : report.titleEn;
  const content = language === 'km' ? report.contentKm : report.contentEn;
  const tips = language === 'km' ? report.tipsForNewbiesKm : report.tipsForNewbiesEn;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const author = commentAuthor.trim() || (language === 'km' ? 'អ្នកដើរព្រៃ' : 'Camper');
    onAddComment(report.id, commentText.trim(), author);
    setCommentText('');
  };

  return (
    <div className="experience-post-card glass-card">
      {/* Author & Destination Header Row */}
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

      {/* Post Title & Content */}
      <h3 className="feed-title">{title}</h3>
      <p className="feed-body">{content}</p>

      {/* Newbie Tips & Road Condition Update */}
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

      {/* Photos & Videos Media Gallery */}
      {report.photos && report.photos.length > 0 && (
        <div className="feed-photos-row">
          {report.photos.map((img, idx) => (
            <img key={idx} src={img} alt="Trip memory" loading="lazy" />
          ))}
        </div>
      )}

      {/* Metadata Stats Badges */}
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

      {/* Footer Action Controls */}
      <div className="feed-footer-actions">
        <button className="btn btn-outline btn-sm" onClick={() => onLikeReport(report.id)}>
          <ThumbsUp size={15} />
          <span>{language === 'km' ? 'មានប្រយោជន៍' : 'Helpful'} ({report.helpfulCount})</span>
        </button>

        <button className="btn btn-secondary btn-sm" onClick={onToggleComments}>
          <MessageSquare size={15} />
          <span>{language === 'km' ? 'មតិយោបល់' : 'Comments'} ({report.comments.length})</span>
        </button>
      </div>

      {/* Expandable Comments Section */}
      {isCommentsOpen && (
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

          {/* Add Comment Input Form */}
          <form onSubmit={handleCommentSubmit} className="add-comment-form">
            <input
              type="text"
              className="comment-name-input"
              placeholder={language === 'km' ? 'ឈ្មោះអ្នក...' : 'Your name...'}
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
            />
            <input
              type="text"
              className="comment-text-input"
              placeholder={language === 'km' ? 'សរសេរមតិយោបល់...' : 'Add a comment...'}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
