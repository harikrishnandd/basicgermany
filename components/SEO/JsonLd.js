/**
 * Reusable JSON-LD Component for Structured Data
 * Automatically generates Article and BreadcrumbList schema for SEO
 * Optimized for Google, Gemini, ChatGPT, and other AI crawlers
 */
export default function JsonLd({ type, data }) {
  let schema = null;

  switch (type) {
    case 'article':
      schema = generateArticleSchema(data);
      break;
    case 'breadcrumb':
      schema = generateBreadcrumbSchema(data);
      break;
    case 'faq':
      schema = generateFAQSchema(data);
      break;
    case 'howto':
      schema = generateHowToSchema(data);
      break;
    case 'organization':
      schema = generateOrganizationSchema();
      break;
    default:
      return null;
  }

  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Generate Article schema with proper ISO date formatting
 */
function generateArticleSchema(data) {
  const {
    title,
    metaDescription,
    excerpt,
    featuredImage,
    datePublished,
    dateModified,
    dateCreated,
    author,
    category,
    keywords,
    wordCount,
    readingTime,
    slug,
  } = data;

  // Ensure dates are properly formatted ISO strings for AI freshness detection
  const publishedDate = formatISODate(datePublished || dateCreated);
  const modifiedDate = formatISODate(dateModified || datePublished || dateCreated);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": sanitizeForJSON(title),
    "description": sanitizeForJSON(metaDescription || excerpt),
    "image": featuredImage || "https://basicgermany.com/images/default-og-image.jpg",
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
    "author": {
      "@type": "Organization",
      "name": author || "BasicGermany Team",
      "url": "https://basicgermany.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BasicGermany",
      "logo": {
        "@type": "ImageObject",
        "url": "https://basicgermany.com/site-icon.png",
        "width": 512,
        "height": 512
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://basicgermany.com/knowledge/${slug}`
    },
    "articleSection": category || "Germany Guides",
    "keywords": keywords?.join(", ") || "",
    "wordCount": wordCount || 0,
    "timeRequired": readingTime || "5 min read",
    "inLanguage": "en-US",
    "isAccessibleForFree": true
  };
}

/**
 * Generate BreadcrumbList schema with full hierarchy
 */
function generateBreadcrumbSchema(data) {
  const { category, slug, title } = data;

  const items = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": {
        "@type": "WebPage",
        "@id": "https://basicgermany.com",
        "url": "https://basicgermany.com",
        "name": "BasicGermany - Your Guide to Germany"
      }
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Knowledge Base",
      "item": {
        "@type": "CollectionPage",
        "@id": "https://basicgermany.com/knowledge",
        "url": "https://basicgermany.com/knowledge",
        "name": "Germany Knowledge Base - Guides & Resources"
      }
    }
  ];

  if (category) {
    items.push({
      "@type": "ListItem",
      "position": 3,
      "name": sanitizeForJSON(category),
      "item": {
        "@type": "CollectionPage",
        "@id": `https://basicgermany.com/knowledge?category=${encodeURIComponent(category)}`,
        "url": `https://basicgermany.com/knowledge?category=${encodeURIComponent(category)}`,
        "name": `${sanitizeForJSON(category)} - Germany Guides`
      }
    });
  }

  items.push({
    "@type": "ListItem",
    "position": items.length + 1,
    "name": sanitizeForJSON(title),
    "item": {
      "@type": "Article",
      "@id": `https://basicgermany.com/knowledge/${slug}`,
      "url": `https://basicgermany.com/knowledge/${slug}`,
      "name": sanitizeForJSON(title)
    }
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "numberOfItems": items.length,
    "itemListElement": items
  };
}

/**
 * Generate FAQ schema
 */
function generateFAQSchema(data) {
  const { faqs } = data;
  
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": sanitizeForJSON(faq.question),
      "acceptedAnswer": {
        "@type": "Answer",
        "text": sanitizeForJSON(faq.answer)
      }
    }))
  };
}

/**
 * Generate HowTo schema
 */
function generateHowToSchema(data) {
  const { title, metaDescription, slug, category } = data;

  const isHowTo = title?.toLowerCase().includes('how to') || 
                  title?.toLowerCase().includes('guide') ||
                  category === "Bureaucracy";

  if (!isHowTo) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": sanitizeForJSON(title),
    "description": sanitizeForJSON(metaDescription),
    "url": `https://basicgermany.com/knowledge/${slug}`,
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Read the complete guide",
        "text": sanitizeForJSON(metaDescription)
      }
    ]
  };
}

/**
 * Generate Organization schema
 */
function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BasicGermany",
    "url": "https://basicgermany.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://basicgermany.com/site-icon.png",
      "width": 512,
      "height": 512
    },
    "sameAs": [
      "https://github.com/basicgermany"
    ],
    "description": "Your comprehensive guide to living, working, and thriving in Germany"
  };
}

/**
 * Sanitize text for JSON-LD
 */
function sanitizeForJSON(text) {
  if (!text) return '';
  return text
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Format date to ISO 8601 string for AI freshness detection
 */
function formatISODate(date) {
  if (!date) return new Date().toISOString();
  
  // Handle Firestore Timestamp
  if (date?.toDate) {
    return date.toDate().toISOString();
  }
  
  // Handle string or Date object
  try {
    return new Date(date).toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}
