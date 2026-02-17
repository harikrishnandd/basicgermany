// Utility function to fetch article slugs for static generation
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getStorage, ref, getBytes } from 'firebase/storage';
import matter from 'gray-matter';

const firebaseConfig = {
  apiKey: "AIzaSyDAkkYfuVjNFPZzmF5YoxGx9zY5RNGK1Ck",
  authDomain: "basic-germany.firebaseapp.com",
  projectId: "basic-germany",
  storageBucket: "basic-germany.firebasestorage.app",
  messagingSenderId: "467024802844",
  appId: "1:467024802844:web:37f87e86c0b8a50699aae9",
  measurementId: "G-9MV3JEX382"
};

export async function getArticleSlugs() {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);
    
    const articlesQuery = query(
      collection(db, 'blogArticles'),
      where('status', '==', 'published')
    );
    const snapshot = await getDocs(articlesQuery);
    
    const slugs = snapshot.docs.map(doc => ({
      slug: doc.data().slug
    }));
    
    return slugs;
  } catch (error) {
    return [];
  }
}

export async function getArticleData(slug) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);
    const storage = getStorage(app);
    
    // Fetch article metadata
    const articlesQuery = query(
      collection(db, 'blogArticles'),
      where('slug', '==', slug),
      where('status', '==', 'published')
    );
    const snapshot = await getDocs(articlesQuery);
    
    if (snapshot.empty) {
      return { article: null, content: '' };
    }
    
    const doc = snapshot.docs[0];
    const rawData = doc.data();
    
    // Convert Firestore data to JSON-serializable format
    // (Timestamps need to be converted to strings for Next.js static export)
    const articleData = {
      id: doc.id,
      ...rawData,
      dateCreated: rawData.dateCreated?.toDate?.()?.toISOString() || rawData.dateCreated,
      datePublished: rawData.datePublished?.toDate?.()?.toISOString() || rawData.datePublished,
      dateUpdated: rawData.dateUpdated?.toDate?.()?.toISOString() || rawData.dateUpdated,
    };
    
    // Fetch markdown content from storage
    let content = '';
    try {
      // Try enhanced version first
      const enhancedRef = ref(storage, articleData.storagePathEnhanced);
      const enhancedBytes = await getBytes(enhancedRef);
      const rawContent = new TextDecoder().decode(enhancedBytes);
      
      // If too short, use original
      if (rawContent.length < 1000) {
        const originalRef = ref(storage, articleData.storagePathOriginal);
        const originalBytes = await getBytes(originalRef);
        content = new TextDecoder().decode(originalBytes);
      } else {
        content = rawContent;
      }
    } catch (error) {
      try {
        const originalRef = ref(storage, articleData.storagePathOriginal);
        const originalBytes = await getBytes(originalRef);
        content = new TextDecoder().decode(originalBytes);
      } catch (originalError) {
        // Failed to fetch content
      }
    }
    
    // CRITICAL: Parse and remove frontmatter from markdown
    // The content includes YAML frontmatter at the top which should NOT be visible
    let cleanContent = content;
    if (content) {
      try {
        const parsed = matter(content);
        cleanContent = parsed.content; // Only the markdown content, no frontmatter
      } catch (parseError) {
        console.warn('Failed to parse frontmatter, using raw content:', parseError);
        cleanContent = content;
      }
    }
    
    return {
      article: articleData,
      content: cleanContent  // Return content WITHOUT frontmatter
    };
  } catch (error) {
    return { article: null, content: '' };
  }
}

export async function getRelatedArticlesData(articleId, category, limit = 3) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);
    
    // Fetch articles from the same category, excluding current article
    const articlesQuery = query(
      collection(db, 'blogArticles'),
      where('category', '==', category),
      where('status', '==', 'published')
    );
    const snapshot = await getDocs(articlesQuery);
    
    const relatedArticles = snapshot.docs
      .filter(doc => doc.id !== articleId)
      .slice(0, limit)
      .map(doc => {
        const rawData = doc.data();
        return {
          id: doc.id,
          title: rawData.title,
          slug: rawData.slug,
          excerpt: rawData.excerpt,
          category: rawData.category,
          readingTime: rawData.readingTime,
          datePublished: rawData.datePublished?.toDate?.()?.toISOString() || rawData.datePublished,
        };
      });
    
    return relatedArticles;
  } catch (error) {
    return [];
  }
}
