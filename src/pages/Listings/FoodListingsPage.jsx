/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import server from "../../networking";
import FoodListingCard from "../../components/listings/FoodListingCard";
import MarkeredGMaps from "../../components/listings/MarkeredGMaps";
import AddListingModal from "../../components/listings/AddListingModal";
import configureShowToast from "../../components/showToast";
import { Button, useDisclosure, SimpleGrid, Text, Box, useToast, Flex, SlideFade, useMediaQuery, Skeleton } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FoodListingsPage = () => {
    const [listings, setListings] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isSmallerThan1095] = useMediaQuery("(max-width: 1095px)");
    const [isBetween701And739] = useMediaQuery("(min-width: 701px) and (max-width: 739px)");
    const [loading, setLoading] = useState(true); 
    const toast = useToast();
    const navigate = useNavigate();
    const showToast = configureShowToast(toast);
    const { user, authToken, loaded } = useSelector((state) => state.auth);

    function getImageLink(listingID, imageName) {
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getImageForListing?listingID=${listingID}&imageName=${imageName}`;
    }

    const fetchListings = async () => {
        try {
            const response = await server.get("/cdn/listings");
            setListings(response.data);
        } catch (error) {
            toast.closeAll();
            showToast(
                "Error fetching food listings",
                "Please try again later.",
                "error",
                2500
            );
        }
    };

    function handleClickAddListing() {
        console.log("Authtoken: ", authToken);
        if (!authToken || !user) {
            navigate('/auth/login');
            setTimeout(() => {
                showToast("You're not logged in", "Please Login first", 3000, false, "info");
            }, 200);
        } else {
            onOpen();
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchListings();
            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        <div>
            <Text fontSize={"30px"} mb={4}>
                {loaded && user ? `Welcome, ${user.username}` : "Welcome to MakanMatch!"}
            </Text>
            <Box display="flex" justifyContent="center" mb={4}>
                <Button onClick={() => handleClickAddListing()} variant="MMPrimary">
                    Host a meal
                </Button>
            </Box>
            {isSmallerThan1095 && listings.length > 0 && (
                <Box mb={4}>
                    <MarkeredGMaps
                    coordinatesList={listings.map((listing) => {
                        const [lat, lng] = listing.coordinates.split(',').map(parseFloat);
                        return { lat, lng };
                    })}
                    listings={listings}
                    isSmallerThan1095={true}/>
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
                                                hostName={listing.Host.username || "MakanMatch Host"}
                                                hostFoodRating={listing.Host.foodRating || 0}
                                                hostID={listing.Host.userID}
                                                images={listing.images.map((imageName) =>
                                                    getImageLink(listing.listingID, imageName)
                                                )}
                                                fetchListings={fetchListings}
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
                                isSmallerThan1095={false}/>
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
