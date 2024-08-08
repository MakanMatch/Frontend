/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, CardBody, Image, Text, Box, SlideFade, Skeleton, ScaleFade, Badge } from "@chakra-ui/react";
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
    flaggedForHygiene
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
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
            <Link to={"/targetListing"} state={{ listingID, hostID, images, title, shortDescription, approxAddress, portionPrice, totalSlots, latitude, longitude, flaggedForHygiene }}>
                <Card maxW="sm" className="image-container" borderRadius={"2xl"}>
                    <CardBody padding={0}>
                        <Box>
                            <SlideFade in={true} offsetY="20px">
                                <Skeleton isLoaded={imageLoaded} height="108px" width="100%" borderRadius="13px 13px 0 0" fadeDuration={2}>
                                    <Image
                                        key={images[0]}
                                        src={images[0]}
                                        onLoad={() => setImageLoaded(true)}
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevent infinite loop if placeholder also fails to load
                                            e.target.src = "/placeholderImage.png";
                                        }}
                                        borderRadius="13px 13px 0 0"
                                        minWidth={"100%"}
                                        minHeight={"108px"}
                                        maxHeight={"108px"}
                                        objectFit="cover"
                                        style={{ pointerEvents: "none" }}
                                    />
                                </Skeleton>
                            </SlideFade>
                        </Box>
                        <Box mt={1}>
                            <Text fontSize={"20px"} textAlign={"left"} ml={4} white-space="nowrap" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" maxWidth="225px">{title}</Text>
                            <Box display="flex">
                                <Text fontSize={"12px"} textAlign={"left"} ml={5}>By <i>{hostName}</i></Text>
                                {flaggedForHygiene && (
                                    <ScaleFade in>
                                        <Badge
                                            colorScheme="red"
                                            ml="10px"
                                            mt={-2}
                                            variant="solid"
                                            px={2}
                                            py={0.5}
                                            fontSize="2xs"
                                        >
                                            Flagged
                                        </Badge>
                                    </ScaleFade>
                                )}
                            </Box>
                            <Box display="flex" justifyContent={"space-between"} mt={3} mb={1} ml={4} mr={4}>
                                <Text color="blue.600" fontSize="18px">${portionPrice} / portion</Text>
                                <Text>{hostFoodRating} ⭐️</Text>
                            </Box>
                        </Box>
                    </CardBody>
                </Card>
            </Link>
        </>
    );
};

export default FoodListingCard;
