/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button, Card, CardBody, CardFooter, ButtonGroup, Divider, Heading, Image, Stack, Text, Box, SlideFade, useMediaQuery, Skeleton } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";

const FoodListingCard = ({
    listingID,
    title,
    portionPrice,
    hostName,
    hostFoodRating,
    hostID,
    images,
    shortDescription,
    approxAddress,
    totalSlots,
    latitude,
    longitude,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isSmallerThan710] = useMediaQuery("(min-width: 700px) and (max-width: 739px)");
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
                            <Link
                            to={`/targetListing?listingID=${listingID}`}
                            state={{ hostID, images, title, shortDescription, approxAddress, portionPrice, totalSlots, latitude, longitude }}
                            >
                                <Button variant="MMPrimary" paddingLeft={"25px"} paddingRight={"25px"}>View</Button>
                            </Link>
                        </ButtonGroup>
                    </CardFooter>
                )}
                {!isSmallerThan710 && (
                    <CardFooter display="flex" flexDirection={"column"} justifyContent="center">
                        <ButtonGroup flex={1} spacing="2" mb={2} justifyContent={"space-evenly"}>
                            <Link
                            to={`/targetListing?listingID=${listingID}`}
                            state={{ hostID, images, title, shortDescription, approxAddress, portionPrice, totalSlots, latitude, longitude }}
                            >
                                <Button variant="MMPrimary" paddingLeft={"25px"} paddingRight={"25px"}>View</Button>
                            </Link>
                        </ButtonGroup>
                    </CardFooter>
                )}
            </Card>
        </>
    );
};

export default FoodListingCard;
