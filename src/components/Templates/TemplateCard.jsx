import React from 'react';
import { motion } from 'framer-motion';
import './TemplateCard.css';

const TemplateCard = ({ template, onPreview, onClone, cloning }) => {
  const {
    name,
    description,
    category,
    thumbnailUrl,
    tags = [],
    rating,
    downloadCount,
    isFeatured,
    isPremium
  } = template;

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    onPreview(template);
  };

  const handleCloneClick = (e) => {
    e.stopPropagation();
    onClone(template);
  };

  // Format category for display
  const categoryDisplay = category
    ? category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Template';

  return (
    <motion.div
      className="template-card"
      whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
      transition={{ duration: 0.2 }}
    >
      {/* Thumbnail */}
      <div className="template-thumbnail" onClick={handlePreviewClick}>
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={name} />
        ) : (
          <div className="template-placeholder">
            <span className="placeholder-icon">📄</span>
            <span className="placeholder-text">Preview</span>
          </div>
        )}

        {/* Badges */}
        <div className="template-badges">
          {isFeatured && (
            <span className="badge badge-featured">⭐ Featured</span>
          )}
          {isPremium && (
            <span className="badge badge-premium">👑 Premium</span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="template-overlay">
          <button
            className="preview-button"
            onClick={handlePreviewClick}
          >
            👁️ Quick Preview
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="template-card-content">
        <div className="template-header">
          <h3 className="template-name">{name}</h3>
          <span className="template-category">{categoryDisplay}</span>
        </div>

        <p className="template-description">
          {description && description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="template-tags">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="template-tag">
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="template-tag template-tag-more">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="template-stats">
          {rating && (
            <span className="stat-item">
              <span className="stat-icon">⭐</span>
              <span className="stat-value">{rating.toFixed(1)}</span>
            </span>
          )}
          {downloadCount !== undefined && (
            <span className="stat-item">
              <span className="stat-icon">⬇️</span>
              <span className="stat-value">
                {downloadCount > 1000
                  ? `${(downloadCount / 1000).toFixed(1)}k`
                  : downloadCount}
              </span>
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="template-actions">
          <button
            className="action-button action-preview"
            onClick={handlePreviewClick}
          >
            Preview
          </button>
          <button
            className="action-button action-clone"
            onClick={handleCloneClick}
            disabled={cloning}
          >
            {cloning ? 'Cloning...' : 'Use Template'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TemplateCard;
