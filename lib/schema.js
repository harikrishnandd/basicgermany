/**
 * Sanitize text for JSON-LD (remove or escape special characters)
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeForJSON(text) {
  if (!text) return '';
  return text
    .replace(/"/g, '\\"')  // Escape quotes
    .replace(/\n/g, ' ')   // Remove newlines
    .replace(/\r/g, '')    // Remove carriage returns
    .replace(/\t/g, ' ')   // Remove tabs
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim();
}

/**
 * Generate Article schema markup for SEO
 */
export function generateArticleSchema(article, url) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": sanitizeForJSON(article.title),
    "description": sanitizeForJSON(article.metaDescription || article.excerpt),
    "image": article.featuredImage || "https://basicgermany.com/images/default-og-image.jpg",
    "datePublished": article.datePublished || article.dateCreated,
    "dateModified": article.dateUpdated || article.datePublished || article.dateCreated,
    "author": {
      "@type": "Organization",
      "name": article.author || "BasicGermany Team",
      "url": "https://basicgermany.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "BasicGermany",
      "logo": {
        "@type": "ImageObject",
        "url": "https://basicgermany.com/site-icon.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": article.category || "Blog"
  };

  // Add optional fields if available
  if (article.keywords && article.keywords.length > 0) {
    schema.keywords = article.keywords.join(", ");
  }
  
  if (article.wordCount) {
    schema.wordCount = article.wordCount;
  }
  
  if (article.readingTime) {
    schema.timeRequired = article.readingTime;
  }

  return schema;
}

/**
 * Generate FAQPage schema from FAQ data
 */
export function generateFAQSchema(faqs) {
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
 * Generate HowTo schema from article content
 */
export function generateHowToSchema(article, url) {
  // If custom schema is already in article data, use it
  if (article.schemaMarkup && article.schemaMarkup["@type"] === "HowTo") {
    return article.schemaMarkup;
  }
  
  // Check if this is a how-to guide
  const isHowTo = article.title?.toLowerCase().includes('how to') || 
                  article.title?.toLowerCase().includes('guide') ||
                  article.category === "Bureaucracy";
  
  if (!isHowTo) return null;
  
  // Generate HowTo schema for guide-type articles
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": sanitizeForJSON(article.title),
    "description": sanitizeForJSON(article.metaDescription || article.excerpt),
    "image": article.featuredImage || "https://basicgermany.com/images/default-og-image.jpg",
    "totalTime": article.totalTime || "PT1H",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "EUR",
      "value": "10"
    },
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Valid passport or ID"
      },
      {
        "@type": "HowToTool",
        "name": "Registration form (Anmeldeformular)"
      },
      {
        "@type": "HowToTool",
        "name": "Landlord confirmation (Wohnungsgeberbestätigung)"
      }
    ],
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Find Your Local Bürgeramt",
        "text": "Locate the nearest registration office by entering your postal code or city name on the official website."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Make an Appointment",
        "text": "Book your appointment online or by phone. Do this as soon as possible after moving, as waiting times can be long."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Gather Required Documents",
        "text": "Prepare your passport, registration form, landlord confirmation, and any additional documents like marriage or birth certificates."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Attend Your Appointment",
        "text": "Visit the registration office with all documents and payment (usually around €10). You'll receive your Meldebescheinigung on the spot."
      }
    ]
  };
}

/**
 * Generate Breadcrumb schema with enhanced SEO signals
 * Breadcrumbs are one of the highest ranking signals for Knowledge sites
 */
export function generateBreadcrumbSchema(category, slug, title) {
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
  
  // Add category breadcrumb if exists
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
  
  // Add current article (position adjusts based on whether category exists)
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
 * Generate Organization schema for the website
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BasicGermany",
    "url": "https://basicgermany.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://basicgermany.com/site-icon.png"
    },
    "sameAs": [
      // Add social media profiles when available
      // "https://twitter.com/basicgermany",
      // "https://facebook.com/basicgermany",
      // "https://linkedin.com/company/basicgermany"
    ],
    "description": "Your trusted guide to navigating life in Germany, from bureaucracy to lifestyle tips."
  };
}
