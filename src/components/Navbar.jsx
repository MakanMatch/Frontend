import { HamburgerIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Center, Container, Flex, GenericAvatarIcon, HStack, Heading, Spacer, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom'

function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Flex as={"nav"} alignItems={"center"} bgGradient={"linear(to-br, #ff86d6, #ffa14a)"} rounded={"10px"} mb={"20px"} p={"10px"} overflow="hidden">
                <Button variant={"link"} onClick={onOpen}><HamburgerIcon color={"white"} /></Button>
                <Spacer />
                <Link to={"/"}>
                    <Text color={"white"} fontFamily={"Short Stack"} fontWeight={"bold"} fontSize={"large"}>MakanMatch</Text>
                </Link>
                <Spacer />
                <Avatar size={"sm"} />
            </Flex>
            <Sidebar isOpen={isOpen} onClose={onClose} />
        </>
    )
}

export default Navbar