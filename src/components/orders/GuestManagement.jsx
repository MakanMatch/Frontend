import React, { useEffect, useState } from 'react'
import server from '../../networking'
import { Spinner, Text, Box, Button, Avatar, IconButton, Flex, ScaleFade, Badge, useBreakpointValue } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux'
import { reloadAuthToken } from '../../slices/AuthState'
import configureShowToast from '../../components/showToast'
import { FaCommentDots, FaCheck } from "react-icons/fa";

function GuestManagement({
    listingID,
    guests
}) {
    const [guestsList, setGuestsList] = useState([]);
    const dispatch = useDispatch();
    const { user, loaded, authToken } = useSelector((state) => state.auth);
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const textAlign = useBreakpointValue({ base: "center", md: "left" });
    const isBaseScreen = useBreakpointValue({ base: true, md: false });

    const handlePaidAndPresent = async ({ referenceNum, listingID, guestID }) => {
        try {
            const response = await server.put(`/orders/manageGuests/togglePaidAndPresent`, { referenceNum, listingID, guestID });
            dispatch(reloadAuthToken(authToken))
            if (response.status === 200) {
                if (response.data.paidAndPresent == true) {
                    showToast('Marked', 'Guest has been marked as paid & present', 3000, false, 'success');
                    guestsList.forEach((guest) => {
                        if (guest.Reservation.referenceNum === referenceNum) {
                            guest.Reservation.paidAndPresent = true;
                        }
                    })
                    setRefresh(!refresh);
                } else {
                    showToast('Unmarked', 'Guest has been marked as not paid & present', 3000, false, 'success');
                    guestsList.forEach((guest) => {
                        if (guest.Reservation.referenceNum === referenceNum) {
                            guest.Reservation.paidAndPresent = false;
                        }
                    })
                    setRefresh(!refresh);
                }
            } else {
                showToast('Something went wrong', 'An error occurred while marking guest as paid & present', 3000, false, 'error');
                console.log('Error marking guest as paid & present:', response.data);
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken))
            if (error.response && error.response.data) {
                if (error.response.data.startsWith("UERROR")) {
                    showToast('Something went wrong', error.response.data.substring("UERROR: ".length), 3000, false, 'error');
                    console.log('User error occurred in marking guest as paid & present:', error.response.data);
                } else {
                    showToast('Something went wrong', 'An error occurred while marking guest as paid & present', 3000, false, 'error');
                    console.log('Error marking guest as paid & present:', error.response.data);
                }
            } else {
                showToast('Something went wrong', 'An error occurred while marking guest as paid & present', 3000, false, 'error');
                console.log('Error marking guest as paid & present:', error);
            }
        }
    }

    useEffect(() => {
        setGuestsList(guests);
    }, [guestsList, refresh])

    if (!loaded) {
        return (
            <Spinner />
        )
    }

    return (
        <>
            {guestsList.length > 0 && (
                <>
                    <Text fontWeight="bold" fontSize="large" display="flex" mb={10} mt={4}>Guests</Text>
                    <Text textAlign="left" color="grey" fontSize="large" display="flex" mb={10}>When guests arrive, check that they have paid and click "Paid & Present" to let us know.</Text>
                </>
            )}
            {guestsList.length > 0 ? (
                guestsList.map((guest) => (
                    <Box
                        key={guest.Reservation.userID}
                        display="flex"
                        flexDirection={{ base: 'column', md: 'row' }}
                        alignItems="center"
                        justifyContent="space-between"
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        p={4}
                        mb={4}
                    >
                        <Flex
                            direction={{ base: 'column', md: 'row' }}
                            alignItems={{ base: 'center', md: 'flex-start' }}
                            mb={{ base: 4, md: 0 }}
                            textAlign={{ base: 'center', md: 'left' }}
                            justifyContent={textAlign}  // Ensure centering on base screens
                            width="100%"
                        >

                            <Avatar name={guest.username} size={{ base: "md", md: "lg" }} mr={{ base: 0, md: 4 }} mb={{ base: 2, md: 0 }} />
                            <Box>
                                <Flex
                                    gap={{ base: 2, md: 3 }}
                                    width="100%"
                                    alignItems={{ base: 'center', md: 'center' }}
                                    flexWrap="wrap"
                                    justifyContent={textAlign}  // Ensure centering on base screens
                                >
                                    <Box>
                                        <Text
                                            fontWeight="bold"
                                            fontSize={{ base: "md", md: "lg" }}
                                            textAlign={textAlign}
                                        >
                                            {guest.fname} {guest.lname}
                                        </Text>
                                    </Box>
                                    {guest.Reservation.markedPaid && !isBaseScreen && (
                                        <Box>
                                            <ScaleFade initialScale={0.5} in={guest.Reservation.markedPaid}>
                                                <Badge colorScheme="purple" variant="solid" px={3} py={1}>PAID</Badge>
                                            </ScaleFade>
                                        </Box>
                                    )}
                                </Flex>
                                {guest.Reservation.markedPaid && isBaseScreen && (
                                    <Box mt={2}>
                                        <ScaleFade initialScale={0.5} in={guest.Reservation.markedPaid}>
                                            <Badge colorScheme="purple" variant="solid" px={3} py={1}>PAID</Badge>
                                        </ScaleFade>
                                    </Box>
                                )}
                                <Flex
                                    mt={2}
                                    direction={{ base: "column", md: "row" }}
                                    alignItems="center"
                                    justify={{ base: "flex-start", md: "space-between" }}
                                    width="100%"
                                    gap={3}
                                >
                                    <Text color="grey" fontSize={{ base: "sm", md: "md" }}>Total portion: {guest.Reservation.portions}</Text>
                                    <Text color="grey" fontSize={{ base: "sm", md: "md" }}>Total price: ${guest.Reservation.totalPrice}</Text>
                                </Flex>
                            </Box>
                        </Flex>
                        <Box display="flex" alignItems="center" >
                            <IconButton
                                icon={<FaCommentDots />}
                                aria-label="Message Guest"
                                mr={4}
                                variant="ghost"
                                colorScheme="blackAlpha"
                                size={{ base: "sm", md: "lg" }}
                                onClick={() => navigate(`/chat`)}
                            />
                            {guest.Reservation.paidAndPresent ? (
                                <Button
                                    background="green.500"
                                    color="white"
                                    borderRadius="10px"
                                    fontWeight="bold"
                                    _hover={{ bg: "green.600" }}
                                    size={{ base: "sm", md: "md" }}
                                    onClick={() => handlePaidAndPresent({ referenceNum: guest.Reservation.referenceNum, listingID, guestID: guest.Reservation.guestID })}
                                    rightIcon={<FaCheck />}
                                >
                                    Paid & Present
                                </Button>
                            ) : (
                                <Button
                                    variant="MMPrimary"
                                    size={{ base: "sm", md: "md" }}
                                    onClick={() => handlePaidAndPresent({ referenceNum: guest.Reservation.referenceNum, listingID, guestID: guest.Reservation.guestID })}
                                >
                                    Paid & Present
                                </Button>
                            )}
                        </Box>
                    </Box>
                ))
            ) : (
                <Text textAlign={textAlign} color="grey" fontSize="large" mt={6}>
                    Oops, there are no reservations made yet!
                </Text>)}
        </>
    )
}

export default GuestManagement