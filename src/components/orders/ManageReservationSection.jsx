import { Box, Button, Fade, Heading, HStack, Image, Spacer, Spinner, Text, useToast, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Extensions from '../../extensions'
import server from '../../networking';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import configureShowToast from '../showToast';
import { reloadAuthToken } from '../../slices/AuthState';
import MealDetailsSection from './MealDetailsSection';
import placeholderImage from '../../assets/placeholderImage.svg';
import { BsClockFill, BsFillCheckCircleFill } from 'react-icons/bs';

function ManageReservationSection({ currentReservation, setCurrentReservation, setReservations, refreshReservations, inSixHourWindow, dataLoaded, mode = "full" }) {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const { user, authToken, loaded } = useSelector(state => state.auth);

    const [showingCancelConfirmation, setShowingCancelConfirmation] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [markingPaid, setMarkingPaid] = useState(false);

    const hostPaymentURL = (currentReservation) => {
        return `${backendURL}/cdn/getHostPaymentQR?token=${authToken}&listingID=${currentReservation.listing.listingID}`
    }

    const handleChargeableCancellationClick = () => {
        if (!currentReservation) {
            showToast("Something went wrong", "Please select a reservation first.", 2000, true, "error")
            return;
        }

        navigate("/reservations/chargeableCancel", {
            state: {
                currentReservation: currentReservation
            }
        })
        return;
    }

    function nonChargeableCancelReservation() {
        setCancelling(true);
        server.post("/cancelReservation", {
            referenceNum: currentReservation.referenceNum,
            listingID: currentReservation.listing.listingID
        })
            .then(res => {
                dispatch(reloadAuthToken(authToken))
                setTimeout(() => {
                    setCancelling(false)
                    if (res.status == 200 && res.data && typeof res.data == "string" && res.data.startsWith("SUCCESS")) {
                        showToast("Reservation cancelled successfully!", "You have successfully cancelled your reservation. We're sorry to see you go! 😢", 5000, true, "success")
                        refreshReservations();
                    } else {
                        console.log("Unknown response received when cancelling reservation: ", res.data);
                        showToast("Something went wrong", "We couldn't cancel your reservation. Please try again later.", 3000, true, "error")
                    }
                }, 500)
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken))
                setTimeout(() => {
                    setCancelling(false)
                    if (err.response && err.response.data && typeof err.response.data == "string") {
                        if (err.response.data.startsWith("UERROR")) {
                            console.log("User error occurred in cancelling reservation; response: " + err.response.data)
                            showToast("Something went wrong", err.response.data.substring("UERROR: ".length), 3000, true, "error")
                        } else {
                            console.log("Error occurred in cancelling reservation: ", err.response.data);
                            showToast("Something went wrong", "We couldn't cancel your reservation. Please try again later.", 3000, true, "error")
                        }
                    } else {
                        console.log("Error occurred in cancelling reservation: ", err);
                        showToast("Something went wrong", "We couldn't cancel your reservation. Please try again later.", 3000, true, "error")
                    }
                }, 500)
            })
    }

    function toggleMarkedPaid() {
        setMarkingPaid(true);
        server.put("/updateReservation", {
            referenceNum: currentReservation.referenceNum,
            markedPaid: !currentReservation.markedPaid
        })
            .then(res => {
                dispatch(reloadAuthToken(authToken))
                setMarkingPaid(false);
                if (res.status == 200) {
                    if (res.data && typeof res.data == "string" && res.data.startsWith("SUCCESS")) {
                        showToast("Payment status updated!", "Your payment status has been updated.", 3000, true, "success")
                    } else if (res.data && res.data.message && typeof res.data.message == "string" && res.data.message.startsWith("SUCCESS")) {
                        showToast("Payment status updated!", "Your payment status has been updated.", 3000, true, "success")
                        var newReservation;
                        setCurrentReservation(prevReservation => {
                            newReservation = structuredClone(prevReservation);
                            newReservation.markedPaid = res.data.markedPaid;
                            newReservation.totalPrice = res.data.totalPrice;
                            newReservation.portions = res.data.portions;

                            return newReservation;
                        })

                        setReservations(prevReservations => {
                            var newReservations = prevReservations.map(reservation => {
                                if (reservation.referenceNum == newReservation.referenceNum) {
                                    return newReservation;
                                }
                                return reservation;
                            })
                            return newReservations;
                        })
                    } else {
                        console.log("Unknown response received when updating reservation: ", res.data);
                        showToast("Something went wrong", "We couldn't update your reservation. Please try again later.", 3000, true, "error")
                    }
                } else {
                    console.log("Unknown response (Non-200) received when updating reservation: ", res.data);
                    showToast("Something went wrong", "We couldn't update your reservation. Please try again later.", 3000, true, "error")
                }
            })
            .catch(err => {
                dispatch(reloadAuthToken(authToken))
                setMarkingPaid(false);
                if (err.response && err.response.data && typeof err.response.data == "string") {
                    if (err.response.data.startsWith("UERROR")) {
                        console.log("User error occurred in updating reservation; response: " + err.response.data)
                        showToast("Something went wrong", err.response.data.substring("UERROR: ".length), 3000, true, "error")
                    } else {
                        console.log("Error occurred in updating reservation: ", err.response.data);
                        showToast("Something went wrong", "We couldn't update your reservation. Please try again later.", 3000, true, "error")
                    }
                } else {
                    console.log("Error occurred in updating reservation: ", err);
                    showToast("Something went wrong", "We couldn't update your reservation. Please try again later.", 3000, true, "error")
                }
            })
    }

    if (!dataLoaded) {
        return <Spinner />;
    }

    return (
        <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} mt={"60px"} alignItems={"flex-start"} ml={mode == "full" ? "30px" : ""}>
            {showingCancelConfirmation ? (
                <Box>
                    <Fade in={showingCancelConfirmation}>
                        <Heading size={"md"} textAlign={"left"}>Are you sure you want to cancel?</Heading>
                        <Text mt={"20px"} textAlign={"left"} fontSize={"larger"}>
                            This cancellation is not charageable.
                            <br />
                            <strong>{currentReservation.listing.Host.fname + " " + currentReservation.listing.Host.lname}</strong> will be notified. They'll miss you! 😢
                        </Text>
                        <Text mt={"30px"}>Please note that this action is irreversible. Continue with care.</Text>
                        <HStack width={"100%"}>
                            <Button mt={"20px"} colorScheme='red' borderRadius={"10px"} fontWeight={"bold"} onClick={nonChargeableCancelReservation} w={"100%"} isLoading={cancelling} loadingText="Cancelling...">Cancel Reservation</Button>
                            {!cancelling && (
                                <Button mt={"20px"} variant={"MMPrimary"} onClick={() => setShowingCancelConfirmation(false)} w={"100%"} isDisabled={cancelling} _hover={'none'}>Nevermind</Button>
                            )}
                        </HStack>
                    </Fade>
                </Box>
            ) : (
                <Fade in>
                    {currentReservation.chargeableCancelActive && (
                        <Box mr={mode == "full" && "3vh"}>
                            <Box display={"flex"} justifyContent={"center"} flexDir={"column"} mt={"20px"} alignItems={"center"}>
                                <BsClockFill color={"#f2ed46"} size={'50px'} onClick={toggleMarkedPaid} />
                                <Heading size={"lg"} mt={"20px"}>Pending Cancellation</Heading>
                                <Text mt={"10px"}>You have paid the <strong>{Extensions.formatCurrency(import.meta.env.VITE_CANCELLATION_FEE_MODE === "five" ? 5: currentReservation.totalPrice * 2)}</strong> cancellation fee to {currentReservation.listing.Host.fname}.</Text>
                                <Text mt={"10px"}>The host needs to check your fee payment and confirm the cancellation.</Text>
                                <Button variant={'link'} color={'primaryColour'} fontSize={'small'} mt={"10px"} onClick={() => navigate("/chat")}>Inform them here.</Button>
                            </Box>
                        </Box>
                    )}
                    {inSixHourWindow && !currentReservation.chargeableCancelActive && (
                        <>
                            {!currentReservation.markedPaid ? (
                                <Box>
                                    <Box display={"flex"} justifyContent={"left"} flexDirection={mode == "full" ? "row" : "column"} mt={"20px"} alignItems={"center"}>
                                        <VStack>
                                            <Image src={hostPaymentURL(currentReservation)} objectFit={"contain"} fallbackSrc={placeholderImage} alt='Host Payment QR Code' width={"250px"} height={"250px"} />
                                            {!currentReservation.listing.Host.paymentImage && (
                                                <>
                                                    <Text fontSize={'small'}>Host hasn't uploaded<br /> PayNow QR code yet.</Text>
                                                    <Button variant={'link'} color={'primaryColour'} fontSize={'small'} onClick={() => navigate("/chat")}>Inform them here.</Button>
                                                </>
                                            )}
                                        </VStack>
                                        <VStack spacing={4} ml={"20px"} maxW={"300px"} textAlign={"left"} mt={"15px"}>
                                            <Text>
                                                Host receives payments directly.<br /><br />

                                                Click “I have paid” to notify your host about the payment.<br /><br />

                                                Payment will be checked when you reach the address.<br />
                                            </Text>
                                            <Text fontSize={'large'}>Send <strong>{Extensions.formatCurrency(currentReservation.totalPrice)}</strong> to {currentReservation.listing.Host.fname} via PayNow.</Text>
                                        </VStack>
                                    </Box>

                                    <VStack>
                                        <Button mt={"10%"} width={"100%"} variant={"MMPrimary"} onClick={toggleMarkedPaid} isLoading={markingPaid} loadingText="Updating..." _hover={"none"}>I have paid</Button>
                                        <Button mt={"10px"} width={"100%"} variant={"link"} color={"red"} fontWeight={"bold"} isDisabled={markingPaid} onClick={handleChargeableCancellationClick}>Cancel (Chargeable)</Button>
                                    </VStack>
                                </Box>
                            ) : (
                                <Box mr={"10vh"}>
                                    <Box display={"flex"} justifyContent={"center"} flexDir={"column"} mt={"20px"} alignItems={"center"}>
                                        <BsFillCheckCircleFill color={'lime'} size={'50px'} onClick={toggleMarkedPaid} />
                                        <Heading size={"lg"} mt={"20px"}>Payment Complete</Heading>
                                        <Text mt={"10px"}>{currentReservation.listing.Host.fname} has been notified of your payment.</Text>
                                        <Text>Thank you for paying promptly!</Text>
                                    </Box>

                                    <VStack>
                                        <Button mt={"10%"} width={"100%"} variant={"MMPrimary"} onClick={toggleMarkedPaid} isLoading={markingPaid} loadingText="Showing..." _hover={"none"}>Show QR Code Again</Button>
                                    </VStack>
                                </Box>
                            )}
                        </>
                    )}
                    {!inSixHourWindow && !currentReservation.chargeableCancelActive && !currentReservation.markedPaid && (
                        <Box>
                            <MealDetailsSection currentReservation={currentReservation} dataLoaded={dataLoaded} />
                            <br />
                            <br />
                            <Text textAlign={"left"}>6 hours prior to the reservation, return here to make your payment to the host.</Text>
                            <Text textAlign={"left"}>Keep a lookout in your inbox for the notification from us!</Text>
                            <HStack width={"100%"}>
                                <Spacer />
                                <Button mt={"20px"} colorScheme='red' fontWeight={"bold"} borderRadius={"10px"} onClick={() => setShowingCancelConfirmation(true)}>Cancel Reservation</Button>
                            </HStack>
                        </Box>
                    )}
                </Fade>
            )}
        </Box>
    )
}

export default ManageReservationSection