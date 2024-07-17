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
import DeleteReviewButton from './DeleteReviewButton';
import EditReview from './EditReview';
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
    posterID,
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
                reviewID: reviewID
            }
            const postLikeResponse = await server.post('/likeReview', reviewInfo, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (postLikeResponse.status === 400 || postLikeResponse.status === 500) {
                showToast("An error occurred", "Please try again later.", 3000, true, "error");
                return
            } else {
                const { liked, likeCount } = postLikeResponse.data;
                setLiked(liked);
                setCurrentLikeCount(likeCount);
            }
        } catch (error) {
            showToast("An error occurred", "Please try again later.", 3000, true, "error");
            console.log("Error liking review:", error);
            return
        }
    }
    const renderImages = () => {
        const numImages = images.length;
        if (numImages === 1) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Image
                        onClick={() => handleImageClick(0)}
                        key={images[0]}
                        src={images[0]}
                        alt="Review image"
                        borderRadius="lg"
                        maxWidth={"100%"}
                        minHeight={{ base: '100%', lg: '280px' }}
                        maxHeight={{ base: '100%', lg: '400px' }}
                        objectFit="cover"
                        _hover={{ cursor: "pointer" }}
                    />
                </Box>
            );
        }
        if (numImages === 2) {
            return (
                <Flex direction={{ base: 'column', md: 'row' }}
                    wrap="wrap"
                    gap={2}
                    justifyContent='center'
                    alignItems={{ base: 'center'}}
                >
                    <Image
                        onClick={() => handleImageClick(0)}
                        key={images[0]}
                        src={images[0]}
                        alt="Review image"
                        borderRadius="lg"
                        maxWidth={{ base: '100%', md: '80%' }}
                        minHeight={"200"}
                        maxHeight={"400px"}
                        objectFit="cover"
                        _hover={{ cursor: "pointer" }}
                    />
                    <Image
                        onClick={() => handleImageClick(1)}
                        key={images[1]}
                        src={images[1]}
                        alt="Review image"
                        borderRadius="lg"
                        maxWidth={{ base: '100%', md: '80%' }}
                        minHeight={"200"}
                        maxHeight={"400px"}
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
                    justifyContent="center"
                >
                    <Image
                        onClick={() => handleImageClick(0)}
                        key={images[0]}
                        src={images[0]}
                        alt="Review image"
                        borderRadius="lg"
                        mt={1}
                        maxWidth={{ base: '100%', md: '60%' }}
                        minHeight={"200"}
                        maxHeight={"600px"}
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
                            minWidth={{ base: '100%', md: "100%" }}
                            minHeight={{ base: '160', md: '200' }}
                            maxHeight={{ base: "100%", md: "300px" }}
                            objectFit="cover"
                            _hover={{ cursor: "pointer" }}
                        />
                        <Image
                            onClick={() => handleImageClick(2)}
                            key={images[2]}
                            src={images[2]}
                            alt="Review image"
                            borderRadius="lg"
                            minWidth={{ base: '100%', md: "100%"}}
                            minHeight={{ base: '160', md: '200' }}
                            maxHeight={{ base: "100%", md: "300px" }}
                            objectFit="cover"
                            _hover={{ cursor: "pointer" }}
                        />
                    </Flex>
                </Flex>
            );
        }
        if (numImages === 4) {
            return (
                <Flex direction={{ base: 'column', md: 'row' }}wrap="wrap" gap={2} justifyContent='center' alignItems={{ base: 'center', md: 'flex-start' }}>
                    {images.map((image, index) => (
                        <Image
                            onClick={() => handleImageClick(index)}
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            borderRadius="lg"
                            minWidth={{ base: '100%', md: "calc(50% - 6px)" }}
                            minHeight={"200px"}
                            maxHeight={{ base: "100%", md: "300px" }}
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
                        minHeight={"200px"}
                        maxHeight={{ base: "100%", md: "300px" }}
                        objectFit="cover"
                        _hover={{ cursor: "pointer" }}
                    />
                ))}
                {images.length > 4 && (
                    <Box
                        onClick={onOpen}
                        borderRadius="lg"
                        minWidth={{ base: '100%' }}
                        minHeight={"158px"}
                        bg="gray.200"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="gray.700"
                        fontSize="lg"
                        fontWeight="bold"
                        transition="all 0.3s ease-in-out"
                        _hover={{ cursor: "pointer", bg: "gray.300" }}
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
            <Card maxW={{ base: "100%" }} variant="elevated" key={reviewID} p={4} boxShadow="md">
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
                                                starDimension="13px"
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
                                                starDimension="13px"
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
                <CardFooter justifyContent={{ base: 'center', md: 'flex-start' }} display="flex">
                    <Button variant='ghost'
                        backgroundColor={liked ? 'blue.100' : 'gray.100'}
                        leftIcon={liked ? <Liked /> : <Like />}
                        _hover={{
                            backgroundColor: liked ? 'blue.200' : 'gray.200',
                            color: liked ? 'black' : 'gray.800'
                        }}
                        onClick={toggleLike}>
                        <Text>{currentLikeCount}</Text>
                    </Button>
                    {posterID === guestID && (
                        <Flex ml={4}>
                            <EditReview
                                reviewID={reviewID}
                                reviewFoodRating={foodRating}
                                reviewHygieneRating={hygieneRating}
                                reviewComments={comments}
                                reviewImages={images}
                            />
                            <DeleteReviewButton reviewID={reviewID} />
                        </Flex>
                    )}
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