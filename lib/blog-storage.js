// Firebase Storage utilities for blog content
import { app } from './firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, getBytes, deleteObject, listAll } from 'firebase/storage';

const storage = getStorage(app);

/**
 * Upload markdown file to Firebase Storage
 * @param {File} file - The markdown file to upload
 * @param {string} slug - Article slug for naming
 * @param {string} type - 'original' or 'enhanced'
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadMarkdownFile(file, slug, type = 'original') {
  try {
    const fileName = `${slug}${type === 'enhanced' ? '-enhanced' : ''}.md`;
    const storageRef = ref(storage, `blog-content/${fileName}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const url = await getDownloadURL(snapshot.ref);
    
    return {
      url,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Upload markdown content from string
 * @param {string} content - Markdown content as string
 * @param {string} slug - Article slug for naming
 * @param {string} type - 'original' or 'enhanced'
 * @returns {Promise<{url: string, path: string}>}
 */
export async function uploadMarkdownContent(content, slug, type = 'original') {
  try {
    const fileName = `${slug}${type === 'enhanced' ? '-enhanced' : ''}.md`;
    const storageRef = ref(storage, `blog-content/${fileName}`);
    
    // Convert string to Blob
    const blob = new Blob([content], { type: 'text/markdown' });
    
    // Upload blob
    const snapshot = await uploadBytes(storageRef, blob);
    
    // Get download URL
    const url = await getDownloadURL(snapshot.ref);
    
    return {
      url,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error uploading content:', error);
    throw error;
  }
}

/**
 * Download markdown content from Storage
 * @param {string} path - Storage path to the file
 * @returns {Promise<string>} - Markdown content
 */
export async function downloadMarkdownContent(path) {
  try {
    const storageRef = ref(storage, path);
    
    // Use getBytes() instead of getDownloadURL + fetch
    // This bypasses CORS issues and provides better error handling
    const bytes = await getBytes(storageRef);
    const content = new TextDecoder('utf-8').decode(bytes);
    
    return content;
  } catch (error) {
    console.error('Error downloading content:', error);
    throw error;
  }
}

/**
 * Delete markdown file from Storage
 * @param {string} path - Storage path to delete
 */
export async function deleteMarkdownFile(path) {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

/**
 * List all blog content files
 * @returns {Promise<Array>} - List of file references
 */
export async function listAllBlogFiles() {
  try {
    const listRef = ref(storage, 'blog-content/');
    const result = await listAll(listRef);
    return result.items;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

/**
 * Generate unique slug from title
 * @param {string} title - Article title
 * @returns {string} - URL-friendly slug
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Calculate reading time from markdown content
 * @param {string} content - Markdown content
 * @returns {string} - Reading time estimate (e.g., "5 min read")
 */
export function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
