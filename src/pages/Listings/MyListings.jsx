/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Heading, Stack, StackDivider, Text, Spinner, SimpleGrid, SlideFade, useMediaQuery, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MyListingCard from "../../components/listings/MyListingCard";
import server from '../../networking';

function MyListings() {
    const [listings, setListings] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const toast = useToast();

    const { user, loaded } = useSelector((state) => state.auth);

    const [isBetween701And739] = useMediaQuery("(min-width: 701px) and (max-width: 739px)");

    function getImageLink(listingID, imageName) {
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getImageForListing?listingID=${listingID}&imageName=${imageName}`;
    }

    function displayToast(title, description, status, duration, isClosable) {
        toast.closeAll();
        toast({
            title: title,
            description: description,
            status: status,
            duration: duration,
            isClosable: isClosable
        });
    }

    const fetchHostListings = async () => {
        const fetchHostListings = await server.get("/listings/getHostListings");
        if (fetchHostListings.status === 200) {
            setListings(fetchHostListings.data);
            setDataLoaded(true);
        } else {
            displayToast("Error", "An error occurred while fetching your listings", "error", 3000, true);
        }
    };

    useEffect(() => {
        if (loaded) {
            fetchHostListings();
        }
    }, [loaded, user]);

    if (!loaded || !user || !dataLoaded) {
        return (
            <Box>
                <Spinner />
            </Box>
        );
    }

    const sortedListings = listings.sort((a, b) => {
        // Determine the published and archived statuses
        const isArchivedA = a.datetime < new Date().toISOString();
        const isArchivedB = b.datetime < new Date().toISOString();
        const isPublishedA = a.published;
        const isPublishedB = b.published;

        // Sort priority
        if (isArchivedA !== isArchivedB) {
            return isArchivedA - isArchivedB;
        }
        if (isPublishedA !== isPublishedB) {
            return isPublishedB - isPublishedA;
        }

        return 0;
    });

    return (
        <Box display="flex">
            <Box
                width="100%"
                borderRadius={15}
                boxShadow="0 1px 2px 2px rgba(0.1, 0.1, 0.1, 0.1)"
                overflow="scroll"
                height="700px"
                sx={{
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                }}
            >
                <Box>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <Box>
                            <Heading p={5} ml={3} mb={-4} size="lg" textAlign="left">
                                My Listings
                            </Heading>
                        </Box>
                        <Box pl={4} pr={4}>
                            {listings.length > 0 ? (
                                <SimpleGrid
                                    spacing={4}
                                    templateColumns="repeat(4, minmax(300px, 1fr))"
                                >
                                    {sortedListings.map((listing) => (
                                        <SlideFade in={true} offsetY="20px" key={listing.listingID}>
                                            <Box
                                                display={isBetween701And739 ? "flex" : "initial"}
                                                justifyContent={isBetween701And739 ? "center" : "initial"}
                                            >
                                                <MyListingCard
                                                    listingID={listing.listingID}
                                                    title={listing.title}
                                                    portionPrice={listing.portionPrice}
                                                    images={listing.images.split("|").map((imageName) => getImageLink(listing.listingID, imageName))}
                                                    published={listing.published}
                                                    archived={listing.datetime < new Date().toISOString()}
                                                    displayToast={displayToast}
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
                                        No listings so far
                                    </Text>
                                </Box>
                            )}
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

export default MyListings;