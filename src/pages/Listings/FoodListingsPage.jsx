/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { SimpleGrid, Text, Box, useToast, Flex, SlideFade, useMediaQuery, Skeleton, Spinner, Center, Fade } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { reloadAuthToken } from "../../slices/AuthState";
import FoodListingCard from "../../components/listings/FoodListingCard";
import MarkeredGMaps from "../../components/listings/MarkeredGMaps";
import server from "../../networking";

const FoodListingsPage = () => {
    const [listings, setListings] = useState([]);
    const [isSmallerThan1095] = useMediaQuery("(max-width: 1095px)");
    const [isBetween701And739] = useMediaQuery("(min-width: 701px) and (max-width: 739px)");
    const [loading, setLoading] = useState(true); 

    const { user, authToken, loaded } = useSelector((state) => state.auth);

    const toast = useToast();
    const dispatch = useDispatch();

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

    function getImageLink(listingID, imageName) {
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getImageForListing?listingID=${listingID}&imageName=${imageName}`;
    }

    const fetchListings = async () => {
        try {
            const response = await server.get("/cdn/listings");
            dispatch(reloadAuthToken(authToken));
            if (response.status === 200) {
                setListings(response.data);
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken))
            if (error.response && error.response.data && typeof error.response.data == "string") {
                console.log("Failed to fetch listings; response: " + error.response.data)
                if (error.response.data.startsWith("UERROR")) {
                    displayToast(
                        "Uh-oh!",
                        error.response.data.substring("UERROR: ".length),
                        "info",
                        3500,
                        true
                    )
                } else {
                    displayToast(
                        "Something went wrong",
                        "Failed to fetch listings. Please try again",
                        "error",
                        3500,
                        true
                    )
                }
            } else {
                console.log("Unknown error occurred when fetching listings; error: " + error)
                displayToast(
                    "Something went wrong",
                    "Failed to fetch listings. Please try again",
                    "error",
                    3500,
                    true
                )
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchListings();
            setLoading(false);
        }
        fetchData();
        if (localStorage.getItem("published") === "true") {
            localStorage.removeItem("published");
            displayToast(
                "Listing published successfully!",
                "We'll notify you when all slots have been filled",
                "success",
                4000,
                true
            );
        }
    }, []);

    if (!loaded) {
        return (
            <Center height="100vh">
                <Fade in={!loaded}>
                    <Spinner size="xl" />
                </Fade>
            </Center>
        );
    } 
    
    return (
        <>
            <Text fontSize={"30px"} mb={4}>
                {user ? `Welcome, ${user.username}` : "Welcome to MakanMatch!"}
            </Text>
            {isSmallerThan1095 && listings.length > 0 && (
                <Box mb={4}>
                    <MarkeredGMaps
                        coordinatesList={listings.map((listing) => {
                            const [lat, lng] = listing.coordinates.split(',').map(parseFloat);
                            return { lat, lng };
                        })}
                        listings={listings}
                        isSmallerThan1095={true}
                    />
                </Box>
            )}
            <Skeleton isLoaded={!loading} style={{ borderRadius: "10px" }}>
                <Flex display="flex" flexWrap="wrap">
                    <Box
                        height="83vh"
                        overflowY="auto"
                        boxShadow={"0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"}
                        borderRadius={"22px 8px 8px 22px"}
                        p="4"
                        flex={2}
                        css={{
                            "&::-webkit-scrollbar": {
                                width: "8px",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "#f1f1f1",
                                borderRadius: "8px 8px 8px 8px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#C2C2C2",
                                borderRadius: "8px",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                                backgroundColor: "#A1A1A1",
                            },
                        }}
                    >
                        {listings.length > 0 ? (
                            <SimpleGrid
                                spacing={4}
                                templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                            >
                                {listings.map((listing) => (
                                    <SlideFade in={true} offsetY="20px" key={listing.listingID}>
                                        <Box 
                                            display={isBetween701And739 ? "flex" : "initial"}
                                            justifyContent={isBetween701And739 ? "center" : "initial"}
                                        >
                                            <FoodListingCard
                                                listingID={listing.listingID}
                                                title={listing.title}
                                                portionPrice={listing.portionPrice}
                                                hostName={listing.Host.username || "MakanMatch Host"}
                                                hostFoodRating={listing.Host.foodRating || 0}
                                                hostID={listing.Host.userID}
                                                images={listing.images.map((imageName) =>
                                                    getImageLink(listing.listingID, imageName)
                                                )}
                                                shortDescription={listing.shortDescription}
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
                                <Text textAlign="center" fontSize="lg" color="gray.500" width="50%">
                                    No listings available
                                </Text>
                            </Box>
                        )}
                    </Box>
                    {!isSmallerThan1095 && listings.length > 0 && (
                        <Box flex="1" ml={5}>
                            <SlideFade in={true} offsetY="20px">
                                <MarkeredGMaps
                                    coordinatesList={listings.map((listing) => {
                                        const [lat, lng] = listing.coordinates.split(',').map(parseFloat);
                                        return { lat, lng };
                                    })}
                                    listings={listings}
                                    isSmallerThan1095={false}
                                />
                            </SlideFade>
                        </Box>
                    )}
                </Flex>
            </Skeleton>
        </>
    );
};

export default FoodListingsPage;