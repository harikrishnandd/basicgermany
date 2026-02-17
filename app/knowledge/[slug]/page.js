// Server component wrapper (no 'use client')
import ArticlePageClient from './ArticlePageClient';
import { getArticleSlugs, getArticleData, getRelatedArticlesData } from './utils';
import { generateArticleSchema, generateFAQSchema, generateHowToSchema, generateBreadcrumbSchema, generateOrganizationSchema } from '@/lib/schema';

// Allow dynamic generation for new/updated articles
export const dynamicParams = true;

// Revalidate every hour as a safety net (on-demand revalidation is primary)
export const revalidate = 3600;

// Generate metadata for each article page
export async function generateMetadata(props) {
  const params = await Promise.resolve(props.params);

  if (!params?.slug || params.slug === 'placeholder-article') {
    return {
      title: 'Article Not Found | BasicGermany',
      description: 'The requested article could not be found.'
    };
  }

  const { article } = await getArticleData(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found | BasicGermany',
      description: 'The requested article could not be found.'
    };
  }

  const url = `https://basicgermany.com/knowledge/${article.slug}`;
  const imageUrl = article.featuredImage || 'https://basicgermany.com/images/default-og-image.jpg';

  return {
    title: `${article.title} | BasicGermany`,
    description: article.metaDescription || article.excerpt,
    keywords: article.keywords?.join(', '),
    authors: [{ name: article.author || 'BasicGermany Team' }],
    openGraph: {
      type: 'article',
      url: url,
      title: article.title,
      description: article.socialDescription || article.metaDescription || article.excerpt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ],
      siteName: 'BasicGermany',
      publishedTime: article.datePublished,
      modifiedTime: article.dateUpdated || article.datePublished,
      authors: [article.author || 'BasicGermany Team'],
      section: article.category,
      tags: article.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.socialDescription || article.metaDescription || article.excerpt,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    other: {
      'revisit-after': '7 days',
      'language': 'English',
    }
  };
}

export async function generateStaticParams() {
  const slugs = await getArticleSlugs();

  // If no articles exist yet, return a placeholder to allow build to succeed
  // This placeholder won't be accessible since it doesn't exist in Firebase
  if (slugs.length === 0) {
    return [{ slug: 'placeholder-article' }];
  }

  return slugs;
}

export default async function ArticlePage(props) {
  // In Next.js 15+, params might be a promise that needs to be awaited
  const params = await Promise.resolve(props.params);

  // Handle case where slug might be undefined or placeholder
  if (!params?.slug || params.slug === 'placeholder-article') {
    return <ArticlePageClient article={null} content="" relatedArticles={[]} />;
  }

  const { article, content } = await getArticleData(params.slug);

  // Fetch related articles if article exists
  let relatedArticles = [];
  if (article) {
    relatedArticles = await getRelatedArticlesData(article.id, article.category, 3);
  }

  // Generate schema markup for SEO
  const url = `https://basicgermany.com/knowledge/${article?.slug || params.slug}`;
  const articleSchema = article ? generateArticleSchema(article, url) : null;
  const faqSchema = article?.faqs ? generateFAQSchema(article.faqs) : null;
  const howToSchema = article ? generateHowToSchema(article, url) : null;
  const breadcrumbSchema = article ? generateBreadcrumbSchema(article.category, article.slug, article.title) : null;
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      {/* Schema Markup for SEO */}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {organizationSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      )}

      <ArticlePageClient article={article} content={content} relatedArticles={relatedArticles} />
    </>
  );
}
