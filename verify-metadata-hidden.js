// Metadata Leak Detection Script
// Run this in browser console on article page to verify no metadata is visible

console.log('🔍 Checking for metadata leaks...\n');

const bodyText = document.body.innerText.toLowerCase();
const bodyHTML = document.body.innerHTML.toLowerCase();

const hiddenFields = [
  { name: 'affiliateOpportunities', pattern: 'affiliateopportunities' },
  { name: 'internalLinkSuggestions', pattern: 'internallinksuggestions' },
  { name: 'schemaMarkup', pattern: 'schemamarkup' },
  { name: 'improvements', pattern: 'improvements:', exact: true },
  { name: 'contentImprovements', pattern: 'contentimprovements' },
  { name: 'ctaPlacement', pattern: 'ctaplacement:' },
  { name: 'metaDescription', pattern: 'metadescription:' },
  { name: 'socialDescription', pattern: 'socialdescription:' },
  { name: 'SEO Metadata section', pattern: 'seo metadata' },
  { name: 'Article Metadata section', pattern: 'article metadata' },
  { name: 'Schema Markup section', pattern: 'schema markup:' },
  { name: 'Affiliate & Internal Linking', pattern: 'affiliate & internal linking' },
  { name: 'Content Improvement section', pattern: 'content improvement:' },
  { name: 'keywords array', pattern: 'keywords:' },
  { name: 'slug field', pattern: 'slug:' },
  { name: 'status field visible', pattern: 'status: published' }
];

let leakCount = 0;

hiddenFields.forEach(field => {
  const checkText = field.exact ? bodyText : bodyText;
  if (checkText.includes(field.pattern) || bodyHTML.includes(field.pattern)) {
    console.error(`❌ LEAKED: "${field.name}" found on page!`);
    leakCount++;
  } else {
    console.log(`✅ SAFE: "${field.name}" is properly hidden`);
  }
});

console.log('\n' + '='.repeat(50));

if (leakCount === 0) {
  console.log('✅ SUCCESS: All metadata is properly hidden!');
  console.log('🎉 No sensitive fields are visible to users.');
} else {
  console.error(`❌ FAILURE: ${leakCount} metadata field(s) leaked!`);
  console.error('⚠️  Fix required: Some sensitive data is visible.');
}

console.log('='.repeat(50));

// Check what IS visible (should only be public data)
console.log('\n📋 Expected public fields (should be visible):');
const publicFields = [
  { name: 'Article title', check: () => document.querySelector('h1') !== null },
  { name: 'Author name', check: () => bodyText.includes('basicgermany team') || bodyText.includes('author') },
  { name: 'Publication date', check: () => document.querySelector('time') !== null },
  { name: 'Reading time', check: () => bodyText.includes('min read') },
  { name: 'Category badge', check: () => bodyText.includes('category') || document.querySelector('.article-category-badge') !== null }
];

publicFields.forEach(field => {
  const isVisible = field.check();
  if (isVisible) {
    console.log(`  ✅ ${field.name}: Visible (correct)`);
  } else {
    console.warn(`  ⚠️  ${field.name}: Not found (might be missing)`);
  }
});

console.log('\n📝 Note: Schema markup in <head> is OK (hidden from users but present for SEO)');

