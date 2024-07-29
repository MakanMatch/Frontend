import { Box, Button, Card, CardBody, CardFooter, Center, Heading, HStack, Image, Spinner, Stack, Text, useMediaQuery, useToast, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import server from '../../networking';
import { useDispatch, useSelector } from 'react-redux';
import configureShowToast from '../../components/showToast';
import { Link, useNavigate } from 'react-router-dom';
import { reloadAuthToken } from '../../slices/AuthState';
import { ChatIcon, StarIcon } from '@chakra-ui/icons';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaClock } from 'react-icons/fa';

let SGDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SGD',
});

function UpcomingReservation() {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [isSmallerThan800] = useMediaQuery("(max-width: 900px)");
    const dispatch = useDispatch();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [currentReservation, setCurrentReservation] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);
    const { user, loaded, authToken } = useSelector(state => state.auth)

    const processReservationData = (reservations) => {
        var processedReservations = reservations.map(reservation => {
            var slotsTaken = 0;
            for (const guest of reservation.listing.guests) {
                slotsTaken += guest.Reservation.portions;
            }
            reservation.listing.slotsTaken = slotsTaken;

            const before = structuredClone(reservation.listing.datetime);
            let datetime = new Date(reservation.listing.datetime)
            let formattedString = datetime.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' })
            reservation.listing.fullDatetime = before;
            reservation.listing.datetime = formattedString

            return reservation;
        })

        console.log("Reservation data processed: ", processedReservations);

        return processedReservations;
    }

    const getFirstImageURL = () => {
        if (!currentReservation || !currentReservation.listing || !currentReservation.listing.images || currentReservation.listing.images.length == 0) {
            return ""
        } else {
            return `${backendURL}/cdn/getImageForListing?listingID=${currentReservation.listingID}&imageName=${currentReservation.listing.images[0]}`
        }
    }

    const fetchReservations = () => {
        server.get('/getReservations?includeListing=true&includeListingHost=true&includeListingReservations=true')
            .then(response => {
                dispatch(reloadAuthToken(authToken));
                if (response.status == 200) {
                    if (Array.isArray(response.data)) {
                        const processedReservations = processReservationData(response.data);
                        setReservations(processedReservations);
                        if (processedReservations.length > 0) {
                            setCurrentReservation(processedReservations[0]);
                        }
                        setDataLoaded(true);
                    } else {
                        console.log("Unexpected format of reservations response data; response: ", response.data);
                        showToast("Something went wrong", "Failed to load required information. Please try again.", 2000, true, "error");
                        return;
                    }
                } else {
                    console.log("Failed to fetch reservations (Non-200 status code); response: ", response);
                    showToast("Something went wrong", "Failed to load required information. Please try again.", 2000, true, "error");
                    return;
                }
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken));
                if (err.response && err.response.data && typeof err.response.data == "string") {
                    if (err.response.data.startsWith("UERROR")) {
                        console.log("User error occurred in retrieving reservations; error: " + err.response.data)
                        showToast("Something went wrong", err.response.data.substring("UERROR: ".length), 2000, true, "error");
                    } else {
                        console.log("Error occurred in retrieving reservations; error: " + err.response.data);
                        showToast("Something went wrong", "Failed to load required information. Please try again.", 2000, true, "error");
                    }
                } else {
                    console.log("Error occurred in retrieving reservations; error: " + err);
                    showToast("Something went wrong", "Failed to load required information. Please try again.", 2000, true, "error");
                }
            })
    }

    useEffect(() => {
        if (loaded == true) {
            if (!user) {
                navigate('/auth/login');
                showToast("Sign in first", "Login to your account to view reservations.", 2000, true, "error");
                return;
            }

            fetchReservations();
        }
    }, [loaded, user])

    if (!dataLoaded) {
        return <Spinner />;
    }

    function ManageReservationSection(mode = "full") {
        return (
            <Box display={"flex"} justifyContent={"flex-start"} flexDirection={"column"} mt={"60px"} alignItems={"flex-start"} ml={"30px"}>
                <Heading fontFamily={"Sora"} fontSize={{ 'base': 'large', 'md': 'larger' }}>Meal Details</Heading>
                <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} mt={"20px"} alignItems={"flex-start"} textAlign={"left"}>
                    <HStack spacing={"30px"}>
                        <Box>
                            <Text>Name</Text>
                            <Text><strong>{currentReservation.listing.title}</strong></Text>
                        </Box>

                        <Box>
                            <Text>Unit Price</Text>
                            <Text><strong>{SGDollar.format(currentReservation.listing.portionPrice)}</strong></Text>
                        </Box>

                        <Box>
                            <Text>Portions Reserved</Text>
                            <Text><strong>{currentReservation.portions}</strong></Text>
                        </Box>

                        <Box>
                            <Text>Total Price</Text>
                            <Text><strong>{SGDollar.format(currentReservation.totalPrice)}</strong></Text>
                        </Box>
                    </HStack>
                </Box>
                <br />
                <br />
                <Text>6 hours prior to the reservation, return here to make your payment to the host.</Text>
                <Text>Keep a lookout in your inbox for the notification from us!</Text>
                <Button mt={"20px"} colorScheme='red' fontWeight={"bold"}>Cancel Reservation</Button>
            </Box>
        )
    }

    if (!currentReservation) {
        return (
            <Box mt={{ base: "150px", md: "250px", lg: "350px" }}>
                <Heading fontFamily={'Sora'} fontWeight={'bold'} fontSize={{ 'base': 'x-large', 'lg': 'xx-large' }}>No reservations yet.</Heading>
                <Text mt={"20px"}>Make a reservation to get more details about it!</Text>
                <Link to={"/"}>
                    <Text color={"primaryColour"} textDecoration={"underline"} mt={"20px"}>
                        Makan up here!
                    </Text>
                </Link>
            </Box>
        )
    }

    return (
        <Box p={isSmallerThan800 ? "5px": "20px"}>
            <Box mt={"30px"} display={"flex"} justifyContent={"space-between"} flexDirection={"row"} maxW={"100%"}>
                <Box display={"flex"} justifyContent={"left"} flexDirection={"column"} textAlign={"left"} width={!isSmallerThan800 ? "50%" : "100%"}>
                    <Heading fontFamily={'Sora'} fontWeight={'bold'} fontSize={{ 'base': 'x-large', 'lg': 'xx-large' }}>Your Upcoming Reservation</Heading>

                    <Box mt={"5%"}>
                        <Card direction={{ base: 'column', sm: 'row' }} overflow='hidden' variant='outline' maxW={"650px"}>
                            <Image objectFit='cover' maxW={{ base: '100%', sm: '200px' }} src={getFirstImageURL()} alt={currentReservation.listing.title} />
                            <Stack>
                                <CardBody>
                                    <Heading size='md'>{currentReservation.listing.title}</Heading>

                                    <Text py='2'>
                                        By <strong>{currentReservation.listing.Host.username}</strong>
                                        <ChatIcon ml={"10px"} />
                                    </Text>

                                    <Text>{currentReservation.listing.longDescription}</Text>
                                </CardBody>

                                <CardFooter>
                                    <HStack display={'flex'} justifyContent={'space-between'}>
                                        <StarIcon /><Text>{currentReservation.listing.Host.foodRating}</Text>
                                        <BsFillPeopleFill /><Text>{currentReservation.listing.slotsTaken}/{currentReservation.listing.totalSlots}</Text>
                                        <FaClock /><Text>{new Date(currentReservation.listing.fullDatetime).toLocaleString('en-US', { dateStyle: "short", timeStyle: 'short' })}</Text>
                                    </HStack>
                                </CardFooter>
                            </Stack>
                        </Card>
                    </Box>

                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} mt={"30px"}>
                        <Box>
                            <Text><strong>Address</strong></Text>
                            <Text maxW={"150px"} overflowWrap={"break-word"}>{currentReservation.listing.address}</Text>
                        </Box>

                        <Box ml={"5%"}>
                            <Text><strong>Date and Time</strong></Text>
                            <Text>{new Date(currentReservation.listing.fullDatetime).toLocaleString('en-US', { dateStyle: "long" })}</Text>
                            <Text>{new Date(currentReservation.listing.fullDatetime).toLocaleString('en-US', { timeStyle: "long" })}</Text>
                        </Box>

                        <Box ml={"5%"}>
                            <Text><strong>Guests</strong></Text>
                            {currentReservation.listing.guests.map(guest => (
                                <Text>{guest.fname + " " + guest.lname}</Text>
                            ))}
                        </Box>
                    </Box>
                </Box>

                {!isSmallerThan800 && ManageReservationSection()}
            </Box>

            {isSmallerThan800 && ManageReservationSection("small")}
        </Box>
    )
}

export default UpcomingReservation;