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

  // Determine if logo is Material Icon or image URL
  const isIcon = product.logo && !product.logo.startsWith('http') && !product.logo.startsWith('data:');
  
  // Vertical layout matching Product Details Modal
  const logoHtml = isIcon
    ? `<div style="width:120px;height:120px;border-radius:12px;background:var(--systemSenary, #f5f5f5);display:flex;align-items:center;justify-content:center;margin:0 auto 16px"><span class="material-symbols-outlined" style="font-size:64px;color:var(--keyColor, #007AFF)">${product.logo}</span></div>`
    : `<div style="width:100%;aspect-ratio:16/9;max-height:200px;border-radius:12px;overflow:hidden;margin-bottom:16px;display:flex;align-items:center;justify-content:center"><img src="${product.logo}" alt="${product.name}" style="width:100%;height:100%;object-fit:contain"/></div>`;

  const priceHtml = product.free 
    ? `<div style="font-size:20px;font-weight:600;color:#34c759;margin:8px 0">Free</div>`
    : `<div style="font-size:20px;font-weight:600;color:var(--systemPrimary);margin:8px 0"><span class="material-symbols-outlined" style="font-size:18px;vertical-align:middle;margin-right:4px">${product.currency || 'euro_symbol'}</span>${product.price}</div>`;

  const descHtml = product.description 
    ? `<div style="font-size:14px;color:var(--systemSecondary);line-height:1.5;margin:12px 0">${product.description}</div>` 
    : '';

  return `<div style="background:${bgColor};border-radius:12px;padding:20px;margin:24px 0;border:1px solid var(--borderColor, #e0e0e0);text-align:center">${logoHtml}<div style="font-size:20px;font-weight:700;color:var(--systemPrimary);margin-bottom:4px">${product.name}</div>${priceHtml}${descHtml}<button style="width:100%;padding:12px;background:var(--keyColor, #007AFF);color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;margin-top:16px" onclick="window.open('${product.link || '#'}','_blank')">Get</button></div>`;
}

/**
 * Create CustomAdCard component HTML
 * @param {Object} params - AD parameters
 * @returns {string} - HTML string for ad card
 */
export function createAdCardHTML(params) {
  const { name, description, price, link, logo, image, bg } = params;
  
  if (!name) {
    return `<div style="padding:16px;background:${bg};border-radius:12px;text-align:center;color:var(--systemSecondary)"><span class="material-symbols-outlined" style="font-size:48px;display:block;margin-bottom:8px">error</span><p>Ad not available</p></div>`;
  }

  // Use 'image' parameter if provided (URL), otherwise use 'logo' parameter (Material Icon)
  const logoHtml = image
    ? `<div style="width:100%;aspect-ratio:16/9;max-height:200px;border-radius:12px;overflow:hidden;margin-bottom:16px;display:flex;align-items:center;justify-content:center"><img src="${image}" alt="${name}" style="width:100%;height:100%;object-fit:contain"/></div>`
    : logo
    ? `<div style="width:120px;height:120px;border-radius:12px;background:var(--systemSenary, #f5f5f5);display:flex;align-items:center;justify-content:center;margin:0 auto 16px"><span class="material-symbols-outlined" style="font-size:64px;color:var(--keyColor, #007AFF)">${logo}</span></div>`
    : `<div style="width:120px;height:120px;border-radius:12px;background:var(--systemSenary, #f5f5f5);display:flex;align-items:center;justify-content:center;margin:0 auto 16px"><span class="material-symbols-outlined" style="font-size:64px;color:var(--systemSecondary)">image</span></div>`;

  const priceHtml = (price && price !== '0')
    ? `<div style="font-size:20px;font-weight:600;color:var(--systemPrimary);margin:8px 0"><span class="material-symbols-outlined" style="font-size:18px;vertical-align:middle;margin-right:4px">euro_symbol</span>${price}</div>`
    : `<div style="font-size:20px;font-weight:600;color:#34c759;margin:8px 0">Free</div>`;

  const descHtml = description 
    ? `<div style="font-size:14px;color:var(--systemSecondary);line-height:1.5;margin:12px 0">${description}</div>` 
    : '';

  return `<div style="background:${bg};border-radius:12px;padding:20px;margin:24px 0;border:1px solid var(--borderColor, #e0e0e0);text-align:center">${logoHtml}<div style="font-size:20px;font-weight:700;color:var(--systemPrimary);margin-bottom:4px">${name}</div>${priceHtml}${descHtml}<button style="width:100%;padding:12px;background:var(--keyColor, #007AFF);color:white;border:none;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer;margin-top:16px" onclick="window.open('${link || '#'}','_blank')">Get</button></div>`;
}
