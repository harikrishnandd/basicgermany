import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getStorage, ref, getBytes } from 'firebase/storage';

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
const storage = getStorage(app);

async function testGetArticleData(slug) {
  console.log('Testing getArticleData for slug:', slug);
  
  try {
    // Fetch article metadata
    const articlesQuery = query(
      collection(db, 'blogArticles'),
      where('slug', '==', slug),
      where('status', '==', 'published')
    );
    const snapshot = await getDocs(articlesQuery);
    
    console.log('Query results:', snapshot.size, 'documents');
    
    if (snapshot.empty) {
      console.log('No article found');
      return;
    }
    
    const doc = snapshot.docs[0];
    const articleData = { id: doc.id, ...doc.data() };
    
    console.log('Article found:', articleData.title);
    console.log('Storage paths:');
    console.log('  Enhanced:', articleData.storagePathEnhanced);
    console.log('  Original:', articleData.storagePathOriginal);
    
    // Try to fetch content
    try {
      const enhancedRef = ref(storage, articleData.storagePathEnhanced);
      const enhancedBytes = await getBytes(enhancedRef);
      const enhancedContent = new TextDecoder().decode(enhancedBytes);
      console.log('Enhanced content length:', enhancedContent.length);
      
      if (enhancedContent.length < 1000) {
        console.log('Enhanced content too short, would use original');
        const originalRef = ref(storage, articleData.storagePathOriginal);
        const originalBytes = await getBytes(originalRef);
        const originalContent = new TextDecoder().decode(originalBytes);
        console.log('Original content length:', originalContent.length);
      }
    } catch (error) {
      console.error('Error fetching content:', error.message);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testGetArticleData('ultimate-anmeldung-guide-germany').then(() => process.exit(0));
