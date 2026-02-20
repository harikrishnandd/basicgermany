# Documentation

This directory contains project documentation and configuration templates.

## Files

- **`MIGRATION_CLEANUP.md`** - Instructions for cleaning up after banner data migration
- **`.env.local.example`** - Environment variables template for local development

## Environment Setup

To set up your local environment:

1. Copy the example file:
   ```bash
   cp docs/.env.local.example .env.local
   ```

2. Fill in your actual values in `.env.local`

3. Never commit `.env.local` to version control (it's gitignored)
