export function generateAppSchema(app) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    applicationCategory: app.category,
    description: app.description || app.tagline,
    operatingSystem: ['Android', 'iOS'],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR'
    },
    aggregateRating: app.rating ? {
      '@type': 'AggregateRating',
      ratingValue: app.rating,
      ratingCount: app.ratingCount || 1
    } : undefined,
    url: `https://basicgermany.com/apps/${app.id}`,
    image: app.icon || 'https://basicgermany.com/default-app-icon.png',
    applicationSubCategory: app.subcategory,
    releaseNotes: app.updates,
    downloadUrl: app.downloadUrl,
    author: {
      '@type': 'Organization',
      name: app.developer || app.name
    }
  };
}
