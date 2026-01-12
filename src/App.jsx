import React, { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Image,
  Card,
  CardBody,
  Input,
  useToast,
  Badge,
  Divider
} from '@chakra-ui/react'
import { gsap } from 'gsap'
import StylistWidget from './components/StylistWidget'
import { getCurrentProduct } from './services/productService'

/**
 * Main App Component - E-commerce product page with AI Stylist integration
 */
function App() {
  const [isStylistOpen, setIsStylistOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [userImage, setUserImage] = useState(null)
  const [userImagePreview, setUserImagePreview] = useState(null)
  const toast = useToast()

  // Load current product on mount
  React.useEffect(() => {
    loadCurrentProduct()
  }, [])

  const loadCurrentProduct = async () => {
    try {
      const product = await getCurrentProduct()
      setCurrentProduct(product)
    } catch (error) {
      console.error('Error loading product:', error)
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setUserImage(reader.result)
          setUserImagePreview(reader.result)
          toast({
            title: 'Image uploaded!',
            description: 'Your photo is ready for virtual try-on.',
            status: 'success',
            duration: 3000,
            isClosable: true
          })
        }
        reader.readAsDataURL(file)
      } else {
        toast({
          title: 'Invalid file',
          description: 'Please upload an image file.',
          status: 'error',
          duration: 3000,
          isClosable: true
        })
      }
    }
  }

  const handleOpenStylist = () => {
    setIsStylistOpen(true)
    // Animate button
    gsap.to('.stylist-button', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    })
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="1200px" py={8}>
        {/* Header */}
        <VStack spacing={4} align="stretch" mb={8}>
          <Heading size="xl" color="gray.800">
            Virtual Try-On & AI Styling Agent
          </Heading>
          <Text color="gray.600">
            Experience AI-powered fashion styling with virtual try-on technology
          </Text>
        </VStack>

        {/* Product Display Section */}
        {currentProduct && (
          <Card borderRadius="lg" boxShadow="lg" mb={6} bg="white">
            <CardBody>
              <HStack spacing={8} align="flex-start">
                {/* Product Image */}
                <Box flex="1">
                  <Image
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    borderRadius="lg"
                    maxH="500px"
                    objectFit="cover"
                    width="100%"
                  />
                </Box>

                {/* Product Info */}
                <Box flex="1">
                  <VStack align="stretch" spacing={4}>
                    <Box>
                      <Heading size="lg" color="gray.800" mb={2}>
                        {currentProduct.name}
                      </Heading>
                      <HStack spacing={2} mb={4}>
                        <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
                          {currentProduct.category}
                        </Badge>
                        <Badge colorScheme="gray" borderRadius="full" px={3} py={1}>
                          {currentProduct.color}
                        </Badge>
                        <Badge colorScheme="purple" borderRadius="full" px={3} py={1}>
                          {currentProduct.fit} fit
                        </Badge>
                      </HStack>
                      <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                        ${currentProduct.price?.toFixed(2)}
                      </Text>
                    </Box>

                    <Divider />

                    {/* User Image Upload */}
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.700">
                        Upload Your Photo for Virtual Try-On
                      </Text>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        size="sm"
                        mb={2}
                      />
                      {userImagePreview && (
                        <Box mt={2}>
                          <Image
                            src={userImagePreview}
                            alt="Your photo"
                            maxH="150px"
                            borderRadius="md"
                            border="2px solid"
                            borderColor="blue.200"
                          />
                        </Box>
                      )}
                    </Box>

                    {/* Open Stylist Button */}
                    <Button
                      className="stylist-button"
                      colorScheme="purple"
                      size="lg"
                      onClick={handleOpenStylist}
                      width="100%"
                      _hover={{ bg: 'purple.600', transform: 'translateY(-2px)' }}
                      boxShadow="md"
                    >
                      🎨 Open AI Stylist
                    </Button>

                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      Get personalized styling suggestions and virtual try-on preview
                    </Text>
                  </VStack>
                </Box>
              </HStack>
            </CardBody>
          </Card>
        )}

        {/* Info Section */}
        <Card borderRadius="lg" bg="blue.50" borderLeft="4px solid" borderColor="blue.500">
          <CardBody>
            <VStack align="stretch" spacing={3}>
              <Heading size="md" color="gray.800">
                How It Works
              </Heading>
              <VStack align="stretch" spacing={2}>
                <HStack>
                  <Text fontWeight="bold" color="blue.600">1.</Text>
                  <Text color="gray.700">
                    View a product and upload your photo (optional)
                  </Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" color="blue.600">2.</Text>
                  <Text color="gray.700">
                    Open the AI Stylist to see your cart and current product
                  </Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" color="blue.600">3.</Text>
                  <Text color="gray.700">
                    Get AI-powered styling suggestions with virtual try-on preview
                  </Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold" color="blue.600">4.</Text>
                  <Text color="gray.700">
                    Add suggested items to your cart with one click
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Container>

      {/* AI Stylist Widget */}
      <StylistWidget
        isOpen={isStylistOpen}
        onClose={() => setIsStylistOpen(false)}
        userImage={userImage}
      />
    </Box>
  )
}

export default App
