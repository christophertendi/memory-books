import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import BookLibrary from './components/BookLibrary.jsx';
import ScrapbookPage from './components/ScrapbookPage.jsx';
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [editingMemory, setEditingMemory] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [bookForm, setBookForm] = useState({
    name: '',
    color: '#2c2c2c',
  });
  const [memoryForm, setMemoryForm] = useState({
    image: '',
    innerCaption: '',
    outerCaption: '',
  });

  useEffect(() => {
    const savedBooks = localStorage.getItem('memoryBooks');
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem('memoryBooks', JSON.stringify(books));
    }
  }, [books]);

  const handleCreateBook = (e) => {
    e.preventDefault();
    if (!bookForm.name) return;

    if (editingBook) {
      setBooks(books.map((book) =>
        book.id === editingBook.id
          ? { ...book, name: bookForm.name, color: bookForm.color }
          : book
      ));
    } else {
      const newBook = {
        id: Date.now(),
        name: bookForm.name,
        color: bookForm.color,
        memories: [],
        dividers: [],
        createdAt: new Date().toISOString(),
      };
      setBooks([...books, newBook]);
    }

    setShowBookModal(false);
    setBookForm({ name: '', color: '#2c2c2c' });
    setEditingBook(null);
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book? All memories will be lost.')) {
      setBooks(books.filter((book) => book.id !== bookId));
      if (currentBook?.id === bookId) {
        setCurrentBook(null);
      }
    }
  };

  const handleOpenBook = (book) => {
    setCurrentBook(book);
    setCurrentPage(0);
  };

  const handleAddMemory = (e) => {
    e.preventDefault();
    if (!memoryForm.image) return;

    const updatedBooks = books.map((book) => {
      if (book.id === currentBook.id) {
        if (editingMemory !== null) {
          const newMemories = [...book.memories];
          const currentPageMemory = newMemories[editingMemory.pageIndex];
          
          if (!currentPageMemory.photos) {
            currentPageMemory.photos = [];
          }
          
          if (editingMemory.photoIndex !== undefined) {
            currentPageMemory.photos[editingMemory.photoIndex] = {
              image: memoryForm.image,
              innerCaption: memoryForm.innerCaption,
              outerCaption: memoryForm.outerCaption,
            };
          } else {
            if (currentPageMemory.photos.length >= 5) {
              alert('Maximum 5 photos per page!');
              return book;
            }
            currentPageMemory.photos.push({
              image: memoryForm.image,
              innerCaption: memoryForm.innerCaption,
              outerCaption: memoryForm.outerCaption,
            });
          }
          
          return { ...book, memories: newMemories };
        } else {
          if (book.memories.length >= 10) {
            alert('This book is full! Maximum 10 pages per book.');
            return book;
          }
          
          const currentPageMemory = book.memories[currentPage];
          if (currentPageMemory && (!currentPageMemory.photos || currentPageMemory.photos.length < 5)) {
            const newMemories = [...book.memories];
            if (!newMemories[currentPage].photos) {
              newMemories[currentPage].photos = [];
            }
            if (newMemories[currentPage].photos.length >= 5) {
              alert('Maximum 5 photos per page!');
              return book;
            }
            newMemories[currentPage].photos.push({
              image: memoryForm.image,
              innerCaption: memoryForm.innerCaption,
              outerCaption: memoryForm.outerCaption,
            });
            return { ...book, memories: newMemories };
          } else {
            return {
              ...book,
              memories: [
                ...book.memories,
                {
                  photos: [{
                    image: memoryForm.image,
                    innerCaption: memoryForm.innerCaption,
                    outerCaption: memoryForm.outerCaption,
                  }],
                  date: new Date().toISOString(),
                },
              ],
            };
          }
        }
      }
      return book;
    });

    setBooks(updatedBooks);
    const updatedCurrentBook = updatedBooks.find((b) => b.id === currentBook.id);
    setCurrentBook(updatedCurrentBook);
    
    if (!editingMemory) {
      setCurrentPage(updatedCurrentBook.memories.length - 1);
    }
    
    setShowMemoryModal(false);
    setMemoryForm({ image: '', innerCaption: '', outerCaption: '' });
    setEditingMemory(null);
  };

  const handleDeleteMemory = (index) => {
    if (window.confirm('Delete this page?')) {
      const updatedBooks = books.map((book) => {
        if (book.id === currentBook.id) {
          return {
            ...book,
            memories: book.memories.filter((_, i) => i !== index),
          };
        }
        return book;
      });
      setBooks(updatedBooks);
      setCurrentBook(updatedBooks.find((b) => b.id === currentBook.id));
      if (currentPage >= updatedBooks.find((b) => b.id === currentBook.id).memories.length) {
        setCurrentPage(Math.max(0, currentPage - 1));
      }
    }
  };

  const handleDeletePhoto = (pageIndex, photoIndex) => {
    if (window.confirm('Delete this photo?')) {
      const updatedBooks = books.map((book) => {
        if (book.id === currentBook.id) {
          const newMemories = [...book.memories];
          newMemories[pageIndex].photos = newMemories[pageIndex].photos.filter(
            (_, i) => i !== photoIndex
          );
          
          if (newMemories[pageIndex].photos.length === 0) {
            return {
              ...book,
              memories: newMemories.filter((_, i) => i !== pageIndex),
            };
          }
          
          return { ...book, memories: newMemories };
        }
        return book;
      });
      setBooks(updatedBooks);
      const updatedCurrentBook = updatedBooks.find((b) => b.id === currentBook.id);
      setCurrentBook(updatedCurrentBook);
      
      if (currentPage >= updatedCurrentBook.memories.length) {
        setCurrentPage(Math.max(0, currentPage - 1));
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMemoryForm({ ...memoryForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (currentBook) {
    return (
      <div className="app">
        <ScrapbookPage
          currentBook={currentBook}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onDeletePage={handleDeleteMemory}
          onDeletePhoto={handleDeletePhoto}
          onAddPhoto={(pageIndex) => {
            setMemoryForm({ image: '', innerCaption: '', outerCaption: '' });
            setEditingMemory({ pageIndex });
            setShowMemoryModal(true);
          }}
          onBack={() => setCurrentBook(null)}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          books={books}
          setBooks={setBooks}
          setCurrentBook={setCurrentBook}
        />

        {currentBook.memories.length < 10 && (
          <>
            <button
              className="add-memory-btn floating"
              onClick={() => setShowFloatingMenu(!showFloatingMenu)}
            >
              <Plus size={24} />
            </button>

            {showFloatingMenu && (
              <div className="floating-menu">
                <button
                  className="floating-menu-btn"
                  onClick={() => {
                    setMemoryForm({ image: '', innerCaption: '', outerCaption: '' });
                    setEditingMemory(null);
                    setShowMemoryModal(true);
                    setShowFloatingMenu(false);
                  }}
                >
                  <Plus size={18} />
                  Add Photo
                </button>
                <button
                  className="floating-menu-btn"
                  onClick={() => {
                    const newPage = {
                      photos: [],
                      date: new Date().toISOString(),
                    };
                    const updatedBooks = books.map((book) => {
                      if (book.id === currentBook.id) {
                        return {
                          ...book,
                          memories: [...book.memories, newPage],
                        };
                      }
                      return book;
                    });
                    setBooks(updatedBooks);
                    const updatedCurrentBook = updatedBooks.find((b) => b.id === currentBook.id);
                    setCurrentBook(updatedCurrentBook);
                    setCurrentPage(updatedCurrentBook.memories.length - 1);
                    setShowFloatingMenu(false);
                  }}
                >
                  <Plus size={18} />
                  Add Page
                </button>
              </div>
            )}
          </>
        )}

        {showMemoryModal && (
          <div className="modal-overlay" onClick={() => setShowMemoryModal(false)}>
            <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowMemoryModal(false)}>
                <X size={24} />
              </button>
              <h3 className="modal-title">
                {editingMemory !== null ? 'Edit Photo' : 'Add Photo'}
              </h3>
              <form onSubmit={handleAddMemory} className="memory-form">
                <div className="form-group">
                  <label>Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                  {memoryForm.image && (
                    <div className="image-preview">
                      <img src={memoryForm.image} alt="Preview" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={memoryForm.image}
                    onChange={(e) => setMemoryForm({ ...memoryForm, image: e.target.value })}
                    placeholder="Or paste image URL"
                    className="url-input"
                  />
                </div>
                <div className="form-group">
                  <label>Caption (inside polaroid)</label>
                  <input
                    type="text"
                    value={memoryForm.innerCaption}
                    onChange={(e) => setMemoryForm({ ...memoryForm, innerCaption: e.target.value })}
                    placeholder="Short caption inside the photo..."
                  />
                </div>
                <div className="form-group">
                  <label>Caption (outside polaroid)</label>
                  <textarea
                    value={memoryForm.outerCaption}
                    onChange={(e) => setMemoryForm({ ...memoryForm, outerCaption: e.target.value })}
                    placeholder="Additional notes beside the photo..."
                    rows="3"
                  />
                </div>
                <button type="submit" className="btn-submit">
                  {editingMemory !== null ? 'Update' : 'Add'} Photo
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <BookLibrary
        books={books}
        onOpenBook={handleOpenBook}
        onEditBook={(book) => {
          setEditingBook(book);
          setBookForm({ name: book.name, color: book.color });
          setShowBookModal(true);
        }}
        onDeleteBook={handleDeleteBook}
        onCreateBook={() => {
          setEditingBook(null);
          setBookForm({ name: '', color: '#2c2c2c' });
          setShowBookModal(true);
        }}
      />

      {showBookModal && (
        <div className="modal-overlay" onClick={() => setShowBookModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBookModal(false)}>
              <X size={24} />
            </button>
            <h3 className="modal-title">
              {editingBook ? 'Edit Book' : 'Create New Book'}
            </h3>
            <form onSubmit={handleCreateBook} className="book-form">
              <div className="form-group">
                <label>Book Name</label>
                <input
                  type="text"
                  value={bookForm.name}
                  onChange={(e) => setBookForm({ ...bookForm, name: e.target.value })}
                  placeholder="e.g., Summer 2024, Paris Trip"
                  required
                />
              </div>
              <div className="form-group">
                <label>Book Color</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={bookForm.color}
                    onChange={(e) => setBookForm({ ...bookForm, color: e.target.value })}
                    className="color-picker-input"
                  />
                  <div 
                    className="color-preview" 
                    style={{ backgroundColor: bookForm.color }}
                  >
                    <span className="color-value">{bookForm.color}</span>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn-submit">
                {editingBook ? 'Update' : 'Create'} Book
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;