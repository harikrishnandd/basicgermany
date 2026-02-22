// Simple migration runner for global categories
// Run this script to populate the globalCategories collection

import { migrateGlobalCategories } from './migrateGlobalCategories.js';

console.log('🚀 Starting Global Categories Migration...');
console.log('This will populate the globalCategories collection from your existing data.');
console.log('');

// Ask for confirmation (in a real environment, you might want to add this)
console.log('⚠️  Make sure you have a backup of your Firestore data before proceeding.');
console.log('');

// Run the migration
migrateGlobalCategories()
  .then(() => {
    console.log('');
    console.log('✅ Migration completed successfully!');
    console.log('📊 Your globalCategories collection is now populated.');
    console.log('');
    console.log('Next steps:');
    console.log('1. Check your Firestore dashboard to verify the globalCategories collection');
    console.log('2. Test your admin panel to ensure new items sync correctly');
    console.log('3. Update your frontend components to use the new global categories');
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Check your Firebase configuration in lib/firebase.js');
    console.log('2. Ensure you have proper Firestore permissions');
    console.log('3. Verify your existing collections (appsList, blogArticles, products) exist');
  });
