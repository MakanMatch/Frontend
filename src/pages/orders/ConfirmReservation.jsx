import { Box, Button, Divider, FormControl, FormHelperText, FormLabel, HStack, Heading, Input, Spacer, Spinner, Text, VStack, useMediaQuery, useToast } from '@chakra-ui/react'
import { Link as ChakraLink } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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
    const [isSmallerThan800] = useMediaQuery("(max-width: 800px)");
    const [searchParams] = useSearchParams();
    const [listingID, setListingID] = useState(searchParams.get("id"))
    const [listingData, setListingData] = useState({});
    const [hostData, setHostData] = useState({});
    const [userData, setUserData] = useState({});
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
        const before = data.datetime;
        let datetime = new Date(data.datetime)
        let formattedString = datetime.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' })
        data.datetime = formattedString
        data.fullDatetime = before;

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
                    setLoading(false);
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

    const fetchUserDetails = () => {
        if (!user || !user.userID) { setLoading(false); return; }
        server.get(`/cdn/accountInfo?userID=${user.userID}`)
            .then(res => {
                dispatch(reloadAuthToken(authToken));
                if (res.status == 200) {
                    const { userID, username, email } = res.data;
                    setUserData({ userID, username, email })
                } else if (res.status == 404) {
                    console.log("User not found, re-directing to home.")
                    navigate("/auth/login")
                    return
                } else {
                    showToast("Error", "Failed to retrieve your details. Please try again.", 3500, true, "error")
                    console.log("LISTING RESERVE: Failed to retrieve user details, redirecting to home. Response below.")
                    console.log(res.data)
                    navigate("/")
                }
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken));
                showToast("Error", "Failed to retrieve your details. Please try again.", 3500, true, "error")
                console.log("LISTING RESERVE: Failed to retrieve user details, redirecting to home. Response below.")
                console.log(err)
                navigate("/")
            })
    }

    useEffect(() => {
        if (loaded == true) {
            if (state == null || !state.listingID) {
                if (!listingID) {
                    console.log("No listing ID provided to show confirm reservation.")
                    showToast("Something went wrong", "Insufficient information provided.", 1500, true, "error")
                    navigate("/")
                    return
                }
            } else {
                setListingID(state.listingID)
            }

            fetchListingDetails(listingID || state.listingID)
            fetchUserDetails() // Will only fetch if user is logged in. If not fetched, UI will show "Login or sign up to reserve."
        }
    }, [loaded, user])

    if (loading) {
        return (
            <Box p={"15px"}>
                <VStack alignItems={"flex-start"}>
                    <Button onClick={handleGoBack} bg={'none'} p={0}><ArrowBackIcon /></Button>
                    <Heading fontFamily={'Sora'} fontWeight={'bold'} fontSize={{ 'base': 'x-large', 'lg': 'xx-large' }}>Confirm Reservation</Heading>
                </VStack>
                <Spinner />
            </Box>
        )
    }

    return (
        <Box p={"15px"}>
            <VStack alignItems={"flex-start"}>
                <Button onClick={handleGoBack} bg={'none'} p={0}><ArrowBackIcon /></Button>
                <Heading fontFamily={'Sora'} fontWeight={'bold'} fontSize={{ 'base': 'x-large', 'lg': 'xx-large' }}>Confirm Reservation</Heading>
            </VStack>


            <Box mt={"30px"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} maxW={"100%"}>
                <Box display={"flex"} justifyContent={"left"} flexDirection={"column"} width={!isSmallerThan800 ? "50%" : "100%"}>
                    <Box display={"flex"} justifyContent={"space-between"} flexDirection={"row"}>
                        <Box textAlign={"left"} flexDirection={"column"}>
                            {isSmallerThan800 && (
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
                            <Text>{listingData.datetime}</Text>
                            <Text mb={"20px"}>{new Date(listingData.fullDatetime).toLocaleString('en-US', { timeStyle: 'short' }) }</Text>

                            <Text fontWeight={"bold"}>Host:</Text>
                            <Text mb={"20px"}>{hostData.username}</Text>

                            <Text fontWeight={"bold"}>Total Reservations:</Text>
                            <Text mb={"20px"}>{listingData.slotsTaken}/{listingData.totalSlots} Reserved</Text>
                        </Box>

                        {!isSmallerThan800 && (
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
                                <Text fontWeight={"light"}>
                                    Details retrieved from your MakanMatch account.
                                    <ChakraLink as={Link} to={"/identity/myaccount"} ml={"5px"} color={'primaryColour'}>Change here.</ChakraLink>
                                </Text>

                                <FormControl mt={"10px"}>
                                    <FormLabel>Username</FormLabel>
                                    <Input type='text' placeholder='John Doe' value={user.username} isReadOnly />
                                    <FormLabel mt={"10px"}>Email</FormLabel>
                                    <Input type='text' placeholder='email@example.com' value={userData.email} isReadOnly />
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

                {!isSmallerThan800 && (
                    <Box display={"flex"} justifyContent={"center"}>
                        <ConfirmReserveCard listingData={listingData} userData={userData} hostData={hostData} />
                    </Box>
                )}
            </Box>

            {isSmallerThan800 && (
                <Box display={"flex"} justifyContent={"center"} mt={"50px"}>
                    <ConfirmReserveCard listingData={listingData} userData={userData} hostData={hostData} />
                </Box>
            )}
        </Box>
    )
}

export default ConfirmReservation