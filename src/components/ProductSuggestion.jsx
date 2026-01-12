import React from 'react'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Text,
  Badge,
  HStack,
  VStack,
  useToast
} from '@chakra-ui/react'
import { addToCart } from '../services/cartService'

/**
 * ProductSuggestion - Displays AI-suggested product with styling explanation
 */
const ProductSuggestion = ({ suggestion, onAddToCart }) => {
  const toast = useToast()

  const handleAddToCart = async () => {
    try {
      const result = await addToCart(suggestion.product.id)
      if (result.success !== false) {
        toast({
          title: 'Added to cart!',
          description: `${suggestion.product.name} has been added to your cart.`,
          status: 'success',
          duration: 3000,
          isClosable: true
        })
        if (onAddToCart) {
          onAddToCart(suggestion.product)
        }
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add product to cart. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  if (!suggestion || !suggestion.product) {
    return null
  }

  const { product, reason, styleTags } = suggestion

  return (
    <Card
      borderRadius="lg"
      boxShadow="lg"
      overflow="hidden"
      bg="white"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
    >
      <Box position="relative">
        <Image
          src={product.image}
          alt={product.name}
          width="100%"
          height="250px"
          objectFit="cover"
        />
        <Box
          position="absolute"
          top="2"
          right="2"
          bg="blue.500"
          color="white"
          px={2}
          py={1}
          borderRadius="md"
          fontSize="xs"
          fontWeight="bold"
        >
          AI SUGGESTED
        </Box>
      </Box>

      <CardBody>
        <VStack align="stretch" spacing={3}>
          <Heading size="md" color="gray.800">
            {product.name}
          </Heading>

          <HStack spacing={2} flexWrap="wrap">
            {styleTags.map((tag, index) => (
              <Badge
                key={index}
                colorScheme={
                  tag === 'formal' ? 'purple' : tag === 'streetwear' ? 'orange' : 'blue'
                }
                borderRadius="full"
                px={2}
                py={1}
              >
                {tag}
              </Badge>
            ))}
          </HStack>

          <Box>
            <Text fontSize="sm" color="gray.600" fontWeight="semibold" mb={1}>
              Why this works:
            </Text>
            <Text fontSize="sm" color="gray.700" lineHeight="1.6">
              {reason}
            </Text>
          </Box>

          <HStack justify="space-between" pt={2}>
            <Text fontSize="lg" fontWeight="bold" color="blue.600">
              ${product.price?.toFixed(2) || 'N/A'}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {product.color} • {product.fit} fit
            </Text>
          </HStack>
        </VStack>
      </CardBody>

      <CardFooter pt={0}>
        <Button
          colorScheme="blue"
          size="md"
          width="100%"
          onClick={handleAddToCart}
          _hover={{ bg: 'blue.600' }}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductSuggestion
