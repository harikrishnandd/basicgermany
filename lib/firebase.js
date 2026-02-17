// Firebase Configuration
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBzFtAqNBpWiNlEnkThX5F8MOUwxuweyeA",
  authDomain: "basic-germany.firebaseapp.com",
  projectId: "basic-germany",
  storageBucket: "basic-germany.firebasestorage.app",
  messagingSenderId: "1077537204573",
  appId: "1:1077537204573:web:92ef71b9e26c006b4ba0b4"
};

// Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app, db };
