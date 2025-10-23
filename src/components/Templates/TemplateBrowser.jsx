import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  usePremiumTemplates,
  useTemplateClone,
  useTemplateSearch,
  useFeaturedTemplates,
  usePopularTemplates
} from '../../hooks/usePremiumTemplates';
import TemplateCard from './TemplateCard';
import TemplatePreview from './TemplatePreview';
import './TemplateBrowser.css';

const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates', icon: '📋' },
  { id: 'contact-cards', name: 'Contact Cards', icon: '👤' },
  { id: 'product-cards', name: 'Product Cards', icon: '🛍️' },
  { id: 'dashboard-widgets', name: 'Dashboard Widgets', icon: '📊' },
  { id: 'form-templates', name: 'Form Templates', icon: '📝' },
  { id: 'landing-page-cards', name: 'Landing Pages', icon: '🚀' },
  { id: 'gallery-cards', name: 'Gallery Cards', icon: '🖼️' },
  { id: 'event-cards', name: 'Event Cards', icon: '📅' }
];

const FILTER_OPTIONS = [
  { id: 'all', name: 'All Templates' },
  { id: 'featured', name: 'Featured' },
  { id: 'popular', name: 'Popular' },
  { id: 'recent', name: 'Recently Added' }
];

const TemplateBrowser = ({ onTemplateClone, currentCardId }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Hooks
  const {
    templates: allTemplates,
    loading: templatesLoading,
    error: templatesError,
    setCategory,
    setSearch,
    setFeatured,
    refresh
  } = usePremiumTemplates();

  const { templates: featuredTemplates, loading: featuredLoading } = useFeaturedTemplates(12);
  const { templates: popularTemplates, loading: popularLoading } = usePopularTemplates(10);
  const { searchResults, searching, handleSearch } = useTemplateSearch(500);
  const { cloning, error: cloneError, cloneTemplate } = useTemplateClone();

  // Update filters
  useEffect(() => {
    if (selectedCategory !== 'all') {
      setCategory(selectedCategory);
    }
    if (selectedFilter === 'featured') {
      setFeatured(true);
    }
  }, [selectedCategory, selectedFilter, setCategory, setFeatured]);

  // Handle search
  useEffect(() => {
    if (searchQuery.length > 0) {
      handleSearch(searchQuery);
    }
  }, [searchQuery, handleSearch]);

  // Determine which templates to display
  const displayTemplates = useMemo(() => {
    if (searchQuery.length > 0 && searchResults.length > 0) {
      return searchResults;
    }

    if (selectedFilter === 'featured') {
      return featuredTemplates;
    }

    if (selectedFilter === 'popular') {
      return popularTemplates;
    }

    if (selectedCategory === 'all') {
      return allTemplates;
    }

    return allTemplates.filter(t => t.category === selectedCategory);
  }, [
    searchQuery,
    searchResults,
    selectedFilter,
    selectedCategory,
    allTemplates,
    featuredTemplates,
    popularTemplates
  ]);

  const handlePreview = (template) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const handleClone = async (template) => {
    if (!currentCardId) {
      alert('Please select or create a card first');
      return;
    }

    try {
      const instance = await cloneTemplate(template.templateId, currentCardId);
      if (onTemplateClone) {
        onTemplateClone(instance);
      }
      alert('Template cloned successfully!');
      setShowPreview(false);
    } catch (error) {
      console.error('Failed to clone template:', error);
      alert('Failed to clone template: ' + (error.message || 'Unknown error'));
    }
  };

  const loading = templatesLoading || featuredLoading || popularLoading || searching;

  return (
    <div className="template-browser">
      {/* Header */}
      <div className="template-browser-header">
        <div className="header-content">
          <h2>Premium Templates</h2>
          <p>Choose from professionally designed templates to jumpstart your card</p>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Filters */}
      <div className="template-filters">
        <div className="filter-group">
          <label>Filter:</label>
          <div className="filter-buttons">
            {FILTER_OPTIONS.map(filter => (
              <button
                key={filter.id}
                className={`filter-button ${selectedFilter === filter.id ? 'active' : ''}`}
                onClick={() => setSelectedFilter(filter.id)}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="template-browser-layout">
        {/* Category Sidebar */}
        <aside className="category-sidebar">
          <h3>Categories</h3>
          <nav className="category-list">
            {TEMPLATE_CATEGORIES.map(category => (
              <button
                key={category.id}
                className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Template Grid */}
        <main className="template-grid-container">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading templates...</p>
            </div>
          )}

          {!loading && templatesError && (
            <div className="error-state">
              <p>Error loading templates: {templatesError}</p>
              <button onClick={refresh} className="retry-button">
                Retry
              </button>
            </div>
          )}

          {!loading && !templatesError && displayTemplates.length === 0 && (
            <div className="empty-state">
              <p>No templates found</p>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-search-button">
                  Clear Search
                </button>
              )}
            </div>
          )}

          {!loading && !templatesError && displayTemplates.length > 0 && (
            <motion.div
              className="template-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence>
                {displayTemplates.map((template, index) => (
                  <motion.div
                    key={template.templateId || template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <TemplateCard
                      template={template}
                      onPreview={handlePreview}
                      onClone={handleClone}
                      cloning={cloning}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {cloneError && (
            <div className="clone-error">
              <p>Error: {cloneError}</p>
            </div>
          )}
        </main>
      </div>

      {/* Preview Modal */}
      {showPreview && previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setShowPreview(false)}
          onClone={handleClone}
          cloning={cloning}
        />
      )}
    </div>
  );
};

export default TemplateBrowser;
