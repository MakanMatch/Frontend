import { ChatIcon, CheckCircleIcon, RepeatClockIcon, WarningIcon } from '@chakra-ui/icons'
import { Box, Center, Heading, HStack, Spinner, Text, useMediaQuery, VStack, useToast } from '@chakra-ui/react'
import React from 'react'
import { BiCheckCircle } from 'react-icons/bi'
import { BsClock, BsFillCheckCircleFill } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import configureShowToast from '../showToast';

function ConfirmReservationSuccess({
    listingData,
    hostData
}) {
    const [isSmallerThan800] = useMediaQuery("(max-width: 800px)");
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const { user, loaded, authToken } = useSelector(state => state.auth)
    var reservation;

    try {
        reservation = listingData.guests.filter(guest => guest.userID == user.userID)[0]
        if (!reservation) {
            showToast("Something went wrong", "Failed to load your reservation details. Please try again.", 2000, true, "error")
            return <Spinner />
        }
        console.log(reservation)
    } catch (err) {
        console.log("Failed to load reservation; error: " + err)
        showToast("Something went wrong", "Failed to load your reservation details. Please try again.", 2000, true, "error")
        return <Spinner />
    }

    const sixHoursPrior = () => {
        if (!listingData.fullDatetime) {
            return "DATE NOT FOUND"
        } else {
            const start = new Date(listingData.fullDatetime)
            start.setHours(start.getHours() - 6)
            return start.toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })
        }
    }

    function NextStepsSection(mode = "full") {
        return (
            <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} mt={mode != "full" ? "50px" : ""} width={!isSmallerThan800 ? "50%" : "100%"}>
                <Box textAlign={"left"}>
                    <Heading fontSize={{ 'base': 'large', 'lg': 'x-large' }}>Next Steps</Heading>
                    <VStack spacing={"20px"} mt={"20px"} alignItems={"flex-start"}>
                        <HStack>
                            <ChatIcon boxSize={'30px'} />
                            <Text>Chat with your host.</Text>
                        </HStack>
                        <HStack>
                            <RepeatClockIcon boxSize={"30px"} />
                            <Text>
                                Make your payment of <strong>${reservation.Reservation.totalPrice}</strong> when notified <strong>six hours prior to the meal</strong>.
                                <br />
                                Keep a lookout in your inbox.
                            </Text>
                        </HStack>
                        <HStack>
                            <WarningIcon boxSize={'30px'} />
                            <Text>Cancel free of charge anytime <strong>before {sixHoursPrior()}.</strong></Text>
                        </HStack>
                    </VStack>
                </Box>
            </Box>
        )
    }

    return (
        <Box p={"15px"} mt={{ 'base': "5%", 'md': "10%", 'lg': "18%" }}>
            <Box mt={"30px"} display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} maxW={"100%"}>
                <Box display={"flex"} justifyContent={"left"} ml={{ 'base': '0px', 'lg': '100px' }} flexDirection={"column"} width={!isSmallerThan800 ? "50%" : "100%"}>
                    <Box textAlign={"left"}>
                        <BsFillCheckCircleFill color={'lime'} size={'50px'} />
                        <Heading fontFamily={'Sora'} fontWeight={'bold'} fontSize={{ 'base': 'x-large', 'lg': 'xx-large' }} mt={'30px'}>Reservation Successful!</Heading>
                        <Text mt={'10px'}>Thank you for reserving with <strong>{hostData.username}</strong>. Bon Appetit!</Text>
                        <Text mt={'15px'} fontSize={'small'}>Reference Num: {reservation.Reservation.referenceNum}</Text>
                    </Box>
                </Box>

                {!isSmallerThan800 && (NextStepsSection())}
            </Box>
            {isSmallerThan800 && (NextStepsSection("mobile"))}
        </Box>
    )
}

export default ConfirmReservationSuccess