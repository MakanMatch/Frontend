/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import server from "../../networking";
import FoodListingCard from "../../components/listings/FoodListingCard";
import MarkeredGMaps from "../../components/listings/MarkeredGMaps";
import AddListingModal from "../../components/listings/AddListingModal";
import { Button, useDisclosure, SimpleGrid, Text, Box, useToast, Flex, SlideFade, useMediaQuery, Skeleton } from "@chakra-ui/react";
import axios from "axios";

const FoodListingsPage = () => {
    const [listings, setListings] = useState([]);
    const [hostName, setHostName] = useState("");
    const [hostRating, setHostRating] = useState(0);
    const [guestUserID, setGuestUserID] = useState("");
    const [guestUsername, setGuestUsername] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [coordinatesList, setCoordinatesList] = useState([]);
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

    const generateCoordinates = async (address) => {
        const encodedAddress = encodeURIComponent(String(address));
        const apiKey = import.meta.env.VITE_GMAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address="${encodedAddress}"&key=${apiKey}`;
        try {
            const response = await axios.get(url);
            const location = response.data.results[0].geometry.location;
            return { lat: location.lat, lng: location.lng };
        } catch (error) {
            ShowToast("An error occured", "Failed to generate maps coordinates", "error", 3000);
            console.error(error);
            return null;
        }
    };

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
        setHostName(response.data.hostUsername);
        setHostRating(response.data.hostFoodRating);
    };

    const fetchGuestDetails = async () => {
        const response = await server.get("/cdn/fetchGuestDetails");
        setGuestUserID(response.data.guestUserID);
        setGuestUsername(response.data.guestUsername);
    }

    useEffect(() => {
        setAddresses(listings.map((listing) => listing.address));
    }, [listings]);

    useEffect(() => {
        const promiseCoordinates = async () => {
            const response = await Promise.all(addresses.map((address) => generateCoordinates(address)));
            setCoordinatesList(response);
        };
        promiseCoordinates();
    }, [addresses]);

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
            {isSmallerThan1095 && coordinatesList.length > 0 && (
                <Box mb={4}>
                    <MarkeredGMaps coordinatesList={coordinatesList} listings={listings} userID={guestUserID} isSmallerThan1095={true} getImageLink={getImageLink}/>
                </Box>
            )}
            <Skeleton isLoaded={!loading}>
                <Flex display="flex" flexWrap="wrap">
                    <Box
                        maxH="600px"
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
                                {listings.map((listing, index) => (
                                    <SlideFade
                                        in={true}
                                        offsetY="20px"
                                        key={listing.listingID}
                                    >
                                        <Box 
                                            display={isBetween701And739 ? "flex" : "initial"}
                                            justifyContent={isBetween701And739 ? "center" : "initial"}>
                                            <FoodListingCard
                                                listingID={listing.listingID}
                                                title={listing.title}
                                                portionPrice={listing.portionPrice}
                                                hostName={hostName}
                                                hostFoodRating={hostRating}
                                                userID={guestUserID}
                                                ShowToast={ShowToast}
                                                images={listing.images.map((imageName) =>
                                                    getImageLink(listing.listingID, imageName)
                                                )}
                                                fetchListings={fetchListings}
                                                shortDescription={listing.shortDescription}
                                                address={listing.address}
                                                approxAddress={listing.approxAddress}
                                                totalSlots={listing.totalSlots}
                                                coordinates={coordinatesList[index]}
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
                                    No listings available
                                </Text>
                            </Box>
                        )}
                    </Box>
                    {!isSmallerThan1095 && coordinatesList.length > 0 && (
                        <Box flex="1" ml={5}>
                            <SlideFade in={true} offsetY="20px">
                                <MarkeredGMaps addresses={addresses} listings={listings} userID={guestUserID} isSmallerThan1095={false} getImageLink={getImageLink}/>
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
