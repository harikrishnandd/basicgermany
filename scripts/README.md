# Scripts Directory

This directory contains utility scripts for debugging, testing, and verification.

## Structure

```
scripts/
├── debug/          # Debug scripts for troubleshooting
│   ├── debug-article.mjs
│   └── debug-storage.mjs
├── test/           # Test scripts for validation
│   ├── test-frontmatter-parsing.mjs
│   └── test-get-article.mjs
└── verify/         # Verification scripts for data integrity
    ├── verify-collections.mjs
    └── verify-metadata-hidden.js
```

## Usage

Run scripts from the project root:

```bash
# Debug scripts
node scripts/debug/debug-article.mjs
node scripts/debug/debug-storage.mjs

# Test scripts
node scripts/test/test-frontmatter-parsing.mjs
node scripts/test/test-get-article.mjs

# Verify scripts
node scripts/verify/verify-collections.mjs
node scripts/verify/verify-metadata-hidden.js
```
