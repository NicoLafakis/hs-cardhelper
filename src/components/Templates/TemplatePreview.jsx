import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TemplatePreview.css';

const TemplatePreview = ({ template, onClose, onClone, cloning }) => {
  if (!template) return null;

  const {
    name,
    description,
    category,
    previewHtml,
    componentStructure,
    designTokens,
    tags = [],
    rating,
    downloadCount,
    cloneCount,
    accessibilityNotes
  } = template;

  const handleClone = () => {
    onClone(template);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Format category for display
  const categoryDisplay = category
    ? category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Template';

  // Count components in structure
  const componentCount = componentStructure?.children?.length || 0;

  return (
    <AnimatePresence>
      <motion.div
        className="template-preview-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="template-preview-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="preview-header">
            <div className="preview-title-section">
              <h2>{name}</h2>
              <span className="preview-category">{categoryDisplay}</span>
            </div>
            <button className="close-button" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="preview-content">
            {/* Left: Preview */}
            <div className="preview-left">
              <div className="preview-viewport">
                {previewHtml ? (
                  <div
                    className="preview-html"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                ) : (
                  <div className="preview-placeholder">
                    <span className="placeholder-icon">📄</span>
                    <p>No preview available</p>
                  </div>
                )}
              </div>

              {/* Responsive Tabs */}
              <div className="preview-tabs">
                <button className="preview-tab active">
                  💻 Desktop
                </button>
                <button className="preview-tab">
                  📱 Mobile
                </button>
                <button className="preview-tab">
                  🎨 Design Tokens
                </button>
              </div>
            </div>

            {/* Right: Details */}
            <div className="preview-right">
              <div className="preview-details">
                {/* Description */}
                <div className="detail-section">
                  <h3>Description</h3>
                  <p>{description}</p>
                </div>

                {/* Stats */}
                <div className="detail-section">
                  <h3>Stats</h3>
                  <div className="stats-grid">
                    {rating && (
                      <div className="stat-box">
                        <span className="stat-label">Rating</span>
                        <span className="stat-value">⭐ {rating.toFixed(1)}</span>
                      </div>
                    )}
                    {downloadCount !== undefined && (
                      <div className="stat-box">
                        <span className="stat-label">Downloads</span>
                        <span className="stat-value">
                          {downloadCount > 1000
                            ? `${(downloadCount / 1000).toFixed(1)}k`
                            : downloadCount}
                        </span>
                      </div>
                    )}
                    {cloneCount !== undefined && (
                      <div className="stat-box">
                        <span className="stat-label">Clones</span>
                        <span className="stat-value">{cloneCount}</span>
                      </div>
                    )}
                    <div className="stat-box">
                      <span className="stat-label">Components</span>
                      <span className="stat-value">{componentCount}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {tags && tags.length > 0 && (
                  <div className="detail-section">
                    <h3>Tags</h3>
                    <div className="preview-tags">
                      {tags.map((tag, index) => (
                        <span key={index} className="preview-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Design Tokens */}
                {designTokens && (
                  <div className="detail-section">
                    <h3>Design Tokens</h3>
                    <div className="design-tokens">
                      {designTokens.colors && (
                        <div className="token-group">
                          <h4>Colors</h4>
                          <div className="color-swatches">
                            {Object.entries(designTokens.colors).slice(0, 6).map(([key, value]) => (
                              <div key={key} className="color-swatch">
                                <div
                                  className="swatch-color"
                                  style={{ backgroundColor: value }}
                                ></div>
                                <span className="swatch-label">{key}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {designTokens.typography && (
                        <div className="token-group">
                          <h4>Typography</h4>
                          <div className="typography-info">
                            <p>
                              <strong>Font Family:</strong>{' '}
                              {designTokens.typography.fontFamily || 'Inter'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Accessibility */}
                {accessibilityNotes && (
                  <div className="detail-section">
                    <h3>Accessibility</h3>
                    <p className="accessibility-notes">{accessibilityNotes}</p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="preview-actions">
                <button
                  className="clone-button"
                  onClick={handleClone}
                  disabled={cloning}
                >
                  {cloning ? (
                    <>
                      <span className="spinner-small"></span>
                      Cloning...
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      Use This Template
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TemplatePreview;
