'use client';

import { useEffect, useState, useRef } from 'react';
import { marked } from 'marked';
import { createProductCardHTML, createAdCardHTML } from '../../lib/shortcode-parser';
import { getProductSection } from '../../lib/services/productsService';

// Configure marked for better HTML output
if (typeof window !== 'undefined') {
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
}

export default function BlogArticleContent({ content, onTocExtracted }) {
  const [html, setHtml] = useState('');
  const [processed, setProcessed] = useState(false);
  const onTocExtractedRef = useRef(onTocExtracted);

  // Update ref when callback changes
  useEffect(() => {
    onTocExtractedRef.current = onTocExtracted;
  }, [onTocExtracted]);

  useEffect(() => {
    if (content && !processed) {
      processContent(content);
      setProcessed(true);
    }
  }, [content, processed]);

  const processContent = async (rawContent) => {
    // Parse markdown and extract headings for TOC
    const tocItems = [];
    
    // Custom renderer to extract headings
    const renderer = new marked.Renderer();
    
    renderer.heading = function(text, level, raw) {
      const id = raw.toLowerCase().replace(/[^\w]+/g, '-');
      
      if (level >= 2 && level <= 3) {
        tocItems.push({
          id,
          text: raw,
          level
        });
      }
      
      return `<h${level} id="${id}">${text}</h${level}>`;
    };

    // Step 1: Replace shortcodes with unique placeholders BEFORE markdown
    // This prevents marked() from wrapping card HTML in <p> tags
    let processedContent = rawContent;
    const cardMap = {};
    let cardIndex = 0;

    // Process PRODUCT shortcodes: [PRODUCT:docId:index|bg=#HEX]
    const productRegex = /\[PRODUCT:([a-zA-Z0-9_-]+):(\d+)(?:\|bg=#([a-fA-F0-9]{3,6}))?\]/g;
    const productMatches = [...rawContent.matchAll(productRegex)];
    
    for (const match of productMatches) {
      const [fullMatch, docId, indexStr, bgColor] = match;
      const bg = bgColor ? `#${bgColor}` : 'var(--systemQuinary)';
      const index = parseInt(indexStr);
      const placeholder = `SHORTCODE_PLACEHOLDER_${cardIndex++}`;
      
      try {
        const section = await getProductSection(docId);
        if (section && section.items && section.items[index]) {
          cardMap[placeholder] = createProductCardHTML(section.items[index], bg);
        } else {
          cardMap[placeholder] = `<div style="padding: 16px; background: ${bg}; border-radius: 12px; text-align: center; color: var(--systemSecondary); border: 1px solid var(--borderColor);"><span class="material-symbols-outlined" style="font-size: 32px; display: block; margin-bottom: 8px;">error</span><p style="margin: 0; font-size: 14px;">Product not found: ${docId}[${index}]</p></div>`;
        }
      } catch (error) {
        console.error('Error fetching product for shortcode:', error);
        cardMap[placeholder] = `<div style="padding: 16px; background: ${bg}; border-radius: 12px; text-align: center; color: var(--systemSecondary); border: 1px solid var(--borderColor);"><span class="material-symbols-outlined" style="font-size: 32px; display: block; margin-bottom: 8px;">error</span><p style="margin: 0; font-size: 14px;">Error loading product</p></div>`;
      }
      
      processedContent = processedContent.replace(fullMatch, `\n\n${placeholder}\n\n`);
    }

    // Process AD shortcodes: [AD:name=...|price=...|link=...|logo=...|bg=#HEX]
    const adRegex = /\[AD:([^\]]+)\]/g;
    const adMatches = [...rawContent.matchAll(adRegex)];
    
    for (const match of adMatches) {
      const [fullMatch, paramString] = match;
      const placeholder = `SHORTCODE_PLACEHOLDER_${cardIndex++}`;
      const params = {};
      paramString.split('|').forEach(pair => {
        const eqIndex = pair.indexOf('=');
        if (eqIndex > 0) {
          const key = pair.substring(0, eqIndex).trim();
          const value = pair.substring(eqIndex + 1).trim();
          params[key] = value;
        }
      });
      
      // Normalize bg color
      if (params.bg) {
        params.bg = params.bg.startsWith('#') ? params.bg : `#${params.bg}`;
      } else {
        params.bg = 'var(--systemQuinary)';
      }
      
      cardMap[placeholder] = createAdCardHTML(params);
      processedContent = processedContent.replace(fullMatch, `\n\n${placeholder}\n\n`);
    }

    // Step 2: Convert markdown to HTML
    let htmlContent = marked(processedContent, { renderer });
    
    // Step 3: Replace placeholders with actual card HTML AFTER markdown conversion
    // This ensures cards are not wrapped in <p> tags
    for (const [placeholder, cardHtml] of Object.entries(cardMap)) {
      // marked wraps the placeholder text in <p> tags, so remove those
      htmlContent = htmlContent.replace(`<p>${placeholder}</p>`, cardHtml);
      // Fallback if marked didn't wrap it
      htmlContent = htmlContent.replace(placeholder, cardHtml);
    }
    
    setHtml(htmlContent);
    
    // Pass TOC items to parent
    if (onTocExtractedRef.current) {
      onTocExtractedRef.current(tocItems);
    }
  };

  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  );
}
