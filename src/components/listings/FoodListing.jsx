/* eslint-disable react/prop-types */
import { Button, Card, CardBody, CardFooter, ButtonGroup, Divider, Heading, Image, Stack, Text, Box, SlideFade } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useState } from "react";
import { Link } from "react-router-dom";

const FoodListing = ({
    id,
    title,
    hostName,
    portionPrice,
    hostFoodRating,
    isFavourite,
    onToggleFavourite,
    images, // Array of image links
}) => {

    const [imageIndex, setImageIndex] = useState(0);
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
                                src={images[imageIndex]}
                                alt="Food listing image"
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
                        <Text>Hosted by {hostName}</Text>
                        <Text>Food Rating: {hostFoodRating}/5 ⭐️</Text>
                        <Text color="blue.600" fontSize="2xl">
                            ${portionPrice}/pax
                        </Text>
                    </Stack>
                </CardBody>
                <Divider />
                <CardFooter justifyContent="center">
                    <ButtonGroup spacing="2">
                        <Link to={`/expandedListing?id=${id}`}>
                            <Button variant="MMPrimary">View more</Button>
                        </Link>
                        <Button onClick={onToggleFavourite}>
                            {isFavourite ? "🩷" : "🤍"}
                        </Button>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </>
    );
};

export default FoodListing;
