import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  IconButton,
  Divider,
  Badge,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react'
import { gsap } from 'gsap'
import TryOnCanvas from './TryOnCanvas'
import ProductSuggestion from './ProductSuggestion'
import { getStylingSuggestion, generateTryOn, generateCompositeTryOn } from '../services/aiService'
import { getCurrentProduct, getAllProducts } from '../services/productService'
import { getCart } from '../services/cartService'

/**
 * StylistWidget - Main floating AI stylist widget
 */
const StylistWidget = ({ isOpen, onClose, userImage }) => {
  const widgetRef = useRef(null)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [suggestion, setSuggestion] = useState(null)
  const [tryOnImage, setTryOnImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load data on mount and when widget opens
  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  // GSAP animation for widget entrance
  useEffect(() => {
    if (isOpen && widgetRef.current) {
      gsap.fromTo(
        widgetRef.current,
        { x: 400, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [isOpen])

  const loadData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch current product and cart in parallel
      const [product, cart] = await Promise.all([
        getCurrentProduct(),
        getCart()
      ])

      setCurrentProduct(product)
      setCartItems(cart)

      // Get AI styling suggestion
      const allProducts = await getAllProducts()
      const suggestionResult = await getStylingSuggestion(product, cart, allProducts)
      setSuggestion(suggestionResult)

      // Generate try-on if user image is available
      if (userImage) {
        const tryOn = await generateTryOn(userImage, product.image)
        setTryOnImage(tryOn)

        // Generate composite try-on with suggested product if available
        if (suggestionResult.product) {
          const compositeTryOn = await generateCompositeTryOn(userImage, [
            product,
            suggestionResult.product
          ])
          if (compositeTryOn) {
            setTryOnImage(compositeTryOn)
          }
        }
      }
    } catch (err) {
      console.error('Error loading stylist data:', err)
      setError('Failed to load styling suggestions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }


  const handleRefresh = () => {
    loadData()
  }

  if (!isOpen) return null

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent ref={widgetRef}>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <HStack spacing={2}>
            <Heading size="md">AI Stylist</Heading>
            <Badge colorScheme="purple" borderRadius="full">
              LIVE
            </Badge>
          </HStack>
        </DrawerHeader>

        <DrawerBody p={6}>
          <VStack spacing={6} align="stretch">
            {/* Current Product Info */}
            {currentProduct && (
              <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  Currently Viewing
                </Text>
                <Box
                  p={3}
                  bg="blue.50"
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderColor="blue.500"
                >
                  <Text fontWeight="semibold" color="gray.800">
                    {currentProduct.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {currentProduct.color} • {currentProduct.fit} fit
                  </Text>
                </Box>
              </Box>
            )}

            {/* Cart Summary */}
            {cartItems.length > 0 && (
              <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>
                  In Your Cart ({cartItems.length})
                </Text>
                <VStack spacing={2} align="stretch">
                  {cartItems.map((item) => (
                    <Box
                      key={item.id}
                      p={2}
                      bg="gray.50"
                      borderRadius="md"
                      fontSize="sm"
                    >
                      {item.name}
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}

            <Divider />

            {/* Error State */}
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            {/* Loading State */}
            {isLoading ? (
              <Box textAlign="center" py={8}>
                <Spinner size="xl" color="blue.500" thickness="4px" />
                <Text mt={4} color="gray.600">
                  Analyzing your style...
                </Text>
              </Box>
            ) : (
              <>
                {/* Try-On Canvas */}
                <Box>
                  <Text fontSize="sm" color="gray.600" mb={2} fontWeight="semibold">
                    Virtual Try-On Preview
                  </Text>
                  <TryOnCanvas
                    tryOnImage={tryOnImage}
                    isLoading={isLoading}
                    productName={currentProduct?.name}
                  />
                </Box>

                {/* AI Suggestion */}
                {suggestion && (
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={2} fontWeight="semibold">
                      Styling Suggestion
                    </Text>
                    <ProductSuggestion
                      suggestion={suggestion}
                      onAddToCart={(product) => {
                        // Refresh cart after adding
                        getCart().then(setCartItems)
                      }}
                    />
                  </Box>
                )}

                {/* Refresh Button */}
                <Button
                  colorScheme="gray"
                  variant="outline"
                  onClick={handleRefresh}
                  size="sm"
                >
                  Refresh Suggestions
                </Button>
              </>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

export default StylistWidget
