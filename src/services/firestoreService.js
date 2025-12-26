import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const firestoreService = {
  // Save all books for a user (including base64 images)
  async saveBooks(userId, books) {
    try {
      console.log('🔥 Firestore: Saving to path:', `users/${userId}/data/books`);
      console.log('🔥 Firestore: Data size:', JSON.stringify(books).length, 'characters');
      
      const userBooksRef = doc(db, 'users', userId, 'data', 'books');
      
      await setDoc(userBooksRef, {
        books: books,
        updatedAt: serverTimestamp()
      });
      
      console.log('🔥 Firestore: Save successful!');
      return { success: true };
    } catch (error) {
      console.error('🔥 Firestore: Save error:', error);
      console.error('🔥 Firestore: Error code:', error.code);
      console.error('🔥 Firestore: Error message:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Load all books for a user
  async loadBooks(userId) {
    try {
      console.log('🔥 Firestore: Loading from path:', `users/${userId}/data/books`);
      
      const userBooksRef = doc(db, 'users', userId, 'data', 'books');
      const docSnap = await getDoc(userBooksRef);
      
      if (docSnap.exists()) {
        console.log('🔥 Firestore: Document found!');
        const data = docSnap.data();
        console.log('🔥 Firestore: Loaded', data.books?.length || 0, 'books');
        return {
          success: true,
          books: data.books || []
        };
      }
      
      console.log('🔥 Firestore: No document found (new user)');
      return {
        success: true,
        books: []
      };
    } catch (error) {
      console.error('🔥 Firestore: Load error:', error);
      console.error('🔥 Firestore: Error code:', error.code);
      console.error('🔥 Firestore: Error message:', error.message);
      return {
        success: false,
        error: error.message,
        books: []
      };
    }
  }
};