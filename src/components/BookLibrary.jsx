import { Plus, Edit2, Trash2 } from 'lucide-react';
import './BookLibrary.css';

const BookLibrary = ({ books, onOpenBook, onEditBook, onDeleteBook, onCreateBook }) => {
  return (
    <div className="library-view">
      <div className="library-header">
        <h1 className="library-title">Memory Books</h1>
        <p className="library-subtitle">Store your precious moments, one page at a time</p>
      </div>

      <div className="books-grid">
        {books.map((book, index) => (
          <div 
            key={book.id} 
            className="book-card"
            style={{ '--book-index': index }}
          >
            <div
              className="book-spine"
              style={{ backgroundColor: book.color }}
              onClick={() => onOpenBook(book)}
            >
              <div className="book-info">
                <div className="book-name">{book.name}</div>
                <div className="book-count">{book.memories.length}/10</div>
                <div className="book-card-actions">
                  <button 
                    className="card-action-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditBook(book);
                    }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    className="card-action-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBook(book.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button 
          className="add-book-card" 
          onClick={onCreateBook}
          style={{ '--book-index': books.length }}
        >
          <Plus size={32} />
          <span>New Book</span>
        </button>
      </div>
    </div>
  );
};

export default BookLibrary;