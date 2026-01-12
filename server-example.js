/**
 * Example Express.js API Server for Development
 * 
 * This is a mock API server to test the Virtual Try-On system locally.
 * In production, replace this with your actual e-commerce backend.
 * 
 * Run with: node server-example.js
 * Requires: npm install express cors
 * 
 * Note: This uses ES modules (package.json has "type": "module")
 */

import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 8000

app.use(cors())
app.use(express.json())

// Mock product catalog
const products = [
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
  },
  {
    id: 'sku789',
    name: 'Blue Slim Jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    category: 'pants',
    color: 'blue',
    fit: 'slim',
    price: 89.99
  }
]

// Mock cart (in-memory storage)
let cart = [
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

// GET /api/product/current
app.get('/api/product/current', (req, res) => {
  // Return a default product (in production, this would be based on current page)
  const currentProduct = products.find(p => p.id === 'sku789') || products[0]
  res.json(currentProduct)
})

// GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products)
})

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ error: 'Product not found' })
  }
})

// GET /api/cart
app.get('/api/cart', (req, res) => {
  res.json(cart)
})

// POST /api/cart/add
app.post('/api/cart/add', (req, res) => {
  const { productId } = req.body
  const product = products.find(p => p.id === productId)
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' })
  }
  
  const existingItem = cart.find(item => item.id === productId)
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }
  
  res.json({ success: true, cart })
})

// DELETE /api/cart/remove/:id
app.delete('/api/cart/remove/:id', (req, res) => {
  cart = cart.filter(item => item.id !== req.params.id)
  res.json({ success: true, cart })
})

// POST /api/ai/tryon/generate
app.post('/api/ai/tryon/generate', (req, res) => {
  // In production, this would call an actual try-on API
  // For now, return a placeholder response
  const { userImage, productImage, modelType } = req.body
  
  // Simulate processing delay
  setTimeout(() => {
    // Return the product image as a placeholder
    // In production, this would be the generated try-on image
    res.json({ 
      success: true, 
      message: 'Try-on generation would happen here',
      imageUrl: productImage 
    })
  }, 1000)
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Mock API Server running on http://localhost:${PORT}`)
  console.log(`📦 Products: ${products.length}`)
  console.log(`🛒 Cart items: ${cart.length}`)
})
