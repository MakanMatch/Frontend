import { HamburgerIcon } from '@chakra-ui/icons'
import { Avatar, Box, Center, Container, Flex, GenericAvatarIcon, HStack, Heading, Spacer, Text } from '@chakra-ui/react'
import React from 'react'

function Navbar() {
    return (
        <Flex as={"nav"} alignItems={"center"} bgGradient={"linear(to-br, #ff86d6, #ffa14a)"} rounded={"10px"} mb={"20px"} p={"10px"}>
            {/* position={"absolute"} width={"90%"} */}
            <HamburgerIcon color={"white"} />
            <Spacer />
            <Text color={"white"} fontFamily={"Short Stack"} fontWeight={"bold"} fontSize={"large"}>MakanMatch</Text>
            <Spacer />
            <Avatar size={"sm"} />
        </Flex>
    )
}

export default Navbar