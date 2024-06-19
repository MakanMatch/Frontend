import { PlusSquareIcon, SmallAddIcon } from '@chakra-ui/icons'
import { Box, Center, Container, HStack, Heading, Image, Text, VStack, useToast } from '@chakra-ui/react'
import React from 'react'
import { useSelector } from 'react-redux'

function ListingDetail() {
    const Universal = useSelector(state => state.universal)
    const toast = useToast()

    const showToast = (title, description, duration=5000, isClosable=true, status='info', icon=null) => {
        if (!["success", "warning", "error", "info"].includes(status)) {
            status = "info"
        }

        const toastConfig = {
            title: title,
            description: description,
            duration: duration,
            isClosable: isClosable,
            status: status
        }
        if (icon != null) {
            toastConfig.icon = icon
        }

        toast(toastConfig)
    }

    const showComingSoon = () => { showToast("Coming soon", "This feature is not complete yet.", 3000) }

    return (
        <VStack align={"flex-start"}>
            <Text>17 May, 6-8PM</Text>
            <Heading>Chili Crab for Dinner</Heading>
            <HStack spacing={"10px"} overflowX={"auto"} height={"250px"}>
                <Image maxH={"100%"} objectFit={"cover"} display={"block"} rounded={"10px"} src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800" />
                <Image maxH={"100%"} objectFit={"cover"} display={"block"} rounded={"10px"} src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800" />
                <Center h={"100%"} aspectRatio={"1"} bg={"gray.300"} textAlign={"center"} onClick={showComingSoon}>
                    <SmallAddIcon boxSize={"10"} />
                </Center>
            </HStack>
        </VStack>
    )
}

export default ListingDetail