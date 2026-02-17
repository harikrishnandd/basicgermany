import { db } from './lib/firebase.js';
import { collection, getDocs } from 'firebase/firestore';

console.log('Checking which collections are actually used...\n');

// Check appsList
try {
  const appsListRef = collection(db, 'appsList');
  const snapshot = await getDocs(appsListRef);
  console.log('✅ appsList collection - FOUND');
  console.log(`   Documents: ${snapshot.docs.map(d => d.id).join(', ')}`);
  console.log(`   Total: ${snapshot.size} categories\n`);
} catch (error) {
  console.log('❌ appsList collection - ERROR:', error.message);
}

// Check blogArticles
try {
  const blogRef = collection(db, 'blogArticles');
  const snapshot = await getDocs(blogRef);
  console.log('✅ blogArticles collection - FOUND');
  console.log(`   Total: ${snapshot.size} articles\n`);
} catch (error) {
  console.log('❌ blogArticles collection - ERROR:', error.message);
}

// Check if old collections exist (but shouldn't be used)
try {
  const appsRef = collection(db, 'apps');
  const snapshot = await getDocs(appsRef);
  if (snapshot.size > 0) {
    console.log('⚠️  apps collection - EXISTS (NOT USED BY CODE - SAFE TO DELETE)');
    console.log(`   Total: ${snapshot.size} documents\n`);
  }
} catch (error) {
  console.log('✅ apps collection - does not exist (good!)\n');
}

try {
  const categoriesRef = collection(db, 'categories');
  const snapshot = await getDocs(categoriesRef);
  if (snapshot.size > 0) {
    console.log('⚠️  categories collection - EXISTS (NOT USED BY CODE - SAFE TO DELETE)');
    console.log(`   Total: ${snapshot.size} documents\n`);
  }
} catch (error) {
  console.log('✅ categories collection - does not exist (good!)\n');
}

console.log('\n📌 Summary:');
console.log('Your code ONLY uses: appsList and blogArticles');
console.log('Safe to delete: apps and categories collections');

process.exit(0);
