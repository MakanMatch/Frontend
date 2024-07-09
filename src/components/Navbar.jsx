import { HamburgerIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Center, Container, Flex, GenericAvatarIcon, HStack, Heading, Spacer, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import Sidebar from './Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate();
    const { authToken } = useSelector((state) => state.auth);

    const handleAvatarClick = () => {
        if (authToken) {
            navigate('/myAccount');
        } else {
            console.log("Sign in first.")
            navigate('/identity/login');
        }
        onClose()
    };

    return (
        <>
            <Flex as={"nav"} alignItems={"center"} bgGradient={"linear(to-br, #ff86d6, #ffa14a)"} rounded={"10px"} mb={"20px"} p={"10px"}>
                <Button variant={"link"} onClick={onOpen}><HamburgerIcon color={"white"} /></Button>
                <Spacer />
                <Link to={"/"}>
                    <Text color={"white"} fontFamily={"Short Stack"} fontWeight={"bold"} fontSize={"large"}>MakanMatch</Text>
                </Link>
                <Spacer />
                <Avatar size={"sm"} cursor={'pointer'} onClick={handleAvatarClick}/>
            </Flex>
            <Sidebar isOpen={isOpen} onClose={onClose} />
        </>
    )
}

export default Navbar