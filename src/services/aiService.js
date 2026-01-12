import axios from 'axios'

const AI_API_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:8000/api/ai'
const GLM_API_KEY = import.meta.env.VITE_GLM_API_KEY || ''
const KIMI_API_KEY = import.meta.env.VITE_KIMI_API_KEY || ''

/**
 * Generate styling suggestion using LLM (GLM or Kimi)
 */
export const getStylingSuggestion = async (currentProduct, cartItems, allProducts) => {
  try {
    // Build the prompt for the AI
    const prompt = buildStylingPrompt(currentProduct, cartItems, allProducts)
    
    // Try GLM first, fallback to Kimi
    if (GLM_API_KEY) {
      return await callGLM(prompt, allProducts)
    } else if (KIMI_API_KEY) {
      return await callKimi(prompt, allProducts)
    } else {
      // Fallback to rule-based logic if no API keys
      return fallbackStylingLogic(currentProduct, cartItems, allProducts)
    }
  } catch (error) {
    console.error('Error getting styling suggestion:', error)
    // Fallback to rule-based logic
    return fallbackStylingLogic(currentProduct, cartItems, allProducts)
  }
}

/**
 * Build the system prompt for the AI stylist
 */
const buildStylingPrompt = (currentProduct, cartItems, allProducts) => {
  return `You are a professional fashion stylist AI for an ecommerce website.

You are given:
1. The product the user is currently viewing: ${JSON.stringify(currentProduct)}
2. The products in their cart: ${JSON.stringify(cartItems)}
3. The full product catalog: ${JSON.stringify(allProducts.map(p => ({ id: p.id, name: p.name, category: p.category, color: p.color, fit: p.fit })))}

Your task:
- Select exactly ONE product that complements the outfit
- It must complete the look (top ↔ bottom)
- Avoid duplicates (don't suggest items already in cart or currently viewing)
- Explain why it matches (color, fit, style)

Return JSON only:
{
  "suggestedProductId": "product_id",
  "reason": "detailed explanation",
  "styleTags": ["casual", "streetwear", "formal"]
}`
}

/**
 * Call GLM API
 */
const callGLM = async (prompt, allProducts) => {
  try {
    const response = await axios.post(
      `${AI_API_BASE_URL}/glm/chat`,
      {
        model: 'glm-4',
        messages: [
          {
            role: 'system',
            content: 'You are a fashion stylist. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${GLM_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    const content = response.data.choices[0].message.content
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const suggestion = JSON.parse(jsonMatch[0])
      return validateAndEnrichSuggestion(suggestion, allProducts)
    }
    throw new Error('Invalid response format')
  } catch (error) {
    console.error('GLM API error:', error)
    throw error
  }
}

/**
 * Call Kimi API
 */
const callKimi = async (prompt, allProducts) => {
  try {
    const response = await axios.post(
      `${AI_API_BASE_URL}/kimi/chat`,
      {
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: 'You are a fashion stylist. Always return valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${KIMI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    const content = response.data.choices[0].message.content
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const suggestion = JSON.parse(jsonMatch[0])
      return validateAndEnrichSuggestion(suggestion, allProducts)
    }
    throw new Error('Invalid response format')
  } catch (error) {
    console.error('Kimi API error:', error)
    throw error
  }
}

/**
 * Fallback rule-based styling logic
 */
const fallbackStylingLogic = (currentProduct, cartItems, allProducts) => {
  const allItems = [currentProduct, ...cartItems]
  const categoriesInOutfit = new Set(allItems.map(item => item.category))
  
  // Determine what's missing
  const hasTop = allItems.some(item => ['tshirt', 'shirt', 'hoodie'].includes(item.category))
  const hasBottom = allItems.some(item => ['pants', 'jeans', 'chinos', 'shorts'].includes(item.category))
  
  // Get dominant color and fit
  const dominantColor = getDominantColor(allItems)
  const dominantFit = getDominantFit(allItems)
  
  // Find complementary product
  let suggestedProduct = null
  
  if (!hasTop && currentProduct.category === 'pants') {
    // Need a top
    suggestedProduct = allProducts.find(p => 
      ['tshirt', 'shirt', 'hoodie'].includes(p.category) &&
      !categoriesInOutfit.has(p.category) &&
      p.id !== currentProduct.id &&
      !cartItems.some(c => c.id === p.id) &&
      matchesColorScheme(p.color, dominantColor) &&
      (p.fit === dominantFit || p.fit === 'regular')
    )
  } else if (!hasBottom && ['tshirt', 'shirt', 'hoodie'].includes(currentProduct.category)) {
    // Need a bottom
    suggestedProduct = allProducts.find(p => 
      ['pants', 'jeans', 'chinos', 'shorts'].includes(p.category) &&
      !categoriesInOutfit.has(p.category) &&
      p.id !== currentProduct.id &&
      !cartItems.some(c => c.id === p.id) &&
      matchesColorScheme(p.color, dominantColor) &&
      (p.fit === dominantFit || p.fit === 'regular')
    )
  }
  
  // If no match found, pick any complementary item
  if (!suggestedProduct) {
    if (!hasTop) {
      suggestedProduct = allProducts.find(p => 
        ['tshirt', 'shirt', 'hoodie'].includes(p.category) &&
        p.id !== currentProduct.id &&
        !cartItems.some(c => c.id === p.id)
      )
    } else if (!hasBottom) {
      suggestedProduct = allProducts.find(p => 
        ['pants', 'jeans', 'chinos', 'shorts'].includes(p.category) &&
        p.id !== currentProduct.id &&
        !cartItems.some(c => c.id === p.id)
      )
    }
  }
  
  if (!suggestedProduct) {
    suggestedProduct = allProducts[0] // Fallback
  }
  
  return {
    suggestedProductId: suggestedProduct.id,
    reason: `This ${suggestedProduct.name} complements your outfit. The ${suggestedProduct.color} color pairs well with ${dominantColor}, and the ${suggestedProduct.fit} fit matches your style.`,
    styleTags: determineStyleTags(allItems, suggestedProduct)
  }
}

/**
 * Validate and enrich AI suggestion with full product data
 */
const validateAndEnrichSuggestion = (suggestion, allProducts) => {
  const product = allProducts.find(p => p.id === suggestion.suggestedProductId)
  if (!product) {
    throw new Error('Suggested product not found in catalog')
  }
  return {
    ...suggestion,
    product: product
  }
}

/**
 * Get dominant color from items
 */
const getDominantColor = (items) => {
  const colors = items.map(item => item.color)
  return colors[0] || 'neutral'
}

/**
 * Get dominant fit from items
 */
const getDominantFit = (items) => {
  const fits = items.map(item => item.fit)
  return fits[0] || 'regular'
}

/**
 * Check if colors match/complement
 */
const matchesColorScheme = (color1, color2) => {
  const neutralColors = ['black', 'white', 'gray', 'navy', 'beige']
  const clashingPairs = [
    ['red', 'green'],
    ['blue', 'orange'],
    ['yellow', 'purple']
  ]
  
  if (neutralColors.includes(color1) || neutralColors.includes(color2)) {
    return true
  }
  
  if (color1 === color2) {
    return true
  }
  
  // Check for clashing colors
  for (const pair of clashingPairs) {
    if ((pair.includes(color1) && pair.includes(color2)) && color1 !== color2) {
      return false
    }
  }
  
  return true
}

/**
 * Determine style tags
 */
const determineStyleTags = (items, suggestedProduct) => {
  const tags = []
  const allItems = [...items, suggestedProduct]
  
  const hasFormal = allItems.some(item => item.category === 'shirt' && item.fit === 'regular')
  const hasCasual = allItems.some(item => ['tshirt', 'hoodie'].includes(item.category))
  const hasStreetwear = allItems.some(item => item.fit === 'oversized')
  
  if (hasFormal) tags.push('formal')
  if (hasCasual) tags.push('casual')
  if (hasStreetwear) tags.push('streetwear')
  if (tags.length === 0) tags.push('casual')
  
  return tags
}

/**
 * Generate virtual try-on image
 */
export const generateTryOn = async (userImage, productImage, modelType = 'idm-vton') => {
  try {
    const response = await axios.post(
      `${AI_API_BASE_URL}/tryon/generate`,
      {
        userImage,
        productImage,
        modelType // 'idm-vton' or 'ootdiffusion'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'blob'
      }
    )
    
    // Convert blob to data URL
    const blob = response.data
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error generating try-on:', error)
    // Return placeholder for development
    return productImage // Fallback to product image
  }
}

/**
 * Generate composite try-on with multiple items
 */
export const generateCompositeTryOn = async (userImage, products) => {
  try {
    // In production, this would call a composite try-on API
    // For now, return the first product's try-on
    if (products.length > 0) {
      return await generateTryOn(userImage, products[0].image)
    }
    return null
  } catch (error) {
    console.error('Error generating composite try-on:', error)
    return null
  }
}
