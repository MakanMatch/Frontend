import React from 'react'
import { useState } from 'react';
import StarRating from './StarRatings';
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

function SubmitReviews() {
  const dispatch = useDispatch()
  const [foodRating, setFoodRating] = useState(0);
  const [hygieneRating, setHygieneRating] = useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure()
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
                    <StarRating maxStars={5} foodRating={foodRating} setFoodRating={setFoodRating} />
                  </Flex>
                  <Spacer/>
                  <Flex direction='column'>
                    <Text mt='8px' mb='8px'>Hygiene Rating</Text>
                    <StarRating maxStars={5} hygieneRating={hygieneRating} setHygieneRating={setHygieneRating} />
                  </Flex>
                </Flex>
              </Box>
              <Text mt='16px' mb='8px'>Comments</Text>
              <Textarea
                placeholder='Write something to the host...'
                size='sm'
                resize='none'
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' borderRadius='10px' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='MMPrimary' type='submit'>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>

  )
}

export default SubmitReviews