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
      const userBooksRef = doc(db, 'users', userId, 'data', 'books');
      
      await setDoc(userBooksRef, {
        books: books,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Save error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Load all books for a user
  async loadBooks(userId) {
    try {
      const userBooksRef = doc(db, 'users', userId, 'data', 'books');
      const docSnap = await getDoc(userBooksRef);
      
      if (docSnap.exists()) {
        return {
          success: true,
          books: docSnap.data().books || []
        };
      }
      
      return {
        success: true,
        books: []
      };
    } catch (error) {
      console.error('Load error:', error);
      return {
        success: false,
        error: error.message,
        books: []
      };
    }
  }
};
