'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { marked } from 'marked';
import { parseShortcodes, fetchProductData, createProductCardHTML, createAdCardHTML } from '../../lib/shortcode-parser';

// Configure marked for better HTML output
if (typeof window !== 'undefined') {
  marked.setOptions({
    breaks: true,
    gfm: true,
  });
}

export default function BlogArticleContent({ content, onTocExtracted }) {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [processed, setProcessed] = useState(false);
  const contentRef = useRef(null);
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

  const processContent = async (content) => {
    setLoading(true);
    
    console.log('Raw content length:', content?.length);
    console.log('Content preview:', content?.substring(0, 500));
    
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
          text: raw, // Use raw text instead of HTML-processed text
          level
        });
      }
      
      return `<h${level} id="${id}">${text}</h${level}>`;
    };

    // Parse shortcodes first
    const contentWithShortcodes = parseShortcodes(content);
    console.log('After shortcode parsing:', contentWithShortcodes?.substring(0, 500));
    
    // Convert markdown to HTML
    let htmlContent = marked(contentWithShortcodes, { renderer });
    console.log('After markdown conversion:', htmlContent?.substring(0, 500));
    
    setHtml(htmlContent);
    
    // Pass TOC items to parent using ref
    if (onTocExtractedRef.current) {
      onTocExtractedRef.current(tocItems);
    }
    
    // Process shortcodes after DOM is ready
    setTimeout(() => {
      processShortcodes();
    }, 100);
  };

  const processShortcodes = async () => {
    if (!contentRef.current) return;

    // Find all shortcode elements
    const productElements = contentRef.current.querySelectorAll('.shortcode-product');
    const adElements = contentRef.current.querySelectorAll('.shortcode-ad');

    console.log('Found shortcodes:', {
      products: productElements.length,
      ads: adElements.length
    });

    // Process PRODUCT shortcodes
    if (productElements.length > 0) {
      const productData = await fetchProductData(Array.from(productElements));
      
      productData.forEach(({ element, product, section, error }) => {
        const bgColor = element.dataset.bg;
        
        if (product) {
          element.innerHTML = createProductCardHTML(product, bgColor);
        } else {
          // Fallback for missing products
          element.innerHTML = `<div style="
            padding: 16px; 
            background: ${bgColor}; 
            border-radius: 12px; 
            text-align: center; 
            color: var(--systemSecondary);
            border: var(--keylineBorder);
          ">
            <span class="material-symbols-outlined" style="font-size: 48px; display: block; margin-bottom: 8px;">
              error
            </span>
            <p style="margin: 0; font-size: 14px;">${error || 'Product not available'}</p>
          </div>`;
        }
      });
    }

    // Process AD shortcodes
    adElements.forEach((element, index) => {
      const params = {
        name: element.dataset.name,
        price: element.dataset.price,
        link: element.dataset.link,
        logo: element.dataset.logo,
        bg: element.dataset.bg
      };
      
      console.log(`Processing AD ${index}:`, params);
      
      if (params.name) {
        element.innerHTML = createAdCardHTML(params);
      } else {
        // Fallback for missing required params
        element.innerHTML = `<div style="
          padding: 16px; 
          background: ${params.bg || 'var(--systemQuinary)'}; 
          border-radius: 12px; 
          text-align: center; 
          color: var(--systemSecondary);
          border: var(--keylineBorder);
        ">
          <span class="material-symbols-outlined" style="font-size: 48px; display: block; margin-bottom: 8px;">
            error
          </span>
          <p style="margin: 0; font-size: 14px;">AD card missing required parameters</p>
        </div>`;
      }
    });

    setLoading(false);
  };

  return (
    <div>
      {loading && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '16px', 
          color: 'var(--systemSecondary)',
          fontSize: '14px'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            hourglass_empty
          </span>
          Loading product cards...
        </div>
      )}
      <div 
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: html }} 
      />
    </div>
  );
}
