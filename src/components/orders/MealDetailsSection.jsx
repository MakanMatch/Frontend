import { Box, Heading, HStack, Text } from '@chakra-ui/react'
import React from 'react'
import Extensions from '../../extensions'

function MealDetailsSection({ currentReservation }) {
    return (
        <>
            <Heading fontFamily={"Sora"} fontSize={{ 'base': 'large', 'md': 'larger' }} textAlign={"left"}>Meal Details</Heading>
            <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"} mt={"20px"} alignItems={"flex-start"} textAlign={"left"}>
                <HStack spacing={{ 'base': '15px', 'md': '20px', 'lg': '30px' }} textAlign={"left"}>
                    <Box>
                        <Text>Name</Text>
                        <Text><strong>{currentReservation.listing.title}</strong></Text>
                    </Box>

                    <Box>
                        <Text>Unit Price</Text>
                        <Text><strong>{Extensions.formatCurrency(currentReservation.listing.portionPrice)}</strong></Text>
                    </Box>

                    <Box>
                        <Text>Portions Reserved</Text>
                        <Text><strong>{currentReservation.portions}</strong></Text>
                    </Box>

                    <Box>
                        <Text>Total Price</Text>
                        <Text><strong>{Extensions.formatCurrency(currentReservation.totalPrice)}</strong></Text>
                    </Box>
                </HStack>
            </Box>
        </>
    )
}

export default MealDetailsSection