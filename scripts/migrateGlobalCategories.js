// Migration Script: Populate globalCategories from existing data
// Run this once to migrate all existing categories to the new global categories system

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

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

// Inline upsert function to avoid import issues
async function upsertGlobalCategory(categoryName, type, countChange = 1) {
  try {
    // Generate slug and ID with :: separator
    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const id = `${slug}::${type}`;
    
    const docRef = doc(db, 'globalCategories', id);
    const docSnapshot = await getDoc(docRef);
    
    if (docSnapshot.exists()) {
      // Update existing category
      await updateDoc(docRef, {
        count: increment(countChange),
        lastUpdated: new Date()
      });
    } else {
      // Create new category
      await setDoc(docRef, {
        categoryName,
        type,
        slug,
        count: Math.max(0, countChange),
        lastUpdated: new Date()
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error upserting global category:', error);
    return false;
  }
}

/**
 * Migration function to populate globalCategories from existing data
 */
async function migrateGlobalCategories() {
  console.log('🚀 Starting global categories migration...');
  
  try {
    // 1. Migrate from appsList collection
    console.log('📱 Migrating apps categories...');
    await migrateAppsCategories();
    
    // 2. Migrate from blogArticles collection  
    console.log('📝 Migrating knowledge categories...');
    await migrateKnowledgeCategories();
    
    // 3. Migrate from products collection
    console.log('🛍️ Migrating product categories...');
    await migrateProductCategories();
    
    // 4. Migrate templates (if they exist in products)
    console.log('📋 Migrating template categories...');
    await migrateTemplateCategories();
    
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

/**
 * Migrate categories from appsList collection
 */
async function migrateAppsCategories() {
  const appsListRef = collection(db, 'appsList');
  const querySnapshot = await getDocs(appsListRef);
  
  if (!querySnapshot || querySnapshot.empty) {
    console.log('  ℹ️  No apps found in appsList collection');
    return;
  }
  
  for (const docSnapshot of querySnapshot.docs) {
    const data = docSnapshot.data();
    const categoryName = data.name || docSnapshot.id;
    const apps = data.apps || [];
    
    if (apps.length > 0) {
      await upsertGlobalCategory(categoryName, 'apps', apps.length);
      console.log(`  ✓ Migrated "${categoryName}" with ${apps.length} apps`);
    }
  }
}

/**
 * Migrate categories from blogArticles collection
 */
async function migrateKnowledgeCategories() {
  const blogArticlesRef = collection(db, 'blogArticles');
  const querySnapshot = await getDocs(blogArticlesRef);
  
  if (!querySnapshot || querySnapshot.empty) {
    console.log('  ℹ️  No articles found in blogArticles collection');
    return;
  }
  
  const categoryCounts = {};
  
  for (const docSnapshot of querySnapshot.docs) {
    const data = docSnapshot.data();
    const category = data.category || 'General';
    
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  }
  
  for (const [categoryName, count] of Object.entries(categoryCounts)) {
    await upsertGlobalCategory(categoryName, 'knowledge', count);
    console.log(`  ✓ Migrated "${categoryName}" with ${count} articles`);
  }
}

/**
 * Migrate categories from products collection
 */
async function migrateProductCategories() {
  const productsRef = collection(db, 'products');
  const querySnapshot = await getDocs(productsRef);
  
  if (!querySnapshot || querySnapshot.empty) {
    console.log('  ℹ️  No products found in products collection');
    return;
  }
  
  for (const docSnapshot of querySnapshot.docs) {
    const data = docSnapshot.data();
    const categoryName = data.name || docSnapshot.id;
    
    // Find the items array (could be named various things)
    let items = [];
    if (data.items && Array.isArray(data.items)) {
      items = data.items;
    } else if (data[docSnapshot.id] && Array.isArray(data[docSnapshot.id])) {
      items = data[docSnapshot.id];
    } else {
      // Look for any array in the document
      const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
      if (arrayKey) {
        items = data[arrayKey];
      }
    }
    
    if (items.length > 0) {
      await upsertGlobalCategory(categoryName, 'products', items.length);
      console.log(`  ✓ Migrated "${categoryName}" with ${items.length} products`);
    }
  }
}

/**
 * Migrate template categories from products collection (template sections)
 */
async function migrateTemplateCategories() {
  const productsRef = collection(db, 'products');
  const querySnapshot = await getDocs(productsRef);
  
  if (!querySnapshot || querySnapshot.empty) {
    console.log('  ℹ️  No templates found in products collection');
    return;
  }
  
  for (const docSnapshot of querySnapshot.docs) {
    const data = docSnapshot.data();
    const categoryName = data.name || docSnapshot.id;
    
    // Check if this is a template section (has template array)
    let templateItems = [];
    if (data.template && Array.isArray(data.template)) {
      templateItems = data.template;
    }
    
    if (templateItems.length > 0) {
      await upsertGlobalCategory(categoryName, 'templates', templateItems.length);
      console.log(`  ✓ Migrated "${categoryName}" with ${templateItems.length} templates`);
    }
  }
}

/**
 * Run migration if this script is executed directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateGlobalCategories();
}

export { migrateGlobalCategories };

/*
FIRESTORE RULES UPDATE NEEDED:

Add this rule to your Firestore security rules to allow writing to globalCategories:

rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Blog articles - allow read to everyone, write from admin
    // Note: In production, implement proper Firebase Auth for admin access
    match /blogArticles/{articleId} {
      allow read: if true;
      allow write: if true; // WARNING: Change this to use Firebase Auth in production
    }
    
    // Blog articles with snake_case naming
    match /blog_articles/{articleId} {
      allow read: if true;
      allow write: if true; // WARNING: Change this to use Firebase Auth in production
    }
    
    // Banners collection - allow read to everyone, write from admin
    match /banners/{bannerId} {
      allow read: if true;
      allow write: if true; // WARNING: Change this to use Firebase Auth in production
    }
    
    // Global Categories collection - allow read to everyone, write from admin
    match /globalCategories/{categoryId} {
      allow read: if true;
      allow write: if true; // WARNING: Change this to use Firebase Auth in production
    }
    
    // Allow read access to everything else
    match /{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
*/
