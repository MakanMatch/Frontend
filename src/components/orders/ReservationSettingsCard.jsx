import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Button, Card, CardBody, CardFooter, CardHeader, HStack, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spacer, Text, VStack } from '@chakra-ui/react'
import React from 'react'

function ReservationSettingsCard({ listingPublished, togglePublished, pricePerPortion, setPricePerPortion}) {
    const formatAsCurrency = (val) => `$` + val
    const parseCurrencyValue = (val) => val.replace(/^\$/, '')

    return (
        <Card maxWidth={"100%"}>
            <CardHeader fontFamily={"Sora"} fontWeight={"bold"}>Reservation Settings</CardHeader>
            <CardBody>
                <VStack spacing={"10px"} textAlign={"left"}>
                    <HStack width={"100%"}>
                        <Text>Max. Guests</Text>
                        <Spacer />
                        <NumberInput defaultValue={1} min={1} max={10}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </HStack>

                    <HStack width={"100%"}>
                        <Text>Portions</Text>
                        <Spacer />
                        <NumberInput defaultValue={1} min={1} max={10}>
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
                        <NumberInput defaultValue={'$1.50'} onChange={(valueString) => setPricePerPortion(parseCurrencyValue(valueString))} value={formatAsCurrency(pricePerPortion)}>
                            <NumberInputField />
                        </NumberInput>
                    </HStack>
                </VStack>
            </CardBody>
            <CardFooter>
                {listingPublished ?
                    <Button variant={"MMPrimary"} width={"100%"} leftIcon={<ViewOffIcon />} onClick={() => togglePublished(false)}>Hide Listing</Button> :
                    <Button variant={"MMPrimary"} width={"100%"} leftIcon={<ViewIcon />} onClick={() => togglePublished(true)}>Publish Listing</Button>
                }
            </CardFooter>
        </Card>
    )
}

export default ReservationSettingsCard