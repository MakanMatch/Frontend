import React, { useEffect, useState } from 'react';
import { Box, useToast, CardBody, Heading, list, Stack, StackDivider, Card, Text, SimpleGrid, SlideFade, Flex, Spacer, Button, Image, HStack, VStack, Divider, Center, useMediaQuery, Spinner } from "@chakra-ui/react";
import GuestSideNav from "../../components/identity/GuestSideNav";
import server from '../../networking'
import configureShowToast from '../../components/showToast';
import { reloadAuthToken } from '../../slices/AuthState';
import { useSelector, useDispatch } from 'react-redux';
import FoodListingCard from '../../components/listings/FoodListingCard';

const Favourites = () => {
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const [favouritesListingDetails, setFavouritesListingDetails] = useState([]);
    const { user, loaded, error, authToken } = useSelector((state) => state.auth);
    const [dataLoaded, setDataLoaded] = useState(false);
    const dispatch = useDispatch();

    const [isSmallerThan1095] = useMediaQuery("(max-width: 1095px)");
    const [isBetween701And739] = useMediaQuery("(min-width: 701px) and (max-width: 739px)");

    function getImageLink(listingID, imageName) {
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getImageForListing?listingID=${listingID}&imageName=${imageName}`;
    }

    // Get all favourites listingID form the user
    const getFavourites = async () => {
        server.get('/favourites/getFavouritedListings')
            .then(res => {
                dispatch(reloadAuthToken(authToken));
                if (res.status == 200 && res.data) {
                    setFavouritesListingDetails(res.data);
                    console.log("Listings retrieved: ", res.data);
                    setDataLoaded(true);
                } else {
                    console.log("Non-200 status code response received when attempting to retrieve favourite listings; response: ", res.data);
                    showToast("Something went wrong", "Couldn't retrieve your favourite listings! Please try again.", 3500, true, "error")
                }
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken));
                if (err.response && err.response.data) {
                    if (err.response.data.startsWith("UERROR")) {
                        showToast("Something went wrong", err.response.data.substring("UERROR: ".length), 3500, true, "error")
                        console.log("User error occurred in retrieving favourite listings; error: ", err.response.data);
                    } else {
                        console.log("Unexpected error in retrieving favourited listings; error: ", err.response.data);
                        showToast("Something went wrong", "Couldn't retrieve your favourite listings! Please try again.", 3500, true, "error")
                    }
                } else {
                    console.log("Unexpected error in retrieving favourited listings; error: ", err.message);
                    showToast("Something went wrong", "Couldn't retrieve your favourite listings! Please try again.", 3500, true, "error")
                }
            })
    }

    useEffect(() => {
        if (loaded == true) {
            getFavourites();
        }
    }, [loaded, user])

    if (!dataLoaded) {
        return <Spinner />
    }

    return (
        <Box display="flex">
            <GuestSideNav />
            <Box
                width="75%"
                ml={10}
                borderRadius={15}
                boxShadow="0 1px 2px 2px rgba(0.1, 0.1, 0.1, 0.1)"
                overflow={"scroll"}
                height={"700px"}
                sx={{
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                <Box>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <Box>
                            <Heading p={5} ml={3} mb={-4} size={"lg"} textAlign="left">
                                My Favourites
                            </Heading>
                        </Box>
                        <Box pl={4} pr={4}>
                            {favouritesListingDetails.length > 0 ? (
                                <SimpleGrid
                                    spacing={4}
                                    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                                >
                                    {favouritesListingDetails.map((listing) => (
                                        <SlideFade
                                            in={true}
                                            offsetY="20px"
                                            key={listing.FavouriteListing.listingID}
                                        >
                                            <Box
                                                display={isBetween701And739 ? "flex" : "initial"}
                                                justifyContent={isBetween701And739 ? "center" : "initial"}>
                                                <FoodListingCard
                                                    listingID={listing.listingID}
                                                    title={listing.title}
                                                    portionPrice={listing.portionPrice}
                                                    hostName={listing.Host.username || "MakanMatch Host"}
                                                    hostFoodRating={listing.Host.foodRating || 0}
                                                    hostID={listing.Host.userID}
                                                    images={listing.images.map((imageName) =>
                                                        getImageLink(listing.listingID, imageName)
                                                    ) || []}
                                                    shortDescription={listing.shortDescription}
                                                    address={listing.address}
                                                    approxAddress={listing.approxAddress}
                                                    totalSlots={listing.totalSlots}
                                                    latitude={parseFloat(listing.coordinates.split(',')[0])}
                                                    longitude={parseFloat(listing.coordinates.split(',')[1])}
                                                />
                                            </Box>
                                        </SlideFade>
                                    ))}
                                </SimpleGrid>
                            ) : (
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    height="70vh"
                                >
                                    <Text
                                        textAlign="center"
                                        fontSize="lg"
                                        color="gray.500"
                                        width="50%"
                                    >
                                        No favourite listings available
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default Favourites;