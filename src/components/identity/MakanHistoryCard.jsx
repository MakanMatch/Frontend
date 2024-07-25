/* eslint-disable react/prop-types */
import { Card, Image, Stack, CardBody, Avatar, Text, Box, Skeleton } from "@chakra-ui/react";
import { CalendarIcon } from '@chakra-ui/icons';
import { FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

function MakanHistoryCard({ reservation, listing }) {
    const [contentLoaded, setContentLoaded] = useState(false);

    const handleClickListingTitle = () => {
        console.log("Clicked on listing title");
    }

    function getImageLink(listingID, imageName) {
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getImageForListing?listingID=${listingID}&imageName=${imageName}`;
    }

    useEffect(() => {
        if (listing) {
            setContentLoaded(true);
        }
    }, [listing]);

    return (
        <>
            {listing && (
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
                    <Skeleton isLoaded={contentLoaded} fadeDuration={1} width={"223px"} height={"149px"}>
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
                        />
                    </Skeleton>
                    <CardBody ml={8}>
                        <Box display="flex" justifyContent={"space-between"} width={"100%"} mt={3}>
                            <Stack mr={20}>
                                <Text textAlign={"left"} fontSize={"25px"} className="clickableText" onClick={handleClickListingTitle} mt={-4}>Pani Puri</Text>

                                <Box display="flex" mr={2}>
                                    <FaMapMarkerAlt size={20}/>
                                    <Text ml={2}>Block 310A Anchorvale Lane</Text>
                                </Box>
                                
                                <Box display="flex" ml={1}>
                                    <CalendarIcon mr={2} mt={1}/>
                                    <Text textAlign={"left"} mb={1}>25 July 2024 5:30 PM</Text>
                                </Box>

                                <Box display="flex" mt={2}>
                                    <Avatar size={"sm"} mr={2}/>
                                    <Text textAlign={"left"} ml={2} mt={1}>Jamie Oliver</Text>
                                </Box>
                            </Stack>

                            <Box display="flex" flexDirection={"column"} justifyContent={"space-between"}>
                                <Text fontSize="20px" mt={7}>4.5 ⭐️</Text>
                                <Text fontSize="20px" color="green">$10.00</Text>
                            </Box>
                        </Box>
                    </CardBody>
                </Card>
            )}
        </>
    )
}

export default MakanHistoryCard