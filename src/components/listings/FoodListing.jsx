/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button, Card, CardBody, CardFooter, ButtonGroup, Divider, Heading, Image, Stack, Text, Box, SlideFade, useToast, Skeleton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useEffect, useState } from "react";
import server from "../../networking";

const FoodListing = ({
    listingID,
    userID,
    title,
    hostName,
    portionPrice,
    hostFoodRating,
    images, // Array of image links
    ShowToast
}) => {
    const toast = useToast();
    const [imageIndex, setImageIndex] = useState(0);
    const [favourite, setFavourite] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkFavouriteListing = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 800)); // Adding a delay of 500ms
                const response = await server.get(`/cdn/checkFavouriteListing?userID=${userID}&listingID=${listingID}`);
                if (response.status === 200) {
                    setFavourite(response.data.listingIsFavourite);
                } else {
                    toast.closeAll();
                    ShowToast("Failed to fetch info", "Please reload the page", "error", 3000);
                }
            } catch (error) {
                toast.closeAll();
                ShowToast("Failed to fetch info", "Please reload the page", "error", 3000);
            } finally {
                setLoading(false);
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
                            <Skeleton isLoaded={!loading} borderRadius="lg" minWidth={"100%"} minHeight={"108px"} maxHeight={"108px"} objectFit="cover" style={{ pointerEvents: "none" }}>
                                <Image
                                    key={images[imageIndex]}
                                    src={images[imageIndex]}
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop if placeholder also fails to load
                                        e.target.src = "/public/placeholderImage.png"; // Path to your placeholder image
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
                <CardFooter justifyContent="center">
                    <ButtonGroup spacing="2">
                        <Button variant="MMPrimary">View more</Button>
                        <Button onClick={toggleFavourite}>
                            {favourite ? "🩷" : "🤍"}
                        </Button>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </>
    );
};

export default FoodListing;
