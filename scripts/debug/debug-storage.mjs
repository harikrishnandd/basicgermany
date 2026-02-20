import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, getBytes } from 'firebase/storage';

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
const storage = getStorage(app);

async function checkStorage() {
  try {
    // Check both files
    const files = [
      'blog-content/ultimate-anmeldung-guide-germany-enhanced.md',
      'blog-content/ultimate-anmeldung-guide-germany.md'
    ];
    
    for (const filePath of files) {
      console.log('\n========================================');
      console.log('Checking file:', filePath);
      console.log('========================================');
      
      try {
        const fileRef = ref(storage, filePath);
        
        // Try to get download URL
        const url = await getDownloadURL(fileRef);
        console.log('✓ File exists');
        
        // Try to download content
        const bytes = await getBytes(fileRef);
        const content = new TextDecoder().decode(bytes);
        console.log('Content length:', content.length, 'characters');
        console.log('\nFirst 800 characters:');
        console.log(content.substring(0, 800));
        console.log('\n... (truncated)');
      } catch (err) {
        console.log('✗ File not found:', err.code);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.code, error.message);
  }
  process.exit(0);
}

checkStorage();
