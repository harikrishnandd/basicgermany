// OpenAI GPT Integration for Article Processing
// This module handles AI-powered article enhancement using OpenAI's GPT API

/**
 * Process an article with OpenAI GPT
 * @param {string} markdownContent - Original markdown content
 * @param {string} filename - Original filename (optional)
 * @returns {Promise<Object>} - Processed article data
 */
export async function processArticleWithAI(markdownContent, filename = '') {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const prompt = `You are an expert content editor and SEO specialist for a blog about living in Germany. 

I will provide you with a markdown article about German bureaucracy, immigration, or daily life. Your task is to:

1. **Fix encoding issues**: Replace incorrectly encoded characters (e.g., BÃ¼rgerbÃ¼ro → Bürgerbüro, Ã¼ → ü, etc.)

2. **Generate SEO metadata**:
   - SEO-optimized title (must be engaging, max 60 characters)
   - Meta description (compelling, 150-155 characters)
   - URL slug (SEO-friendly, lowercase, hyphens)
   - 5-10 relevant keywords (single words or phrases)
   - Excerpt (150 words, engaging summary)
   - Category (choose ONE from: Banking, Insurance, Housing, Healthcare, Visas, Immigration, Taxes, Jobs, Transportation, Language Learning, Bureaucracy, Lifestyle)
   - Reading time estimate
   - Social media description (engaging, 280 characters max)

3. **Extract/Generate FAQ section**: Create 5-8 frequently asked questions based on the article content. Format as:
   - Question (concise, natural language)
   - Answer (2-3 sentences, helpful)

4. **Generate Schema.org markup**: Create appropriate JSON-LD schema (Article, HowTo, or FAQPage - choose the best fit)

5. **Suggest affiliate opportunities**: Identify 2-4 places in the article where affiliate links could naturally be added (e.g., "insurance comparison here", "banking product recommendation here", "German language course here")

6. **Suggest internal links**: Identify 3-5 places where links to other articles about Germany would be relevant (use generic placeholders like "[Link: Health Insurance Guide]", "[Link: How to Open a Bank Account]")

7. **Return enhanced markdown**: Include the corrected markdown with better formatting if needed

Please respond with a valid JSON object (no markdown code blocks, just pure JSON) in this exact structure:

{
  "title": "SEO-Optimized Title Here",
  "metaDescription": "Meta description here",
  "slug": "url-friendly-slug",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "excerpt": "Article excerpt here...",
  "category": "CategoryName",
  "readingTime": "X min read",
  "socialDescription": "Social media description",
  "faqs": [
    {
      "question": "What is...",
      "answer": "The answer is..."
    }
  ],
  "schemaMarkup": {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "...",
    "author": {
      "@type": "Person",
      "name": "BasicGermany Team"
    }
  },
  "affiliateSuggestions": [
    {
      "location": "After paragraph 3",
      "suggestion": "Insurance comparison tool link",
      "context": "Brief context about why this makes sense"
    }
  ],
  "internalLinkSuggestions": [
    {
      "location": "In section about health insurance",
      "linkText": "How to Choose Health Insurance",
      "context": "Why this link fits here"
    }
  ],
  "enhancedMarkdown": "# Corrected Title\\n\\nFull corrected article content..."
}

Here is the article to process:

---
FILENAME: ${filename}
---

${markdownContent}

---

Remember: Respond ONLY with valid JSON. No explanations, no markdown code blocks, just the JSON object.`;

  try {
    // Note: Try different models if gpt-5-nano is not available
    // Fallback order: gpt-5-nano -> gpt-4-turbo-preview -> gpt-4
    const model = 'gpt-4-turbo-preview'; // Changed from gpt-5-nano for compatibility
    
    console.log('Making request to OpenAI with model:', model);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        max_completion_tokens: 4000,
        messages: [{
          role: 'system',
          content: 'You are an expert content editor and SEO specialist. You must respond with valid JSON only.'
        }, {
          role: 'user',
          content: prompt
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error Response:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Log the full API response structure for debugging
    console.log('Full API Response:', {
      id: data.id,
      model: data.model,
      choices: data.choices?.length,
      usage: data.usage
    });
    
    // Check if response has expected structure
    if (!data.choices || data.choices.length === 0) {
      console.error('API returned no choices:', data);
      throw new Error('OpenAI API returned no response choices');
    }
    
    const content = data.choices[0].message?.content || '';
    
    // Log the raw response for debugging
    console.log('AI Response (first 500 chars):', content.substring(0, 500));
    console.log('AI Response length:', content.length);

    // Parse the JSON response
    let processedData;
    try {
      // Try to parse directly
      processedData = JSON.parse(content);
    } catch (parseError) {
      console.log('Direct JSON parse failed, trying to extract...');
      
      // If there's a markdown code block, extract JSON from it
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        console.log('Found JSON in markdown code block');
        processedData = JSON.parse(jsonMatch[1]);
      } else {
        // Try to extract just the JSON object
        const jsonObjectMatch = content.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          console.log('Found JSON object pattern');
          try {
            processedData = JSON.parse(jsonObjectMatch[0]);
          } catch (e) {
            console.error('Failed to parse extracted JSON:', e);
            console.error('Extracted content:', jsonObjectMatch[0].substring(0, 500));
            throw new Error(`Could not parse AI response as JSON. Response preview: ${content.substring(0, 200)}`);
          }
        } else {
          console.error('No JSON pattern found in response');
          throw new Error(`Could not parse AI response as JSON. Response preview: ${content.substring(0, 200)}`);
        }
      }
    }

    return {
      success: true,
      data: processedData,
      tokensUsed: data.usage?.total_tokens || 0,
      cost: calculateCost(data.usage)
    };

  } catch (error) {
    console.error('Error processing article with AI:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

/**
 * Calculate approximate cost for OpenAI API usage
 * @param {Object} usage - Usage statistics from OpenAI API
 * @returns {string} - Formatted cost estimate
 */
function calculateCost(usage) {
  if (!usage) return '$0.00';
  
  // GPT-4 Turbo pricing
  // Input: $10 per million tokens
  // Output: $30 per million tokens
  const inputCost = ((usage.prompt_tokens || 0) / 1000000) * 10;
  const outputCost = ((usage.completion_tokens || 0) / 1000000) * 30;
  const totalCost = inputCost + outputCost;
  
  return `$${totalCost.toFixed(4)}`;
}

/**
 * Batch process multiple articles
 * @param {Array} articles - Array of {content, filename} objects
 * @param {Function} progressCallback - Called after each article is processed
 * @returns {Promise<Array>} - Array of processed results
 */
export async function batchProcessArticles(articles, progressCallback = null) {
  const results = [];
  let totalCost = 0;
  let totalTokens = 0;

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    
    try {
      const result = await processArticleWithAI(article.content, article.filename);
      
      if (result.success) {
        totalTokens += result.tokensUsed;
        totalCost += parseFloat(result.cost.replace('$', ''));
      }
      
      results.push({
        filename: article.filename,
        ...result
      });

      // Call progress callback if provided
      if (progressCallback) {
        progressCallback({
          current: i + 1,
          total: articles.length,
          filename: article.filename,
          success: result.success,
          totalCost: `$${totalCost.toFixed(4)}`,
          totalTokens
        });
      }

      // Add a small delay to avoid rate limiting
      if (i < articles.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      results.push({
        filename: article.filename,
        success: false,
        error: error.message
      });

      if (progressCallback) {
        progressCallback({
          current: i + 1,
          total: articles.length,
          filename: article.filename,
          success: false,
          error: error.message
        });
      }
    }
  }

  return {
    results,
    summary: {
      total: articles.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      totalCost: `$${totalCost.toFixed(4)}`,
      totalTokens
    }
  };
}

/**
 * Validate processed article data
 * @param {Object} processedData - Data returned from AI
 * @returns {Object} - Validation result
 */
export function validateProcessedArticle(processedData) {
  const errors = [];
  const warnings = [];

  // Required fields
  const requiredFields = ['title', 'metaDescription', 'slug', 'keywords', 'excerpt', 'category', 'enhancedMarkdown'];
  
  requiredFields.forEach(field => {
    if (!processedData[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate title length
  if (processedData.title && processedData.title.length > 60) {
    warnings.push(`Title too long (${processedData.title.length} chars, recommended max 60)`);
  }

  // Validate meta description
  if (processedData.metaDescription) {
    if (processedData.metaDescription.length < 120) {
      warnings.push(`Meta description too short (${processedData.metaDescription.length} chars, recommended 150-155)`);
    }
    if (processedData.metaDescription.length > 160) {
      warnings.push(`Meta description too long (${processedData.metaDescription.length} chars, recommended 150-155)`);
    }
  }

  // Validate keywords
  if (processedData.keywords && processedData.keywords.length < 5) {
    warnings.push(`Only ${processedData.keywords.length} keywords (recommended 5-10)`);
  }

  // Validate category
  const validCategories = [
    'Banking', 'Insurance', 'Housing', 'Healthcare', 'Visas', 
    'Immigration', 'Taxes', 'Jobs', 'Transportation', 
    'Language Learning', 'Bureaucracy', 'Lifestyle'
  ];
  
  if (processedData.category && !validCategories.includes(processedData.category)) {
    errors.push(`Invalid category: ${processedData.category}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
