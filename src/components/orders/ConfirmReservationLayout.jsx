import { Box, Button, Divider, FormControl, FormHelperText, FormLabel, HStack, Heading, Input, Spacer, Spinner, Text, VStack, useMediaQuery, useToast } from '@chakra-ui/react'
import { Link as ChakraLink } from '@chakra-ui/react';
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import configureShowToast from '../../components/showToast';
import { ArrowBackIcon } from '@chakra-ui/icons';
import StaticGMaps from '../../components/listings/StaticGMaps';
import ConfirmReserveCard from '../../components/orders/ConfirmReserveCard';
import { useSelector } from 'react-redux';

function ConfirmReservationLayout({
    handleGoBack,
    listingData,
    hostData,
    userData,
    fetchListingDetails
}) {
    const [isSmallerThan800] = useMediaQuery("(max-width: 800px)");
    const { user, loaded, authToken } = useSelector(state => state.auth)

    return (
        <Box p={"15px"}>
            <VStack alignItems={"flex-start"}>
                <Button onClick={handleGoBack} bg={'none'} p={0}><ArrowBackIcon /></Button>
                <Heading fontFamily={'Sora'} fontWeight={'bold'} fontSize={{ 'base': 'x-large', 'lg': 'xx-large' }}>Confirm Reservation</Heading>
            </VStack>


            <Box mt={"30px"} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} maxW={"100%"}>
                <Box display={"flex"} justifyContent={"left"} flexDirection={"column"} width={!isSmallerThan800 ? "50%" : "100%"}>
                    <Box display={"flex"} justifyContent={"space-between"} flexDirection={"row"}>
                        <Box textAlign={"left"} flexDirection={"column"}>
                            {isSmallerThan800 && (
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
                            <Text>{listingData.datetime}</Text>
                            <Text mb={"20px"}>{new Date(listingData.fullDatetime).toLocaleString('en-US', { timeStyle: 'short' }) }</Text>

                            <Text fontWeight={"bold"}>Host:</Text>
                            <Text mb={"20px"}>{hostData.username}</Text>

                            <Text fontWeight={"bold"}>Total Reservations:</Text>
                            <Text mb={"20px"}>{listingData.slotsTaken}/{listingData.totalSlots} Reserved</Text>
                        </Box>

                        {!isSmallerThan800 && (
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
                        {user ? (
                            <>
                                <Heading as={"h5"} size={"md"} mb={"5px"}>Profile</Heading>
                                <Text fontWeight={"light"}>
                                    Details retrieved from your MakanMatch account.
                                    <ChakraLink as={Link} to={"/identity/myaccount"} ml={"5px"} color={'primaryColour'}>Change here.</ChakraLink>
                                </Text>

                                <FormControl mt={"10px"}>
                                    <FormLabel>Username</FormLabel>
                                    <Input type='text' placeholder='John Doe' value={user.username} isReadOnly />
                                    <FormLabel mt={"10px"}>Email</FormLabel>
                                    <Input type='text' placeholder='email@example.com' value={userData.email} isReadOnly />
                                </FormControl>
                            </>
                        ) : (
                            <>
                                <Heading as={"h5"} size={"md"} mb={"5px"}>Login or sign up to reserve.</Heading>
                                <Text fontWeight={"light"}>A MakanMatch account is needed to make a reservation.</Text>
                            </>
                        )}
                    </Box>
                </Box>

                {!isSmallerThan800 && (
                    <Box display={"flex"} justifyContent={"center"}>
                        <ConfirmReserveCard listingData={listingData} userData={userData} hostData={hostData} fetchListingDetails={fetchListingDetails} />
                    </Box>
                )}
            </Box>

            {isSmallerThan800 && (
                <Box display={"flex"} justifyContent={"center"} mt={"50px"}>
                    <ConfirmReserveCard listingData={listingData} userData={userData} hostData={hostData} fetchListingDetails={fetchListingDetails} />
                </Box>
            )}
        </Box>
    )
}

export default ConfirmReservationLayout