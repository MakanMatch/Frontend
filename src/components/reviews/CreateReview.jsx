import React, { useState, useRef } from 'react'
import {
    Button, Card, CardBody, CardFooter, TabPanel, Heading, Image, Text, Box, CardHeader, Flex,
    Avatar, useToast, Divider
} from "@chakra-ui/react";
import { useDisclosure } from '@chakra-ui/react'
import { FaUtensils, FaSoap, FaStar, FaRegStar } from "react-icons/fa";
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
import StarRatings from 'react-star-ratings';

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
    const [modalImageIndex, setModalImageIndex] = useState(null);

    const imageRefs = useRef([]);

    const handleImageClick = (index) => {
        setModalImageIndex(index);
        onOpen();
        setTimeout(() => {
            imageRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 0);
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
                    onClick={() => handleImageClick(0)}
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
                <Flex direction={{ base: 'column', md: 'row' }}
                    wrap="wrap"
                    gap={2}
                >
                    <Image
                        onClick={() => handleImageClick(0)}
                        key={images[0]}
                        src={images[0]}
                        alt="Review image"
                        borderRadius="lg"
                        minWidth={{ base: '100%', md: '50%' }}
                        minHeight={"108px"}
                        maxHeight={"200"}
                        objectFit="cover"
                        _hover={{ cursor: "pointer" }}
                    />
                    <Image
                        onClick={() => handleImageClick(1)}
                        key={images[1]}
                        src={images[1]}
                        alt="Review image"
                        borderRadius="lg"
                        minWidth={{ base: '100%', md: '50%' }}
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
                <Flex direction={{ base: 'column', md: 'row' }}
                    wrap="wrap"
                    gap={2}
                >
                    <Image
                        onClick={() => handleImageClick(0)}
                        key={images[0]}
                        src={images[0]}
                        alt="Review image"
                        borderRadius="lg"
                        minWidth={{ base: '100%', md: '50%' }}
                        minHeight={"108px"}
                        maxHeight={"200"}
                        objectFit="cover"
                        _hover={{ cursor: "pointer" }}
                    />
                    <Flex direction={{ base: "row", md: "column" }} ml={2} flex="1" wrap="wrap">
                        <Image
                            onClick={() => handleImageClick(1)}
                            key={images[1]}
                            src={images[1]}
                            alt="Review image"
                            borderRadius="lg"
                            minWidth={"100%"}
                            minHeight={{ base: '50%', md: '50%' }}
                            maxHeight={"100px"}
                            objectFit="cover"
                            _hover={{ cursor: "pointer" }}
                        />
                        <Image
                            onClick={() => handleImageClick(2)}
                            key={images[2]}
                            src={images[2]}
                            alt="Review image"
                            borderRadius="lg"
                            minWidth={"100%"}
                            minHeight={{ base: '50%', md: '50%' }}
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
                            onClick={() => handleImageClick(index)}
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            borderRadius="lg"
                            minWidth={{ base: '100%', md: "calc(50% - 6px)" }}
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
                        onClick={() => handleImageClick(index)}
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        borderRadius="lg"
                        minWidth={{ base: '100%', md: "calc(50% - 6px)" }}
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
                        minWidth={{ base: '100%' }}
                        minHeight={"108px"}
                        bg="gray.200"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="gray.700"
                        fontSize="lg"
                        fontWeight="bold"
                        _hover={{ cursor: "pointer" }}
                        textAlign="center"
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
                    <Flex direction={{ base: 'column', md: 'row' }}
                        alignItems={{ base: 'flex-start', md: 'center' }}
                        justifyContent="space-between"
                        wrap="wrap">
                        <Flex alignItems='center' mb={{ base: 2, md: 0 }}>
                            {username ? (
                                <Avatar name={username} src='https://bit.ly/sage-adebayo' />
                            ) : (
                                <Avatar src='https://bit.ly/sage-adebayo' />
                            )}
                            <Box ml={4}>
                                <Heading textAlign="left" size='sm'>{username ? username : "Guest"}</Heading>
                                <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 2, md: 5 }} mt={1}>
                                    <Flex alignItems="center" gap={2}>
                                        <Box pt="5px">
                                            <FaUtensils />
                                        </Box>
                                        {/* Show StarRatings on medium and larger screens */}
                                        <Box display={{ base: 'none', md: 'block' }}>
                                            <StarRatings
                                                rating={foodRating}
                                                starRatedColor="gold"
                                                numberOfStars={5}
                                                name='foodRating'
                                                starDimension="15px"
                                                starSpacing="1px"
                                                starFull={<FaStar />}
                                                starEmpty={<FaRegStar />}
                                            />
                                        </Box>
                                        {/* Show numeric rating and star icon on smaller screens */}
                                        <Box display={{ base: 'flex', md: 'none' }} alignItems="center" gap={1}>
                                            <Text fontSize="sm">{foodRating}</Text>
                                            <FaStar color="gold" />
                                        </Box>
                                    </Flex>
                                    <Flex alignItems="center" gap={2}>
                                        <Box pt="5px">
                                            <FaSoap />
                                        </Box>
                                        {/* Show StarRatings on medium and larger screens */}
                                        <Box display={{ base: 'none', md: 'block' }}>
                                            <StarRatings
                                                rating={hygieneRating}
                                                starRatedColor="gold"
                                                numberOfStars={5}
                                                name='hygieneRating'
                                                starDimension="15px"
                                                starSpacing="1px"
                                                starFull={<FaStar />}
                                                starEmpty={<FaRegStar />}
                                            />
                                        </Box>
                                        {/* Show numeric rating and star icon on smaller screens */}
                                        <Box display={{ base: 'flex', md: 'none' }} alignItems="center" gap={1}>
                                            <Text fontSize="sm">{hygieneRating}</Text>
                                            <FaStar color="gold" />
                                        </Box>
                                    </Flex>
                                </Flex>
                            </Box>
                        </Flex>
                        <Box textAlign={{ base: 'center', md: 'right' }}
                            width={{ base: '100%', md: 'auto' }}
                            mt={{ base: 8, md: 6 }}>
                            <Text fontSize="sm" color="gray.500">{new Date(dateCreated).toLocaleDateString()}</Text>
                        </Box>
                    </Flex>
                </CardHeader>
                {comments && (<Text textAlign="left" mb={4}>{comments}</Text>)}
                {images && images.filter(image => image !== null).length > 0 && (
                    <CardBody>
                        <Text textAlign="left" mb={4}>{comments}</Text>
                        {renderImages()}
                    </CardBody>
                )}
                <CardFooter>
                    <Button flex='1' variant='ghost' leftIcon={liked ? <Liked /> : <Like />} onClick={toggleLike}>
                        <Text>{currentLikeCount}</Text>
                    </Button>
                </CardFooter>
                <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
                    <ModalOverlay />
                    <ModalContent maxWidth="90vw" maxHeight="80vh" overflow="auto">
                        <ModalHeader>Review Images</ModalHeader>
                        <ModalCloseButton mt={2} />
                        <ModalBody display="flex" justifyContent="center" alignItems="center" p={0}>
                            <Flex direction="column" alignItems="center">
                                {images.map((image, index) => (
                                    <React.Fragment key={index}>
                                        <Image
                                            ref={el => (imageRefs.current[index] = el)}
                                            src={image}
                                            alt={`Review image ${index + 1}`}
                                            maxWidth="100%"
                                            maxHeight="80vh"
                                            mt={10}
                                            mb={10}
                                            objectFit="cover"
                                            onClick={() => handleImageClick(index)}
                                            _hover={{ cursor: "pointer" }}
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