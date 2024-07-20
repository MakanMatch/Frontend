import { Button, Card, CardBody, CardFooter, CardHeader, Heading, HStack, Image, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spacer, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import placeholderImage from '../../assets/placeholderImage.svg'
import { RepeatClockIcon, StarIcon } from '@chakra-ui/icons';
import { BsClock, BsClockFill, BsClockHistory, BsFillPeopleFill, BsPeople, BsPeopleFill } from 'react-icons/bs';
import { FaClock, FaPeopleCarry } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';

function ConfirmReserveCard({
    listingData,
    hostData,
    userData
}) {
    const backendAPIURL = import.meta.env.VITE_BACKEND_URL
    const [portionSize, setPortionSize] = useState(1);
    const { user, loaded, authToken } = useSelector(state => state.auth)
    const noSlotsRemaining = listingData.slotsTaken == listingData.totalSlots
    const remainingSlots = listingData.totalSlots - listingData.slotsTaken

    const firstImageLink = `${backendAPIURL}/cdn/getImageForListing?listingID=${listingData.listingID}&imageName=${listingData.images[0]}`
    console.log(firstImageLink)

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
                        <Text fontSize={'larger'} fontFamily={'Sora'} fontWeight={'bold'}>$3.50</Text>
                    </VStack>
                    <Spacer />
                    {loaded && user ? (
                        <Button variant={'MMPrimary'} w={'50%'} ml={'20px'} isDisabled={noSlotsRemaining} _hover={'none'}>Reserve</Button>
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