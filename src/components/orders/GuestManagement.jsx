import React, { useEffect, useState } from 'react'
import server from '../../networking'
import { Spinner, Text, Box, Button, Avatar, IconButton, Flex, Spacer, ScaleFade, Badge } from '@chakra-ui/react'
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

    const handlePaidAndPresent = async ({ referenceNum, listingID }) => {
        try {
            const response = await server.put(`/orders/manageGuests/togglePaidAndPresent`, { referenceNum, listingID });
            dispatch(reloadAuthToken(authToken))
            if (response.status === 200) {
                if (response.data.paidAndPresent == true) {
                    showToast('Guest marked as paid & present', 'Guest has been marked as paid & present', 3000, false, 'success');
                    guestsList.forEach((guest) => {
                        if (guest.Reservation.referenceNum === referenceNum) {
                            guest.Reservation.paidAndPresent = true;
                        }
                    })
                    setRefresh(!refresh);
                } else {
                    showToast('Guest marked as not paid & present', 'Guest has been marked as not paid & present', 3000, false, 'success');
                    guestsList.forEach((guest) => {
                        if (guest.Reservation.referenceNum === referenceNum) {
                            guest.Reservation.paidAndPresent = false;
                        }
                    })
                    setRefresh(!refresh);
                }
            } else {
                showToast('Something went wrong', 'An error occurred while marking guest as paid & present', 3000, false, 'error');
                console.error('Error marking guest as paid & present:', response.data);
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken))
            if (error.response && error.response.data) {
                if (error.response.data.startsWith("UERROR")) {
                    showToast('Something went wrong', error.response.data.substring("UERROR: ".length), 3000, false, 'error');
                    console.log('User error occurred in marking guest as paid & present:', error.response.data);
                } else {
                    showToast('Something went wrong', 'An error occurred while marking guest as paid & present', 3000, false, 'error');
                    console.error('Error marking guest as paid & present:', error.response.data);
                }
            } else {
                showToast('Something went wrong', 'An error occurred while marking guest as paid & present', 3000, false, 'error');
                console.error('Error marking guest as paid & present:', error);
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
                        key={guest.userID}
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
                        <Box display="flex" alignItems="center" mb={{base:4, md:0}}>
                            <Avatar name={guest.username} size="lg" mr={4} />
                            <Box>
                                <Flex gap={3} width="100%">
                                    <Box>
                                        <Text fontWeight="bold" fontSize="lg" textAlign="right">{guest.fname} {guest.lname}</Text>
                                    </Box>
                                    <Box>
                                        <ScaleFade initialScale={0.5} in={guest.Reservation.markedPaid}>
                                            <Badge colorScheme={'purple'} variant={'solid'} px={3} py={1}>PAID</Badge>
                                        </ScaleFade>
                                    </Box>
                                </Flex>
                                <Flex mt={2} wrap="wrap" justify="space-between" width="100%" gap={3}>
                                    <Text color="grey" fontSize="large">Total portion: {guest.Reservation.portions}</Text>
                                    <Spacer />
                                    <Text color="grey" fontSize="large">Total price: ${guest.Reservation.totalPrice}</Text>
                                </Flex>
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <IconButton
                                icon={<FaCommentDots />}
                                aria-label="Message Guest"
                                mr={4}
                                variant="ghost"
                                colorScheme="blackAlpha"
                                size="lg"
                                onClick={() => navigate(`/chat`)}
                            />
                            {guest.Reservation.paidAndPresent ? (
                                <IconButton
                                    icon={<FaCheck />}
                                    aria-label="Paid & Present"
                                    colorScheme="green"
                                    size="lg"
                                    style={{ transition: 'all 1s ease' }}
                                    onClick={() => handlePaidAndPresent({ referenceNum: guest.Reservation.referenceNum, listingID })}
                                />
                            ) : (
                                <Button
                                    variant="MMPrimary"
                                    style={{ transition: 'all 1s ease' }}
                                    onClick={() => handlePaidAndPresent({ referenceNum: guest.Reservation.referenceNum, listingID })}
                                >
                                    Paid & Present
                                </Button>
                            )}
                        </Box>
                    </Box>
                ))
            ) : (
                <Text textAlign="left" color="grey" fontSize="large" display="flex">No reservations made.</Text>
            )}
        </>
    )
}

export default GuestManagement