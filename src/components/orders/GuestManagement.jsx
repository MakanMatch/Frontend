import React, { useEffect, useState } from 'react'
import server from '../../networking'
import { Spinner, Text, Box, Button, Avatar, IconButton, Flex, ScaleFade, Badge, useBreakpointValue, ModalOverlay, ModalContent, Modal } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useToast, useDisclosure } from '@chakra-ui/react'
import { useSelector, useDispatch } from 'react-redux'
import { reloadAuthToken } from '../../slices/AuthState'
import configureShowToast from '../../components/showToast'
import { FaCommentDots, FaCheck } from "react-icons/fa";
import { CloseIcon } from '@chakra-ui/icons'

function GuestManagement({
    listingID,
    guests,
    fetchListingDetails
}) {
    const [guestsList, setGuestsList] = useState([]);
    const dispatch = useDispatch();
    const { user, loaded, authToken } = useSelector((state) => state.auth);
    const [selectedImage, setSelectedImage] = useState(null); 
    const [selectedGuestUsername, setSelectedGuestUsername] = useState(null);
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const textAlign = useBreakpointValue({ base: "center", md: "left" });
    const isBaseScreen = useBreakpointValue({ base: true, md: false });
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleCancelReservation = async (referenceNum, listingID, guestID) => {
        try {
            const response = await server.post(`/cancelReservation`, {
                referenceNum: referenceNum,
                listingID: listingID,
                guestID: guestID
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            dispatch(reloadAuthToken(authToken))
            if (response.status === 200) {
                if (response.data && typeof response.data == "string" && response.data.startsWith("SUCCESS")) {
                    showToast("Reservation cancelled", "You've successfully cancelled the reservation", 3000, false, 'success')
                    fetchListingDetails();
                } else {
                    showToast('Something went wrong', 'An error occurred while cancelling the reservation', 3000, false, 'error');
                    console.log('Error cancelling the reservation:', response.data);
                }
            } else {
                showToast('Something went wrong', 'An error occurred while cancelling the reservation', 3000, false, 'error');
                console.log('Error cancelling the reservation:', response.data);
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken))
            if (error.response && error.response.data) {
                if (error.response.data.startsWith("UERROR")) {
                    showToast('Something went wrong', error.response.data.substring("UERROR: ".length), 3000, false, 'error');
                    console.log('User error occurred while cancelling the reservation:', error.response.data);
                } else {
                    showToast('Something went wrong', 'An error occurred while cancelling the reservation', 3000, false, 'error');
                    console.log('Error cancelling the reservation:', error.response.data);
                }
            } else {
                showToast('Something went wrong', 'An error occurred while cancelling the reservation', 3000, false, 'error');
                console.log('Error cancelling the reservation:', error);
            }
        }
    }

    const handlePaidAndPresent = async ({ referenceNum, listingID, guestID }) => {
        try {
            const response = await server.put(`/orders/manageGuests/togglePaidAndPresent`, { referenceNum, listingID, guestID });
            dispatch(reloadAuthToken(authToken))
            if (response.status === 200) {
                if (response.data.paidAndPresent == true) {
                    showToast('Reservation Updated', 'Guest has been marked as paid & present', 3000, false, 'success');
                    guestsList.forEach((guest) => {
                        if (guest.Reservation.referenceNum === referenceNum) {
                            guest.Reservation.paidAndPresent = true;
                        }
                    })
                    setRefresh(!refresh);
                } else {
                    showToast('Reservation Updated', 'Guest has been marked as not paid & present', 3000, false, 'success');
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
    }, [guests, refresh])

    if (!loaded) {
        return (
            <Spinner />
        )
    }

    return (
        <>
            {guestsList.length > 0 && (
                <>
                    <Text fontWeight="bold" fontSize="large" display="flex" mb={10} mt={5}>Reserved Guests</Text>
                    <Text textAlign="left" color="grey" fontSize="large" display="flex" mb={10}>When guests arrive, check that they have paid and click "Paid & Present" to let us know.</Text>
                </>
            )}
            {guestsList.length > 0 ? (
                guestsList.map((guest) => (
                    <Flex
                        key={guest.userID}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="space-between"
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="scroll"
                        p={4}
                        mb={4}
                    >
                        <Flex
                            direction={{ base: 'column', md: 'row' }}
                            alignItems={{ base: 'center', md: 'space-between' }}
                            mb={{ base: 4, md: 0 }}
                            textAlign={{ base: 'center', md: 'left' }}
                            width="100%"
                        >
                            <Flex
                                direction={{ base: 'column', md: 'row' }}
                                alignItems="center"
                                justifyContent={{ base: 'center', md: 'left' }}
                                width="100%"
                            >
                                <Avatar
                                    name={guest.username}
                                    src={`${import.meta.env.VITE_BACKEND_URL}/cdn/getProfilePicture?userID=${guest.Reservation.guestID}`}
                                    size="md"
                                    mr={{ base: 0, md: 4 }}
                                    mb={{ base: 2, md: 0 }}
                                    onClick={ () => {
                                        setSelectedGuestUsername(guest.username)
                                        setSelectedImage(`${import.meta.env.VITE_BACKEND_URL}/cdn/getProfilePicture?userID=${guest.Reservation.guestID}`)
                                        onOpen()
                                    }}
                                />
                                <Box>
                                    <Flex
                                        gap={{ base: 2, md: 3 }}
                                        width="100%"
                                        alignItems={{ base: 'center', md: 'center' }}
                                        flexWrap="wrap"
                                        justifyContent={{ base: 'center', md: 'left' }}
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
                                                    <Badge colorScheme="purple" variant="solid" px={3} py={1}>GUEST PAID</Badge>
                                                </ScaleFade>
                                            </Box>
                                        )}
                                    </Flex>
                                    {guest.Reservation.markedPaid && isBaseScreen && (
                                        <Box mt={2}>
                                            <ScaleFade initialScale={0.5} in={guest.Reservation.markedPaid}>
                                                <Badge colorScheme="purple" variant="solid" px={3} py={1}>GUEST PAID</Badge>
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
                            <Flex
                                direction="row"
                                alignItems="center"
                                justifyContent={{base:"center", md:"flex-end"}}
                                width="100%"
                                mt={{base: 4, md: 1}}
                                gap={2}
                                wrap="wrap"  // Ensure wrapping of buttons
                            >
                                <IconButton
                                    icon={<FaCommentDots />}
                                    aria-label="Message Guest"
                                    ml={2}
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
                                        size="sm"
                                        onClick={() => handlePaidAndPresent({ referenceNum: guest.Reservation.referenceNum, listingID, guestID: guest.Reservation.guestID })}
                                        rightIcon={<FaCheck />}
                                    >
                                        Paid & Present
                                    </Button>
                                ) : (
                                    <Box>
                                        <Button
                                            variant="MMPrimary"
                                            size="sm"
                                            onClick={() => handlePaidAndPresent({ referenceNum: guest.Reservation.referenceNum, listingID, guestID: guest.Reservation.guestID })}
                                        >
                                            Paid & Present
                                        </Button>
                                    </Box>
                                )}
                                {!guest.Reservation.markedPaid && !guest.Reservation.chargeableCancelActive && (
                                    <IconButton
                                        background="red.500"
                                        color="white"
                                        icon={<CloseIcon />}
                                        size="sm"
                                        onClick={() => handleCancelReservation(guest.Reservation.referenceNum, listingID, guest.userID)}
                                        _hover={{ bg: "red.600" }}
                                    />
                                )}
                            </Flex>
                        </Flex>
                        {guest.Reservation.chargeableCancelActive && (
                            <Box
                                display="flex"
                                alignItems="center"
                                flexDirection={{ base: 'column', md: 'row' }}
                                justifyContent="space-between"
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                p={4}
                                mb={4}
                                bg="yellow.100"
                                mt={4}
                                width="100%"
                            >
                                <Box
                                    textAlign={{ base: "center", md: "left" }}
                                    mb={{ base: 4, md: 0 }}
                                    width={{ base: "100%", md: "auto" }}
                                >
                                    <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>Cancelled within six hours</Text>
                                    <Text fontSize={{ base: "sm", md: "md" }}>
                                        {guest.fname} {guest.lname} just cancelled their reservation. Check that they've paid the cancellation fee of ${guest.Reservation.totalPrice * 2} and confirm cancellation.
                                    </Text>
                                </Box>
                                <Box>
                                    <Button
                                        background="red.500"
                                        color="white"
                                        borderRadius="10px"
                                        fontWeight="bold"
                                        _hover={{ bg: "red.600" }}
                                        size="sm"
                                        ml={{ base: 0, md: 4 }}
                                        onClick={() => handleCancelReservation(guest.Reservation.referenceNum, listingID, guest.userID)}
                                    >
                                        Confirm Cancellation {/* Adjust text size for md screens */}
                                    </Button>
                                </Box>
                            </Box>
                        )}

                    </Flex>
                ))
            ) : (
                <Text textAlign={textAlign} color="grey" fontSize="large" mt={5}>
                    Oops, there are no reservations made yet!
                </Text>
            )}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent maxW="max-content" background="transparent" boxShadow="none">
                    <Avatar
                        name={selectedGuestUsername}
                        boxSize={{ base: '60vw', md: '30vw' }}  // Responsive size for different screen sizes
                        src={selectedImage}
                    />
                </ModalContent>
            </Modal>
        </>
    )
}

export default GuestManagement