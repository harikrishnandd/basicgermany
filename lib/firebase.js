// Firebase Configuration
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Primary Firebase config - Basic Germany project
const firebaseConfig = {
  apiKey: "AIzaSyBzFtAqNBpWiNlEnkThX5F8MOUwxuweyeA",
  authDomain: "basic-germany.firebaseapp.com",
  projectId: "basic-germany",
  storageBucket: "basic-germany.firebasestorage.app",
  messagingSenderId: "1077537204573",
  appId: "1:1077537204573:web:92ef71b9e26c006b4ba0b4",
  measurementId: "G-7DES80ZZ21"
};

// Secondary Firebase config - Bulletin project
const bulletinConfig = {
  apiKey: "AIzaSyDvCoF0ARLMwWDfdblVaOdw-WbhdjSvV3U",
  authDomain: "bullettin-hzqbvq.firebaseapp.com",
  projectId: "bullettin-hzqbvq",
  storageBucket: "bullettin-hzqbvq.appspot.com",
  messagingSenderId: "664060285424",
  appId: "1:664060285424:web:e830794f34844fb8ee0d35"
};

// Initialize Firebase apps with proper guards
let app, bulletinApp, db, bulletinDb;

try {
  // Initialize primary app
  const existingApps = getApps();
  const primaryApp = existingApps.find(app => app.name === "[DEFAULT]");
  
  if (!primaryApp) {
    app = initializeApp(firebaseConfig);
  } else {
    app = primaryApp;
  }

  // Initialize secondary bulletin app
  const bulletinAppInstance = existingApps.find(app => app.name === "bulletin");
  
  if (!bulletinAppInstance) {
    bulletinApp = initializeApp(bulletinConfig, "bulletin");
  } else {
    bulletinApp = bulletinAppInstance;
  }

  // Get Firestore instances with error handling
  db = getFirestore(app);
  bulletinDb = getFirestore(bulletinApp);

} catch (error) {
  console.error('Firebase initialization error:', error);
  // Fallback: initialize only primary app if secondary fails
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
}

export { app, db, bulletinApp, bulletinDb };
