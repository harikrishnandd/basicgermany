// Firebase Configuration
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Primary Firebase config - Basic Germany project
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Secondary Firebase config - Bulletin project
const bulletinConfig = {
  apiKey: process.env.NEXT_PUBLIC_BULLETIN_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_BULLETIN_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_BULLETIN_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_BULLETIN_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_BULLETIN_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_BULLETIN_APP_ID
};

// Initialize Firebase apps with proper guards
let app, bulletinApp, db, bulletinDb;

try {
  // Validate that required environment variables exist
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    throw new Error('Missing required Firebase environment variables for Basic Germany');
  }
  // Initialize primary app
  const existingApps = getApps();
  const primaryApp = existingApps.find(app => app.name === "[DEFAULT]");
  
  if (!primaryApp) {
    app = initializeApp(firebaseConfig);
  } else {
    app = primaryApp;
  }

  // Initialize secondary bulletin app
  if (bulletinConfig.apiKey && bulletinConfig.projectId) {
    const bulletinAppInstance = existingApps.find(app => app.name === "bulletin");
    
    if (!bulletinAppInstance) {
      bulletinApp = initializeApp(bulletinConfig, "bulletin");
    } else {
      bulletinApp = bulletinAppInstance;
    }
  } else {
    console.warn('Bulletin Firebase environment variables not found, bulletin features will be disabled');
  }

  // Get Firestore instances with error handling
  db = getFirestore(app);
  bulletinDb = bulletinApp ? getFirestore(bulletinApp) : null;

} catch (error) {
  console.error('Firebase initialization error:', error);
  // Fallback: initialize only primary app if secondary fails
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
}

export { app, db, bulletinApp, bulletinDb };
