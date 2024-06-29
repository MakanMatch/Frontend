import React, { useState } from 'react'
import {
    Button, Card, CardBody, CardFooter, TabPanel, Heading, Image, Text, Box, SlideFade, CardHeader, Flex,
    Avatar, useToast, Divider
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

    const renderImages = () => {
        const numImages = images.length;
        if (numImages === 1) {
            return (
                <Image
                    onClick={onOpen}
                    key={images[0]}
                    src={images[0]}
                    alt="Review image"
                    borderRadius="lg"
                    minWidth={"100%"}
                    minHeight={"108px"}
                    maxHeight={"200"}
                    objectFit="cover"
                    _hover={{ cursor: "pointer" }}
                />
            );
        }
        if (numImages === 2) {
            return (
                <Flex>
                    <Image
                        onClick={onOpen}
                        key={images[0]}
                        src={images[0]}
                        alt="Review image"
                        borderRadius="lg"
                        minWidth={"50%"}
                        minHeight={"108px"}
                        maxHeight={"200"}
                        objectFit="cover"
                        _hover={{ cursor: "pointer" }}
                    />
                    <Image
                        onClick={onOpen}
                        key={images[1]}
                        src={images[1]}
                        alt="Review image"
                        borderRadius="lg"
                        minWidth={"50%"}
                        minHeight={"108px"}
                        maxHeight={"200"}
                        objectFit="cover"
                        _hover={{ cursor: "pointer" }}
                    />
                </Flex>
            );
        }
        if (numImages === 3) {
            return (
                <Flex>
                    <Image
                        onClick={onOpen}
                        key={images[0]}
                        src={images[0]}
                        alt="Review image"
                        borderRadius="lg"
                        minWidth={"50%"}
                        minHeight={"108px"}
                        maxHeight={"200"}
                        objectFit="cover"
                        _hover={{ cursor: "pointer" }}
                    />
                    <Flex direction="column" ml={2} flex="1">
                        <Image
                            onClick={onOpen}
                            key={images[1]}
                            src={images[1]}
                            alt="Review image"
                            borderRadius="lg"
                            minWidth={"100%"}
                            minHeight={"50%"}
                            maxHeight={"100px"}
                            objectFit="cover"
                            _hover={{ cursor: "pointer" }}
                        />
                        <Image
                            onClick={onOpen}
                            key={images[2]}
                            src={images[2]}
                            alt="Review image"
                            borderRadius="lg"
                            minWidth={"100%"}
                            minHeight={"50%"}
                            maxHeight={"100px"}
                            objectFit="cover"
                            _hover={{ cursor: "pointer" }}
                        />
                    </Flex>
                </Flex>
            );
        }
        if (numImages === 4) {
            return (
                <Flex wrap="wrap" gap={2}>
                    {images.map((image, index) => (
                        <Image
                            onClick={onOpen}
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            borderRadius="lg"
                            minWidth={"calc(50% - 8px)"}
                            minHeight={"108px"}
                            maxHeight={"100px"}
                            objectFit="cover"
                            _hover={{ cursor: "pointer" }}
                        />
                    ))}
                </Flex>
            );
        }
        return (
            <Flex wrap="wrap" gap={2}>
                {images.slice(0, 4).map((image, index) => (
                    <Image
                        onClick={onOpen}
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        borderRadius="lg"
                        minWidth={"calc(25% - 8px)"}
                        minHeight={"108px"}
                        maxHeight={"100px"}
                        objectFit="cover"
                        _hover={{ cursor: "pointer" }}
                    />
                ))}
                {images.length > 4 && (
                    <Box
                        onClick={onOpen}
                        borderRadius="lg"
                        minWidth={"calc(25% - 8px)"}
                        minHeight={"108px"}
                        bg="gray.200"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="gray.700"
                        fontSize="lg"
                        fontWeight="bold"
                        _hover={{ cursor: "pointer" }}
                    >
                        +{images.length - 4}
                    </Box>
                )}
            </Flex>
        );
    }

    return (
        <TabPanel>
            <Card maxW='lg' variant="elevated" key={reviewID} p={4} boxShadow="md">
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
                    {renderImages()}
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
                        <Flex direction="column" alignItems="center">
                                {images.map((image, index) => (
                                    <React.Fragment key={index}>
                                        <Image
                                            src={image}
                                            alt={`Review image ${index + 1}`}
                                            maxWidth="100%"
                                            maxHeight="80vh"
                                            mb={2}
                                            objectFit="contain"
                                            p={4}
                                        />
                                        {index < images.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </Flex>
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