import { HamburgerIcon } from '@chakra-ui/icons'
import { Avatar, Box, Center, Container, GenericAvatarIcon, HStack, Heading, Spacer, Text } from '@chakra-ui/react'
import React from 'react'

function Navbar() {
    return (
        <Container bgGradient={"linear(to-br, #ff86d6, #ffa14a)"} dropShadow={"5px solid"} maxWidth={"90%"} rounded={"10px"} mb={"20px"}>
            <HStack padding={"5px"}>
                <HamburgerIcon color={"white"} />
                <Spacer />
                <Text color={"white"} fontFamily={"Short Stack"} fontWeight={"bold"} fontSize={"large"}>MakanMatch</Text>
                <Spacer />
                <Avatar size={"sm"} />
            </HStack>
        </Container>
    )
}

export default Navbar