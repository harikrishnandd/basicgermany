# Firebase Configuration

This directory contains all Firebase-related configuration files.

## Files

- **`firestore.rules`** - Firestore security rules
- **`firestore.indexes.json`** - Firestore database indexes
- **`storage.rules`** - Firebase Storage security rules
- **`cors.json`** - CORS configuration for Firebase Storage
- **`storage-cors.json`** - Additional storage CORS settings

## Deployment

These files are referenced in `firebase.json` and deployed via:

```bash
# Deploy all Firebase resources
firebase deploy

# Deploy specific resources
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

## CORS Configuration

To apply CORS settings to Firebase Storage:

```bash
gsutil cors set firebase/cors.json gs://your-bucket-name
gsutil cors set firebase/storage-cors.json gs://your-bucket-name
```
