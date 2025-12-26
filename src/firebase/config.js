// Firebase configuration - Authentication + Firestore only (no Storage)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCwvJdpSaOQmCp8JV313H15gBv4Ui4DFH8",
  authDomain: "memory-books.firebaseapp.com",
  projectId: "memory-books",
  storageBucket: "memory-books.firebasestorage.app",
  messagingSenderId: "911810030426",
  appId: "1:911810030426:web:9c41af885e76409d8fe163"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services (Authentication + Firestore only)
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;