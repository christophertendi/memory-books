import { Plus, Edit2, Trash2, Palette, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import './BookLibrary.css';

const BookLibrary = ({ books, onOpenBook, onEditBook, onDeleteBook, onCreateBook, onDesignCover, onLogout, hideMenu }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const getCoverStyle = (book) => {
    if (!book.coverDesign) {
      return { backgroundColor: book.color };
    }

    const { backgroundColor, pattern } = book.coverDesign;
    
    switch (pattern) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${backgroundColor}, color-mix(in srgb, ${backgroundColor}, black 30%))`
        };
      case 'dots':
        return {
          backgroundColor,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        };
      case 'stripes':
        return {
          backgroundColor,
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
        };
      case 'grid':
        return {
          backgroundColor,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        };
      case 'diagonal':
        return {
          backgroundColor,
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 10px, transparent 10px, transparent 20px)'
        };
      default:
        return { backgroundColor };
    }
  };

  const getTextColor = (book) => {
    return book.coverDesign?.textColor || '#ffffff';
  };

  return (
    <div className="library-view">
      <div className="library-header">
        <div className="library-header-content">
          <h1 className="library-title">Memory Books</h1>
          <p className="library-subtitle">Store your precious moments, one page at a time</p>
        </div>
        {!hideMenu && (
          <button 
            className={`burger-menu ${showSidebar ? 'open' : ''}`}
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label="Menu"
          >
            {showSidebar ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* Sidebar */}
      {!hideMenu && (
        <>
          <div className={`sidebar-overlay ${showSidebar ? 'active' : ''}`} onClick={() => setShowSidebar(false)} />
          <div className={`sidebar ${showSidebar ? 'active' : ''}`}>
            <div className="sidebar-content">
              <h3 className="sidebar-title">Menu</h3>
              <button className="sidebar-logout-btn" onClick={() => {
                onLogout();
                setShowSidebar(false);
              }}>
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      <div className="books-stack">
        {books.map((book, index) => (
          <div 
            key={book.id} 
            className="book-cover"
            style={{ 
              '--book-index': index,
              '--total-books': books.length
            }}
            onClick={() => onOpenBook(book)}
          >
            <div 
              className="book-front"
              style={getCoverStyle(book)}
            >
              <div 
                className="book-title-cover"
                style={{ color: getTextColor(book) }}
              >
                {book.name}
              </div>
              <div 
                className="book-page-count"
                style={{ color: getTextColor(book) }}
              >
                {book.memories.length}/10 pages
              </div>
            </div>
            <div 
              className="book-spine-side"
              style={getCoverStyle(book)}
            >
            </div>
            <div className="book-actions-overlay">
              <button 
                className="book-action-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDesignCover(book);
                }}
                title="Design Cover"
              >
                <Palette size={16} />
              </button>
              <button 
                className="book-action-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditBook(book);
                }}
                title="Edit Book"
              >
                <Edit2 size={16} />
              </button>
              <button 
                className="book-action-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBook(book.id);
                }}
                title="Delete Book"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="add-book-btn-fixed" onClick={onCreateBook}>
        <Plus size={20} />
        <span>New Book</span>
      </button>
    </div>
  );
};

export default BookLibrary;