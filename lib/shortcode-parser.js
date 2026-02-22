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
    return `<div style="padding: 16px; background: ${bgColor}; border-radius: 12px; text-align: center; color: var(--systemSecondary);">
      <span class="material-symbols-outlined" style="font-size: 48px; display: block; margin-bottom: 8px;">
        error
      </span>
      <p>Product not available</p>
    </div>`;
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
  
  const priceDisplay = product.free ? 
    `<span style="
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: var(--systemGreen);
      color: white;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
    ">
      <span class="material-symbols-outlined" style="font-size: 14px;">check_circle</span>
      Free
    </span>` : 
    `<div style="display: flex; align-items: center; gap: 4px;">
      <span class="material-symbols-outlined" style="font-size: 16px; color: var(--systemSecondary);">
        ${product.currency || 'euro_symbol'}
      </span>
      <span style="font-weight: 500; color: var(--systemPrimary);">
        ${product.price}
      </span>
    </div>`;

  return `<div class="app-card" style="
    background: ${bgColor};
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border: var(--keylineBorder);
  " onclick="window.open('${product.link || '#'}', '_blank')">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
      <div style="
        width: 48px;
        height: 48px;
        border-radius: 8px;
        background: var(--systemSenary);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      ">
        ${isSvgPath ? 
          `<svg viewBox="0 0 100 100" style="width: 100%; height: 100%;" fill="var(--keyColor)">
            <path d="${product.logo}" />
          </svg>` :
          isIconName ? 
          `<span class="material-symbols-outlined" style="font-size: 32px; color: var(--keyColor);">
            ${product.logo}
          </span>` :
          `<img src="${logoSrc}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" />`
        }
      </div>
      <div style="flex: 1;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: var(--systemPrimary);">
          ${product.name}
        </h3>
        ${product.description ? 
          `<p style="margin: 4px 0 0 0; font-size: 14px; color: var(--systemSecondary); line-height: 1.4;">
            ${product.description}
          </p>` : ''
        }
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      ${priceDisplay}
      <button class="app-button" style="
        padding: 8px 16px;
        background: var(--keyColor);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.2s ease;
      " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
        Get
      </button>
    </div>
  </div>`;
}

/**
 * Create CustomAdCard component HTML
 * @param {Object} params - AD parameters
 * @returns {string} - HTML string for ad card
 */
export function createAdCardHTML(params) {
  const { name, price, link, logo, bg } = params;
  
  if (!name) {
    return `<div style="padding: 16px; background: ${bg}; border-radius: 12px; text-align: center; color: var(--systemSecondary);">
      <span class="material-symbols-outlined" style="font-size: 48px; display: block; margin-bottom: 8px;">
        error
      </span>
      <p>Ad not available</p>
    </div>`;
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
  
  const priceDisplay = price ? 
    `<div style="display: flex; align-items: center; gap: 4px;">
      <span class="material-symbols-outlined" style="font-size: 16px; color: var(--systemSecondary);">
        euro_symbol
      </span>
      <span style="font-weight: 500; color: var(--systemPrimary);">
        ${price}
      </span>
    </div>` : '';

  return `<div class="app-card" style="
    background: ${bg};
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    border: var(--keylineBorder);
  " onclick="window.open('${link || '#'}', '_blank')">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
      <div style="
        width: 48px;
        height: 48px;
        border-radius: 8px;
        background: var(--systemSenary);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      ">
        ${isSvgPath ? 
          `<svg viewBox="0 0 100 100" style="width: 100%; height: 100%;" fill="var(--keyColor)">
            <path d="${logo}" />
          </svg>` :
          isIconName ? 
          `<span class="material-symbols-outlined" style="font-size: 32px; color: var(--keyColor);">
            ${logo}
          </span>` :
          `<img src="${logoSrc}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover;" />`
        }
      </div>
      <div style="flex: 1;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: var(--systemPrimary);">
          ${name}
        </h3>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; align-items: center;">
      ${priceDisplay}
      <button class="app-button" style="
        padding: 8px 16px;
        background: var(--keyColor);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.2s ease;
      " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
        Get
      </button>
    </div>
  </div>`;
}
