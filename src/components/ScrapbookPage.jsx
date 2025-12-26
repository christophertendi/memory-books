import { ChevronLeft, ChevronRight, Trash2, Plus, X, Edit2, Move, Filter, Tag } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import './ScrapbookPage.css';

const ScrapbookPage = ({
  currentBook,
  currentPage,
  onPageChange,
  onDeletePage,
  onDeletePhoto,
  onBack,
  editingTitle,
  setEditingTitle,
  books,
  setBooks,
  setCurrentBook
}) => {
  const [draggingPhoto, setDraggingPhoto] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingPhotoCaption, setEditingPhotoCaption] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const currentMemory = currentBook.memories[currentPage];
  const hasMemories = currentBook.memories.length > 0;

  // Get filtered pages
  const filteredPages = useMemo(() => {
    if (selectedFilters.length === 0) {
      return currentBook.memories.map((_, idx) => idx);
    }
    
    return currentBook.memories
      .map((memory, idx) => ({ ...memory, originalIndex: idx }))
      .filter(memory => selectedFilters.includes(memory.category))
      .sort((a, b) => {
        const orderA = currentBook.categories?.findIndex(cat => cat.name === a.category) ?? 999;
        const orderB = currentBook.categories?.findIndex(cat => cat.name === b.category) ?? 999;
        return orderA - orderB;
      })
      .map(memory => memory.originalIndex);
  }, [selectedFilters, currentBook.memories, currentBook.categories]);

  const currentFilteredIndex = filteredPages.indexOf(currentPage);
  const totalFilteredPages = filteredPages.length;

  const handleMouseDown = (e, photoIndex) => {
    if (e.target.closest('.photo-action-btn') || e.target.closest('.polaroid-image')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggingPhoto(photoIndex);
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e) => {
    if (draggingPhoto === null) return;
    const container = document.querySelector('.scrapbook-collage');
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;
    
    const updatedBooks = books.map((book) => {
      if (book.id === currentBook.id) {
        const newMemories = [...book.memories];
        newMemories[currentPage].photos[draggingPhoto] = {
          ...newMemories[currentPage].photos[draggingPhoto],
          position: { x: Math.max(0, Math.min(80, x)), y: Math.max(0, Math.min(80, y)) }
        };
        return { ...book, memories: newMemories };
      }
      return book;
    });
    setBooks(updatedBooks);
    setCurrentBook(updatedBooks.find((b) => b.id === currentBook.id));
  };

  const handleMouseUp = () => setDraggingPhoto(null);
  const handleEditCaption = (photoIndex) => setEditingPhotoCaption(photoIndex);

  const handleSaveCaption = (photoIndex, newInnerCaption, newOuterCaption) => {
    const updatedBooks = books.map((book) => {
      if (book.id === currentBook.id) {
        const newMemories = [...book.memories];
        newMemories[currentPage].photos[photoIndex] = {
          ...newMemories[currentPage].photos[photoIndex],
          innerCaption: newInnerCaption,
          outerCaption: newOuterCaption
        };
        return { ...book, memories: newMemories };
      }
      return book;
    });
    setBooks(updatedBooks);
    setCurrentBook(updatedBooks.find((b) => b.id === currentBook.id));
    setEditingPhotoCaption(null);
  };

  const handleImageClick = (e, photo) => {
    if (e.target.closest('.photo-action-btn') || draggingPhoto !== null) return;
    setViewingImage(photo);
  };

  const toggleFilter = (categoryName) => {
    setSelectedFilters(prev => 
      prev.includes(categoryName) ? prev.filter(f => f !== categoryName) : [...prev, categoryName]
    );
  };

  const navigateFiltered = (direction) => {
    const newIndex = currentFilteredIndex + direction;
    if (newIndex >= 0 && newIndex < totalFilteredPages) {
      onPageChange(filteredPages[newIndex]);
    }
  };

  const assignCategory = (categoryName) => {
    const updatedBooks = books.map((book) => {
      if (book.id === currentBook.id) {
        const newMemories = [...book.memories];
        newMemories[currentPage] = { ...newMemories[currentPage], category: categoryName };
        return { ...book, memories: newMemories };
      }
      return book;
    });
    setBooks(updatedBooks);
    setCurrentBook(updatedBooks.find((b) => b.id === currentBook.id));
    setShowCategoryModal(false);
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const categoryName = newCategoryName.trim();
    const updatedBooks = books.map((book) => {
      if (book.id === currentBook.id) {
        const newCategories = book.categories || [];
        // Check if category already exists
        if (newCategories.some(cat => cat.name === categoryName)) {
          return book; // Don't add duplicate
        }
        return {
          ...book,
          categories: [...newCategories, { name: categoryName, color: '#6b7280' }]
        };
      }
      return book;
    });
    setBooks(updatedBooks);
    setCurrentBook(updatedBooks.find((b) => b.id === currentBook.id));
    setNewCategoryName('');
    
    return categoryName; // Return the category name for chaining
  };

  const addAndAssignCategory = () => {
    const categoryName = newCategoryName.trim();
    if (!categoryName) return;
    
    // First add the category to the book
    const updatedBooks = books.map((book) => {
      if (book.id === currentBook.id) {
        const newCategories = book.categories || [];
        // Check if category already exists
        const categoryExists = newCategories.some(cat => cat.name === categoryName);
        
        // Update categories list
        const updatedCategories = categoryExists 
          ? newCategories 
          : [...newCategories, { name: categoryName, color: '#6b7280' }];
        
        // Also assign to current page
        const newMemories = [...book.memories];
        newMemories[currentPage] = { ...newMemories[currentPage], category: categoryName };
        
        return { 
          ...book, 
          categories: updatedCategories,
          memories: newMemories
        };
      }
      return book;
    });
    
    setBooks(updatedBooks);
    setCurrentBook(updatedBooks.find((b) => b.id === currentBook.id));
    setNewCategoryName('');
    setShowCategoryModal(false);
  };

  return (
    <div className="book-view">
      <div className="book-header">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={20} />
          Back to Library
        </button>
        {editingTitle ? (
          <input
            type="text"
            className="book-title-input"
            value={currentBook.name}
            onChange={(e) => {
              const updatedBooks = books.map((b) =>
                b.id === currentBook.id ? { ...b, name: e.target.value } : b
              );
              setBooks(updatedBooks);
              setCurrentBook({ ...currentBook, name: e.target.value });
            }}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => { if (e.key === 'Enter') setEditingTitle(false); }}
            autoFocus
          />
        ) : (
          <h1 className="book-title" onClick={() => setEditingTitle(true)}>
            {currentBook.name}
            <Edit2 size={18} className="title-edit-icon" />
          </h1>
        )}
        <div className="book-actions">
          <span className="page-counter">
            {selectedFilters.length > 0
              ? `${currentFilteredIndex + 1} / ${totalFilteredPages} (filtered)`
              : `${currentPage + 1} / ${currentBook.memories.length}`
            }
          </span>
        </div>
      </div>

      <div className="binder-wrapper">
        <div className="binder-rings">
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
        </div>

        <div 
          className="scrapbook-page"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {hasMemories ? (
            <div className="page-content">

              <div className="scrapbook-collage jamboard-style">
                {currentMemory.photos?.length > 0 ? (
                  <>
                    {currentMemory.photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className={`polaroid-jamboard ${draggingPhoto === idx ? 'dragging' : ''}`}
                        style={{
                          left: `${photo.position?.x || (idx * 15)}%`,
                          top: `${photo.position?.y || (idx * 12)}%`,
                          transform: `rotate(${(idx % 2 === 0 ? 1 : -1) * (Math.random() * 4 - 2)}deg)`,
                          cursor: draggingPhoto === idx ? 'grabbing' : 'grab'
                        }}
                        onMouseDown={(e) => handleMouseDown(e, idx)}
                      >
                        <div className="polaroid-photo">
                          <div 
                            className="polaroid-image"
                            onClick={(e) => handleImageClick(e, photo)}
                            style={{ cursor: 'pointer' }}
                          >
                            <img src={photo.image} alt={photo.innerCaption} />
                          </div>
                          {photo.innerCaption && (
                            <div className="polaroid-inner-caption">{photo.innerCaption}</div>
                          )}
                          <div className="photo-actions">
                            <button className="photo-action-btn edit" onClick={() => handleEditCaption(idx)}>
                              <Edit2 size={14} />
                            </button>
                            <button className="photo-action-btn delete" onClick={() => onDeletePhoto(currentPage, idx)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="drag-indicator">
                            <Move size={16} />
                          </div>
                        </div>
                        {photo.outerCaption && (
                          <div className="polaroid-outer-caption">{photo.outerCaption}</div>
                        )}
                      </div>
                    ))}
                  </>
                ) : null}

                {(!currentMemory.photos || currentMemory.photos.length < 5) && (
                  <div className="add-photo-hint">
                    <p>Click the + button to add photos</p>
                    <p className="hint-subtext">Drag photos to reposition them</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-book">
              <p>This book is empty</p>
              <p className="empty-subtitle">Add your first memory to begin</p>
            </div>
          )}

          {/* Center Navigation Controls */}
          <div className="center-nav-controls">
            <button
              className="page-btn"
              onClick={() => selectedFilters.length > 0 ? navigateFiltered(-1) : onPageChange(Math.max(0, currentPage - 1))}
              disabled={selectedFilters.length > 0 ? currentFilteredIndex === 0 : currentPage === 0}
            >
              <ChevronLeft size={24} />
            </button>

            <button className="action-btn delete" onClick={() => onDeletePage(currentPage)}>
              <Trash2 size={16} />
            </button>

            <button
              className="page-btn"
              onClick={() => selectedFilters.length > 0 ? navigateFiltered(1) : onPageChange(Math.min(currentBook.memories.length - 1, currentPage + 1))}
              disabled={selectedFilters.length > 0 ? currentFilteredIndex === totalFilteredPages - 1 : currentPage === currentBook.memories.length - 1}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* External Controls - Outside Page */}
        <div className="external-controls">
          <div className="left-external-controls">
            <button className="external-btn filter-btn" onClick={() => setShowFilterMenu(true)}>
              <Filter size={20} />
              {selectedFilters.length > 0 && (
                <span className="filter-count">{selectedFilters.length}</span>
              )}
            </button>

            <button className="external-btn category-btn" onClick={() => setShowCategoryModal(true)}>
              <Tag size={18} />
              {currentMemory?.category || 'Category'}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Menu */}
      {showFilterMenu && (
        <div className="modal-overlay" onClick={() => setShowFilterMenu(false)}>
          <div className="modal filter-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowFilterMenu(false)}>
              <X size={24} />
            </button>
            <h3 className="modal-title">Filter by Category</h3>
            
            {currentBook.categories?.length > 0 ? (
              <div className="filter-options">
                {currentBook.categories.map((category) => (
                  <button
                    key={category.name}
                    className={`filter-option ${selectedFilters.includes(category.name) ? 'active' : ''}`}
                    onClick={() => toggleFilter(category.name)}
                  >
                    <div className="filter-checkbox">
                      {selectedFilters.includes(category.name) && '✓'}
                    </div>
                    {category.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="empty-filters">No categories yet. Assign categories to pages first.</p>
            )}

            <div className="filter-actions">
              <button className="btn-secondary" onClick={() => setSelectedFilters([])}>
                Clear Filters
              </button>
              <button className="btn-submit" onClick={() => setShowFilterMenu(false)}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Assignment Modal */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => setShowCategoryModal(false)}
            >
              <X size={24} />
            </button>
            <h3 className="modal-title">Assign Category to Page</h3>
            
            {currentMemory.category && (
              <div className="current-category-display">
                <span className="current-label">Current:</span>
                <span className="current-category">{currentMemory.category}</span>
              </div>
            )}

            {currentBook.categories?.length > 0 && (
              <div className="category-list">
                {currentBook.categories.map((category) => (
                  <button
                    key={category.name}
                    className={`category-option ${currentMemory.category === category.name ? 'selected' : ''}`}
                    onClick={() => assignCategory(category.name)}
                  >
                    {currentMemory.category === category.name && <span className="check-icon">✓</span>}
                    {category.name}
                  </button>
                ))}
              </div>
            )}

            <div className="add-category-section">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className="category-input"
                onKeyDown={(e) => { 
                  if (e.key === 'Enter') {
                    addAndAssignCategory();
                  }
                }}
              />
              <button 
                className="btn-submit" 
                onClick={addAndAssignCategory}
              >
                <Plus size={16} />
                Add & Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer */}
      {viewingImage && (
        <div className="image-modal-overlay" onClick={() => setViewingImage(null)}>
          <button className="image-modal-close" onClick={() => setViewingImage(null)}>
            <X size={32} />
          </button>
          <div className="image-modal-content">
            <img src={viewingImage.image} alt={viewingImage.innerCaption} />
            {(viewingImage.innerCaption || viewingImage.outerCaption) && (
              <div className="image-modal-captions">
                {viewingImage.innerCaption && <p className="modal-inner-caption">{viewingImage.innerCaption}</p>}
                {viewingImage.outerCaption && <p className="modal-outer-caption">{viewingImage.outerCaption}</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Caption Modal */}
      {editingPhotoCaption !== null && (
        <div className="modal-overlay" onClick={() => setEditingPhotoCaption(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditingPhotoCaption(null)}>
              <X size={24} />
            </button>
            <h3 className="modal-title">Edit Captions</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleSaveCaption(editingPhotoCaption, formData.get('innerCaption'), formData.get('outerCaption'));
              }}
            >
              <div className="form-group">
                <label>Caption (inside polaroid)</label>
                <input
                  type="text"
                  name="innerCaption"
                  defaultValue={currentMemory.photos[editingPhotoCaption].innerCaption}
                  placeholder="Short caption inside the photo..."
                />
              </div>
              <div className="form-group">
                <label>Caption (outside polaroid)</label>
                <textarea
                  name="outerCaption"
                  defaultValue={currentMemory.photos[editingPhotoCaption].outerCaption}
                  placeholder="Additional notes beside the photo..."
                  rows="3"
                />
              </div>
              <button type="submit" className="btn-submit">Save Captions</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrapbookPage;