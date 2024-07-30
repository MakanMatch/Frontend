import React, { useEffect, useState } from 'react'
import server from '../../networking'
import { Spinner, Text, Box, Button, Avatar, IconButton, Flex, Spacer } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux'
import { reloadAuthToken } from '../../slices/AuthState'
import configureShowToast from '../../components/showToast'
import { FaCommentDots, FaCheck } from "react-icons/fa";

function GuestManagement({
    hostID,
    listingID
}) {
    const [guestsList, setGuestsList] = useState([]);
    const dispatch = useDispatch();
    const { user, loaded, authToken } = useSelector((state) => state.auth);
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const [paidAndPresent, setPaidAndPresent] = useState(false);
    const navigate = useNavigate();

    const fetchReservationGuests = async () => {
        try {
            const response = await server.get(`/getGuests?hostID=${hostID}&listingID=${listingID}`);
            dispatch(reloadAuthToken(authToken))
            if (response.status === 200) {
                setGuestsList(response.data);
                setPaidAndPresent(response.data[0].Reservation.paidAndPresent);
            } else {
                showToast('Something went wrong', 'An error occurred while fetching guest information', 3000, false, 'error');
                console.error('Error fetching guest information:', response.data);
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken))
            if (error.response && error.response.data) {
                if (error.response.data.startsWith("UERROR")) {
                    showToast('Something went wrong', error.response.data.substring("UERROR: ".length), 3000, false, 'error');
                    console.log('User error occurred in fetching guest information:', error.response.data);
                } else {
                    showToast('Something went wrong', 'An error occurred while fetching guest information', 3000, false, 'error');
                    console.error('Error fetching guest information:', error.response.data);
                }
            } else {
                showToast('Something went wrong', 'An error occurred while fetching guest information', 3000, false, 'error');
                console.error('Error fetching guest information:', error);
            }
        }
    }

    const handlePaidAndPresent = async ({ referenceNum, listingID }) => {
        try {
            const response = await server.put(`/orders/manageGuests/togglePaidAndPresent`, { referenceNum, listingID });
            dispatch(reloadAuthToken(authToken))
            if (response.status === 200) {
                if (paidAndPresent) {
                    showToast('Guest marked as unpaid & absent', '', 3000, false, 'success');
                    setPaidAndPresent(!paidAndPresent);
                } else {
                    showToast('Guest marked as paid & present', '', 3000, false, 'success');
                    setPaidAndPresent(!paidAndPresent);
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
        fetchReservationGuests();
    }, [loaded, paidAndPresent])

    if (!loaded) {
        return (
            <Spinner />
        )
    }

    return (
        <>
            {guestsList.length > 0 && (
                <>
                    <Text fontWeight="bold" fontSize="large" display="flex" mb={10}>Guests</Text>
                    <Text textAlign="left" color="grey" fontSize="large" display="flex" mb={10}>When guests arrive, check that they have paid and click "Paid & Present" to let us know.</Text>
                </>
            )}
            {guestsList.length > 0 ? (
                guestsList.map((guest) => (
                    <Box
                        key={guest.userID}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        p={4}
                        mb={4}
                    >
                        <Box display="flex" alignItems="center">
                            <Avatar name={guest.username} size="lg" mr={4} />
                            <Box>
                                <Flex justify="space-between" width="100%">
                                    <Box>
                                        <Text fontWeight="bold" fontSize="lg" textAlign="right">{guest.fname} {guest.lname}</Text>
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