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

    </div>
  );
};
