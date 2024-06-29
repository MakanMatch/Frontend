import React, { useState } from 'react'
import {
    Button, Card, CardBody, CardFooter, TabPanel, Heading, Image, Text, Box, SlideFade, CardHeader, Flex,
    Avatar, useToast
} from "@chakra-ui/react";
import { useDisclosure } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { FaUtensils, FaSoap } from "react-icons/fa";
import server from '../../networking';
import Like from './Like';
import Liked from './Liked';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'

const CreateReview = ({
    username,
    foodRating,
    hygieneRating,
    dateCreated,
    comments,
    images,
    like,
    reviewID,
}) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [imageIndex, setImageIndex] = useState(0);
    const [liked, setLiked] = useState(false);
    const [currentLikeCount, setCurrentLikeCount] = useState(like);

    const handlePrevImage = () => {
        if (imageIndex === 0) {
            setImageIndex(images.length - 1);
        } else {
            setImageIndex(imageIndex - 1);
        }
    }
    const handleNextImage = () => {
        if (imageIndex === images.length - 1) {
            setImageIndex(0);
        } else {
            setImageIndex(imageIndex + 1);
        }
    }

    const toggleLike = async () => {
        try {
            const newLikeCount = liked ? currentLikeCount - 1 : currentLikeCount + 1;

            const response = await server.put(`/reviews/reviews?id=${reviewID}&likeCount=${newLikeCount}`);
            if (response.status === 200) {
                setLiked(!liked);
                setCurrentLikeCount(!liked ? currentLikeCount + 1 : currentLikeCount - 1);
            } else {
                toast({
                    title: "An error occurred",
                    description: response.data,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });

            }
        } catch (error) {
            toast({
                title: "An error occurred",
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }

    return (
        <TabPanel>
            <Card maxW='md' variant="elevated" key={reviewID} p={4} boxShadow="md">
                <CardHeader>
                    <Flex alignItems="center" justifyContent="space-between">
                        <Flex alignItems='center'>
                            {username ? (
                                <Avatar name={username} src='https://bit.ly/sage-adebayo' />
                            ) : (
                                <Avatar src='https://bit.ly/sage-adebayo' />
                            )}
                            <Box ml={4}>
                                <Heading textAlign="left" size='sm'>{username ? username : "Guest"}</Heading>
                                <Flex gap={3}>
                                    <Flex gap={3}>
                                        <Box pt="4px">
                                            <FaUtensils />
                                        </Box>
                                        <Text>{foodRating}</Text>
                                    </Flex>
                                    <Flex gap={3}>
                                        <Box pt="2px">
                                            <FaSoap />
                                        </Box>
                                        <Text>{hygieneRating}</Text>
                                    </Flex>
                                </Flex>
                            </Box>
                        </Flex>
                        <Text fontSize="sm" color="gray.500">{new Date(dateCreated).toLocaleDateString()}</Text>
                    </Flex>
                </CardHeader>
                <CardBody>
                    <Text textAlign="left">{comments}</Text>
                    {images.length > 0 && (
                        <Box position="relative" mt={4}>
                            {images.length > 1 && (
                                <Box position={"absolute"} top="50%" transform="translateY(-50%)" width={"100%"}>
                                    <ChevronLeftIcon boxSize={8} ml={-1} mt={-4} onClick={handlePrevImage} color={"#A9A9A9"} _hover={{ cursor: "pointer", color: "#515F7C", transition: "0.2s ease" }} position={"absolute"} left="-5" zIndex={1} />
                                    <ChevronRightIcon boxSize={8} mr={-1} mt={-4} onClick={handleNextImage} color={"#A9A9A9"} _hover={{ cursor: "pointer", color: "#515F7C", transition: "0.2s ease" }} position={"absolute"} right="-5" zIndex={1} />
                                </Box>
                            )}
                            <SlideFade in={true} offsetY="20px">
                                <Image
                                    onClick={onOpen}
                                    key={images[imageIndex]}
                                    src={images[imageIndex]}
                                    alt="Review image"
                                    borderRadius="lg"
                                    minWidth={"100%"}
                                    minHeight={"108px"}
                                    maxHeight={"200"}
                                    objectFit="cover"
                                    _hover={{ cursor: "pointer" }}
                                />
                            </SlideFade>
                        </Box>

                    )}
                </CardBody>
                <CardFooter>
                    <Button flex='1' variant='ghost' leftIcon={liked ? <Liked /> : <Like />} onClick={toggleLike}>
                        <Text>{currentLikeCount}</Text>
                    </Button>
                </CardFooter>
                <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
                    <ModalOverlay />
                    <ModalContent maxWidth="90vw" maxHeight="80vh" overflow="auto">
                        <ModalHeader>Images</ModalHeader>
                        <ModalCloseButton mt={2} />
                        <ModalBody display="flex" justifyContent="center" alignItems="center" p={0}>
                            <Image src={images[imageIndex]} alt="Review image" maxWidth="100%" maxHeight="100%" />
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='red' borderRadius='10px' onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Card>
        </TabPanel>
    )
}

export default CreateReview