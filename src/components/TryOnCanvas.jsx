import React, { useEffect, useRef, useState } from 'react'
import { Box, Image, Spinner, Text } from '@chakra-ui/react'
import { gsap } from 'gsap'

/**
 * TryOnCanvas - Displays virtual try-on images with GSAP animations
 */
const TryOnCanvas = ({ tryOnImage, isLoading, productName }) => {
  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const [displayImage, setDisplayImage] = useState(tryOnImage)

  useEffect(() => {
    if (tryOnImage && imageRef.current) {
      // Fade in animation
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }
      )
      setDisplayImage(tryOnImage)
    }
  }, [tryOnImage])

  return (
    <Box
      ref={canvasRef}
      position="relative"
      width="100%"
      height="400px"
      borderRadius="lg"
      overflow="hidden"
      bg="gray.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {isLoading ? (
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text mt={4} color="gray.600" fontSize="sm">
            Generating your virtual try-on...
          </Text>
        </Box>
      ) : displayImage ? (
        <Image
          ref={imageRef}
          src={displayImage}
          alt={`Virtual try-on: ${productName}`}
          maxW="100%"
          maxH="100%"
          objectFit="contain"
        />
      ) : (
        <Text color="gray.500" fontSize="sm">
          Upload a photo to see virtual try-on
        </Text>
      )}
    </Box>
  )
}

export default TryOnCanvas
