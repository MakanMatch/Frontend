/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button, Card, CardBody, CardFooter, ButtonGroup, Divider, Heading, Image, Stack, Text, Box, SlideFade, useToast, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton, useMediaQuery } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons';
import { useState } from "react";
import server from "../../networking";
import { Link } from "react-router-dom";

const FoodListing = ({
    listingID,
    title,
    portionPrice,
    hostName,
    hostFoodRating,
    userID,
    hostID,
    isFavourite,
    ShowToast,
    images,
    fetchListings,
}) => {
    const toast = useToast();
    const [imageIndex, setImageIndex] = useState(0);
    const [favourite, setFavourite] = useState(isFavourite);
    const [isSmallerThan710] = useMediaQuery("(min-width: 700px) and (max-width: 739px)");
    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();

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
                ShowToast("Error", "Failed to add/remove listing from favourites", "error", 3000);
            });
    };

    const handleDeleteListing = async () => {
        const deleteListing = await server.delete("/listings/deleteListing", { data: { listingID: listingID } });
        if (deleteListing.status === 200) {
            toast.closeAll();
            ShowToast("Listing removed", "Your listing has been successfully removed!", "success", 3000);
            fetchListings();
        } else {
            toast.closeAll();
            ShowToast("Error", "Failed to remove listing", "error", 3000);
        }
    };
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
                                <ChevronLeftIcon boxSize={8} ml={-1} mt={-4} onClick={handlePrevImage} color={"#A9A9A9"} _hover={{ cursor: "pointer", color: "#515F7C", transition: "0.2s ease" }} position={"absolute"} left="-5" zIndex={1} />
                                <ChevronRightIcon boxSize={8} mr={-1} mt={-4} onClick={handleNextImage} color={"#A9A9A9"} _hover={{ cursor: "pointer", color: "#515F7C", transition: "0.2s ease" }} position={"absolute"} right="-5" zIndex={1} />
                            </Box>
                        )}
                        <SlideFade in={true} offsetY="20px">
                            <Image
                                key={images[imageIndex]}
                                src={images[imageIndex] || "/placeholderImage.png"}
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
                        <Link to={`/reviews`} state={{ userID: userID, hostID: hostID }}> {/* This is a placeholder link with user and host ID fetched from FoodListingPage.jsx */}
                            <Text textDecoration={"underline"} color={"blue"}>See reviews</Text>
                        </Link>
                    </Stack>
                </CardBody>
                <Divider />
                {isSmallerThan710 && (
                    <CardFooter display="flex" flexDirection={"column"} justifyContent="center">
                        <ButtonGroup flex={1} spacing="2" mb={2} justifyContent={"space-evenly"}>
                            <Link to={`/expandedListingGuest?id=${listingID}`}>
                                <Button variant="MMPrimary" paddingLeft={"25px"} paddingRight={"25px"}>View</Button>
                            </Link>
                            <Button onClick={toggleFavourite}>
                                <Text fontSize={"15px"}>{favourite ? "🩷 Un-favourite" : "🤍 Favourite"}</Text>
                            </Button>
                            <Button onClick={onOpenAlert}>
                                <Text fontSize={"15px"}><DeleteIcon color="red" mb={1} /> Remove</Text>
                            </Button>
                        </ButtonGroup>
                    </CardFooter>
                )}
                {!isSmallerThan710 && (
                    <CardFooter display="flex" flexDirection={"column"} justifyContent="center">
                        <ButtonGroup flex={1} spacing="2" mb={2} justifyContent={"space-evenly"}>
                            <Link to={`/expandedListingGuest?id=${listingID}`}>
                                <Button variant="MMPrimary" paddingLeft={"25px"} paddingRight={"25px"}>View</Button>
                            </Link>
                            <Button onClick={toggleFavourite}>
                                {favourite ? "🩷" : "🤍"}
                            </Button>
                            <Button onClick={onOpenAlert}>
                                <DeleteIcon color="red" />
                            </Button>
                        </ButtonGroup>
                    </CardFooter>
                )}
            </Card>
            <AlertDialog
                isOpen={isOpenAlert}
                onClose={onCloseAlert}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Remove Listing
                        </AlertDialogHeader>
                        <AlertDialogCloseButton />
                        <AlertDialogBody>
                            Are you sure you want to remove this listing?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={onCloseAlert}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDeleteListing} ml={3}>
                                Remove
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default FoodListing;
