import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { authService } from './services/authService';
import { firestoreService } from './services/firestoreService';
import Auth from './components/Auth.jsx';
import BookLibrary from './components/BookLibrary.jsx';
import ScrapbookPage from './components/ScrapbookPage.jsx';
import BookCoverDesigner from './components/BookCoverDesigner.jsx';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [books, setBooks] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [showCoverDesigner, setShowCoverDesigner] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [designingBook, setDesigningBook] = useState(null);
  const [editingMemory, setEditingMemory] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]); // Track active category filters
  const [bookForm, setBookForm] = useState({
    name: '',
    color: '#2c2c2c',
  });
  const [memoryForm, setMemoryForm] = useState({
    image: '',
    innerCaption: '',
    outerCaption: '',
  });

  // Validate word count (max 20 words)
  const validateWordCount = (text, maxWords = 20) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length <= maxWords;
  };

  const handleCaptionChange = (field, value) => {
    if (validateWordCount(value, 20)) {
      setMemoryForm({ ...memoryForm, [field]: value });
    }
  };

  // Listen to Firebase auth state (persists across refreshes)
  useEffect(() => {
    const unsubscribe = authService.onAuthChange((user) => {
      if (user && user.emailVerified) {
        console.log('✅ User authenticated:', user.email);
        setCurrentUser(user.email);
        setUserId(user.uid);
        setIsAuthenticated(true);
      } else {
        console.log('❌ No authenticated user');
        setCurrentUser(null);
        setUserId(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load user-specific books from Firestore
  useEffect(() => {
    const loadUserBooks = async () => {
      if (isAuthenticated && userId) {
        console.log('📥 Loading books from Firestore...', { userId });
        const result = await firestoreService.loadBooks(userId);
        
        if (result.success) {
          console.log('✅ Loaded', result.books.length, 'books');
          setBooks(result.books);
        } else {
          console.error('❌ Load failed:', result.error);
        }
      }
    };
    loadUserBooks();
  }, [isAuthenticated, userId]);

  // Save user-specific books to Firestore (debounced)
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      console.log('❌ Not saving - not authenticated or no userId');
      return;
    }

    if (books.length === 0) {
      console.log('ℹ️ No books to save yet');
      return;
    }

    console.log('⏱️ Scheduling save for', books.length, 'books...');
    
    const saveTimer = setTimeout(async () => {
      console.log('💾 Saving books to Firestore...', { userId, bookCount: books.length });
      const result = await firestoreService.saveBooks(userId, books);
      
      if (result.success) {
        console.log('✅ Books saved successfully!');
      } else {
        console.error('❌ Save failed:', result.error);
        alert('Failed to save: ' + result.error);
      }
    }, 2000); // Save 2 seconds after changes stop

    return () => {
      console.log('🔄 Save cancelled - new changes detected');
      clearTimeout(saveTimer);
    };
  }, [books, isAuthenticated, userId]);

  const handleAuthSuccess = (user) => {
    console.log('🎉 Auth success! User:', user);
    setCurrentUser(user.email);
    setUserId(user.uid);  // Use UID not email!
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setUserId(null);
    setIsAuthenticated(false);
    setBooks([]);
    setCurrentBook(null);
  };

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.5rem',
        fontFamily: 'Playfair Display, serif'
      }}>
        Memory Books
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

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

  const handleDesignCover = (book) => {
    setDesigningBook(book);
    setShowCoverDesigner(true);
  };

  const handleSaveCoverDesign = (coverDesign) => {
    setBooks(books.map((book) =>
      book.id === designingBook.id
        ? { ...book, coverDesign }
        : book
    ));
  };

  const handleOpenBook = (book) => {
    setCurrentBook(book);
    setCurrentPage(0);
    setActiveFilters([]); // Reset filters when opening a new book
  };

  // Check if current page exists in filtered results (or no filters active)
  const isCurrentPageValid = () => {
    if (!currentBook || activeFilters.length === 0) return true;
    
    const filteredPages = currentBook.memories
      .map((memory, idx) => ({ ...memory, originalIndex: idx }))
      .filter(memory => activeFilters.includes(memory.category))
      .map(memory => memory.originalIndex);
    
    return filteredPages.includes(currentPage);
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
      // Create an image to compress it
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (event) => {
        img.src = event.target.result;
        
        img.onload = () => {
          // Create canvas to compress image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set max dimensions
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression (0.7 quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setMemoryForm({ ...memoryForm, image: compressedBase64 });
        };
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
          onBack={() => {
            setCurrentBook(null);
            setActiveFilters([]); // Reset filters when closing book
          }}
          editingTitle={editingTitle}
          setEditingTitle={setEditingTitle}
          books={books}
          setBooks={setBooks}
          setCurrentBook={setCurrentBook}
          onFilterChange={setActiveFilters}
          onDesignCover={handleDesignCover}
          onDeleteBook={handleDeleteBook}
        />

        {/* Only show floating menu if on a valid page and book isn't full */}
        {currentBook.memories.length < 10 && isCurrentPageValid() && (
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
                      category: null, // No category assigned yet
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
                    
                    // Show category modal for new page
                    setTimeout(() => {
                      // Need to pass this to ScrapbookPage to trigger
                      // Will handle in ScrapbookPage
                    }, 100);
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
                  <label>
                    Caption (inside polaroid)
                    <span className="word-count">
                      {memoryForm.innerCaption.trim().split(/\s+/).filter(w => w).length}/20 words
                    </span>
                  </label>
                  <input
                    type="text"
                    value={memoryForm.innerCaption}
                    onChange={(e) => handleCaptionChange('innerCaption', e.target.value)}
                    placeholder="Short caption inside the photo... (max 20 words)"
                  />
                </div>
                <div className="form-group">
                  <label>
                    Caption (outside polaroid)
                    <span className="word-count">
                      {memoryForm.outerCaption.trim().split(/\s+/).filter(w => w).length}/20 words
                    </span>
                  </label>
                  <textarea
                    value={memoryForm.outerCaption}
                    onChange={(e) => handleCaptionChange('outerCaption', e.target.value)}
                    placeholder="Additional notes beside the photo... (max 20 words)"
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
        onDesignCover={handleDesignCover}
        onLogout={handleLogout}
        hideMenu={showCoverDesigner || showBookModal}
      />

      {showCoverDesigner && (
        <BookCoverDesigner
          initialCover={designingBook?.coverDesign}
          onSave={handleSaveCoverDesign}
          onClose={() => setShowCoverDesigner(false)}
        />
      )}

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