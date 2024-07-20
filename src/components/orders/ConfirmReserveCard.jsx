import { Button, Card, CardBody, CardFooter, CardHeader, Heading, HStack, Image, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spacer, Text, VStack, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import placeholderImage from '../../assets/placeholderImage.svg'
import { StarIcon } from '@chakra-ui/icons';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FaClock } from 'react-icons/fa';
import server from '../../networking';
import { reloadAuthToken } from '../../slices/AuthState';

function ConfirmReserveCard({
    listingData,
    hostData,
    userData,
    fetchListingDetails
}) {
    const backendAPIURL = import.meta.env.VITE_BACKEND_URL
    const toast = useToast();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [portionSize, setPortionSize] = useState(1);
    const [reserving, setReserving] = useState(false);
    const { user, loaded, authToken } = useSelector(state => state.auth)

    const noSlotsRemaining = listingData.slotsTaken == listingData.totalSlots
    const remainingSlots = listingData.totalSlots - listingData.slotsTaken

    const firstImageLink = `${backendAPIURL}/cdn/getImageForListing?listingID=${listingData.listingID}&imageName=${listingData.images[0]}`

    function makeReservation() {
        setReserving(true)
        server.post("/createReservation", {
            listingID: listingData.listingID,
            portions: portionSize
        })
        .then(res => {
            dispatch(reloadAuthToken(authToken));
            setReserving(false)

            if (res.status == 200 && res.data.message && res.data.message.startsWith("SUCCESS")) {
                toast({
                    title: "Reservation successful!",
                    description: "You have successfully made a reservation! Makan up!",
                    status: "success",
                    duration: 5000,
                    isClosable: true
                })
                console.log("Reservation created; reference number: " + res.data.referenceNum)
                fetchListingDetails(listingData.listingID);
            } else if (res.data.startsWith("UERROR")) {
                console.log("User error occurred in creating reservation; response: " + res.data)
                toast({
                    title: "Something went wrong",
                    description: res.data.substring("UERROR: ".length),
                    status: "error",
                    duration: 5000,
                    isClosable: true
                })
            } else {
                console.log("Failed to create reservation; response: " + res.data)
                toast({
                    title: "Something went wrong",
                    description: "Failed to make a reservation. Please try again later.",
                    status: "error",
                    duration: 5000,
                    isClosable: true
                })
            }
        })
        .catch(err => {
            dispatch(reloadAuthToken(authToken));
            setReserving(false)
            console.log("Failed to create reservation; error: " + err)
            toast({
                title: "Something went wrong",
                description: "Failed to make a reservation. Please try again later.",
                status: "error",
                duration: 5000,
                isClosable: true
            })
        })
    }

    return (
        <Card variant={'elevated'} height={'fit-content'} w={'400px'}>
            <CardBody textAlign={'left'}>
                <HStack width={'100%'} spacing={'10px'} mb={'20px'}>
                    <Image src={firstImageLink} placeholder={placeholderImage} borderRadius={'10px'} h={'100px'} />

                    <VStack maxW={'100%'} alignItems={'flex-start'} spacing={'5px'} ml={'10px'}>
                        <Heading size={'md'} fontWeight={'bold'} fontFamily={'Sora'}>{listingData.title}</Heading>
                        <Text fontSize={'small'}>{listingData.approxAddress}</Text>

                        <HStack display={'flex'} justifyContent={'space-between'}>
                            <StarIcon /><Text>{hostData.foodRating}</Text>
                            <BsFillPeopleFill /><Text>{listingData.slotsTaken}/{listingData.totalSlots}</Text>
                            <FaClock /><Text>{new Date(listingData.fullDatetime).toLocaleString('en-US', { timeStyle: 'short' })}</Text>
                        </HStack>
                    </VStack>
                </HStack>

                <Text>Payment to be made 6 hours prior to meal.</Text>
                <br />
                <Text>You may contact <strong>Jamie</strong> any time via chat for questions upon reservation.</Text>
                <HStack mt={'15px'}>
                    <Text>Portion:</Text>
                    <Spacer />
                    <NumberInput isDisabled={noSlotsRemaining} defaultValue={1} min={1} max={remainingSlots} value={portionSize} onChange={(v) => setPortionSize(v)}>
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                </HStack>
            </CardBody>
            <CardFooter>
                <HStack width={'100%'}>
                    <VStack alignItems={'flex-start'} spacing={0}>
                        <Text fontSize={'smaller'} fontFamily={'Sora'} fontWeight={'bold'} color={'gray.500'}>Total</Text>
                        <Text fontSize={'larger'} fontFamily={'Sora'} fontWeight={'bold'}>${listingData.portionPrice * portionSize}</Text>
                    </VStack>
                    <Spacer />
                    {loaded && user ? (
                        <Button variant={'MMPrimary'} w={'50%'} ml={'20px'} isDisabled={noSlotsRemaining} isLoading={reserving} loadingText={"Reserving..."} onClick={makeReservation} _hover={'none'}>Reserve</Button>
                    ) : (
                        <Link to={'/auth/login'}>
                            <Button variant={'MMPrimary'} w={'50%'} ml={'20px'} minW={'fit-content'}>Login/Sign Up</Button>
                        </Link>
                    )}
                </HStack>
            </CardFooter>
        </Card>
    )
}

export default ConfirmReserveCard;