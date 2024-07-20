import { Box, Button, Divider, FormControl, FormHelperText, FormLabel, HStack, Heading, Input, Spacer, Text, VStack, useMediaQuery, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import configureShowToast from '../../components/showToast';
import { ArrowBackIcon } from '@chakra-ui/icons';
import MarkeredGMaps from '../../components/listings/MarkeredGMaps';
import StaticGMaps from '../../components/listings/StaticGMaps';
import ConfirmReserveCard from '../../components/orders/ConfirmReserveCard';
import { useDispatch, useSelector } from 'react-redux';
import { reloadAuthToken } from '../../slices/AuthState';
import server from '../../networking';

function ConfirmReservation() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const [isSmallerThan600] = useMediaQuery("(max-width: 600px)");
    const [searchParams] = useSearchParams();
    const [listingID, setListingID] = useState(searchParams.get("id"))
    const [listingData, setListingData] = useState({});
    const [hostData, setHostData] = useState({});
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { user, loaded, authToken } = useSelector(state => state.auth)

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    }

    const processListingData = (data) => {
        let datetime = new Date(data.datetime)
        let formattedString = datetime.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' })
        data.datetime = formattedString

        data.images = data.images.split("|")

        var slotsTaken = 0;
        if (data.guests) {
            data.guests.forEach((guest) => {
                slotsTaken += guest.Reservation.portions
            })
        }

        data.slotsTaken = slotsTaken;

        return data
    }

    const processHostData = (data) => {
        const { userID, username, foodRating, hygieneGrade } = data
        return { userID, username, foodRating, hygieneGrade }
    }

    const fetchListingDetails = (id) => {
        server.get(`/cdn/getListing?id=${id}&includeReservations=true&includeHost=true`)
            .then(response => {
                dispatch(reloadAuthToken(authToken));
                if (response.status == 200) {
                    const processedData = processListingData(response.data)
                    if (user && processedData.hostID == user.userID) { console.log("Attempt to reserve listing blocked; redirecting..."); navigate("/"); return; }
                    const processedHostData = processHostData(response.data.Host)
                    setListingData(processedData)
                    setHostData(processedHostData)
                    return
                } else if (response.status == 404) {
                    console.log("Listing not found, re-directing to home.")
                    navigate("/")
                    return
                } else {
                    showToast("Error", "Failed to retrieve listing details", 5000, true, "error")
                    console.log("LISTING RESERVE: Failed to retrieve listing details, redirecting to home. Response below.")
                    console.log(response.data)
                    navigate("/")
                    return
                }
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken));
                showToast("Error", "Failed to retrieve listing details", 5000, true, "error")
                console.log("LISTING RESERVE: Failed to retrieve listing details, redirecting to home. Response below.")
                console.log(err)
                navigate("/")
                return
            })
    }

    useEffect(() => {
        if (loaded == true) {
            console.log(state)
            if (!state.listingID) {
                if (!listingID) {
                    console.log("No listing ID provided to show confirm reservation.")
                    showToast("Something went wrong", "Insufficient information provided.", 1500, true, "error")
                    navigate("/")
                    return
                }
            } else {
                setListingID(history.state.listingID)
            }

            fetchListingDetails(state.listingID || listingID)
        }
    }, [loaded, user])

    return (
        <Box p={"15px"}>
            <VStack alignItems={"flex-start"}>
                <Button onClick={handleGoBack} bg={'none'} p={0}><ArrowBackIcon /></Button>
                <Heading fontFamily={'Sora'} fontWeight={'bold'} fontSize={{ 'base': 'x-large', 'lg': 'xx-large' }}>Confirm Reservation</Heading>
            </VStack>


            <Box mt={"30px"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} maxW={"100%"}>
                <Box display={"flex"} justifyContent={"left"} flexDirection={"column"} width={!isSmallerThan600 ? "50%" : "100%"}>
                    <Box display={"flex"} justifyContent={"space-between"} flexDirection={"row"}>
                        <Box textAlign={"left"} flexDirection={"column"}>
                            {isSmallerThan600 && (
                                <StaticGMaps
                                    coordinates={{ lat: 1.3016989, lng: 103.8284868 }}
                                    style={{
                                        height: "200px",
                                        width: "300px",
                                        borderRadius: "10px",
                                        marginBottom: "30px"
                                    }}
                                />
                            )}

                            <Text fontWeight={"bold"}>Date and Time:</Text>
                            <Text>13 May, Tuesday, 2024</Text>
                            <Text mb={"20px"}>6:00PM-8:00PM</Text>

                            <Text fontWeight={"bold"}>Host:</Text>
                            <Text mb={"20px"}>Jamie Oliver</Text>

                            <Text fontWeight={"bold"}>Total Guests Served:</Text>
                            <Text mb={"20px"}>2/5 Reserved</Text>
                        </Box>

                        {!isSmallerThan600 && (
                            <StaticGMaps
                                coordinates={{ lat: 1.3016989, lng: 103.8284868 }}
                                style={{
                                    height: "200px",
                                    width: "250px",
                                    borderRadius: "10px",
                                    marginLeft: "30px"
                                }}
                            />
                        )}
                    </Box>

                    <Divider mt={"30px"} mb={"30px"} />

                    <Box textAlign={"left"} flexDirection={"column"}>
                        {user ? (
                            <>
                                <Heading as={"h5"} size={"md"} mb={"5px"}>Profile</Heading>
                                <Text fontWeight={"light"}>Details auto-filled from your MakanMatch account.</Text>

                                <FormControl mt={"10px"}>
                                    <FormLabel>Username</FormLabel>
                                    <Input type='text' placeholder='John Doe' />
                                    <FormLabel mt={"10px"}>Email</FormLabel>
                                    <Input type='text' placeholder='email@example.com' />
                                </FormControl>
                            </>
                        ) : (
                            <>
                                <Heading as={"h5"} size={"md"} mb={"5px"}>Login or sign up to reserve.</Heading>
                                <Text fontWeight={"light"}>A MakanMatch account is needed to make a reservation.</Text>
                            </>
                        )}
                    </Box>
                </Box>

                {!isSmallerThan600 && (
                    <Box display={"flex"} justifyContent={"center"}>
                        <ConfirmReserveCard />
                    </Box>
                )}
            </Box>

            {isSmallerThan600 && (
                <Box display={"flex"} justifyContent={"center"} mt={"50px"}>
                    <ConfirmReserveCard />
                </Box>
            )}
        </Box>
    )
}

export default ConfirmReservation