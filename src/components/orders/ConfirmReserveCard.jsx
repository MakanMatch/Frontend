import { Button, Card, CardBody, CardFooter, CardHeader, HStack, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spacer, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function ConfirmReserveCard() {
    const [portionSize, setPortionSize] = useState(1);
    const { user, loaded, authToken } = useSelector(state => state.auth)

    return (
        <Card variant={'elevated'} height={'fit-content'} w={'350px'}>
            <CardHeader fontFamily={"Sora"} fontWeight={"bold"} fontSize={'large'}>Hello World</CardHeader>
            <CardBody textAlign={'left'}>
                <Text>Payment to be made 6 hours prior to meal.</Text>
                <br />
                <Text>You may contact <strong>Jamie</strong> any time via chat for questions upon reservation.</Text>
                <HStack mt={'15px'}>
                    <Text>Portion:</Text>
                    <Spacer />
                    <NumberInput isDisabled={false} defaultValue={1} min={1} max={4} value={portionSize} onChange={(v) => setPortionSize(v)}>
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
                        <Button variant={'MMPrimary'} w={'50%'} ml={'20px'} isDisabled={false}>Reserve</Button>
                    ) : (
                        <Link to={'/auth/login'}>
                            <Button variant={'MMPrimary'} w={'50%'} ml={'20px'} minW={'fit-content'} isDisabled={false}>Login/Sign Up</Button>
                        </Link>
                    )}
                </HStack>
            </CardFooter>
        </Card>
    )
}

export default ConfirmReserveCard;