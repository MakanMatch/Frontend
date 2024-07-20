import { CheckCircleIcon } from '@chakra-ui/icons'
import { Box, Center, Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { BiCheckCircle } from 'react-icons/bi'
import { BsFillCheckCircleFill } from 'react-icons/bs'

function ConfirmReservationSuccess({
    listingData,
    hostData
}) {
    return (
        <Center>
            <VStack mt={'100px'}>
                <BsFillCheckCircleFill color={'lime'} size={'50px'} />
                <Heading fontFamily={'Sora'} fontWeight={'bold'} fontSize={{ 'base': 'x-large', 'lg': 'xx-large' }} mt={'30px'}>Reservation Successful!</Heading>
                <Text mt={'10px'}>Thank you for reserving with <strong>{hostData.username}</strong>. Bon Appetit!</Text>
            </VStack>
        </Center>
        // <Box mt={"30px"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} maxW={"100%"} p={'50px'}>
        //     <Box display={"flex"} justifyContent={"left"} flexDirection={"column"} width={"100%"}>
        //         <Box textAlign={"left"} flexDirection={"column"} maxW={'50%'}>
        //             <BsFillCheckCircleFill color={'lime'} size={'50px'} />
        //             <Heading fontFamily={'Sora'} fontWeight={'bold'} fontSize={{ 'base': 'x-large', 'lg': 'xx-large' }} mt={'30px'}>Reservation Successful!</Heading>
        //             <Text mt={'10px'}>Thank you for reserving with <strong>{hostData.username}</strong>. Bon Appetit!</Text>
        //         </Box>
        //     </Box>
        //     {/* <Box display={"flex"} justifyContent={"center"} flexDirection={"column"} width={"50%"}>
        //         <Heading fontFamily={'Sora'} fontWeight={'bold'} fontSize={{ 'base': 'meidum', 'lg': 'large' }}>Next Steps</Heading>
        //     </Box> */}
        // </Box>
    )
}

export default ConfirmReservationSuccess