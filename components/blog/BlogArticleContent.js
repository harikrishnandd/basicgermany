'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';

// Configure marked for better HTML output
if (typeof window !== 'undefined') {
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
}

export default function BlogArticleContent({ content, onTocExtracted }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (content) {
      // Parse markdown and extract headings for TOC
      const tocItems = [];
      
      // Custom renderer to extract headings
      const renderer = new marked.Renderer();
      const originalHeading = renderer.heading;
      
      renderer.heading = function(text, level, raw) {
        const id = raw.toLowerCase().replace(/[^\w]+/g, '-');
        
        if (level >= 2 && level <= 3) {
          tocItems.push({
            id,
            text: text,
            level
          });
        }
        
        return `<h${level} id="${id}">${text}</h${level}>`;
      };

      // Convert markdown to HTML
      const htmlContent = marked(content, { renderer });
      setHtml(htmlContent);
      
      // Pass TOC items to parent
      if (onTocExtracted) {
        onTocExtracted(tocItems);
      }
    }
  }, [content, onTocExtracted]);

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
