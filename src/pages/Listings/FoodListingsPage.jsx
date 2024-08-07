/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { SimpleGrid, Text, Box, useToast, Flex, SlideFade, useMediaQuery, Skeleton, Spinner, Center, Fade, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Card, CardBody, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reloadAuthToken } from "../../slices/AuthState";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaUser } from "react-icons/fa";
import FoodListingCard from "../../components/listings/FoodListingCard";
import MarkeredGMaps from "../../components/listings/MarkeredGMaps";
import server from "../../networking";

const FoodListingsPage = () => {
    const [listings, setListings] = useState([]);
    const [isSmallerThan1095] = useMediaQuery("(max-width: 1095px)");
    const [isBetween701And739] = useMediaQuery("(min-width: 701px) and (max-width: 739px)");
    const [activeMarker, setActiveMarker] = useState(null);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    const timeOfDay = () => {
        const date = new Date();
        const hours = date.getHours();
        if (hours >= 5 && hours < 12) {
            return "morning";
        } else if (hours >= 12 && hours < 18) {
            return "afternoon";
        } else {
            return "evening";
        }
    }

    const { user, authToken, loaded } = useSelector((state) => state.auth);

    const toast = useToast();
    const dispatch = useDispatch();

    const salutations = [
        "What's on your mind?",
        "How about italian cuisine today?",
        "Feeling hungry?",
        "Let's find you something to eat!",
        "Ready to dig in?",
        "Wine and dine?"
    ]

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
            const response = await server.get("/cdn/listings?includeHost=true");
            dispatch(reloadAuthToken(authToken));
            if (response.status === 200) {
                setListings(response.data);
            } else { console.log("Unexpected response received; response:", response.data); }
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

    const navigateToListing = (listing, lat, lng) => {
        navigate("/targetListing", {
            state: {
                listingID: listing.listingID,
                hostID: listing.hostID,
                images: listing.images.map((image) => getImageLink(listing.listingID, image)),
                title: listing.title,
                shortDescription: listing.shortDescription,
                approxAddress: listing.approxAddress,
                portionPrice: listing.portionPrice,
                totalSlots: listing.totalSlots,
                latitude: lat,
                longitude: lng,
                flaggedForHygiene: listing.Host.flaggedForHygiene
            },
        });
    };

    const handleCloseMapModal = () => {
        setActiveMarker(null);
        localStorage.setItem("mapRemountDenyOnModalClose", true);
    }

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
        if (localStorage.getItem("mapRemountDenyOnModalOpen")) {
            localStorage.removeItem("mapRemountDenyOnModalOpen");
            if (localStorage.getItem("mapRemountDenyOnModalClose")) {
                localStorage.removeItem("mapRemountDenyOnModalClose");
            }
        }
    }, []);

    if (!loaded) {
        return (
            <Center height="100vh">
                <Fade in={!loaded}>
                    <Spinner size="lg" />
                </Fade>
            </Center>
        );
    } 
    
    return (
        <>
            <Text fontSize={"25px"} mb={4} ml={5} textAlign={"left"} fontFamily={"arial"}>
                {user ? `Good ${timeOfDay()} ${user.username}!` : "Welcome to MakanMatch!"}
            </Text>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Text fontSize={"15px"} mb={4} textAlign={"left"} ml={5} color="grey" fontFamily={"arial"}>
                    {salutations[Math.floor(Math.random() * salutations.length)]}
                </Text>
            </motion.div>
            {isSmallerThan1095 && listings.length > 0 && (
                <Box mb={4}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <MarkeredGMaps
                            coordinatesList={listings.map((listing) => {
                                const [lat, lng] = listing.approxCoordinates.split(',').map(parseFloat);
                                return { lat, lng };
                            })}
                            listings={listings}
                            isSmallerThan1095={true}
                            setActiveMarker={setActiveMarker}
                            navigateToListing={navigateToListing}
                        />
                    </motion.div>
                </Box>
            )}
            <Skeleton isLoaded={!loading} style={{ borderRadius: "10px" }}>
                <Flex display="flex" flexWrap="wrap">
                    <Box
                        height="83vh"
                        overflowY="auto"
                        boxShadow={"0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"}
                        borderRadius={"22px 22px 22px 22px"}
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
                                {listings && listings.map((listing) => (
                                    <SlideFade in={true} offsetY="20px" key={listing.listingID}>
                                        <Box 
                                            display={isBetween701And739 ? "flex" : "initial"}
                                            justifyContent={isBetween701And739 ? "center" : "initial"}
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5 }}
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
                                                    latitude={parseFloat(listing.approxCoordinates.split(',')[0])}
                                                    longitude={parseFloat(listing.approxCoordinates.split(',')[1])}
                                                    flaggedForHygiene={listing.Host.flaggedForHygiene}
                                                    sx={{ cursor: "pointer" }}
                                                />
                                            </motion.div>
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
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <MarkeredGMaps
                                    coordinatesList={listings.map((listing) => {
                                        const [lat, lng] = listing.approxCoordinates.split(',').map(parseFloat);
                                        return { lat, lng };
                                    })}
                                    listings={listings}
                                    isSmallerThan1095={false}
                                    setActiveMarker={setActiveMarker}
                                    navigateToListing={navigateToListing}
                                />
                            </motion.div>
                        </Box>
                    )}
                </Flex>
            </Skeleton>
            {activeMarker && (
                <Modal isOpen={true} closeOnOverlayClick={false} onClose={() => setActiveMarker(null)} size="xl">
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader color="#323437">This address has multiple listings! Select one to view</ModalHeader>
                        <ModalBody>
                            {activeMarker.listings.map((listing, idx) => (
                                <Card
                                mb={3}
                                key={idx}
                                sx={{ cursor: "pointer" }}
                                onClick={() => {
                                    navigateToListing(listing, activeMarker.lat, activeMarker.lng);
                                    setActiveMarker(null);
                                }}>
                                    <CardBody display="flex" justifyContent={"space-between"}>
                                        <Box mt={1}>
                                            <Text fontWeight="bold" mt={-3}>{listing.title}</Text>
                                            <Box display="flex" mb={2}>
                                                <Text mr={2} mt={3.5}><FaMapMarkerAlt fill="#515F7C" /></Text>
                                                <Text mt={3}>{listing.approxAddress}</Text>
                                            </Box>
                                            <Box display="flex">
                                                <Text mr={2} mt={1}><FaUser fill="#515F7C" /></Text>
                                                <Text>{listing.Host.username || "MakanMatch Host"}</Text>
                                            </Box>
                                        </Box>
                                        <Box display="flex" flexDirection="column" justifyContent={"center"}>
                                            <Text mt={2} fontSize="md">${listing.portionPrice} / portion</Text>
                                        </Box>
                                    </CardBody>
                                </Card>
                            ))}
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='red' mr={3} onClick={handleCloseMapModal}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};

export default FoodListingsPage;