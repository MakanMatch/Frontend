/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, Image, Stack, CardBody, Avatar, Text, Box, Skeleton } from "@chakra-ui/react";
import { CalendarIcon } from '@chakra-ui/icons';
import { FaMapMarkerAlt } from "react-icons/fa";
import { useState } from "react";

function MakanHistoryCard({ reservation, listing }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleClickListingTitle = () => {
        console.log("Clicked on listing title");
    }

    function getImageLink(listingID, imageName) {
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getImageForListing?listingID=${listingID}&imageName=${imageName}`;
    }

    function formatDate(dateObj) {
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('en-US', { month: 'long' });
        const year = dateObj.getFullYear();

        return `${day} ${month} ${year}`;
    }

    return (
        <>
            {listing && reservation && (
                <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
                sx={{
                    '.clickableText': {
                        _hover: {
                            textDecoration: 'underline',
                            cursor: 'pointer'
                        }
                    },
                    marginBottom: "25px",
                    borderRadius: "2xl",
                    minWidth: "645px"
                }}
                >
                    <Skeleton isLoaded={imageLoaded} fadeDuration={0.5} minWidth={"223px"} maxWidth={"223px"} minHeight={"149px"} maxHeight={"149px"} margin="20px" borderRadius="5px">
                        <Image
                        minWidth={"223px"}
                        maxWidth={"223px"}
                        minHeight={"149px"}
                        maxHeight={"149px"}
                        src={getImageLink(listing.listingID, listing.images.split("|")[0])}
                        alt='Caffe Latte'
                        borderRadius = "5px"
                        objectFit={"cover"}
                        onLoad={() => setImageLoaded(true)}
                        />
                    </Skeleton>
                    <CardBody ml={8}>
                        <Box display="flex" justifyContent={"space-between"} width={"100%"} mt={3}>
                            <Stack mr={20}>
                                <Text textAlign={"left"} fontSize={"25px"} className="clickableText" onClick={handleClickListingTitle} mt={-4}>{listing.title}</Text>

                                <Box display="flex" mr={2}>
                                    <FaMapMarkerAlt size={20}/>
                                    <Text ml={2} whiteSpace={"nowrap"} overflow="hidden" textOverflow={"ellipsis"} maxWidth={"200px"} maxHeight={"24px"}>{listing.approxAddress}</Text>
                                </Box>
                                
                                <Box display="flex" ml={1}>
                                    <CalendarIcon mr={2} mt={1}/>
                                    <Text textAlign={"left"} mb={1}>{formatDate(new Date(reservation.datetime))}</Text>
                                </Box>

                                <Box display="flex" mt={2}>
                                    <Avatar size={"sm"} mr={2}/>
                                    <Text textAlign={"left"} ml={2} mt={1}>{listing.Host.username}</Text>
                                </Box>
                            </Stack>

                            <Box display="flex" flexDirection={"column"} justifyContent={"space-between"}>
                                <Text fontSize="20px" mt={7}>{listing.Host.foodRating} ⭐️</Text>
                                <Text fontSize="20px" color="green">${listing.portionPrice}</Text>
                            </Box>
                        </Box>
                    </CardBody>
                </Card>
            )}
        </>
    )
}

export default MakanHistoryCard