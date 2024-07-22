import { ChatIcon, CheckCircleIcon, RepeatClockIcon, WarningIcon } from '@chakra-ui/icons'
import { Box, Center, Heading, HStack, Text, useMediaQuery, VStack } from '@chakra-ui/react'
import React from 'react'
import { BiCheckCircle } from 'react-icons/bi'
import { BsClock, BsFillCheckCircleFill } from 'react-icons/bs'

function ConfirmReservationSuccess({
    listingData,
    hostData
}) {
    const [isSmallerThan800] = useMediaQuery("(max-width: 800px)");

    function NextStepsSection(mode="full") {
        return (
            <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} mt={mode != "full" ? "50px": ""} width={!isSmallerThan800 ? "50%" : "100%"}>
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
                                Make your payment of <strong>$3.50</strong> when notified <strong>six hours prior to the meal</strong>.
                                <br />
                                Keep a lookout in your inbox.
                            </Text>
                        </HStack>
                        <HStack>
                            <WarningIcon boxSize={'30px'} />
                            <Text>Cancel free of charge anytime <strong>before 1pm, 13 May.</strong></Text>
                        </HStack>
                    </VStack>
                </Box>
            </Box>
        )
    }

    return (
        <Box p={"15px"} mt={{ 'base': "5%", 'md': "10%", 'lg': "18%" }}>
            <Box mt={"30px"} display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} maxW={"100%"}>
                <Box display={"flex"} justifyContent={"left"} ml={{ 'base': '0px', 'md': '50px', 'lg': '100px' }} flexDirection={"column"} width={!isSmallerThan800 ? "50%" : "100%"}>
                    <Box textAlign={"left"}>
                        <BsFillCheckCircleFill color={'lime'} size={'50px'} />
                        <Heading fontFamily={'Sora'} fontWeight={'bold'} fontSize={{ 'base': 'x-large', 'lg': 'xx-large' }} mt={'30px'}>Reservation Successful!</Heading>
                        <Text mt={'10px'}>Thank you for reserving with <strong>{hostData.username}</strong>. Bon Appetit!</Text>
                    </Box>
                </Box>

                {!isSmallerThan800 && (NextStepsSection())}
            </Box>
            {isSmallerThan800 && (NextStepsSection("mobile"))}
        </Box>
    )
}

export default ConfirmReservationSuccess