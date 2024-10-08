/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Box, Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, Progress, Stack, Text, useToast, Skeleton, WrapItem, Tooltip, ScaleFade, Badge } from "@chakra-ui/react";
import { InfoOutlineIcon, ArrowBackIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FaWallet, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reloadAuthToken } from "../../slices/AuthState";
import { motion } from "framer-motion";
import server from "../../networking";

function ListingCardOverlay({ listingID, hostID, images, title, shortDescription, approxAddress, portionPrice, totalSlots, displayToast, flaggedForHygiene }) {
    const [imageIndex, setImageIndex] = useState(0);
    const [favourite, setFavourite] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const [oneStarRatings, setOneStarRatings] = useState(0);
    const [twoStarRatings, setTwoStarRatings] = useState(0);
    const [threeStarRatings, setThreeStarRatings] = useState(0);
    const [fourStarRatings, setFourStarRatings] = useState(0);
    const [fiveStarRatings, setFiveStarRatings] = useState(0);
    const [ratingsLoaded, setRatingsLoaded] = useState(false);

    const { user, authToken, loaded } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
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
        if (!user || !authToken) {
            navigate('/auth/login');
            displayToast("You're not logged in", "Please login first to favourite a listing", "info", 3000, false);
            return;
        } else {
            const favouriteData = {
                listingID: listingID
            }
            try {
                const toggleResponse = await server.put("/listings/toggleFavouriteListing", favouriteData)
                dispatch(reloadAuthToken(authToken))
                if (toggleResponse.status == 200 && toggleResponse.data.favourite != undefined) {
                    if (toggleResponse.data.favourite === true) {
                        setFavourite(true);
                    } else {
                        setFavourite(false);
                    }
                }
            } catch (error) {
                dispatch(reloadAuthToken(authToken))
                if (error.response && error.response.data && typeof error.response.data == "string") {
                    console.log("Failed to favourite listing; response: " + error.response.data)
                    if (error.response.data.startsWith("UERROR")) {
                        displayToast(
                            "Uh-oh!",
                            error.response.data.substring("UERROR: ".length),
                            "info",
                            3500,
                            true
                        )
                    } else {
                        displayToast(
                            "Something went wrong",
                            "Failed to favourite listing. Please try again",
                            "error",
                            3500,
                            true
                        )
                    }
                } else {
                    console.log("Unknown error occurred when adding listing to favourites; error: " + error)
                    displayToast(
                        "Something went wrong",
                        "Failed to favourite listing. Please try again",
                        "error",
                        3500,
                        true
                    )
                }
            }
        }
    };

    const fetchFavouriteState = async () => {
        if (!user) {
            setFavourite(false);
            return;
        } else {
            try {
                const fetchFavouritedListingID = await server.get(`/listings/getFavouritedListingsID`);
                dispatch(reloadAuthToken(authToken))    
                if (fetchFavouritedListingID.status == 200 && fetchFavouritedListingID.data) {
                    fetchFavouritedListingID.data.forEach((favListingID) => {
                        if (favListingID === listingID) {
                            setFavourite(true);
                        }
                    });
                } else {
                    setFavourite(false);
                }
                if (fetchFavouritedListingID.status != 200) {
                    displayToast("Error", "Failed to fetch favourite state", "error", 3000, false);
                    console.log("Non-200 status code response received when attempting to retrieve favourite listings; response: ", fetchFavouritedListingID.data);
                }
            } catch (error) {
                dispatch(reloadAuthToken(authToken))
                if (error.response && error.response.data) {
                    if (error.response.data.startsWith("UERROR")) {
                        displayToast("Something went wrong", error.response.data.substring("UERROR: ".length), 3500, true, "error")
                        console.log("User error occurred in retrieving favourite listings; error: ", error.response.data);
                        setFavourite(false);
                    } else {
                        displayToast("Error", "Failed to fetch favourite state", "error", 3000, false);
                        console.log("Unexpected error in retrieving favourited listings; error: ", error.response.data);
                        setFavourite(false);
                    }
                }
                console.log("Unexpected error in retrieving favourited listings; error: ", error.message);
                displayToast("Error", "Failed to fetch favourite state", "error", 3000, false);
                setFavourite(false);
            }
        }
    }

    const proceedToExpandedListing = (id) => {
        server.post("/listingAnalytics/updateClick", { listingID: id });
        navigate("/expandedListingGuest", {
            state: {
                listingID: id
            }
        });
    }

    const fetchRatingProgress = async () => {
        try {
            const response = await server.get(`/cdn/consolidateReviewsStatistics?hostID=${hostID}`);
            dispatch(reloadAuthToken(authToken))
            if (response.status === 200) {
                const data = response.data;
                setOneStarRatings(data.oneStar);
                setTwoStarRatings(data.twoStar);
                setThreeStarRatings(data.threeStar);
                setFourStarRatings(data.fourStar);
                setFiveStarRatings(data.fiveStar);
                setRatingsLoaded(true);
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken))
            if (error.response && error.response.data && typeof error.response.data == "string") {
                console.log("Failed to fetch host's food rating; response: " + error.response.data)
                if (error.response.data.startsWith("UERROR")) {
                    displayToast(
                        "Uh-oh!",
                        error.response.data.substring("UERROR: ".length),
                        "info",
                        3500,
                        true
                    )
                } else {
                    displayToast(
                        "Something went wrong",
                        "Failed to fetch host's food rating. Please try again",
                        "error",
                        3500,
                        true
                    )
                }
            } else {
                console.log("Unknown error occurred when fetching host's food rating; error: " + error)
                displayToast(
                    "Something went wrong",
                    "Failed to fetch host's food rating. Please try again",
                    "error",
                    3500,
                    true
                )
            }
        }
    }

    useEffect(() => {
        fetchFavouriteState();
        fetchRatingProgress();
    }, []);

    const renderDescription = () => {
        if (shortDescription.length <= 43 || showFullDescription) {
            return (
                <>
                    {shortDescription} {shortDescription.length > 43 && !showFullDescription && (
                        <Text color="blue" fontSize="sm" cursor="pointer" onClick={() => setShowFullDescription(true)}>show more</Text>
                    )}
                    {showFullDescription && (
                        <Text color="blue" fontSize="sm" cursor="pointer" onClick={() => setShowFullDescription(false)}>show less</Text>
                    )}
                </>
            );
        }

        return (
            <>
                {shortDescription.slice(0, 43)}... <Text as="span" color="blue" fontSize="sm" cursor="pointer" onClick={() => setShowFullDescription(true)}>show more</Text>
            </>
        );
    };

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
            <Card
                maxW="350px"
                height="80vh"
                borderRadius={6}
                overflow="scroll"
                className="disable-select"
                css={{
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}>
                <CardBody>
                    <Box position="relative" width="fit-content">
                        {images.length > 1 && (
                            <Box position={"absolute"} top="50%" transform="translateY(-50%)" width={"100%"}>
                                <ChevronLeftIcon boxSize={8} ml={-1} mt={-4} onClick={handlePrevImage} color={"#A9A9A9"} _hover={{ cursor: "pointer", color: "#515F7C", transition: "0.2s ease" }} position={"absolute"} left="-5" zIndex={1} />
                                <ChevronRightIcon boxSize={8} mr={-1} mt={-4} onClick={handleNextImage} color={"#A9A9A9"} _hover={{ cursor: "pointer", color: "#515F7C", transition: "0.2s ease" }} position={"absolute"} right="-5" zIndex={1} />
                            </Box>
                        )}
                        <Skeleton isLoaded={imageLoaded} height="150px" width="310px" borderRadius="5px" fadeDuration={2}>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20
                                }}
                            >
                                <Image
                                    key={images[imageIndex]}
                                    src={images[imageIndex]}
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop if placeholder also fails to load
                                        e.target.src = "/placeholderImage.png";
                                    }}
                                    onLoad={() => setImageLoaded(true)}
                                    borderRadius="5px"
                                    minWidth="310px"
                                    maxWidth="310px"
                                    minHeight="150px"
                                    maxHeight="150px"
                                    objectFit="cover"
                                    style={{ pointerEvents: "none" }}
                                    className="image"
                                />
                            </motion.div>
                        </Skeleton>
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
                            onClick={() => {
                                localStorage.removeItem("mapRemountDenyOnModalOpen");
                                localStorage.removeItem("mapRemountDenyOnModalClose");
                                navigate(-1)
                            }}>
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
                            <Box display="flex"> 
                                <Heading size="md" mt={-2} className="enable-select">{title}</Heading>
                                {flaggedForHygiene && (
                                    <ScaleFade in>
                                        <Badge
                                            mt={-4}
                                            colorScheme="red"
                                            variant="solid"
                                            px={2}
                                            py={0.5}
                                            fontSize="2xs"
                                            ml={3}
                                        >
                                            Flagged
                                        </Badge>
                                    </ScaleFade>
                                )}
                            </Box>
                            <Text onClick={toggleFavourite} mt={-2} cursor={"pointer"} className="favouriteButton">
                                {(!user || user.userID !== hostID) ? (favourite ? "🩷" : "🤍") : null}
                            </Text>
                        </Box>
                        <Box className="ratingBox">
                            {ratingsLoaded ? (
                                <>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Text fontSize={"10px"} mr={1} ml={0.5} mt={-2}>1⭐️</Text>
                                        <Progress
                                            colorScheme="green"
                                            size="sm"
                                            value={oneStarRatings}
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
                                            value={twoStarRatings}
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
                                            value={threeStarRatings}
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
                                            value={fourStarRatings}
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
                                            value={fiveStarRatings}
                                            borderRadius="5px"
                                            flex={1}
                                        />
                                    </Box>
                                </>
                            ) : (
                                <Skeleton height="100px" width="100%" borderRadius={"10px"} fadeDuration={2} />
                            )}
                        </Box>
                        <Link to={'/reviews'} state={{ hostID }}>
                            <Text mt={2} mb={-4} textAlign="left" color="blue" fontSize={"13px"} textDecoration={"underline"} cursor={"pointer"}>View Host Reviews</Text>
                        </Link>
                    </Stack>
                </CardBody>
                <Divider mt={1} />
                <Box ml={4} mt={2} textAlign="left" fontSize={"15px"}>
                    <Box display="flex" justifyContent={"left"} mb={1}>
                        <Text mr={1}><InfoOutlineIcon fill="#515F7C" /></Text><Text ml={1} className="enable-select" maxW={"80%"} overflow="hidden">{renderDescription()}</Text>
                    </Box>

                    <Box display="flex" justifyContent="left" mb={1}>
                        <WrapItem>
                            <Tooltip label='Full address will be provided upon successful reservation' placement="right" borderRadius={'lg'} openDelay={500}>
                                <Box display="flex" alignItems="center">
                                    <Text mr={1} mt={1}>
                                        <FaMapMarkerAlt fill="#515F7C" />
                                    </Text>
                                    <Text ml={1} className="enable-select">
                                        {approxAddress}
                                    </Text>
                                </Box>
                            </Tooltip>
                        </WrapItem>
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
                        <Button variant="MMPrimary" colorScheme="blue" onClick={() => proceedToExpandedListing(listingID)} mt={-4}>
                            Proceed
                        </Button>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </>
    );
}

export default ListingCardOverlay;
