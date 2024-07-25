/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, CardBody, Image, Text, Box, SlideFade, Skeleton } from "@chakra-ui/react";
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
            <Link to={"/targetListing"} state={{ listingID, hostID, images, title, shortDescription, approxAddress, portionPrice, totalSlots, latitude, longitude }}>
                <Card maxW="sm" className="image-container" borderRadius={"2xl"}>
                    <CardBody padding={0}>
                        <Box>
                            <SlideFade in={true} offsetY="20px">
                                <Skeleton isLoaded={imageLoaded} height="108px" width="100%" borderRadius="2xl" fadeDuration={2}>
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
                            <Text fontSize={"20px"} textAlign={"left"} ml={4}>{title}</Text>
                            <Text fontSize={"12px"} textAlign={"left"} ml={5}>By <i>{hostName}</i></Text>
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
