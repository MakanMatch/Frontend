import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Button, Card, CardBody, CardFooter, CardHeader, HStack, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spacer, Text, VStack } from '@chakra-ui/react'
import React from 'react'

function ReservationSettingsCard({ listingPublished, paymentImage, togglePublished, setEditListing, pricePerPortion, guestSlots, minGuests, handleSettingsChange }) {
    const formatAsCurrency = (val) => `$` + val
    const parseCurrencyValue = (val) => val.replace(/^\$/, '')

    return (
        <Card maxWidth={"100%"}>
            <CardHeader fontFamily={"Sora"} fontWeight={"bold"}>Reservation Settings</CardHeader>
            <CardBody>
                <VStack spacing={"10px"} textAlign={"left"}>
                    <HStack width={"100%"}>
                        <Text>Max. Portions</Text>
                        <Spacer />
                        <NumberInput defaultValue={1} min={minGuests > 0 ? minGuests : 1} max={10} value={guestSlots} onChange={(value) => handleSettingsChange(value, "guestSlots")}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </HStack>

                    <HStack width={"100%"}>
                        <Text>Price Per Portion</Text>
                        <Spacer />
                        <NumberInput defaultValue={'$1.50'} onChange={(valueString) => handleSettingsChange(parseCurrencyValue(valueString), "pricePerPortion")} value={formatAsCurrency(pricePerPortion)}>
                            <NumberInputField />
                        </NumberInput>
                    </HStack>
                </VStack>
            </CardBody>
            <CardFooter>
                <VStack width={"100%"}>
                    {listingPublished ?
                        <Button variant={"MMPrimary"} width={"100%"} isDisabled={!paymentImage} _hover={!paymentImage && 'none'} leftIcon={<ViewOffIcon />} onClick={() => togglePublished(false)}>Hide Listing</Button> :
                        <Button variant={"MMPrimary"} width={"100%"} isDisabled={!paymentImage} _hover={!paymentImage && 'none'} leftIcon={<ViewIcon />} onClick={() => togglePublished(true)}>Publish Listing</Button>
                    }
                    {!paymentImage && (
                        <>
                            <Text fontSize={"sm"} color={"red.500"}>Please upload your PayNow QR code before publishing listing.</Text>
                            <Button fontSize={"sm"} variant={"link"} color={"primaryColour"} onClick={() => setEditListing(false)}>See Manage Guests screen.</Button>
                        </>
                    )}
                </VStack>
            </CardFooter>
        </Card>
    )
}

export default ReservationSettingsCard