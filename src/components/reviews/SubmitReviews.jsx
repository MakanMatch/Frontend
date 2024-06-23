import React, { useState, useEffect } from 'react';
import StarRating from './StarRatings';
import { Button, Box, Input, Flex, Avatar, Text, Center, Container, Image, Textarea, Spacer, useToast } from '@chakra-ui/react';
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
    const toast = useToast();
    const [foodRating, setFoodRating] = useState(0);
    const [hygieneRating, setHygieneRating] = useState(0);
    const [comments, setComments] = useState('');
    const [images, setImages] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [reviewData, setReviewData] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleImageChange = async (event) => {
        const newFiles = Array.from(event.target.files);
        setImages(prevImages => [...prevImages, ...newFiles]);
    };

    const handleRemoveImage = (index) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const currentDate = new Date().toISOString();
        const formData = new FormData();
        formData.append('sender', 'Susie Jones');
        formData.append('receiver', 'Jamie Oliver');
        formData.append('foodRating', foodRating);
        formData.append('hygieneRating', hygieneRating);
        formData.append('comments', comments);
        images.forEach((file) => {
            formData.append('file', file);
        });
        formData.append('dateCreated', currentDate);

        try {
            await server.post('/reviews', formData);

            toast({
                title: 'Review submitted successfully!',
                status: 'success',
                isClosable: true,
            });
            console.log('Review submitted successfully!');

            setComments('');
            setImages([]);
            setReviewData(null);
            onClose();

        } catch (error) {
            console.error('Failed to submit review:', error);
            toast({
                title: 'Failed to submit review.',
                status: 'error',
                isClosable: true,
            });
        }
    };

    const handleClose = () => {
        setComments('');
        setImages([]);
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
                                {images.map((image, index) => (
                                    <Box key={index} position="relative" boxSize="100px" m={1}>
                                        <Image
                                            src={URL.createObjectURL(image)}
                                            alt={`preview ${index}`}
                                            boxSize="100px"
                                            objectFit="cover"
                                            borderRadius="md"
                                        />
                                        <Button
                                            size="xs"
                                            position="absolute"
                                            top="0"
                                            right="0"
                                            colorScheme="red"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            X
                                        </Button>
                                    </Box>
                                ))}
                            </Flex>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' borderRadius='10px' mr={3} onClick={handleClose}>
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