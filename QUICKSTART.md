# Quick Start Guide

Get the Virtual Try-On & AI Styling Agent running in 5 minutes!

## 🚀 Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## 🧪 Testing with Mock API

1. **Start the mock API server** (in a separate terminal):
   ```bash
   # Install Express (if not already installed)
   npm install express cors
   
   # Run the example server
   node server-example.js
   ```

2. **Update `.env` file**:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

3. **Restart the dev server**:
   ```bash
   npm run dev
   ```

## 📝 What You'll See

1. **Product Page**: Displays a sample product with details
2. **Upload Photo**: Click to upload your photo for virtual try-on
3. **Open AI Stylist**: Click the purple button to open the styling widget
4. **Styling Suggestions**: See AI-powered product recommendations
5. **Virtual Try-On**: View generated try-on previews (when photo is uploaded)

## 🔧 Next Steps

1. **Connect to Real APIs**: Update API endpoints in `src/services/`
2. **Add AI Keys**: Configure GLM or Kimi API keys in `.env`
3. **Integrate Try-On**: Connect to your try-on service
4. **Customize Styling**: Modify Chakra UI theme
5. **Deploy**: Build with `npm run build`

## 📚 Documentation

- **README.md**: Full project documentation
- **INTEGRATION.md**: Detailed integration guide
- **Code Comments**: Inline documentation in all files

## 🐛 Troubleshooting

**Port already in use?**
- Change port in `vite.config.js`

**API errors?**
- Check that mock server is running
- Verify API endpoints in `.env`

**Styling issues?**
- Clear browser cache
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 💡 Features to Try

- ✅ Upload different photos
- ✅ Add items to cart
- ✅ View styling suggestions
- ✅ See color and fit matching
- ✅ Test with different products

Enjoy your AI Styling Agent! 🎨
