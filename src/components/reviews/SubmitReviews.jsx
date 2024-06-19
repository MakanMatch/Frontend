import React from 'react'
import { useState } from 'react';
import StarRating from './StarRatings';
import { submitReviews } from '../../slices/ReviewsState';
import { Button, Box, Input, Flex, Avatar, Text, Center, Container, Image, Textarea, Spacer } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { useDisclosure } from '@chakra-ui/react'
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
import { date } from 'yup';

function SubmitReviews() {
  const dispatch = useDispatch()
  const [foodRating, setFoodRating] = useState(0);
  const [hygieneRating, setHygieneRating] = useState(0)
  const [comments, setComments] = useState('')
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleImageChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setImages(prevImages => [...prevImages, ...newFiles]);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };
  const handleSubmit = () => {
    const currentDate = new Date().toLocaleDateString();
    const reviewData = {
      sender: "Susie Jones",
      receiver: "Jamie Oliver",
      foodRating,
      hygieneRating,
      comments,
      images,
      dateCreated: currentDate
    };
    dispatch(submitReviews(reviewData));
    setComments('');
    setImages([]);
    setPreviews([]);
    onClose();
  };

  return (
    <Box>
      <Button onClick={onOpen} variant={"MMPrimary"}> Submit Reviews </Button>
      <Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInBottom' isCentered >
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
                  <Spacer/>
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
            <Button colorScheme='red' borderRadius='10px' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='MMPrimary' type='submit' onClick={handleSubmit}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>

  )
}

export default SubmitReviews