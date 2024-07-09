/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box, Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, Progress, Stack, Text, useToast } from "@chakra-ui/react";
import { InfoOutlineIcon, ArrowBackIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaWallet, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import server from "../../networking";
import configureShowToast from "../../components/showToast";

function DetailedListingCard({ listingID, userID, images, title, shortDescription, approxAddress, portionPrice, totalSlots }) {
    const [imageIndex, setImageIndex] = useState(0);
    const [favourite, setFavourite] = useState(false);
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const navigate = useNavigate();

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

    const toggleFavourite = async () => {
        const favouriteData = {
            userID: userID,
            listingID: listingID
        }
        await server.put("/listings/toggleFavouriteListing", favouriteData)
        .then((response) => {
            if (response.data.favourite === true) {
                setFavourite(true);
            } else {
                setFavourite(false);
            }
        })
        .catch(() => {
            toast.closeAll();
            showToast("Error", "Failed to add/remove listing from favourites", "error", 3000);
        });
    };

    const fetchFavouriteState = async () => {
        const data = { userID: userID };
        const response = await server.get("/cdn/fetchGuestDetails", data);
        const guestFavCuisine = response.data.guestFavCuisine;
        if (guestFavCuisine.includes(listingID)) {
            setFavourite(true);
        } else {
            setFavourite(false);
        }
    }

    useEffect(() => {
        fetchFavouriteState();
    }, []);
    
    return (
        <>
            <style>
                {`
                    .disable-select * {
                        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                        -webkit-touch-callout: none;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                    }

                    .enable-select {
                        -webkit-user-select: text;
                        -moz-user-select: text;
                        -ms-user-select: text;
                        user-select: text;
                    }
                `}
            </style>
            <Card maxW="md" maxH="78vh" borderRadius={6} overflow="hidden" className="disable-select">
                <CardBody>
                    <Box position="relative" width="fit-content">
                        {images.length > 1 && (
                            <Box position={"absolute"} top="50%" transform="translateY(-50%)" width={"100%"}>
                                <ChevronLeftIcon boxSize={8} ml={-1} mt={-4} onClick={handlePrevImage} color={"#A9A9A9"} _hover={{ cursor: "pointer", color: "#515F7C", transition: "0.2s ease" }} position={"absolute"} left="-5" zIndex={1} />
                                <ChevronRightIcon boxSize={8} mr={-1} mt={-4} onClick={handleNextImage} color={"#A9A9A9"} _hover={{ cursor: "pointer", color: "#515F7C", transition: "0.2s ease" }} position={"absolute"} right="-5" zIndex={1} />
                            </Box>
                        )}
                        <Image
                            key={images[imageIndex]}
                            src={images[imageIndex]}
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop if placeholder also fails to load
                                e.target.src = "/placeholderImage.png";
                            }}
                            borderRadius="5px"
                            minWidth="310px"
                            maxWidth="310px"
                            minHeight="175px"
                            maxHeight="175px"
                            objectFit="cover"
                            style={{ pointerEvents: "none" }}
                            className="image"
                        />
                        <Text
                            borderRadius="50%"
                            height="40px"
                            width="40px"
                            boxShadow="0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            position="absolute"
                            top="10px"
                            left="10px"
                            zIndex="10"
                            backgroundColor="white"
                            cursor="pointer"
                            onClick={() => navigate("/")}>
                            <ArrowBackIcon height="50%" />
                        </Text>
                    </Box>
                    <Stack mt="3" spacing={0}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            flexDirection="row"
                            mt={2}
                            mb={5}
                        >
                            <Heading size="md" mt={-2} className="enable-select">{title}</Heading>
                            <Text onClick={toggleFavourite} mt={-2} cursor={"pointer"} className="favouriteButton">
                                {favourite ? "🩷" : "🤍"}
                            </Text>
                        </Box>
                        <Box className="ratingBox">
                            <Box display="flex" alignItems="center" mb={1}>
                                <Text fontSize={"10px"} mr={1} ml={0.5} mt={-2}>1⭐️</Text>
                                <Progress
                                    colorScheme="green"
                                    size="sm"
                                    value={70}
                                    mb={2}
                                    borderRadius="5px"
                                    flex={1}
                                />
                            </Box>
                            <Box display="flex" alignItems="center" mb={1}>
                                <Text fontSize={"10px"} mr={1} mt={-2}>2⭐️</Text>
                                <Progress
                                    colorScheme="green"
                                    size="sm"
                                    value={90}
                                    mb={2}
                                    borderRadius="5px"
                                    flex={1}
                                />
                            </Box>
                            <Box display="flex" alignItems="center" mb={1}>
                                <Text fontSize={"10px"} mr={1} mt={-2}>3⭐️</Text>
                                <Progress
                                    colorScheme="green"
                                    size="sm"
                                    value={30}
                                    mb={2}
                                    borderRadius="5px"
                                    flex={1}
                                />
                            </Box>
                            <Box display="flex" alignItems="center" mb={1}>
                                <Text fontSize={"10px"} mr={1} mt={-2}>4⭐️</Text>
                                <Progress
                                    colorScheme="green"
                                    size="sm"
                                    value={10}
                                    mb={2}
                                    borderRadius="5px"
                                    flex={1}
                                />
                            </Box>
                            <Box display="flex" alignItems="center" mb={1}>
                                <Text fontSize={"10px"} mr={1} mt={-1}>5⭐️</Text>
                                <Progress
                                    colorScheme="green"
                                    size="sm"
                                    value={20}
                                    borderRadius="5px"
                                    flex={1}
                                />
                            </Box>
                        </Box>
                        <Text mt={2} mb={-4} textAlign="left" color="blue" fontSize={"13px"} textDecoration={"underline"} cursor={"pointer"} onClick={() => navigate("/reviews")}>View all reviews</Text>
                    </Stack>
                </CardBody>
                <Divider mt={1} />
                <Box ml={4} mt={2} textAlign="left" fontSize={"15px"}>
                    <Box display="flex" justifyContent={"left"} mb={1}>
                        <Text mr={1}><InfoOutlineIcon fill="#515F7C" /></Text><Text ml={1} className="enable-select">{shortDescription}</Text>
                    </Box>

                    <Box display="flex" justifyContent={"left"} mb={1}>
                        <Text mr={1} mt={1}><FaMapMarkerAlt fill="#515F7C" /></Text><Text ml={1} className="enable-select">{approxAddress}</Text>
                    </Box>

                    <Box display="flex" justifyContent={"left"} mb={1}>
                        <Text mt={1.5} mr={1}><FaWallet fill="#515F7C" /></Text><Text flex={1} ml={1} mt={0.5} className="enable-select">${portionPrice}</Text>
                    </Box>

                    <Box display="flex" justifyContent={"left"} mb={1}>
                        <Text mr={1} mt={0.5}><FaUser fill="#515F7C" /></Text><Text ml={1} className="enable-select">{totalSlots} slots left</Text>
                    </Box>
                </Box>
                <CardFooter display="flex" justifyContent="center">
                    <ButtonGroup spacing="2">
                        <Button variant="MMPrimary" colorScheme="blue" onClick={() => navigate(`/expandedListingGuest?id=${listingID}`)} mt={-4}>
                            Proceed
                        </Button>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </>
    );
}

export default DetailedListingCard;
