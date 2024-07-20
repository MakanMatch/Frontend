import { Button, Card, CardBody, CardFooter, CardHeader, Flex, HStack, Heading, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spacer, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

function ReserveCard({ hostData, listingData }) {
    const noSlotsRemaining = listingData.slotsTaken == listingData.totalSlots

    return (
        <Card variant={'elevated'} maxW={'100%'}>
            <CardHeader fontFamily={"Sora"} fontWeight={"bold"} fontSize={'large'} color={noSlotsRemaining ? "red": "black"}>{listingData.totalSlots - listingData.slotsTaken} Slots Remain ({listingData.slotsTaken}/{listingData.totalSlots})</CardHeader>
            <CardBody textAlign={'left'}>
                <Text>Payment to be made 6 hours prior to meal.</Text>
                <br />
                <Text>You may contact <strong>{hostData.username}</strong> any time via chat for questions upon reservation.</Text>
            </CardBody>
            <CardFooter>
                <HStack width={'100%'}>
                    <VStack alignItems={'flex-start'} spacing={0}>
                        <Text fontSize={'large'} fontFamily={'Sora'} fontWeight={'medium'}>${listingData.portionPrice}/portion</Text>
                    </VStack>
                    <Spacer />
                    <Button variant={'MMPrimary'} w={'50%'} ml={'20px'} isDisabled={noSlotsRemaining}>Reserve</Button>
                </HStack>
            </CardFooter>
        </Card>
    )
}

export default ReserveCard