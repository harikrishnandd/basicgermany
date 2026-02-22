// Migration Script: Refactor GlobalCategory IDs from dash to :: separator
// This script will update existing globalCategories documents from [category]-[type] to [category]::[type]

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzFtAqNBpWiNlEnkThX5F8MOUwxuweyeA",
  authDomain: "basic-germany.firebaseapp.com",
  projectId: "basic-germany",
  storageBucket: "basic-germany.firebasestorage.app",
  messagingSenderId: "1077537204573",
  appId: "1:1077537204573:web:92ef71b9e26c006b4ba0b4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Refactor global category IDs from dash to :: separator
 */
async function refactorGlobalCategoryIds() {
  console.log('🔄 Starting Global Category ID Refactoring...');
  console.log('This will update IDs from [category]-[type] to [category]::[type]');
  console.log('');
  
  try {
    const globalCategoriesRef = collection(db, 'globalCategories');
    const querySnapshot = await getDocs(globalCategoriesRef);
    
    if (!querySnapshot || querySnapshot.empty) {
      console.log('ℹ️  No global categories found to refactor');
      return;
    }
    
    let refactoredCount = 0;
    let skippedCount = 0;
    
    for (const docSnapshot of querySnapshot.docs) {
      const oldId = docSnapshot.id;
      const data = docSnapshot.data();
      
      // Check if this ID uses the old dash pattern
      if (!oldId.includes('::') && oldId.includes('-')) {
        // Extract category and type from old ID
        const parts = oldId.split('-');
        const type = parts[parts.length - 1]; // Last part is the type
        const categorySlug = parts.slice(0, -1).join('-'); // Everything except last part
        
        // Create new ID with :: separator
        const newId = `${categorySlug}::${type}`;
        
        console.log(`  🔄 Refactoring: ${oldId} → ${newId}`);
        
        try {
          // Create new document with new ID
          const newDocRef = doc(db, 'globalCategories', newId);
          await setDoc(newDocRef, data);
          
          // Delete old document
          const oldDocRef = doc(db, 'globalCategories', oldId);
          await deleteDoc(oldDocRef);
          
          console.log(`    ✅ Successfully refactored`);
          refactoredCount++;
          
        } catch (error) {
          console.log(`    ❌ Error refactoring: ${error.message}`);
        }
      } else {
        console.log(`  ⏭️  Skipping: ${oldId} (already uses :: separator or no dash found)`);
        skippedCount++;
      }
    }
    
    console.log('');
    console.log('✅ Refactoring completed!');
    console.log(`📊 Results:`);
    console.log(`   - Refactored: ${refactoredCount} documents`);
    console.log(`   - Skipped: ${skippedCount} documents`);
    console.log(`   - Total processed: ${refactoredCount + skippedCount} documents`);
    
  } catch (error) {
    console.error('❌ Refactoring failed:', error);
  }
}

/**
 * Verify the refactoring was successful
 */
async function verifyRefactoring() {
  console.log('');
  console.log('🔍 Verifying refactoring results...');
  
  try {
    const globalCategoriesRef = collection(db, 'globalCategories');
    const querySnapshot = await getDocs(globalCategoriesRef);
    
    let doubleDashCount = 0;
    let doubleColonCount = 0;
    let otherCount = 0;
    
    for (const docSnapshot of querySnapshot.docs) {
      const id = docSnapshot.id;
      
      if (id.includes('::')) {
        doubleColonCount++;
      } else if (id.includes('-')) {
        doubleDashCount++;
      } else {
        otherCount++;
      }
    }
    
    console.log(`📈 Verification Results:`);
    console.log(`   - IDs with :: separator: ${doubleColonCount}`);
    console.log(`   - IDs with - separator: ${doubleDashCount}`);
    console.log(`   - Other IDs: ${otherCount}`);
    
    if (doubleDashCount === 0) {
      console.log('   ✅ All IDs successfully refactored to use :: separator!');
    } else {
      console.log('   ⚠️  Some IDs still use - separator');
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
  }
}

/**
 * Run refactoring if this script is executed directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  await refactorGlobalCategoryIds();
  await verifyRefactoring();
}

export { refactorGlobalCategoryIds, verifyRefactoring };
