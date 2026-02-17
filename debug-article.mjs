import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDAkkYfuVjNFPZzmF5YoxGx9zY5RNGK1Ck",
  authDomain: "basic-germany.firebaseapp.com",
  projectId: "basic-germany",
  storageBucket: "basic-germany.firebasestorage.app",
  messagingSenderId: "467024802844",
  appId: "1:467024802844:web:37f87e86c0b8a50699aae9",
  measurementId: "G-9MV3JEX382"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkArticle() {
  try {
    const q = query(
      collection(db, 'blogArticles'),
      where('slug', '==', 'ultimate-anmeldung-guide-germany')
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('No article found with that slug');
      return;
    }
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log('Article found:');
      console.log('ID:', doc.id);
      console.log('Title:', data.title);
      console.log('Status:', data.status);
      console.log('storagePathEnhanced:', data.storagePathEnhanced);
      console.log('storagePathOriginal:', data.storagePathOriginal);
      console.log('\nAll fields:', Object.keys(data));
    });
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

checkArticle();
