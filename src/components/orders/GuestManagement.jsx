import React, { useEffect, useState } from 'react'
import server from '../../networking'
import { Spinner, Text, Box, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux'
import { reloadAuthToken } from '../../slices/AuthState'
import configureShowToast from '../../components/showToast'

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

    const handlePaidAndPresent = async ({referenceNum, listingID}) => {
        try {
            const response = await server.put(`/orders/manageGuests/togglePaidAndPresent`, {referenceNum, listingID});
            dispatch(reloadAuthToken(authToken))
            if (response.status === 200) {
                if (paidAndPresent) {
                    showToast('Guest marked as unpaid & absent', 'Guest has been marked as unpaid & absent', 3000, false, 'success');
                    setPaidAndPresent(!paidAndPresent);
                } else {
                    showToast('Guest marked as paid & present', 'Guest has been marked as paid & present', 3000, false, 'success');
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
    }, [loaded, paidAndPresent ])

    if (!loaded) {
        return (
            <Spinner />
        )
    }

    return (
        <>
            <Text fontWeight="bold" fontSize="large" display="flex" mb={4} >Guests</Text>
            <Text textAlign="left" color="grey" fontSize="large" display="flex" >When guests arrive, check that they have paid and click "Paid & Present" below to let us know.</Text>
            {guestsList.length > 0 ? (
                guestsList.map((guest) => (
                    <Box key={guest.userID} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} mb={4}>
                        <Text fontWeight="bold" fontSize="lg">{guest.fname} {guest.lname}</Text>
                        <Text>Portions: {guest.Reservation.portions}</Text>
                        <Text>Total Price: ${guest.Reservation.totalPrice}</Text>
                        <Text>Paid & Present: {guest.Reservation.paidAndPresent ? 'Yes' : 'No'}</Text>
                        <Button
                            mt={2}
                            colorScheme="green"
                            onClick={() => handlePaidAndPresent({referenceNum: guest.Reservation.referenceNum, listingID: listingID})}
                        >
                            Mark as Paid & Present
                        </Button>
                    </Box>
                ))
            ) : (
                <Text>No guests found for this listing.</Text>
            )}
        </>
    )
}

export default GuestManagement