import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

/**
 * Fetch current cart contents
 */
export const getCart = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart`)
    return response.data
  } catch (error) {
    console.error('Error fetching cart:', error)
    // Fallback mock cart for development
    return [
      {
        id: 'sku123',
        name: 'Black T-Shirt',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        category: 'tshirt',
        color: 'black',
        fit: 'regular',
        price: 29.99,
        quantity: 1
      }
    ]
  }
}

/**
 * Add a product to cart
 */
export const addToCart = async (productId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/add`, {
      productId
    })
    return response.data
  } catch (error) {
    console.error('Error adding to cart:', error)
    // In production, handle error appropriately
    return { success: false, error: error.message }
  }
}

/**
 * Remove a product from cart
 */
export const removeFromCart = async (productId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cart/remove/${productId}`)
    return response.data
  } catch (error) {
    console.error('Error removing from cart:', error)
    return { success: false, error: error.message }
  }
}
