'use client';

import React, { useState, useRef, ReactNode } from 'react';
import { UploadCloud, Link as LinkIcon, Plus, X, Image as ImageIcon, Film, Trash2 } from 'lucide-react';

export interface MediaUploadProps {
  label?: string;
  helperText?: string;
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'avatar' | 'banner' | 'auto';
  compact?: boolean;
  icon?: ReactNode;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  label,
  helperText,
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  accept = 'image/*,video/*',
  required = false,
  disabled = false,
  className = '',
  aspectRatio = 'auto',
  compact = false,
  icon
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize initial items into string array
  const currentUrls: string[] = Array.isArray(value)
    ? value.filter(Boolean)
    : value
    ? [value]
    : [];

  const emitChange = (newUrls: string[]) => {
    if (multiple) {
      onChange(newUrls.slice(0, maxFiles));
    } else {
      onChange(newUrls[0] || '');
    }
  };

  const processFiles = (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (!fileList.length) return;

    const remainingSlots = multiple ? maxFiles - currentUrls.length : 1;
    const filesToProcess = fileList.slice(0, remainingSlots);

    const newUrls: string[] = [...currentUrls];
    let processedCount = 0;

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          if (multiple) {
            newUrls.push(e.target.result as string);
          } else {
            newUrls[0] = e.target.result as string;
          }
        }
        processedCount++;
        if (processedCount === filesToProcess.length) {
          emitChange(newUrls);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const trimmed = urlInput.trim();
    if (multiple) {
      emitChange([...currentUrls, trimmed].slice(0, maxFiles));
    } else {
      emitChange([trimmed]);
    }
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleRemoveItem = (index: number) => {
    const updated = currentUrls.filter((_, i) => i !== index);
    emitChange(updated);
  };

  const isVideo = (url: string) => {
    return url.includes('video') || url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov');
  };

  return (
    <div className={`form-field-group media-upload-container full-width ${className}`}>
      {/* Header Row */}
      <div className="media-upload-header">
        {label && (
          <label className="form-field-label">
            {icon && <span className="label-icon">{icon}</span>}
            {label}
            {required && <span className="required-star">*</span>}
          </label>
        )}

        {multiple && (
          <span className={`media-counter-badge ${currentUrls.length >= maxFiles ? 'full' : ''}`}>
            {currentUrls.length}/{maxFiles} {currentUrls.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {/* Main Drag & Drop Zone Box */}
      {(!multiple || currentUrls.length < maxFiles) && (
        <div
          className={`dropzone-box ${isDragging ? 'is-dragging' : ''} ${disabled ? 'is-disabled' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <div className="dropzone-icon">
            <UploadCloud size={28} />
          </div>
          <div className="dropzone-text">
            <strong>Drag & Drop photos/videos or <span className="browse-link">Browse files</span></strong>
            <span>Supports JPG, PNG, WEBP and MP4 videos (Up to {maxFiles} files)</span>
          </div>
        </div>
      )}

      {/* Fallback Web URL Paste Section */}
      <div className="url-option-wrap">
        {!showUrlInput ? (
          <button
            type="button"
            className="url-toggle-btn"
            onClick={() => setShowUrlInput(true)}
            disabled={disabled || (multiple && currentUrls.length >= maxFiles)}
          >
            <LinkIcon size={13} />
            <span>Or paste photo/video web link</span>
          </button>
        ) : (
          <div className="url-inline-row">
            <input
              type="url"
              className="custom-modern-input"
              placeholder="https://... (photo or video URL)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleAddUrl}
              disabled={!urlInput.trim()}
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowUrlInput(false)}
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {helperText && <span className="form-field-helper">{helperText}</span>}

      {/* Preview Thumbnails Grid */}
      {currentUrls.length > 0 && (
        <div className="media-preview-grid">
          {currentUrls.map((url, index) => (
            <div key={index} className="media-preview-item">
              {isVideo(url) ? (
                <div className="video-preview-tile">
                  <video src={url} className="preview-media-obj" muted />
                  <div className="video-badge">
                    <Film size={12} />
                    <span>Video</span>
                  </div>
                </div>
              ) : (
                <img src={url} alt={`Attachment ${index + 1}`} className="preview-media-obj" />
              )}
              <button
                type="button"
                className="btn-remove-media"
                onClick={() => handleRemoveItem(index)}
                title="Remove attachment"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        .media-upload-container {
          margin-bottom: 1rem;
        }

        .media-upload-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .label-icon {
          display: inline-flex;
          align-items: center;
          margin-right: 0.4rem;
          color: var(--primary);
        }

        .media-counter-badge {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--primary);
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid var(--border-glow);
          padding: 0.2rem 0.65rem;
          border-radius: var(--radius-full);
        }

        .media-counter-badge.full {
          color: var(--accent-amber);
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.4);
        }

        .dropzone-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          border: 2px dashed rgba(16, 185, 129, 0.4);
          background: rgba(16, 185, 129, 0.04);
          border-radius: var(--radius-md);
          padding: 1.25rem 1rem;
          cursor: pointer;
          transition: var(--transition);
          text-align: center;
        }

        [data-theme="light"] .dropzone-box {
          background: rgba(5, 150, 105, 0.04);
          border-color: rgba(5, 150, 105, 0.35);
        }

        .dropzone-box:hover,
        .dropzone-box.is-dragging {
          border-color: var(--primary);
          background: rgba(16, 185, 129, 0.1);
          transform: translateY(-1px);
        }

        .dropzone-box.is-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .dropzone-icon {
          color: var(--primary);
        }

        .dropzone-text strong {
          display: block;
          font-size: 0.88rem;
          color: var(--text-main);
        }

        .browse-link {
          color: var(--primary);
          text-decoration: underline;
        }

        .dropzone-text span {
          display: block;
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }

        .url-option-wrap {
          margin-top: 0.45rem;
        }

        .url-toggle-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.82rem;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          padding: 0.2rem 0;
          transition: var(--transition);
        }

        .url-toggle-btn:hover {
          color: var(--primary);
          text-decoration: underline;
        }

        .url-inline-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.35rem;
        }

        .url-inline-row .custom-modern-input {
          flex: 1;
          padding: 0.45rem 0.75rem;
          font-size: 0.85rem;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-sm);
          color: var(--text-main);
        }

        .media-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 0.75rem;
          margin-top: 0.85rem;
        }

        .media-preview-item {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--border-light);
          background: #000;
        }

        .preview-media-obj {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-preview-tile {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .video-badge {
          position: absolute;
          bottom: 4px;
          left: 4px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 600;
          padding: 2px 5px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .btn-remove-media {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(225, 29, 72, 0.88);
          color: #fff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .btn-remove-media:hover {
          background: rgba(225, 29, 72, 1);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};
