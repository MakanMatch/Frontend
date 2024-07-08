/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button, Card, CardBody, CardFooter, ButtonGroup, Divider, Heading, Image, Stack, Text, Box, SlideFade, useToast, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton, useMediaQuery, Skeleton } from "@chakra-ui/react";
import { DeleteIcon } from '@chakra-ui/icons';
import { useEffect, useState } from "react";
import server from "../../networking";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FoodListing = ({
    listingID,
    title,
    portionPrice,
    hostName,
    hostFoodRating,
    userID,
    ShowToast,
    images,
    fetchListings,
    address,
    shortDescription,
    approxAddress,
    totalSlots
}) => {
    const toast = useToast();
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isSmallerThan710] = useMediaQuery("(min-width: 700px) and (max-width: 739px)");
    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();
    const navigate = useNavigate();

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

    const generateCoordinates = async (address) => {
        const encodedAddress = encodeURIComponent(String(address));
        const apiKey = import.meta.env.VITE_GMAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address="${encodedAddress}"&key=${apiKey}`;
        try {
            const response = await axios.get(url);
            const location = response.data.results[0].geometry.location;
            return {
                latitude: location.lat,
                longitude: location.lng
            };
        } catch (error) {
            ShowToast("An error occured", "Failed to generate maps coordinates", "error", 3000);
            return null;
        }
    };

    useEffect(() => {
        const fetchCoordinates = async () => {
            const coordinates = await generateCoordinates(address);
            if (coordinates) {
                setLatitude(coordinates.latitude);
                setLongitude(coordinates.longitude);
            }
        };
    
        fetchCoordinates();
    }, [address]);
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
                        <SlideFade in={true} offsetY="20px">
                            <Skeleton isLoaded={imageLoaded} height="108px" width="100%" borderRadius="lg" fadeDuration={1}>
                                <Image
                                    key={images[0]}
                                    src={images[0]}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop if placeholder also fails to load
                                        e.target.src = "/placeholderImage.png";
                                    }}
                                    borderRadius="lg"
                                    minWidth={"100%"}
                                    minHeight={"108px"}
                                    maxHeight={"108px"}
                                    objectFit="cover"
                                    style={{ pointerEvents: "none" }}
                                />
                            </Skeleton>
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
                {isSmallerThan710 && (
                    <CardFooter display="flex" flexDirection={"column"} justifyContent="center">
                        <ButtonGroup flex={1} spacing="2" mb={2} justifyContent={"space-evenly"}>
                            <Button variant="MMPrimary" paddingLeft={"25px"} paddingRight={"25px"} onClick={() => navigate(`/targetListing?latitude=${latitude}&longitude=${longitude}&listingID=${listingID}&userID=${userID}&images=${encodeURIComponent(JSON.stringify(images))}&title=${title}&shortDescription=${shortDescription}&approxAddress=${approxAddress}&portionPrice=${portionPrice}&totalSlots=${totalSlots}`)}>View</Button>
                            <Button onClick={onOpenAlert}>
                                <Text fontSize={"15px"}><DeleteIcon color="red" mb={1} /> Remove</Text>
                            </Button>
                        </ButtonGroup>
                    </CardFooter>
                )}
                {!isSmallerThan710 && (
                    <CardFooter display="flex" flexDirection={"column"} justifyContent="center">
                        <ButtonGroup flex={1} spacing="2" mb={2} justifyContent={"space-evenly"}>
                            <Button variant="MMPrimary" paddingLeft={"25px"} paddingRight={"25px"} onClick={() => navigate(`/targetListing?latitude=${latitude}&longitude=${longitude}&listingID=${listingID}&userID=${userID}&images=${encodeURIComponent(JSON.stringify(images))}&title=${title}&shortDescription=${shortDescription}&approxAddress=${approxAddress}&portionPrice=${portionPrice}&totalSlots=${totalSlots}`)}>View</Button>
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
