'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { marked } from 'marked';
import AuthorBio from '@/components/AuthorBio';
import OfficialResources from '@/components/OfficialResources';
import SocialShare from '@/components/SocialShare';
import Sidebar from '@/components/sidebar';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQSection from '@/components/Article/FAQSection';
import { getCategories } from '@/lib/firestore';
import '../../../app/blog-article.css';

// Slugify function to create URL-friendly IDs from heading text
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
}

export default function ArticlePageClient({ article: initialArticle, content: initialContent, relatedArticles: initialRelatedArticles }) {
  // Whitelist: Extract ONLY public fields that should be visible to users
  // Everything else (SEO metadata, affiliate, improvements, etc.) is hidden
  const extractPublicData = (articleData) => {
    if (!articleData) return null;
    
    return {
      title: articleData.title || 'Untitled',
      author: articleData.author || 'BasicGermany Team',
      datePublished: articleData.datePublished,
      dateUpdated: articleData.dateUpdated,
      dateCreated: articleData.dateCreated,
      readingTime: articleData.readingTime || '5 min read',
      category: articleData.category || 'General',
      faqs: articleData.faqs || null,
      // Hidden fields (not included):
      // - keywords, metaDescription, slug, schemaMarkup
      // - affiliateOpportunities, internalLinkSuggestions
      // - improvements, excerpt, socialDescription, status
    };
  };

  const [publicData, setPublicData] = useState(extractPublicData(initialArticle));
  const [content, setContent] = useState(initialContent);
  const [relatedArticles, setRelatedArticles] = useState(initialRelatedArticles || []);
  const [loading, setLoading] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [appCategories, setAppCategories] = useState([]);
  const [tocItems, setTocItems] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [collapsedSections, setCollapsedSections] = useState(new Set());
  const contentRef = useRef(null);
  const tocInitialized = useRef(false);

  // Keep schema markup for SEO (hidden from users, in <head> only)
  const seoData = initialArticle ? {
    title: initialArticle.title,
    metaDescription: initialArticle.metaDescription,
    schemaMarkup: initialArticle.schemaMarkup,
    slug: initialArticle.slug
  } : null;

  // Fetch app categories for sidebar
  useEffect(() => {
    async function fetchCategories() {
      const categories = await getCategories();
      setAppCategories(categories);
    }
    fetchCategories();
  }, []);
  
  // Configure marked for better HTML output
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: true
    });
  }, []);

  useEffect(() => {
    // Article and content are already provided as props from server component
    // Convert markdown to HTML and extract TOC
    if (content) {
      let html = marked(content);
      const updatedHtml = extractTableOfContents(html);
      if (updatedHtml) {
        html = updatedHtml;
      }
      setHtmlContent(html);
    }
    
    // Set page title and meta tags
    if (publicData && typeof document !== 'undefined') {
      document.title = `${publicData.title} | BasicGermany Blog`;
      
      // Update meta description (from SEO data, not visible)
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && seoData?.metaDescription) {
        metaDescription.setAttribute('content', seoData.metaDescription);
      }
    }
  }, [publicData, content, seoData]);
  
  // Update IDs in the actual DOM after content is rendered
  useEffect(() => {
    if (contentRef.current && tocItems.length > 0) {
      const headings = contentRef.current.querySelectorAll('h2, h3');
      headings.forEach((heading) => {
        const id = slugify(heading.textContent);
        heading.id = id;
      });
    }
  }, [htmlContent, tocItems]);
  
  // Track active heading with Intersection Observer
  useEffect(() => {
    if (!contentRef.current || tocItems.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -66% 0px', // Trigger when heading is near top
        threshold: 0
      }
    );
    
    const headings = contentRef.current.querySelectorAll('h2[id], h3[id]');
    headings.forEach((heading) => observer.observe(heading));
    
    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [htmlContent, tocItems]);
  
  // Handle smooth scrolling for TOC links
  const handleTocClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset from top (adjust based on fixed header if any)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Extract headings for table of contents and ensure IDs match
  const extractTableOfContents = (html) => {
    if (typeof DOMParser === 'undefined') return;
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const headings = doc.querySelectorAll('h2, h3');
    
    const items = Array.from(headings).map((heading) => {
      const text = heading.textContent;
      const id = slugify(text);
      
      // Update the heading element to have the proper ID
      heading.id = id;
      
      return {
        id: id,
        text: text,
        level: parseInt(heading.tagName.substring(1))
      };
    });
    
    setTocItems(items);
    
    // Only set initial collapsed state once on first load
    if (!tocInitialized.current) {
      tocInitialized.current = true;
      
      // Collapse all sections with children by default
      const h2Items = items.filter(item => item.level === 2);
      const itemsToCollapse = new Set();
      h2Items.forEach((item, index) => {
        // Check if this h2 has any h3 children
        const nextH2Index = items.findIndex((i, idx) => idx > items.indexOf(item) && i.level === 2);
        const endIndex = nextH2Index === -1 ? items.length : nextH2Index;
        const hasChildren = items.slice(items.indexOf(item) + 1, endIndex).some(i => i.level === 3);
        if (hasChildren) {
          itemsToCollapse.add(item.id);
        }
      });
      setCollapsedSections(itemsToCollapse);
    }
    
    // Return the updated HTML with proper IDs
    return doc.body.innerHTML;
  };

  // Toggle collapsed state for a section
  const toggleSection = (itemId) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Group TOC items into hierarchical structure
  const groupTocItems = (items) => {
    const grouped = [];
    let currentH2 = null;
    
    items.forEach(item => {
      if (item.level === 2) {
        currentH2 = { ...item, children: [] };
        grouped.push(currentH2);
      } else if (item.level === 3 && currentH2) {
        currentH2.children.push(item);
      }
    });
    
    return grouped;
  };

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar categories={[]} activeCategory="knowledge" onCategoryChange={() => {}} onSearch={() => {}} currentPage="knowledge" />
        <div className="main-content">
          <div className="blog-article-page">
            <div className="article-loading">
              <p>Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!publicData) {
    return (
      <div className="app-container">
        <Sidebar categories={appCategories} activeCategory="knowledge" onCategoryChange={() => {}} onSearch={() => {}} currentPage="knowledge" />
        <div className="main-content">
          <div className="blog-article-page">
            <div className="article-error">
              <h1>Article Not Found</h1>
              <p>The article you're looking for doesn't exist or has been removed.</p>
              <Link href="/knowledge/" className="article-error-button">
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar 
        categories={appCategories} 
        activeCategory="blog" 
        onCategoryChange={() => {}} 
        onSearch={() => {}} 
        currentPage="knowledge"
      />
      <main className="main-content">
        <div className="blog-article-page">
      <div className="blog-article-container">
        {/* Enhanced Breadcrumbs with schema.org microdata */}
        <Breadcrumbs 
          category={publicData.category} 
          title={publicData.title}
        />

        {/* Article Header */}
        <header className="article-header-clean">
          {publicData.category && (
            <span className="article-category-badge">{publicData.category}</span>
          )}
          <h1 className="article-title-clean">{publicData.title}</h1>
          <div className="article-meta-clean">
            <span>{publicData.author}</span>
            <span className="article-meta-separator">•</span>
            <time dateTime={publicData.datePublished}>
              {formatDate(publicData.datePublished)}
            </time>
            {publicData.dateUpdated && (
              <>
                <span className="article-meta-separator">•</span>
                <span className="article-updated-date">
                  Updated: {formatDate(publicData.dateUpdated)}
                </span>
              </>
            )}
            <span className="article-meta-separator">•</span>
            <span>{publicData.readingTime}</span>
          </div>
        </header>

        {/* Table of Contents - Banner style with collapsible sections */}
        {tocItems.length > 2 && (
          <nav className="article-toc-banner" aria-label="Table of Contents">
            <div className="article-toc-header">
              <span className="material-symbols-outlined article-toc-icon">format_list_bulleted</span>
              <h2 className="article-toc-title">Table of Contents</h2>
            </div>
            <ul className="article-toc-list">
              {groupTocItems(tocItems).map((item) => (
                <li key={item.id} className="article-toc-item">
                  <div className="article-toc-h2-wrapper">
                    <a 
                      href={`#${item.id}`}
                      onClick={(e) => handleTocClick(e, item.id)}
                      className={`article-toc-link article-toc-h2 ${activeId === item.id ? 'active' : ''}`}
                    >
                      {item.text}
                    </a>
                    {item.children.length > 0 && (
                      <button
                        onClick={() => toggleSection(item.id)}
                        className="article-toc-toggle"
                        aria-label={collapsedSections.has(item.id) ? 'Expand' : 'Collapse'}
                      >
                        <span className="material-symbols-outlined">
                          {collapsedSections.has(item.id) ? 'expand_more' : 'expand_less'}
                        </span>
                      </button>
                    )}
                  </div>
                  {item.children.length > 0 && !collapsedSections.has(item.id) && (
                    <ul className="article-toc-sublist">
                      {item.children.map((child) => (
                        <li key={child.id} className="article-toc-item">
                          <a 
                            href={`#${child.id}`}
                            onClick={(e) => handleTocClick(e, child.id)}
                            className={`article-toc-link article-toc-h3 ${activeId === child.id ? 'active' : ''}`}
                          >
                            {child.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Article Content */}
        <article className="article-content-clean" ref={contentRef}>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </article>

        {/* Official Resources */}
        <OfficialResources />

        {/* FAQ Accordion Section with SEO Schema */}
        <FAQSection faqs={publicData.faqs} articleTitle={publicData.title} />

        {/* Author Bio with Stats - E-E-A-T Signal */}
        <AuthorBio 
          articleUrl={typeof window !== 'undefined' ? window.location.href : `https://basicgermany.com/knowledge/${seoData?.slug || ''}`}
          articleTitle={publicData.title}
        />

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="related-articles-clean">
            <h2>Related Articles</h2>
            <div className="related-articles-grid">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.slug}
                  href={`/knowledge/${relatedArticle.slug}/`}
                  className="related-article-card"
                >
                  <h3 className="related-article-title">{relatedArticle.title}</h3>
                  {relatedArticle.excerpt && (
                    <p className="related-article-excerpt">{relatedArticle.excerpt}</p>
                  )}
                  <div className="related-article-meta">
                    <span>{formatDate(relatedArticle.datePublished)}</span>
                    <span>{relatedArticle.readingTime || '5 min read'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
        </div>
      </main>
    </div>
  );
}
