import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, Button, Fade, Heading, Image, Spinner, Text, useMediaQuery, useToast, VStack } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import configureShowToast from '../../components/showToast';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Extensions from '../../extensions';
import placeholderImage from '../../assets/placeholderImage.svg';

function ChargeableCancellation() {
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isSmallerThan800] = useMediaQuery("(max-width: 800px)");
    const { user, loaded, authToken } = useSelector(state => state.auth);

    const [currentReservation, setCurrentReservation] = useState(null);

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/reservations/upcoming');
        }
    }

    const hostPaymentURL = (currentReservation) => {
        return `${backendURL}/cdn/getHostPaymentQR?token=${authToken}&listingID=${currentReservation.listing.listingID}`
    }

    useEffect(() => {
        if (loaded == true) {
            if (!user) {
                navigate("/auth/login")
                showToast("Please login first", "Login before managing reservations.", 2000, true, "error")
                return;
            }

            if (state && state.currentReservation) {
                setCurrentReservation(state.currentReservation)
            } else {
                // Insufficient information provided
                navigate("/reservations/upcoming")
                return;
            }
        }
    }, [loaded, user])

    if (!loaded || !currentReservation) {
        return <Spinner />
    }

    function FeeQRCode() {
        return (
            <Box display={"flex"} justifyContent={"left"} alignItems={"center"} flexDirection={"column"} width={!isSmallerThan800 ? "40%" : "100%"} mt={"20px"}>
                <Image src={hostPaymentURL(currentReservation)} fallbackSrc={placeholderImage} alt='Host Payment QR Code' h={"350px"} w={"350px"} border={"1px"} borderColor={"black"} borderRadius={"10px"} objectFit={"contain"} />
                {!currentReservation.listing.Host.paymentImage && (
                    <Box mt={"15px"}>
                        <Text textAlign={"center"}>Host has not set up payment yet.</Text>
                        <Button onClick={() => navigate("/chat")} variant={"link"} color={"primaryColour"}>Inform them here.</Button>
                    </Box>
                )}

                <VStack mt={"10%"} spacing={"20px"}>
                    <Button variant={"MMPrimary"} width={"100%"}>I have paid the fee</Button>
                    <Text fontSize={"smaller"}>- OR -</Text>
                    <Button variant={"link"} color={"primaryColour"}>Go back</Button>
                </VStack>
            </Box>
        )
    }

    return (
        <Fade in>
            <Box p={"15px"}>
                <VStack alignItems={"flex-start"}>
                    <Button onClick={handleGoBack} bg={'none'} p={0}><ArrowBackIcon /></Button>
                    <Heading fontFamily={'Sora'} fontWeight={'bold'} fontSize={{ 'base': 'x-large', 'lg': 'xx-large' }} textAlign={"left"}>Are you sure you want to cancel?</Heading>
                </VStack>


                <Box mt={"30px"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} maxW={"100%"}>
                    <Box display={"flex"} justifyContent={"left"} flexDirection={"column"} width={!isSmallerThan800 ? "60%" : "100%"}>
                        <VStack alignItems={"flex-start"} fontSize={"larger"} textAlign={"left"} width={"100%"} height={"100%"} spacing={"2vh"}>
                            <Box alignItems={"flex-start"} fontSize={"smaller"}>
                                <Text fontWeight={"bold"}>Reservation:</Text>
                                <Text>Reference Number: {currentReservation.referenceNum}</Text>
                                <Text>Host: {currentReservation.listing.Host.fname + " " + currentReservation.listing.Host.lname} ({currentReservation.listing.Host.username})</Text>
                                <Text>Meal: {currentReservation.listing.title}</Text>
                                <Text>Reserved: {currentReservation.portions} portions, {Extensions.formatCurrency(currentReservation.totalPrice)}</Text>
                            </Box>

                            <div>
                                <Text fontWeight={"bold"}>Cancellations 6 hours prior to a reservation are chargeable.</Text>
                                <Text>If you wish to cancel, you must pay a <span style={{ color: "red", fontWeight: "bold" }}>{Extensions.formatCurrency(currentReservation.totalPrice * 2)}</span> cancellation fee to the host.</Text>
                            </div>

                            <div>
                                <Text fontWeight={"bold"} mt={"20px"}>Why?</Text>
                                <Text textAlign={"left"}>
                                    Cancellations so close to the meal time make it inconvenient for the host
                                    if they had already made the meal for you.
                                </Text>
                            </div>

                            <div>
                                <Text fontWeight={"bold"} mt={"20px"}>
                                    Make a payment for the cancellation fee. The host will be notified of your cancellation.
                                </Text>
                                <Text>The host will check that you have paid and then confirm your cancellation.</Text>
                            </div>

                            <Text mt={"10px"} fontWeight={"bold"} fontSize={"small"} textAlign={"left"}>If you don't pay, the host has your contact details and can contact you personally to follow-up on payment.<br /> The fee may also increase.</Text>
                        </VStack>
                    </Box>

                    {!isSmallerThan800 && FeeQRCode()}
                </Box>

                {isSmallerThan800 && FeeQRCode()}
            </Box>
        </Fade>
    )
}

export default ChargeableCancellation