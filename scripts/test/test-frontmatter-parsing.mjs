// Quick test to verify frontmatter parsing works
import matter from 'gray-matter';

const sampleMarkdown = `---
title: Test Article
author: Test Author
keywords: [test, sample]
affiliateOpportunities: [some data]
improvements:
  ctaPlacement: "Add CTA here"
---

# Actual Article Content

This is the real content that should be visible.
`;

console.log('Testing frontmatter parsing...\n');

const { data, content } = matter(sampleMarkdown);

console.log('Frontmatter (should be hidden from users):');
console.log(JSON.stringify(data, null, 2));

console.log('\n' + '='.repeat(50) + '\n');

console.log('Content (should be visible to users):');
console.log(content);

console.log('\n' + '='.repeat(50) + '\n');

if (content.includes('Actual Article Content')) {
  console.log('✅ SUCCESS: Frontmatter was removed, only content remains');
} else {
  console.log('❌ FAILURE: Content parsing failed');
}

if (!content.includes('affiliateOpportunities')) {
  console.log('✅ SUCCESS: Metadata fields NOT in content');
} else {
  console.log('❌ FAILURE: Metadata leaked into content');
}
