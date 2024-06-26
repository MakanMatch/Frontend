import React, { useState, useEffect } from 'react';
import StarRating from './StarRatings';
import { Button, Box, Input, Flex, Card, Text, Container, Image, Textarea, Spacer, useToast } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
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
    const [reviewData, setReviewData] = useState(null);
    const [fileFormatError, setFileFormatError] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        let filesAccepted = false;
        for (const file of files) {
            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/svg+xml",
                "image/heic"
            ];
            if (allowedTypes.includes(file.type)) {
                filesAccepted = true;
            } else {
                filesAccepted = false;
                break;
            }
        }
        if (filesAccepted) {
            // set images to previous images + files
            setImages((prevImages) => [...prevImages, ...files]);
            setFileFormatError("");

        } else {
            setFileFormatError("Invalid file format. Only JPEG, JPG, PNG, and SVG are allowed.");
        }
    };    

    const handleRemoveImage = (index) => {
        setImages((prevImages) => prevImages.filter((image, imageIndex) => imageIndex !== index));
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
            await server.post('/reviews', formData, { headers: { 'Content-Type': 'multipart/form-data' }, transformRequest: formData => formData })
                .then((res) => {
                    if (res.data && res.data.startsWith("SUCCESS")) {
                        toast({
                            title: 'Review submitted successfully.',
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                        });
                        console.log('Review submitted successfully!');

                        setComments('');
                        setImages([]);
                        setReviewData(null);
                        onClose();
                    } else {
                        toast({
                            title: 'Error',
                            description: res.data,
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                })
        } catch (error) {
            console.error('Failed to submit review:', error);
            toast({
                title: 'Failed to submit review.',
                status: 'error',
                duration: 3000,
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
                            <Text>Upload Images</Text>
                            <Input
                                pt={0.5}
                                type="file"
                                size="sm"
                                onChange={handleFileChange}
                                multiple
                            />
                            {fileFormatError && (
                                <FormHelperText color="red">
                                    {fileFormatError}
                                </FormHelperText>
                            )}
                            <Box mt={2}>
                                {images.length > 0 && (
                                    <>
                                        <FormLabel>Selected images:</FormLabel>
                                        {images.map((image, index) => (
                                            <Card key={index} mb={2} padding={"13px"} display="flex" flexDirection={"row"} justifyContent={"space-between"}>
                                                <Text fontSize={"15px"} color={"green"} mt={2}>
                                                    {image.name}
                                                </Text>
                                                <Button onClick={() => handleRemoveImage(index)}>
                                                    <CloseIcon boxSize={3}/>
                                                </Button>
                                            </Card>
                                        ))}
                                    </>
                                )}
                            </Box>
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