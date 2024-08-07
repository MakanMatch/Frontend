/* eslint-disable react/prop-types */
import { Card, CardBody, Image, Text, Box, SlideFade, Skeleton, ScaleFade, Badge } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MyListingCard = ({
    listingID,
    title,
    portionPrice,
    images,
    published,
    archived,
    displayToast
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const navigate = useNavigate();

    const handleClickMyListingCard = () => {
        if (archived === true) {
            displayToast("This meal has been completed!", "You can no longer view this listing", "success", 3000, true);
        } else {
            navigate(`/expandedListingHost`, { state: { listingID: listingID } });
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
                    .truncate-text {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                `}
            </style>
            <Card
                className="image-container"
                borderRadius={"2xl"}
                onClick={handleClickMyListingCard}
                cursor={"pointer"}
            >
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
                                    filter={archived === true ? "blur(0.5px)" : ""}
                                    style={{ pointerEvents: "none" }}
                                />
                            </Skeleton>
                        </SlideFade>
                    </Box>
                    <Box mt={1}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Text 
                                fontSize={"20px"} 
                                textAlign={"left"} 
                                ml={4} 
                                color={archived === true ? "grey" : "black"}
                                className="truncate-text"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                maxWidth="150px" // Adjust width as needed
                            >
                                {title}
                            </Text>
                            {!archived ? (
                                <ScaleFade in>
                                    <Badge
                                        colorScheme={published === true ? "green" : "purple"}
                                        ml="10px"
                                        mt={-2}
                                        variant="solid"
                                        px={2}
                                        py={0.5}
                                        fontSize="2xs"
                                        mr={3}
                                    >
                                        {published === true ? "PUBLISHED" : "HIDDEN"}
                                    </Badge>
                                </ScaleFade>
                            ) : (
                                <ScaleFade in>
                                    <Badge
                                        ml="10px"
                                        mt={-2}
                                        variant="solid"
                                        px={2}
                                        py={0.5}
                                        fontSize="2xs"
                                        mr={3}
                                    >
                                        COMPLETED
                                    </Badge>
                                </ScaleFade>
                            )}
                        </Box>
                        <Box display="flex" justifyContent={"space-between"} mt={3} mb={1} ml={4} mr={4}>
                            <Text fontSize="18px" color={archived === true ? "grey" : "blue.600"}>${portionPrice} / portion</Text>
                        </Box>
                    </Box>
                </CardBody>
            </Card>
        </>
    );
};

export default MyListingCard;