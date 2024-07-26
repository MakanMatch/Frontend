/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-key */
import { Box, useToast, Heading, Stack, StackDivider } from "@chakra-ui/react";
import GuestSideNav from "../../components/identity/GuestSideNav";
import MakanHistoryCard from "../../components/identity/MakanHistoryCard";
import server from "../../networking";
import { useEffect, useState } from "react";
import configureShowToast from '../../components/showToast';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MakanHistory = () => {
    const [reservations, setReservations] = useState([]); // array of past reservations that the user made
    const [listings, setListings] = useState([]); // array of listings tied to the past reservations
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const loaded = useSelector((state) => state.auth.loaded);

    const fetchMakanHistory = async() => {
        try {
            const pastReservationsResponse = await server.get("/makanHistory/getGuestPastReservations");
            if (pastReservationsResponse.status === 200) {
                const makanHistory = pastReservationsResponse.data;
                setReservations(makanHistory);
                const listingIDs = makanHistory.map((reservation) => reservation.listingID);
    
                const listingPromises = listingIDs.map((listingID) =>
                    server.get(`/cdn/getListing?id=${listingID}`)
                );
    
                const listingResponses = await Promise.all(listingPromises);
                const fetchedListings = listingResponses.map((response) => {
                    if (response.status === 200) {
                        return response.data;
                    } else {
                        showToast("Error", "Failed to fetch listings", 3000, true, "error");
                        return null;
                    }
                }).filter(listing => listing !== null);
    
                setListings(fetchedListings);
            }
        } catch (error) {
            console.error("Error fetching makan history:", error);
            showToast("Error", "Failed to fetch past reservations", 3000, true, "error");
        }
    };

    useEffect(() => {
        if (loaded === true) {
            if (user && user.userID) {
                fetchMakanHistory();
            } else {
                navigate("/auth/login");
                showToast("You're not logged in", "Please login first", 3000, true, "info");
            }
        }
    }, [loaded, user]);

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
                                Makan History
                            </Heading>
                        </Box>
                        <Box display="flex" flexDir={"column"} padding="20px">
                            {reservations.map((reservation) => (
                                <MakanHistoryCard
                                    reservation={reservation}
                                    listing={listings.find((listing) => listing.listingID === reservation.listingID)}
                                />
                            ))}
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default MakanHistory;