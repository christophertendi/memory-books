import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { validation } from '../utils/validation';
import { errorHandler } from '../utils/errorHandler';

export const firestoreService = {
  // Save all books for a user (with validation and sanitization)
  async saveBooks(userId, books) {
    try {
      // Validate userId
      if (!userId || typeof userId !== 'string') {
        throw errorHandler.createError(
          'validation/invalid-input',
          'Invalid user ID'
        );
      }

      // Validate books array
      if (!Array.isArray(books)) {
        throw errorHandler.createError(
          'validation/invalid-input',
          'Books must be an array'
        );
      }

      console.log('🔥 Firestore: Saving to path:', `users/${userId}/data/books`);
      
      // Sanitize and validate all books before saving
      const sanitizedBooks = books.map(book => {
        // Validate book structure
        if (!book || typeof book !== 'object') {
          throw errorHandler.createError(
            'validation/invalid-input',
            'Invalid book structure'
          );
        }

        // Validate book name
        if (!validation.validateBookName(book.name)) {
          throw errorHandler.createError(
            'validation/invalid-input',
            'Invalid book name'
          );
        }

        return {
          ...book,
          id: book.id,
          name: validation.sanitizeText(book.name),
          color: book.color || '#2c2c2c',
          coverDesign: book.coverDesign || null,
          memories: Array.isArray(book.memories) ? book.memories.map(memory => {
            // Validate category
            if (memory.category && !validation.validateCategory(memory.category)) {
              throw errorHandler.createError(
                'validation/invalid-input',
                'Invalid category'
              );
            }

            return {
              ...memory,
              category: memory.category ? validation.sanitizeText(memory.category) : '',
              photos: Array.isArray(memory.photos) ? memory.photos.map(photo => {
                // Validate captions
                if (photo.innerCaption && !validation.validateCaption(photo.innerCaption)) {
                  throw errorHandler.createError(
                    'validation/invalid-input',
                    'Invalid caption'
                  );
                }
                if (photo.outerCaption && !validation.validateCaption(photo.outerCaption)) {
                  throw errorHandler.createError(
                    'validation/invalid-input',
                    'Invalid caption'
                  );
                }

                // Validate image size
                if (photo.image && !validation.validateImageSize(photo.image)) {
                  throw errorHandler.createError(
                    'validation/file-too-large',
                    'Image exceeds 5MB limit'
                  );
                }

                return {
                  ...photo,
                  innerCaption: validation.sanitizeText(photo.innerCaption || ''),
                  outerCaption: validation.sanitizeText(photo.outerCaption || ''),
                  image: photo.image || ''
                };
              }) : []
            };
          }) : []
        };
      });

      // Check total data size
      const dataSize = JSON.stringify(sanitizedBooks).length;
      console.log('🔥 Firestore: Data size:', dataSize, 'characters');

      // Firestore has a 1MB document size limit
      const maxSize = 1024 * 1024; // 1MB in bytes
      if (dataSize > maxSize) {
        throw errorHandler.createError(
          'validation/file-too-large',
          'Total data exceeds maximum size. Please reduce the number of photos.'
        );
      }

      const userBooksRef = doc(db, 'users', userId, 'data', 'books');
      
      await setDoc(userBooksRef, {
        books: sanitizedBooks,
        updatedAt: serverTimestamp()
      });
      
      console.log('🔥 Firestore: Save successful!');
      return { success: true };
    } catch (error) {
      errorHandler.logError(error, 'firestoreService.saveBooks', { userId });
      console.error('🔥 Firestore: Save error:', error);
      console.error('🔥 Firestore: Error code:', error.code);
      console.error('🔥 Firestore: Error message:', error.message);
      
      return {
        success: false,
        error: errorHandler.getUserMessage(error)
      };
    }
  },

  // Load all books for a user (with validation)
  async loadBooks(userId) {
    try {
      // Validate userId
      if (!userId || typeof userId !== 'string') {
        throw errorHandler.createError(
          'validation/invalid-input',
          'Invalid user ID'
        );
      }

      console.log('🔥 Firestore: Loading from path:', `users/${userId}/data/books`);
      
      const userBooksRef = doc(db, 'users', userId, 'data', 'books');
      const docSnap = await getDoc(userBooksRef);
      
      if (docSnap.exists()) {
        console.log('🔥 Firestore: Document found!');
        const data = docSnap.data();
        const books = data.books || [];
        
        // Validate loaded data
        if (!Array.isArray(books)) {
          throw errorHandler.createError(
            'validation/invalid-input',
            'Invalid data structure in database'
          );
        }

        console.log('🔥 Firestore: Loaded', books.length, 'books');
        return {
          success: true,
          books: books
        };
      }
      
      console.log('🔥 Firestore: No document found (new user)');
      return {
        success: true,
        books: []
      };
    } catch (error) {
      errorHandler.logError(error, 'firestoreService.loadBooks', { userId });
      console.error('🔥 Firestore: Load error:', error);
      console.error('🔥 Firestore: Error code:', error.code);
      console.error('🔥 Firestore: Error message:', error.message);
      
      return {
        success: false,
        error: errorHandler.getUserMessage(error),
        books: []
      };
    }
  }
};