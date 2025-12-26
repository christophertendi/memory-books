import { Plus, Edit2, Trash2 } from 'lucide-react';
import './BookLibrary.css';

const BookLibrary = ({ books, onOpenBook, onEditBook, onDeleteBook, onCreateBook }) => {
  return (
    <div className="library-view">
      <div className="library-header">
        <h1 className="library-title">Memory Books</h1>
        <p className="library-subtitle">Store your precious moments, one page at a time</p>
      </div>

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
              style={{ backgroundColor: book.color }}
            >
              <div className="book-title-cover">{book.name}</div>
              <div className="book-page-count">{book.memories.length}/10 pages</div>
            </div>
            <div 
              className="book-spine-side"
              style={{ backgroundColor: book.color }}
            >
              <span>{book.name}</span>
            </div>
            <div className="book-actions-overlay">
              <button 
                className="book-action-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditBook(book);
                }}
              >
                <Edit2 size={16} />
              </button>
              <button 
                className="book-action-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteBook(book.id);
                }}
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