import { Button, Card, CardBody, CardFooter, CardHeader, Flex, HStack, Heading, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spacer, Text, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

function ReserveCard({ hostData, listingData }) {
    const [portionSize, setPortionSize] = useState(1)
    const noSlotsRemaining = listingData.slotsTaken == listingData.totalSlots

    return (
        <Card variant={'elevated'} maxW={'100%'}>
            <CardHeader fontFamily={"Sora"} fontWeight={"bold"} fontSize={'large'} color={noSlotsRemaining ? "red": "black"}>{listingData.totalSlots - listingData.slotsTaken} Slots Remain ({listingData.slotsTaken}/{listingData.totalSlots})</CardHeader>
            <CardBody textAlign={'left'}>
                <Text>Payment to be made 6 hours prior to meal.</Text>
                <br />
                <Text>You may contact <strong>{hostData.username}</strong> any time via chat for questions upon reservation.</Text>
                <HStack mt={'15px'}>
                    <Text>Portion:</Text>
                    <Spacer />
                    <NumberInput isDisabled={noSlotsRemaining} defaultValue={1} min={1} max={listingData.totalSlots - listingData.slotsTaken} value={portionSize} onChange={(v) => setPortionSize(v)}>
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
                        <Text fontSize={'larger'} fontFamily={'Sora'} fontWeight={'bold'}>${listingData.portionPrice * portionSize}</Text>
                        <Text fontSize={'smaller'} fontFamily={'Sora'} color={'gray.500'}>${listingData.portionPrice}/portion</Text>
                    </VStack>
                    <Spacer />
                    <Button variant={'MMPrimary'} w={'50%'} ml={'20px'} isDisabled={noSlotsRemaining || portionSize <= 0}>Reserve</Button>
                </HStack>
            </CardFooter>
        </Card>
    )
}

export default ReserveCard