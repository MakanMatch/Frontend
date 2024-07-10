/* eslint-disable react-hooks/exhaustive-deps */
// FoodListingsPage.jsx
import { useState, useEffect } from "react";
import server from "../../networking";
import FoodListing from "../../components/listings/FoodListing";
import GoogleMaps from "../../components/listings/GoogleMaps";
import AddListingModal from "../../components/listings/AddListingModal";
import { Button, useDisclosure, SimpleGrid, Text, Box, useToast, Flex, SlideFade, useMediaQuery, Skeleton } from "@chakra-ui/react";

const FoodListingsPage = () => {
    const [listings, setListings] = useState([]);
    const [hostUserID, setHostUserID] = useState("");
    const [hostName, setHostName] = useState("");
    const [hostRating, setHostRating] = useState(0);
    const [guestUserID, setGuestUserID] = useState("");
    const [guestUsername, setGuestUsername] = useState("");
    const [guestFavCuisine, setGuestFavCuisine] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isSmallerThan1095] = useMediaQuery("(max-width: 1095px)");
    const [isBetween701And739] = useMediaQuery("(min-width: 701px) and (max-width: 739px)");
    const [loading, setLoading] = useState(true); 
    const toast = useToast();

    function ShowToast(title, description, status, duration) {
        toast({
            title: title,
            description: description,
            status: status,
            duration: duration,
            isClosable: false,
        });
    }

    function getImageLink(listingID, imageName) {
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getImageForListing?listingID=${listingID}&imageName=${imageName}`;
    }

    const fetchListings = async () => {
        try {
            const response = await server.get("/cdn/listings");
            setListings(response.data);
        } catch (error) {
            toast.closeAll();
            ShowToast(
                "Error fetching food listings",
                "Please try again later.",
                "error",
                2500
            );
        }
    };

    const fetchHostDetails = async () => {
        const response = await server.get("/cdn/fetchHostdetails");
        setHostUserID(response.data.hostUserID);
        setHostName(response.data.hostUsername);
        setHostRating(response.data.hostFoodRating);
    };

    const fetchGuestDetails = async () => {
        const response = await server.get("/cdn/fetchGuestDetails");
        setGuestUserID(response.data.guestUserID);
        setGuestUsername(response.data.guestUsername);
        setGuestFavCuisine(response.data.guestFavCuisine);
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchHostDetails();
            await fetchGuestDetails();
            await fetchListings();
            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        <div>
            <Text fontSize={"30px"} mb={4}>
                {guestUsername === "" ? "Welcome to MakanMatch!" : `Welcome, ${guestUsername}!`}
            </Text>
            <Box display="flex" justifyContent="center" mb={4}>
                <Button onClick={onOpen} variant="MMPrimary">
                    Host a meal
                </Button>
            </Box>
            {isSmallerThan1095 && (
                <Box mb={4}>
                    <GoogleMaps maxHeight="250px"/>
                </Box>
            )}
            <Skeleton isLoaded={!loading}>
                <Flex display="flex" flexWrap="wrap">
                    <Box
                        maxH="520px"
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
                                    <SlideFade
                                        in={true}
                                        offsetY="20px"
                                        key={listing.listingID}
                                    >
                                        <Box 
                                            display={isBetween701And739 ? "flex" : "initial"}
                                            justifyContent={isBetween701And739 ? "center" : "initial"}>
                                            <FoodListing
                                                listingID={listing.listingID}
                                                title={listing.title}
                                                portionPrice={listing.portionPrice}
                                                hostName={hostName}
                                                hostFoodRating={hostRating}
                                                userID={guestUserID}
                                                hostID={hostUserID}
                                                isFavourite={guestFavCuisine.split("|").includes(listing.listingID)}
                                                ShowToast={ShowToast}
                                                images={listing.images.map((imageName) =>
                                                    getImageLink(listing.listingID, imageName)
                                                )}
                                                fetchListings={fetchListings}
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
                                height="65vh"
                            >
                                <Text
                                    textAlign="center"
                                    fontSize="lg"
                                    color="gray.500"
                                    width="50%"
                                >
                                    No listings available
                                </Text>
                            </Box>
                        )}
                    </Box>
                    {!isSmallerThan1095 && (
                        <Box flex="1" ml={5}>
                            <SlideFade in={true} offsetY="20px">
                                <GoogleMaps />
                            </SlideFade>
                        </Box>
                    )}
                </Flex>
            </Skeleton>
            <AddListingModal
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onOpen}
                fetchListings={fetchListings}
            />
        </div>
    );
};

export default FoodListingsPage;
