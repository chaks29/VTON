import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

/**
 * Fetch the current product being viewed
 */
export const getCurrentProduct = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/product/current`)
    return response.data
  } catch (error) {
    console.error('Error fetching current product:', error)
    // Fallback mock data for development
    return {
      id: 'sku789',
      name: 'Blue Slim Jeans',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      category: 'pants',
      color: 'blue',
      fit: 'slim',
      price: 89.99
    }
  }
}

/**
 * Fetch all products from catalog
 */
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`)
    return response.data
  } catch (error) {
    console.error('Error fetching products:', error)
    // Fallback mock catalog
    return [
      {
        id: 'sku001',
        name: 'Black T-Shirt',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        category: 'tshirt',
        color: 'black',
        fit: 'regular',
        price: 29.99
      },
      {
        id: 'sku002',
        name: 'White T-Shirt',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        category: 'tshirt',
        color: 'white',
        fit: 'regular',
        price: 29.99
      },
      {
        id: 'sku003',
        name: 'Gray Hoodie',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
        category: 'hoodie',
        color: 'gray',
        fit: 'oversized',
        price: 59.99
      },
      {
        id: 'sku004',
        name: 'Navy Chinos',
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400',
        category: 'pants',
        color: 'navy',
        fit: 'regular',
        price: 79.99
      },
      {
        id: 'sku005',
        name: 'Black Jeans',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        category: 'pants',
        color: 'black',
        fit: 'slim',
        price: 89.99
      },
      {
        id: 'sku006',
        name: 'White Button Shirt',
        image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e69a?w=400',
        category: 'shirt',
        color: 'white',
        fit: 'regular',
        price: 49.99
      }
    ]
  }
}

/**
 * Fetch a specific product by ID
 */
export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}
