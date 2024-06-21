import React, { useState, useEffect } from 'react';
import StarRating from './StarRatings';
import { submitReviews } from '../../slices/ReviewsState';
import { Button, Box, Input, Flex, Avatar, Text, Center, Container, Image, Textarea, Spacer, useToast } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useDisclosure } from '@chakra-ui/react'
import server from '../../networking'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'

function SubmitReviews() {
  const dispatch = useDispatch();
  const toast = useToast();
  const [foodRating, setFoodRating] = useState(0);
  const [hygieneRating, setHygieneRating] = useState(0);
  const [comments, setComments] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [reviewData, setReviewData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleImageChange = async (event) => {
    const newFiles = Array.from(event.target.files);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    
    setImages(prevImages => [...prevImages, ...newFiles]);
    setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  
    try {
      const formData = new FormData();
      newFiles.forEach((file, index) => {
        formData.append(`images`, file);
      });
  
      const response = await server.post('/reviews/upload-images', formData);
      const imageUrls = response.data.urls;
  
      setImageUrls(prevUrls => [...prevUrls, ...imageUrls]);
      
    } catch (error) {
      console.error('Failed to upload images:', error);
      toast({
        title: 'Failed to upload images.',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleSubmit = () => {
    const currentDate = new Date().toLocaleDateString();
    const sendReviewData = {
      sender: "Susie Jones",
      receiver: "Jamie Oliver",
      foodRating,
      hygieneRating,
      comments,
      images: imageUrls,
      dateCreated: currentDate,
    };

    setReviewData(sendReviewData);
    dispatch(submitReviews(sendReviewData));
    setComments('');
    setImages([]);
    setPreviews([]);
    onClose();
  };

  useEffect(() => {
    const postReview = async () => {
      if (reviewData) {
        try {
          await server.post('/reviews/', reviewData);
          toast({
            title: 'Review submitted successfully!',
            status: 'success',
            isClosable: true,
          });
          console.log('Review submitted successfully!');
        } catch (error) {
          console.error('Failed to submit review:', error);
          toast({
            title: 'Failed to submit review.',
            status: 'error',
            isClosable: true,
          });
        }
      }
    };

    postReview();
  }, [reviewData, toast]);

  const handleClose = () => {
    setComments('');
    setImages([]);
    setPreviews([]);
    onClose();
  };

  return (
    <Box>
      <Button onClick={onOpen} variant={"MMPrimary"}> Submit Reviews </Button>
      <Modal isOpen={isOpen} onClose={handleClose} motionPreset='slideInBottom' isCentered >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit A Review</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" align="center" mb={4}>
              <Image
                borderRadius='full'
                boxSize='100px'
                src='https://bit.ly/dan-abramov'
                alt='Dan Abramov'
              />
              <Text fontSize='3xl' textAlign='center'>Jamie Oliver</Text>
            </Flex>
            <FormControl>
              <Box>
                <Flex>
                  <Flex direction='column'>
                    <Text mt='8px' mb='8px'>Food Rating</Text>
                    <StarRating maxStars={5} rating={foodRating} onChange={setFoodRating} />
                  </Flex>
                  <Spacer />
                  <Flex direction='column'>
                    <Text mt='8px' mb='8px'>Hygiene Rating</Text>
                    <StarRating maxStars={5} rating={hygieneRating} onChange={setHygieneRating} />
                  </Flex>
                </Flex>
              </Box>
              <Text mt='16px' mb='8px'>Comments</Text>
              <Textarea
                placeholder='Write something to the host...'
                size='sm'
                resize='none'
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              <Text mt='16px' mb='8px'>Upload Images</Text>
              <Input pt="4px" type='file' accept='image/*' multiple onChange={handleImageChange} />
              <Flex mt={4} wrap="wrap">
                {previews.map((preview, index) => (
                  <Image
                    key={index}
                    src={preview}
                    alt={`preview ${index}`}
                    boxSize="100px"
                    objectFit="cover"
                    m={1}
                    borderRadius="md"
                  />
                ))}
              </Flex>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' borderRadius='10px' mr={3} onClick={handleClose}>
              Close
            </Button>
            <Button variant='MMPrimary' type='submit' onClick={() => {
              handleSubmit();
              toast({
                title: `Review submitted successfully!`,
                status: 'success',
                isClosable: true,
              });
            }}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>

  )
}

export default SubmitReviews