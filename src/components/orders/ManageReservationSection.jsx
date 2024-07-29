import { Box, Button, Fade, Heading, HStack, Spacer, Text, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import Extensions from '../../extensions'

function ManageReservationSection({ currentReservation, mode = "full" }) {
    const [showingCancelConfirmation, setShowingCancelConfirmation] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const inSixHourWindow = Extensions.timeDiffInSeconds(new Date(), new Date(currentReservation.listing.fullDatetime)) < 21600;

    function cancelReservation() {
        console.log("Cancelling!")
        setCancelling(true);
    }

    return (
        <Box display={"flex"} justifyContent={"left"} flexDirection={"column"} mt={"60px"} alignItems={"flex-start"} ml={mode == "full" ? "30px": ""}>
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
                            <Button mt={"20px"} colorScheme='red' borderRadius={"10px"} fontWeight={"bold"} onClick={cancelReservation} w={"100%"} isLoading={cancelling} loadingText="Cancelling...">Cancel Reservation</Button>
                            {!cancelling && (
                                <Button mt={"20px"} variant={"MMPrimary"} onClick={() => setShowingCancelConfirmation(false)} w={"100%"} isDisabled={cancelling} _hover={'none'}>Nevermind</Button>
                            )}
                        </HStack>
                    </Fade>
                </Box>
            ) : (
                <Fade in>
                    <Heading fontFamily={"Sora"} fontSize={{ 'base': 'large', 'md': 'larger' }} textAlign={"left"}>Meal Details</Heading>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} mt={"20px"} alignItems={"flex-start"} textAlign={"left"}>
                        <HStack spacing={{ 'base': '15px', 'md': '20px', 'lg': '30px' }} textAlign={"left"}>
                            <Box>
                                <Text>Name</Text>
                                <Text><strong>{currentReservation.listing.title}</strong></Text>
                            </Box>

                            <Box>
                                <Text>Unit Price</Text>
                                <Text><strong>{Extensions.formatCurrency(currentReservation.listing.portionPrice)}</strong></Text>
                            </Box>

                            <Box>
                                <Text>Portions Reserved</Text>
                                <Text><strong>{currentReservation.portions}</strong></Text>
                            </Box>

                            <Box>
                                <Text>Total Price</Text>
                                <Text><strong>{Extensions.formatCurrency(currentReservation.totalPrice)}</strong></Text>
                            </Box>
                        </HStack>
                    </Box>
                    <br />
                    <br />
                    <Text textAlign={"left"}>6 hours prior to the reservation, return here to make your payment to the host.</Text>
                    <Text textAlign={"left"}>Keep a lookout in your inbox for the notification from us!</Text>
                    <HStack width={"100%"}>
                        <Spacer />
                        <Button mt={"20px"} colorScheme='red' fontWeight={"bold"} borderRadius={"10px"} onClick={() => setShowingCancelConfirmation(true)}>Cancel Reservation</Button>
                    </HStack>
                </Fade>
            )}
        </Box>
    )
}

export default ManageReservationSection