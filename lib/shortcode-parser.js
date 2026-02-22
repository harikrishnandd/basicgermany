// Shortcode Parser for Blog Content
import { getProductSection } from './services/productsService';

/**
 * Parse shortcodes in markdown content and replace with React components
 * @param {string} content - Markdown content with shortcodes
 * @returns {string} - Content with shortcodes replaced by HTML placeholders
 */
export function parseShortcodes(content) {
  if (!content) return content;

  let parsedContent = content;

  // Parse PRODUCT tags: [PRODUCT:docId:index|bg=#HEX]
  const productRegex = /\[PRODUCT:([a-zA-Z0-9_-]+):(\d+)(?:\|bg=#([a-fA-F0-9]{6}))?\]/g;
  
  parsedContent = parsedContent.replace(productRegex, (match, docId, index, bgColor) => {
    const bgHex = bgColor || 'var(--systemQuinary)';
    return `<div class="shortcode-product" data-doc-id="${docId}" data-index="${index}" data-bg="${bgHex}"></div>`;
  });

  // Parse AD tags: [AD:name=...|price=...|link=...|logo=...|bg=#HEX]
  const adRegex = /\[AD:([^\]]+)\]/g;
  
  parsedContent = parsedContent.replace(adRegex, (match, params) => {
    const paramObj = parseAdParams(params);
    const bgHex = paramObj.bg || 'var(--systemQuinary)';
    
    return `<div class="shortcode-ad" 
      data-name="${paramObj.name || ''}" 
      data-price="${paramObj.price || ''}" 
      data-link="${paramObj.link || ''}" 
      data-logo="${paramObj.logo || ''}" 
      data-bg="${bgHex}"
    ></div>`;
  });

  return parsedContent;
}

/**
 * Parse AD shortcode parameters
 * @param {string} paramString - Parameters string (name=...|price=...|...)
 * @returns {Object} - Parsed parameters
 */
function parseAdParams(paramString) {
  const params = {};
  const pairs = paramString.split('|');
  
  pairs.forEach(pair => {
    const [key, value] = pair.split('=');
    if (key && value) {
      params[key.trim()] = value.trim();
    }
  });
  
  return params;
}

/**
 * Fetch product data for PRODUCT shortcodes
 * @param {Array} productElements - Array of DOM elements with product shortcodes
 * @returns {Promise<Array>} - Array of product data
 */
export async function fetchProductData(productElements) {
  const productData = [];
  
  for (const element of productElements) {
    const docId = element.dataset.docId;
    const index = parseInt(element.dataset.index);
    
    try {
      const section = await getProductSection(docId);
      if (section && section.items && section.items[index]) {
        productData.push({
          element,
          product: section.items[index],
          section: section
        });
      } else {
        // Product not found, add fallback data
        productData.push({
          element,
          product: null,
          section: null,
          error: `Product not found: ${docId}[${index}]`
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      productData.push({
        element,
        product: null,
        section: null,
        error: `Error fetching product: ${docId}[${index}]`
      });
    }
  }
  
  return productData;
}

/**
 * Create ProductCard component HTML
 * @param {Object} product - Product data
 * @param {string} bgColor - Background color
 * @returns {string} - HTML string for product card
 */
export function createProductCardHTML(product, bgColor) {
  if (!product) {
    return `<div style="padding:16px;background:${bgColor};border-radius:12px;text-align:center;color:var(--systemSecondary)"><span class="material-symbols-outlined" style="font-size:48px;display:block;margin-bottom:8px">error</span><p>Product not available</p></div>`;
  }

  // Detect logo type: Material Icon, SVG path, or image URL
  const isSvgPath = product.logo && product.logo.includes('M') && product.logo.length > 50;
  const isIconName = product.logo && 
    typeof product.logo === 'string' && 
    !product.logo.startsWith('http') && 
    !product.logo.startsWith('data:') &&
    !isSvgPath &&
    product.logo.length < 50;
  const logoSrc = product.logo || '/site-icon.png';
  
  let logoHtml;
  if (isSvgPath) {
    logoHtml = `<svg viewBox="0 0 90 20" style="width:100%;height:100%;padding:8px" fill="var(--keyColor)"><path d="${product.logo}"/></svg>`;
  } else if (isIconName) {
    logoHtml = `<span class="material-symbols-outlined" style="font-size:32px;color:var(--keyColor)">${product.logo}</span>`;
  } else {
    logoHtml = `<img src="${logoSrc}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover"/>`;
  }

  const priceHtml = product.free 
    ? `<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#34c759;color:white;border-radius:20px;font-size:13px;font-weight:600"><span class="material-symbols-outlined" style="font-size:14px">check_circle</span> Free</span>`
    : `<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:var(--systemQuaternary);color:var(--systemPrimary);border-radius:20px;font-size:13px;font-weight:600"><span class="material-symbols-outlined" style="font-size:14px">${product.currency || 'euro_symbol'}</span> ${product.price}</span>`;

  const descHtml = product.description 
    ? `<div style="margin:4px 0 0;font-size:14px;color:var(--systemSecondary);line-height:1.4">${product.description}</div>` 
    : '';

  return `<div style="background:${bgColor};border-radius:12px;padding:16px;margin:24px 0;cursor:pointer;border:1px solid var(--borderColor, #e0e0e0);transition:transform 0.2s ease,box-shadow 0.2s ease" onclick="window.open('${product.link || '#'}','_blank')" onmouseover="this.style.transform='scale(1.01)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='scale(1)';this.style.boxShadow='none'"><div style="display:flex;align-items:center;gap:12px"><div style="width:48px;height:48px;border-radius:12px;background:var(--systemSenary, #f5f5f5);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0">${logoHtml}</div><div style="flex:1;min-width:0"><div style="font-size:16px;font-weight:600;color:var(--systemPrimary)">${product.name}</div>${descHtml}</div><div style="display:flex;align-items:center;gap:8px;flex-shrink:0">${priceHtml}<button style="padding:8px 18px;background:var(--keyColor, #007AFF);color:white;border:none;border-radius:20px;font-size:14px;font-weight:600;cursor:pointer" onclick="event.stopPropagation();window.open('${product.link || '#'}','_blank')">Get</button></div></div></div>`;
}

/**
 * Create CustomAdCard component HTML
 * @param {Object} params - AD parameters
 * @returns {string} - HTML string for ad card
 */
export function createAdCardHTML(params) {
  const { name, price, link, logo, bg } = params;
  
  if (!name) {
    return `<div style="padding:16px;background:${bg};border-radius:12px;text-align:center;color:var(--systemSecondary)"><span class="material-symbols-outlined" style="font-size:48px;display:block;margin-bottom:8px">error</span><p>Ad not available</p></div>`;
  }

  // Detect logo type: Material Icon, SVG path, or image URL
  const isSvgPath = logo && logo.includes('M') && logo.length > 50;
  const isIconName = logo && 
    typeof logo === 'string' && 
    !logo.startsWith('http') && 
    !logo.startsWith('data:') &&
    !isSvgPath &&
    logo.length < 50;
  const logoSrc = logo || '/site-icon.png';

  let logoHtml;
  if (isSvgPath) {
    logoHtml = `<svg viewBox="0 0 90 20" style="width:100%;height:100%;padding:8px" fill="var(--keyColor)"><path d="${logo}"/></svg>`;
  } else if (isIconName) {
    logoHtml = `<span class="material-symbols-outlined" style="font-size:32px;color:var(--keyColor)">${logo}</span>`;
  } else {
    logoHtml = `<img src="${logoSrc}" alt="${name}" style="width:100%;height:100%;object-fit:cover"/>`;
  }

  const priceHtml = (price && price !== '0')
    ? `<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:var(--systemQuaternary);color:var(--systemPrimary);border-radius:20px;font-size:13px;font-weight:600"><span class="material-symbols-outlined" style="font-size:14px">euro_symbol</span> ${price}</span>`
    : `<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:#34c759;color:white;border-radius:20px;font-size:13px;font-weight:600"><span class="material-symbols-outlined" style="font-size:14px">check_circle</span> Free</span>`;

  return `<div style="background:${bg};border-radius:12px;padding:16px;margin:24px 0;cursor:pointer;border:1px solid var(--borderColor, #e0e0e0);transition:transform 0.2s ease,box-shadow 0.2s ease" onclick="window.open('${link || '#'}','_blank')" onmouseover="this.style.transform='scale(1.01)';this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='scale(1)';this.style.boxShadow='none'"><div style="display:flex;align-items:center;gap:12px"><div style="width:48px;height:48px;border-radius:12px;background:var(--systemSenary, #f5f5f5);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0">${logoHtml}</div><div style="flex:1;min-width:0"><div style="font-size:16px;font-weight:600;color:var(--systemPrimary)">${name}</div></div><div style="display:flex;align-items:center;gap:8px;flex-shrink:0">${priceHtml}<button style="padding:8px 18px;background:var(--keyColor, #007AFF);color:white;border:none;border-radius:20px;font-size:14px;font-weight:600;cursor:pointer" onclick="event.stopPropagation();window.open('${link || '#'}','_blank')">Get</button></div></div></div>`;
}
