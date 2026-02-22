// Migration Script: Populate globalCategories from existing data
// Run this once to migrate all existing categories to the new global categories system

import { db } from '../lib/firebase.js';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore.js';
import { upsertGlobalCategory } from '../lib/services/globalCategoriesService.js';

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
  
  for (const docSnapshot of querySnapshot) {
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
  
  const categoryCounts = {};
  
  for (const docSnapshot of querySnapshot) {
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
  
  for (const docSnapshot of querySnapshot) {
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
  
  for (const docSnapshot of querySnapshot) {
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
