import { Box, Button, HStack, Heading, Spacer, Text, VStack, useMediaQuery, useToast } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import configureShowToast from '../../components/showToast';
import { ArrowBackIcon } from '@chakra-ui/icons';
import MarkeredGMaps from '../../components/listings/MarkeredGMaps';
import StaticGMaps from '../../components/listings/StaticGMaps';

function ConfirmReservation() {
    const navigate = useNavigate();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const [isSmallerThan600] = useMediaQuery("(max-width: 600px)");

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    }

    return (
        <Box p={"15px"}>
            <VStack alignItems={"flex-start"}>
                <Button onClick={handleGoBack} bg={'none'} p={0}><ArrowBackIcon /></Button>
                <Heading fontFamily={'Sora'} fontWeight={'bold'} fontSize={{ 'base': 'x-large', 'lg': 'xx-large' }}>Confirm Reservation</Heading>
            </VStack>


            <Box mt={"30px"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} maxW={"100%"}>
                <Box display={"flex"} justifyContent={"left"} flexDirection={"column"} width={"50%"}>
                    <Box display={"flex"} justifyContent={"space-between"} flexDirection={"row"}>
                        <Box textAlign={"left"} flexDirection={"column"}>
                            {isSmallerThan600 && (
                                <StaticGMaps
                                    coordinates={{ lat: 1.3016989, lng: 103.8284868 }}
                                    style={{
                                        height: "200px",
                                        width: "300px",
                                        borderRadius: "10px",
                                        marginBottom: "30px"
                                    }}
                                />
                            )}

                            <Text fontWeight={"bold"}>Date and Time:</Text>
                            <Text>13 May, Tuesday, 2024</Text>
                            <Text mb={"20px"}>6:00PM-8:00PM</Text>

                            <Text fontWeight={"bold"}>Host:</Text>
                            <Text mb={"20px"}>Jamie Oliver</Text>

                            <Text fontWeight={"bold"}>Total Guests Served:</Text>
                            <Text mb={"20px"}>2/5 Reserved</Text>
                        </Box>

                        {!isSmallerThan600 && (
                            <StaticGMaps
                                coordinates={{ lat: 1.3016989, lng: 103.8284868 }}
                                style={{
                                    height: "200px",
                                    width: "250px",
                                    borderRadius: "10px",
                                    marginLeft: "30px"
                                }}
                            />
                        )}
                    </Box>
                </Box>

                {!isSmallerThan600 && (
                    <Box display={"flex"} justifyContent={"left"}>
                        <Heading as={"h4"}>Coming Soon</Heading>
                    </Box>
                )}
            </Box>

            {isSmallerThan600 && (
                <Box display={"flex"} justifyContent={"left"} mt={"50px"}>
                    <Heading as={"h4"}>Coming Soon</Heading>
                </Box>
            )}
        </Box>
    )
}

export default ConfirmReservation