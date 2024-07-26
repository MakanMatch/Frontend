/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Card, useToast, Image, Stack, CardBody, Avatar, Text, Box, Skeleton } from "@chakra-ui/react";
import { CalendarIcon } from '@chakra-ui/icons';
import { FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import server from "../../networking";
import configureShowToast from '../../components/showToast';

function MakanHistoryCard({ reservation, listing }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [hostUsername, setHostUsername] = useState(null);
    const [hostFoodRating, setHostFoodRating] = useState(0);
    const toast = useToast();
    const showToast = configureShowToast(toast);

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

    const fetchHostDetails = async () => {
        try {
            const response = await server.get(`/cdn/accountInfo?userID=${listing.hostID}`);
            if (response.status === 200) {
                setHostUsername(response.data.username);
                setHostFoodRating(response.data.foodRating);
            }
        } catch (error) {
            if (error.response && error.response.data && typeof error.response.data == "string") {
                console.log("Failed to retrieve host's info; response: " + error.response)
                if (error.response.data.startsWith("UERROR")) {
                    showToast(
                        error.response.data.substring("UERROR: ".length),
                        "Please try again", 3500, true, "info"
                    )
                } else {
                    showToast(
                        "Something went wrong",
                        "Failed to retrieve host info. Please try again", 3500, true, "error")
                }
            } else {
                console.log("Unknown error occurred when retrieving host info; error: " + error)
                showToast("Something went wrong", "Failed to retrieve host info. Please try again", 3000, true, "error")
            }
        }

    }

    useEffect(() => {
        if (listing) {
            fetchHostDetails(listing.hostID);
        }
    }, [listing]);

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
                    borderRadius: "2xl"
                }}
                >
                    <Skeleton isLoaded={imageLoaded} fadeDuration={1} width={"223px"} height={"149px"}>
                        <Image
                        minWidth={"223px"}
                        maxWidth={"223px"}
                        minHeight={"149px"}
                        maxHeight={"149px"}
                        src={getImageLink(listing.listingID, listing.images)}
                        alt='Caffe Latte'
                        borderRadius = "5px"
                        margin="20px"
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
                                    <Text ml={2}>{listing.approxAddress}</Text>
                                </Box>
                                
                                <Box display="flex" ml={1}>
                                    <CalendarIcon mr={2} mt={1}/>
                                    <Text textAlign={"left"} mb={1}>{formatDate(new Date(reservation.datetime))}</Text>
                                </Box>

                                <Box display="flex" mt={2}>
                                    <Avatar size={"sm"} mr={2}/>
                                    <Text textAlign={"left"} ml={2} mt={1}>{hostUsername}</Text>
                                </Box>
                            </Stack>

                            <Box display="flex" flexDirection={"column"} justifyContent={"space-between"}>
                                <Text fontSize="20px" mt={7}>{hostFoodRating} ⭐️</Text>
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