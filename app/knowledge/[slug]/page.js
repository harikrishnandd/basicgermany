// Server component wrapper (no 'use client')
import ArticlePageClient from './ArticlePageClient';
import { getArticleSlugs, getArticleData, getRelatedArticlesData } from './utils';
import { getRecommendedAppsForArticle } from '@/lib/services/relatedContentService';
import JsonLd from '@/components/SEO/JsonLd';

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
    return <ArticlePageClient article={null} content="" relatedArticles={[]} recommendedApps={[]} />;
  }

  const { article, content } = await getArticleData(params.slug);

  // Fetch related content if article exists
  let relatedArticles = [];
  let recommendedApps = [];
  if (article) {
    [relatedArticles, recommendedApps] = await Promise.all([
      getRelatedArticlesData(article.id, article.category, 3),
      getRecommendedAppsForArticle(article.category, 3)
    ]);
  }

  // Automated SEO: Generate all schema markup using reusable JsonLd component
  // Note: FAQ schema is now generated within FAQSection component for better encapsulation
  return (
    <>
      {/* Automated JSON-LD Schema for SEO */}
      {article && (
        <>
          <JsonLd type="article" data={article} />
          <JsonLd type="breadcrumb" data={{ category: article.category, slug: article.slug, title: article.title }} />
          <JsonLd type="howto" data={article} />
          <JsonLd type="organization" data={{}} />
        </>
      )}

      <ArticlePageClient article={article} content={content} relatedArticles={relatedArticles} recommendedApps={recommendedApps} />
    </>
  );
}
