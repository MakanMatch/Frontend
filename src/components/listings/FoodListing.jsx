/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button, Card, CardBody, CardFooter, ButtonGroup, Divider, Heading, Image, Stack, Text, Box, SlideFade, useToast, Skeleton, Icon, useDisclosure } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useEffect, useState } from "react";
import EditListingModal from "./EditListingModal";
import server from "../../networking";

const VerticalEllipsisIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </Icon>
);

const FoodListing = ({
    listingID,
    title,
    shortDescription,
    longDescription,
    portionFee,
    totalSlots,
    datetime,
    hostName,
    portionPrice,
    hostFoodRating,
    userID,
    ShowToast,
    images,
    fetchListings,
}) => {
    const toast = useToast();
    const [imageIndex, setImageIndex] = useState(0);
    const [favourite, setFavourite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [favouriteLoaded, setFavouriteLoaded] = useState(false);
    const [moreActionsActive, setMoreActionsActive] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        const checkFavouriteListing = async () => {
            let timer = setTimeout(() => {
                if (loading && !favouriteLoaded) {
                    toast.closeAll();
                    ShowToast("Content taking longer to load", "Please wait a moment or try reloading the page", "info", 3000);
                }
            }, 7000);

            const response = await server.get(`/cdn/checkFavouriteListing?userID=${userID}&listingID=${listingID}`);
            if (response.status === 200) {
                setFavourite(response.data.listingIsFavourite);
                setLoading(false);
                setFavouriteLoaded(true);
                clearTimeout(timer);
            } else {
                setTimeout(() => {
                    toast.closeAll();
                    ShowToast("Failed to fetch information", "Please try again later", "error", 3000);
                }, 5000);
            }
        };

        checkFavouriteListing();
    }, []);

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
        const toggle = await server.put("/listings/toggleFavouriteListing", favouriteData);
        if (toggle.status === 200) {
            if (toggle.data.favourite === true) {
                setFavourite(true);
            } else {
                setFavourite(false);
            }
        } else {
            toast.closeAll();
            ShowToast("Error", "Failed to add/remove listing from favourites", "error", 3000);
        }
    };

    const toggleActiveActions = () => {
        setMoreActionsActive(!moreActionsActive);
    }

    const handleDeleteListing = async () => {
        console.log("Delete listing clicked");
    }
    return (
        <>
            <style>
                {`
                    .image-container {
                        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                        -webkit-touch-callout: none;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                    }
                `}
            </style>
            <Card maxW="sm" className="image-container">
                <CardBody>
                    <Box position="relative">
                        {images.length > 1 && (
                            <Box position={"absolute"} top="50%" transform="translateY(-50%)" width={"100%"}>
                                <ChevronLeftIcon boxSize={8} ml={-1} mt={-4} onClick={handlePrevImage} color={"#A9A9A9"} _hover={{ cursor: "pointer", color: "#515F7C", transition: "0.2s ease" }} position={"absolute"} left="-5" zIndex={1}/>
                                <ChevronRightIcon boxSize={8} mr={-1} mt={-4} onClick={handleNextImage} color={"#A9A9A9"} _hover={{ cursor: "pointer", color: "#515F7C", transition: "0.2s ease" }} position={"absolute"} right="-5" zIndex={1}/>
                            </Box>
                        )}
                        <SlideFade in={true} offsetY="20px">
                            <Image
                                key={images[imageIndex]}
                                src={images[imageIndex]}
                                onError={(e) => {
                                    e.target.onerror = null; // Prevent infinite loop if placeholder also fails to load
                                    e.target.src = "/placeholderImage.png"; // Path to your placeholder image
                                }}
                                borderRadius="lg"
                                minWidth={"100%"}
                                minHeight={"108px"}
                                maxHeight={"108px"}
                                objectFit="cover"
                                style={{ pointerEvents: "none" }}
                            />
                        </SlideFade>
                    </Box>
                    <Stack mt="6" spacing="3">
                        <Heading size="md">{title}</Heading>
                        <Text>Hosted by <i>{hostName}</i></Text>
                        <Text>Food Rating: {hostFoodRating}/5 ⭐️</Text>
                        <Text color="blue.600" fontSize="2xl">
                            ${portionPrice}/pax
                        </Text>
                    </Stack>
                </CardBody>
                <Divider />
                <Skeleton isLoaded={favouriteLoaded && !loading}>
                    <CardFooter display="flex" flexDirection={"column"} justifyContent="center">
                        <ButtonGroup flex={1} spacing="2" mb={2} justifyContent={"space-between"}>
                            <Button variant="MMPrimary">View more</Button>
                            <Button onClick={toggleFavourite}>
                                {favourite ? "🩷" : "🤍"}
                            </Button>
                            <Button onClick={toggleActiveActions}>
                                <VerticalEllipsisIcon/>
                            </Button>
                        </ButtonGroup>
                        {moreActionsActive && (
                            <ButtonGroup flex={1} spacing="2" mt={2} justifyContent={"space-between"}>
                                <Button onClick={onOpen} flex={1}>
                                    <Text color="blue" fontSize={"13px"}>Edit</Text>
                                </Button>
                                <Button onClick={handleDeleteListing} flex={1}>
                                    <Text color="red" fontSize={"13px"}>Remove</Text>
                                </Button>
                            </ButtonGroup>
                        )}
                    </CardFooter>
                </Skeleton>
            </Card>
            <EditListingModal 
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onOpen}
                fetchListings={fetchListings}
                listingID={listingID}
                previousTitle={title}
                previousShortDescription={shortDescription}
                previousLongDescription={longDescription}
                previousPortionFee={portionFee}
                previousTotalSlots={totalSlots}
                previousDatetime={datetime}
                previousImages={images}
            />
        </>
    );
};

export default FoodListing;
