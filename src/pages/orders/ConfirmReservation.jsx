import { Box, Button, Divider, FormControl, FormHelperText, FormLabel, HStack, Heading, Input, Spacer, Text, VStack, useMediaQuery, useToast } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import configureShowToast from '../../components/showToast';
import { ArrowBackIcon } from '@chakra-ui/icons';
import MarkeredGMaps from '../../components/listings/MarkeredGMaps';
import StaticGMaps from '../../components/listings/StaticGMaps';
import ConfirmReserveCard from '../../components/orders/ConfirmReserveCard';

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
                <Box display={"flex"} justifyContent={"left"} flexDirection={"column"} width={!isSmallerThan600 ? "50%": "100%"}>
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

                    <Divider mt={"30px"} mb={"30px"} />

                    <Box textAlign={"left"} flexDirection={"column"}>
                        <Heading as={"h5"} size={"md"} mb={"5px"}>Profile</Heading>
                        <Text fontWeight={"light"}>Details auto-filled from your MakanMatch account.</Text>

                        <FormControl mt={"10px"}>
                            <FormLabel>Username</FormLabel>
                            <Input type='text' placeholder='John Doe' />
                            <FormLabel mt={"10px"}>Email</FormLabel>
                            <Input type='text' placeholder='email@example.com' />
                        </FormControl>
                    </Box>
                </Box>

                {!isSmallerThan600 && (
                    <Box display={"flex"} justifyContent={"center"}>
                        <ConfirmReserveCard />
                    </Box>
                )}
            </Box>

            {isSmallerThan600 && (
                <Box display={"flex"} justifyContent={"center"} mt={"50px"}>
                    <ConfirmReserveCard />
                </Box>
            )}
        </Box>
    )
}

export default ConfirmReservation