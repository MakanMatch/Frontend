import React, { useState, useRef, useEffect } from 'react'
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
import configureShowToast from '../showToast';

const CreateReview = ({
    username,
    foodRating,
    hygieneRating,
    dateCreated,
    comments,
    images,
    likeCount,
    reviewID,
    guestID,
    isLiked
}) => {
    const toast = useToast();
    const showToast = configureShowToast(toast)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [liked, setLiked] = useState(isLiked);
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const imageRefs = useRef([]);

    useEffect(() => {
        // Fetch the like status when component mounts or guestID changes
        const fetchLikeStatus = async () => {
            try {
                const response = await server.get(`/likeReview?reviewID=${reviewID}&guestID=${guestID}`);
                if (response.status === 400 || response.status === 500) {
                    showToast("An error occurred", "Please try again later.", 3000, true, "error");
                } else {
                    setLiked(response.data.liked);
                }
            } catch (error) {
                showToast("An error occurred", "Please try again later.", 3000, true, "error");
            }
        };
        fetchLikeStatus();
    }, [reviewID, guestID]);

    const handleProfileClick = (image) => {
        setProfileImage(image);
        setIsProfileOpen(true);
    }

    const handleImageClick = (index) => {
        onOpen();
        setTimeout(() => {
            imageRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 0);
    }

    const toggleLike = async () => {
        try {
            const reviewInfo = {
                reviewID: reviewID,
                guestID: guestID
            }
            const postLikeResponse = await server.post('/likeReview', reviewInfo, {headers: {
                'Content-Type': 'application/json',
            }});
            if (postLikeResponse.status === 400 || postLikeResponse.status === 500) {
                showToast("An error occurred", "Please try again later.", 3000, true, "error");
            } else {
                const fetchLikeStatus = await server.get(`/likeReview?reviewID=${reviewID}&guestID=${guestID}`);
                if (fetchLikeStatus.status === 400 || fetchLikeStatus.status === 500) {
                    showToast("An error occurred", "Please try again later.", 3000, true, "error");
                } else {
                    if (fetchLikeStatus.data.liked) {
                        setLiked(true);
                        setCurrentLikeCount(currentLikeCount + 1);
                    } else {
                        setLiked(false);
                        setCurrentLikeCount(currentLikeCount - 1);
                    }
                }
            }
        } catch (error) {
            showToast("An error occurred", "Please try again later.", 3000, true, "error");
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
                    minHeight={"200px"}
                    maxHeight={"400px"}
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
                    justifyContent='center'
                    alignItems={{ base: 'center', md: 'flex-start' }}
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
                        maxWidth={{ base: '100%', md: '60%' }}
                        minHeight={"108px"}
                        maxHeight={"200"}
                        objectFit="cover"
                        _hover={{ cursor: "pointer" }}
                    />
                    <Flex direction="row" ml={{ base: 0, md: 2 }} flex="1" wrap="wrap" justifyContent="space-between" gap={2}>
                        <Image
                            onClick={() => handleImageClick(1)}
                            key={images[1]}
                            src={images[1]}
                            alt="Review image"
                            borderRadius="lg"
                            minWidth={"100%"}
                            minHeight={{ base: '50%', md: '50%' }}
                            maxHeight={{ base: "200px", md: "100px" }}
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
                            maxHeight={{ base: "200px", md: "100px" }}
                            objectFit="cover"
                            _hover={{ cursor: "pointer" }}
                        />
                    </Flex>
                </Flex>
            );
        }
        if (numImages === 4) {
            return (
                <Flex wrap="wrap" gap={2} justifyContent='center' alignItems={{ base: 'center', md: 'flex-start' }}>
                    {images.map((image, index) => (
                        <Image
                            onClick={() => handleImageClick(index)}
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            borderRadius="lg"
                            minWidth={{ base: '100%', md: "calc(50% - 6px)" }}
                            minHeight={"108px"}
                            maxHeight={"120px"}
                            objectFit="cover"
                            _hover={{ cursor: "pointer" }}
                        />
                    ))}
                </Flex>
            );
        }
        return (
            <Flex wrap="wrap" gap={2} justifyContent='center' alignItems={{ base: 'center', md: 'flex-start' }}>
                {images.slice(0, 4).map((image, index) => (
                    <Image
                        onClick={() => handleImageClick(index)}
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        borderRadius="lg"
                        minWidth={{ base: '100%', md: "calc(50% - 6px)" }}
                        minHeight={"108px"}
                        maxHeight={"120px"}
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
                                <Avatar name={username} src='https://bit.ly/sage-adebayo'
                                    onClick={() => handleProfileClick('https://bit.ly/sage-adebayo')}
                                    _hover={{ cursor: "pointer" }} />
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
                <CardBody>
                    {comments && (<Text textAlign="left" mb={4}>{comments}</Text>)}
                </CardBody>
                {images && images.filter(image => image !== null).length > 0 && (
                    <CardBody>
                        {renderImages()}
                    </CardBody>
                )}
                <CardFooter>
                    <Button flex='1' variant='ghost'
                        backgroundColor={liked ? 'blue.100' : 'gray.100'}
                        leftIcon={liked ? <Liked /> : <Like />}
                        _hover={{
                            backgroundColor: liked ? 'blue.300' : 'gray.200',
                            color: liked ? 'white' : 'gray.800'
                        }}
                        onClick={toggleLike}>
                        <Text>{currentLikeCount}</Text>
                    </Button>
                </CardFooter>
                <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} size="lg" isCentered>
                <ModalOverlay />
                <ModalContent maxW="max-content" background="transparent" boxShadow="none">
                        <Image
                            boxSize='500px'
                            borderRadius='full'
                            src='https://bit.ly/sage-adebayo'
                            alt='Dan Abramov'
                        />
                </ModalContent>
                </Modal>
                <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
                    <ModalOverlay />
                    <ModalContent maxWidth="90vw" maxHeight="80vh" overflow="auto">
                        <ModalHeader>Review Images</ModalHeader>
                        <ModalCloseButton mt={2} />
                        <ModalBody display="flex" justifyContent="center" alignItems="center" p={0}>
                            <Flex direction="column" alignItems="center">
                                {images.map((image, index) => (
                                    <Box key={index}>
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
                                    </Box>
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