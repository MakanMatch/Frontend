import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StarRating from './StarRatings';
import { Button, Box, Input, Flex, Card, Text, Image, Textarea, Spacer, useToast,Avatar } from '@chakra-ui/react';
import { EditIcon, CloseIcon } from '@chakra-ui/icons';
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
    FormHelperText,
} from '@chakra-ui/react'
import configureShowToast from '../../components/showToast';
import { useNavigate } from "react-router-dom"
import { reloadAuthToken } from '../../slices/AuthState';


const SubmitReviews = ({
    hostName,
    hostID,
    refreshState,
    stateRefresh
}) => {
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const [foodRating, setFoodRating] = useState(1);
    const [hygieneRating, setHygieneRating] = useState(1);
    const [comments, setComments] = useState('');
    const [images, setImages] = useState([]);
    const [fileFormatError, setFileFormatError] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, loaded, authToken } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        if (images.length + files.length > 6) {
            setFileFormatError("You can upload a maximum of 6 images.");
            return;
        }
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
        if (!user) {
            navigate("/auth/login");
            showToast("Please log in", "You need to log in before submitting a review", 3000, true, "info");
            return
        }
        setIsSubmitting(true);
        const currentDate = new Date().toISOString();
        const formData = new FormData();
        formData.append('foodRating', foodRating);
        formData.append('hygieneRating', hygieneRating);
        formData.append('comments', comments);
        images.forEach((file) => {
            formData.append('images', file);
        });
        formData.append('dateCreated', currentDate);
        formData.append('hostID', hostID);

        try {
            const submitReview = await server.post('/submitReview', formData, { headers: { 'Content-Type': 'multipart/form-data' }, transformRequest: formData => formData })
            dispatch(reloadAuthToken(authToken))
            if (submitReview.data && submitReview.data.startsWith("SUCCESS")) {
                showToast("Review submitted successfully", "", 3000, true, "success")
                console.log('Review submitted successfully!');
                setIsSubmitting(false);
                setComments('');
                setImages([]);
                onClose();
                refreshState(!stateRefresh)
            } else {
                showToast("Failed to submit review", "Please try again later", 3000, true, "error");
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken))
            if (error.response.status === 400 && error.response.data.startsWith("UERROR")) {
                setIsSubmitting(false);
                showToast(error.response.data.substring("UERROR: ".length), "", 3000, true, "error");
            } else {
                console.log(error)
                setIsSubmitting(false);
                showToast("Failed to submit review", "Please try again later", 3000, true, "error");
                console.log('Failed to submit review:', error);
            }
        }
    };

    const handleOpenModal = () => {
        if (loaded && (!user || !user.userID)) {
            showToast("Please log in ", "You need to log in before submitting a review", 3000, true, "info");
            navigate('/auth/login');
        } else {
            onOpen();
        }
    };

    const handleClose = () => {
        setComments('');
        setImages([]);
        onClose();
        setFileFormatError("")
    };

    return (
        <Box>
            <Button onClick={handleOpenModal} variant={"MMPrimary"}><EditIcon /></Button>
            <Modal isOpen={isOpen} onClose={handleClose} motionPreset='slideInBottom' isCentered size="lg" scrollBehavior="inside">
                <ModalOverlay />
                <ModalContent overflow="hidden" maxH="90vh" >
                    <ModalHeader>Rate & Tell Your Experience!
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction='column' align="center" mb={4}>
                            <Avatar
                                borderRadius='full'
                                boxSize='100px'
                                // src='https://bit.ly/dan-abramov'
                                name={hostName}
                                alt={hostName}
                            />
                            <Text fontSize={{ base: '2xl', md: '3xl' }} textAlign='center' mt={{ base: 2, md: 0 }} ml={{ base: 0, md: 4 }}>
                                {hostName}
                            </Text>
                        </Flex>
                        <FormControl>
                            <Flex direction={{ base: 'column', md: 'row' }} align="center">
                                <Flex direction='column'>
                                    <Text mt='8px' mb='8px' textAlign={{ base: 'center', md: 'left' }}>Food Rating</Text>
                                    <StarRating maxStars={5} initialRating={foodRating} onChange={setFoodRating} />
                                </Flex>
                                <Spacer display={{ base: 'none', md: 'block' }} />
                                <Flex direction='column'>
                                    <Text mt="8px" mb="8px" textAlign={{ base: 'center', md: 'left' }}>Hygiene Rating</Text>
                                    <StarRating maxStars={5} initialRating={hygieneRating} onChange={setHygieneRating} />
                                </Flex>
                            </Flex>
                            <Text mt='16px' mb='8px' textAlign={{ base: 'center', md: 'left' }}>Comments</Text>
                            <Textarea
                                placeholder='Write something to the host...'
                                size='sm'
                                resize='none'
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                            />
                            <Text mt='16px' mb='8px' textAlign={{ base: 'center', md: 'left' }}>Upload Images</Text>
                            <Input
                                pt={1}
                                type="file"
                                size="md"
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
                                            <Card key={index} mb={2} padding={"13px"} display="flex" flexDirection="row" justifyContent="space-between">
                                                <Text fontSize={"15px"} color={"green"} mt={2}>
                                                    {image.name}
                                                </Text>
                                                <Button onClick={() => handleRemoveImage(index)}>
                                                    <CloseIcon boxSize={3} />
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

                        <>
                            {isSubmitting ? (
                                <Button
                                    isLoading
                                    loadingText="Submitting..."
                                    borderRadius={"10px"}
                                >
                                    Submitting...
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    variant="MMPrimary"
                                >
                                    Submit
                                </Button>
                            )}
                        </>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default SubmitReviews