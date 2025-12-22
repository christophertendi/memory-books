import { ChevronLeft, ChevronRight, Trash2, Plus, X, Edit2 } from 'lucide-react';
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
  const currentMemory = currentBook.memories[currentPage];
  const hasMemories = currentBook.memories.length > 0;

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

        <div className="scrapbook-page">
          {hasMemories ? (
            <div className="page-content">
              <div className="scrapbook-collage">
                {currentMemory.photos && currentMemory.photos.length > 0 ? (
                  <div className="photos-grid">
                    {currentMemory.photos.map((photo, idx) => (
                      <div key={idx} className="polaroid-wrapper">
                        <div
                          className="polaroid-photo"
                          style={{
                            transform: `rotate(${(idx % 2 === 0 ? 1 : -1) * (Math.random() * 4 - 2)}deg)`,
                          }}
                        >
                          <div className="polaroid-image">
                            <img src={photo.image} alt={photo.innerCaption} />
                          </div>
                          {photo.innerCaption && (
                            <div className="polaroid-inner-caption">{photo.innerCaption}</div>
                          )}
                          <button
                            className="photo-delete"
                            onClick={() => onDeletePhoto(currentPage, idx)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        {photo.outerCaption && (
                          <div className="polaroid-outer-caption">{photo.outerCaption}</div>
                        )}
                      </div>
                    ))}
                    {currentMemory.photos.length < 5 && (
                      <button className="add-photo-slot" onClick={() => onAddPhoto(currentPage)}>
                        <Plus size={32} />
                        <span>Add Photo</span>
                      </button>
                    )}
                  </div>
                ) : null}
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
    </div>
  );
};

export default ScrapbookPage;