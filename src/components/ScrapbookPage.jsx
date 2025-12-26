import { ChevronLeft, ChevronRight, Trash2, Plus, X, Edit2, Move } from 'lucide-react';
import { useState } from 'react';
import './ScrapbookPage.css';

const ScrapbookPage = ({
  currentBook,
  currentPage,
  onPageChange,
  onDeletePage,
  onDeletePhoto,
  onAddPhoto,
  onEditTitle,
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

  const currentMemory = currentBook.memories[currentPage];
  const hasMemories = currentBook.memories.length > 0;

  const handleMouseDown = (e, photoIndex) => {
    if (e.target.closest('.photo-action-btn')) return;
    
    const photo = currentMemory.photos[photoIndex];
    const rect = e.currentTarget.getBoundingClientRect();
    
    setDraggingPhoto(photoIndex);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
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
          position: {
            x: Math.max(0, Math.min(80, x)),
            y: Math.max(0, Math.min(80, y))
          }
        };
        return { ...book, memories: newMemories };
      }
      return book;
    });
    
    setBooks(updatedBooks);
    setCurrentBook(updatedBooks.find((b) => b.id === currentBook.id));
  };

  const handleMouseUp = () => {
    setDraggingPhoto(null);
  };

  const handleEditCaption = (photoIndex) => {
    setEditingPhotoCaption(photoIndex);
  };

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
            onKeyDown={(e) => {
              if (e.key === 'Enter') setEditingTitle(false);
            }}
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
            {hasMemories ? `${currentPage + 1} / ${currentBook.memories.length}` : '0 / 10'}
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
                {currentMemory.photos && currentMemory.photos.length > 0 ? (
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
                          <div className="polaroid-image">
                            <img src={photo.image} alt={photo.innerCaption} />
                          </div>
                          {photo.innerCaption && (
                            <div className="polaroid-inner-caption">{photo.innerCaption}</div>
                          )}
                          <div className="photo-actions">
                            <button
                              className="photo-action-btn edit"
                              onClick={() => handleEditCaption(idx)}
                              title="Edit captions"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="photo-action-btn delete"
                              onClick={() => onDeletePhoto(currentPage, idx)}
                              title="Delete photo"
                            >
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

              <div className="page-controls">
                <button
                  className="page-btn"
                  onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="memory-actions">
                  <button className="action-btn delete" onClick={() => onDeletePage(currentPage)}>
                    <Trash2 size={16} />
                  </button>
                </div>

                <button
                  className="page-btn"
                  onClick={() => onPageChange(Math.min(currentBook.memories.length - 1, currentPage + 1))}
                  disabled={currentPage === currentBook.memories.length - 1}
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-book">
              <p>This book is empty</p>
              <p className="empty-subtitle">Add your first memory to begin</p>
            </div>
          )}
        </div>

        <div className="divider-tabs">
          {currentBook.dividers?.map((divider, idx) => (
            <div
              key={idx}
              className="divider-tab"
              style={{
                backgroundColor: divider.color,
              }}
            >
              <input
                type="text"
                className="divider-label-input"
                value={divider.label}
                onChange={(e) => {
                  const updatedBooks = books.map((book) => {
                    if (book.id === currentBook.id) {
                      const newDividers = [...book.dividers];
                      newDividers[idx].label = e.target.value;
                      return { ...book, dividers: newDividers };
                    }
                    return book;
                  });
                  setBooks(updatedBooks);
                  setCurrentBook(updatedBooks.find((b) => b.id === currentBook.id));
                }}
                placeholder="Label"
              />
            </div>
          ))}
          <button
            className="add-divider"
            onClick={() => {
              const updatedBooks = books.map((book) => {
                if (book.id === currentBook.id) {
                  const newDividers = book.dividers || [];
                  return {
                    ...book,
                    dividers: [
                      ...newDividers,
                      { label: 'New Tab', color: '#6b7280' },
                    ],
                  };
                }
                return book;
              });
              setBooks(updatedBooks);
              setCurrentBook(updatedBooks.find((b) => b.id === currentBook.id));
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

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
                handleSaveCaption(
                  editingPhotoCaption,
                  formData.get('innerCaption'),
                  formData.get('outerCaption')
                );
              }}
              className="memory-form"
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
              <button type="submit" className="btn-submit">
                Save Captions
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrapbookPage;