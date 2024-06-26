/* eslint-disable react-hooks/exhaustive-deps */
// FoodListingsPage.jsx
import { useState, useEffect } from "react";
import server from "../../networking";
import FoodListing from "../../components/listings/FoodListing";
import GoogleMaps from "../../components/listings/GoogleMaps";
import AddListingModal from "../../components/listings/AddListingModal";
import { Button, Heading, useDisclosure, SimpleGrid, Text, Box, useToast, Flex, SlideFade, } from "@chakra-ui/react";

const FoodListingsPage = () => {
    const [listings, setListings] = useState([]);
    const [hostName, setHostName] = useState("");
    const [hostRating, setHostRating] = useState(0);
    const [guestUserID, setGuestUserID] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
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

    const fetchHostInfo = async () => {
        const response = await server.get(`/cdn/accountInfo?userID=${"272d3d17-fa63-49c4-b1ef-1a3b7fe63cf4"}`);
        if (response.status === 200) {
            setHostName(response.data.username);
            setHostRating(response.data.foodRating);
        } else if (response.status === 404) {
            const hostData = {
                userID: "272d3d17-fa63-49c4-b1ef-1a3b7fe63cf4",
                username: "Jamie Oliver",
                email: "jamie_oliver@gmail.com",
                password: "JamieOliver123",
                contactNum: "81118222",
                address: "Block 123, Hougang Avenue 1, #01-234",
                emailVerified: "false",
                favCuisine: "Chilli Crab",
                mealsMatched: "0",
                foodRating: "4",
                hygieneGrade: "5",
                paymentImage: "public/Sample PayNow QR.png"
            };
            const createSampleHost = await server.post("/listings/createHost", hostData);
            if (createSampleHost.status === 200) {
                setHostName(hostData.username);
                setHostRating(hostData.foodRating);
            } else {
                toast.closeAll();
                ShowToast(
                    "Error fetching required information",
                    "Please try again later.",
                    "error",
                    2500
                );
            }
        } else {
            toast.closeAll();
            ShowToast(
                "Error fetching required information",
                "Please try again later.",
                "error",
                2500
            );
        }
    };

    const fetchGuestID = async () => {
        const response = await server.get(`/cdn/accountInfo?userID=${"47f4497b-1331-4b8a-97a4-095a79a1fd48"}`);
        if (response.status === 200) {
            setGuestUserID(response.data.userID);
        } else if (response.status === 404) {
            const guestData = {
                userID: "47f4497b-1331-4b8a-97a4-095a79a1fd48",
                username: "Susie Jones",
                email: "susie_jones@gmail.com",
                password: "SusieJones123",
                contactNum: "82228111",
                address: "Block 321, Hougang Avenue 10, #10-567",
                emailVerified: "false",
                favCuisine: "Nasi Lemak",
                mealsMatched: "0",
                resetKey: "265c18",
                resetKeyExpiration: "2024-06-22T14:30:00.000Z"
            }
            const createSampleGuest = await server.post("/listings/createGuest", guestData);
            if (createSampleGuest.status === 200) {
                setGuestUserID(guestData.userID);
            } else {
                toast.closeAll();
                ShowToast(
                    "Error fetching required information",
                    "Please try again later.",
                    "error",
                    2500
                );
            }
        } else {
            toast.closeAll();
            ShowToast(
                "Error fetching required information",
                "Please try again later.",
                "error",
                2500
            );
        }
    }

    useEffect(() => {
        fetchListings();
        fetchHostInfo();
        fetchGuestID();
    }, []);

    return (
        <div>
            <Heading as={"h1"} mb={4}>
                Food Listings
            </Heading>
            <Box display="flex" justifyContent="center" mb={4}>
                <Button onClick={onOpen} variant="MMPrimary">
                    Add Listing
                </Button>
            </Box>
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
                                    <FoodListing
                                        listingID={listing.listingID}
                                        title={listing.title}
                                        hostName={hostName}
                                        portionPrice={listing.portionPrice}
                                        hostFoodRating={hostRating}
                                        userID={guestUserID}
                                        ShowToast={ShowToast}
                                        // pass in images prop as an array of image links for every image there is. images is a string of image names separated by | symbol
                                        images={listing.images.map((imageName) =>
                                            getImageLink(listing.listingID, imageName)
                                        )
                                        }
                                    />
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
                <Box flex="1" ml={5}>
                    <SlideFade in={true} offsetY="20px">
                        <GoogleMaps />
                    </SlideFade>
                </Box>
            </Flex>
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
