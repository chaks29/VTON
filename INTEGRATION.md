# Integration Guide

## Quick Start Integration

### Step 1: Install Dependencies

```bash
npm install react react-dom @chakra-ui/react @emotion/react @emotion/styled framer-motion gsap axios
```

### Step 2: Copy Components

Copy the following files to your React project:

```
src/
  components/
    StylistWidget.jsx
    TryOnCanvas.jsx
    ProductSuggestion.jsx
  services/
    aiService.js
    cartService.js
    productService.js
```

### Step 3: Update API Endpoints

Edit `src/services/productService.js` and `src/services/cartService.js` to match your API:

```javascript
const API_BASE_URL = 'https://your-api-domain.com/api'
```

### Step 4: Configure AI Service

Edit `src/services/aiService.js` and update:

- AI API endpoint
- API key configuration
- Model selection (GLM vs Kimi)

### Step 5: Use in Your Product Page

```jsx
import { useState } from 'react'
import StylistWidget from './components/StylistWidget'

function ProductPage() {
  const [isStylistOpen, setIsStylistOpen] = useState(false)
  const [userImage, setUserImage] = useState(null)

  return (
    <>
      {/* Your product page content */}
      
      <Button onClick={() => setIsStylistOpen(true)}>
        Open AI Stylist
      </Button>

      <StylistWidget
        isOpen={isStylistOpen}
        onClose={() => setIsStylistOpen(false)}
        userImage={userImage}
      />
    </>
  )
}
```

## API Contract Requirements

Your backend must implement these endpoints:

### Product Endpoints

**GET /api/product/current**
```json
{
  "id": "string",
  "name": "string",
  "image": "url",
  "category": "tshirt|pants|shirt|hoodie|...",
  "color": "string",
  "fit": "regular|slim|oversized",
  "price": number
}
```

**GET /api/products**
```json
[
  { /* product object */ },
  { /* product object */ }
]
```

### Cart Endpoints

**GET /api/cart**
```json
[
  {
    "id": "string",
    "name": "string",
    "image": "url",
    "category": "string",
    "color": "string",
    "fit": "string",
    "price": number,
    "quantity": number
  }
]
```

**POST /api/cart/add**
```json
Request: { "productId": "string" }
Response: { "success": true, "cart": [...] }
```

**DELETE /api/cart/remove/:id**
```json
Response: { "success": true, "cart": [...] }
```

## AI Service Integration

### Option 1: Use Built-in Fallback Logic

The system includes intelligent fallback logic that works without AI APIs. It follows:
- Category matching rules
- Color harmony
- Fit consistency

### Option 2: Integrate GLM API

1. Get API key from GLM provider
2. Set `VITE_GLM_API_KEY` in environment
3. Update `AI_API_BASE_URL` in `aiService.js`

### Option 3: Integrate Kimi API

1. Get API key from Kimi provider
2. Set `VITE_KIMI_API_KEY` in environment
3. Update `AI_API_BASE_URL` in `aiService.js`

### Option 4: Custom AI Integration

Modify `src/services/aiService.js`:

```javascript
export const getStylingSuggestion = async (currentProduct, cartItems, allProducts) => {
  // Your custom AI integration
  const response = await fetch('your-ai-endpoint', {
    method: 'POST',
    body: JSON.stringify({ currentProduct, cartItems, allProducts })
  })
  return response.json()
}
```

## Virtual Try-On Integration

### Option 1: Use idm-vton

```javascript
// In aiService.js, update generateTryOn function
const response = await axios.post('https://your-tryon-api.com/idm-vton', {
  userImage,
  productImage
})
```

### Option 2: Use ootdiffusion

```javascript
const response = await axios.post('https://your-tryon-api.com/ootdiffusion', {
  userImage,
  productImage
})
```

### Option 3: Custom Try-On Service

Replace the `generateTryOn` function in `aiService.js` with your implementation.

## Styling Customization

### Chakra UI Theme

Create `src/theme.js`:

```javascript
import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#...',
      500: '#...',
      600: '#...',
    }
  }
})
```

Then in `main.jsx`:

```javascript
<ChakraProvider theme={theme}>
  <App />
</ChakraProvider>
```

### GSAP Animations

Customize animations in components:

```javascript
// In StylistWidget.jsx
gsap.fromTo(
  widgetRef.current,
  { x: 400, opacity: 0 },
  { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
)
```

## Production Checklist

- [ ] Update all API endpoints
- [ ] Configure environment variables
- [ ] Set up AI service API keys
- [ ] Configure try-on service
- [ ] Test with real product data
- [ ] Test cart integration
- [ ] Test AI suggestions
- [ ] Test try-on generation
- [ ] Optimize images
- [ ] Set up error monitoring
- [ ] Configure CORS
- [ ] Set up rate limiting
- [ ] Test mobile responsiveness

## Troubleshooting

### Widget not opening
- Check if `isOpen` state is properly managed
- Verify Chakra UI Drawer is working

### API errors
- Check network tab for failed requests
- Verify API endpoints are correct
- Check CORS configuration

### AI suggestions not working
- Verify API keys are set
- Check AI service endpoint
- Review fallback logic logs

### Try-on not generating
- Verify user image is uploaded
- Check try-on API endpoint
- Review image format requirements
