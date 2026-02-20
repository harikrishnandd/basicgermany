# Migration Cleanup Instructions

After successfully migrating banners to Firestore, follow these steps to clean up:

## 1. Remove Migration Component Import

**File:** `/app/admin/products/banner/page.js`

Remove this line:
```javascript
import MigrateBanners from '../../../../components/admin/MigrateBanners';
```

## 2. Remove Migration Component Usage

In the same file, find this section and remove the `<MigrateBanners />` line:

```javascript
) : banners.length === 0 ? (
  <>
    <EmptyState
      icon="view_carousel"
      title="No banners yet"
      description="Migrate existing hardcoded banners or create your first banner manually"
      action={{
        label: 'Add New Banner',
        onClick: handleAddNew
      }}
    />
    <MigrateBanners onComplete={handleMigrationComplete} />  // ← REMOVE THIS LINE
  </>
```

Change the description back to:
```javascript
description="Create your first banner to display on the Products page carousel"
```

## 3. Remove Migration Handler

Remove this function:
```javascript
const handleMigrationComplete = async (results) => {
  await loadBanners();
};
```

## 4. Delete Migration Component File

Delete the file:
```
/components/admin/MigrateBanners.js
```

## 5. Optional: Delete Static Data File

If you no longer need the hardcoded data, you can delete:
```
/data/carouselData.ts
```

## 6. Rebuild and Deploy

```bash
npm run build
git add -A
git commit -m "Remove migration utility after successful data migration"
git push origin main
```

---

**Note:** Only perform these cleanup steps AFTER confirming that:
- ✅ All 3 banners are successfully migrated to Firestore
- ✅ Banners appear correctly in admin panel
- ✅ Carousel displays properly on /products page
- ✅ You can edit/delete banners without issues
