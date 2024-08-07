import { HamburgerIcon } from '@chakra-ui/icons'
import { Avatar, Box, Button, Center, Container, Flex, GenericAvatarIcon, HStack, Heading, Spacer, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import Sidebar from './Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import AdminSidebar from './AdminSideBar'

function Navbar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate();
    const { user, authToken } = useSelector((state) => state.auth);

    const isAdminAccount = user && user.userType == "Admin" ? true : false;

    const handleAvatarClick = () => {
        if (authToken) {
            if (user && user.userType == "Admin") {
                navigate('/admin/myAccount');
            } else {
                navigate('/identity/myAccount');
            }
        } else {
            navigate('/auth/login');
        }
    };

    const handleLogoClick = () => {
        if (authToken) {
            if (user && user.userType == "Admin") {
                navigate('/admin');
            } else {
                navigate('/')
            }

        } else{
            navigate('/');
        }
    }

    return (
        <>
            <Flex as={"nav"} alignItems={"center"} bgGradient={"linear(to-br, #ff86d6, #ffa14a)"} rounded={"10px"} mb={"20px"} p={"10px"} overflow="hidden">
                <Button variant={"link"} onClick={onOpen}><HamburgerIcon color={"white"} /></Button>
                <Spacer />
                <Box>
                    <Text color={"white"} fontFamily={"Short Stack"} fontWeight={"bold"} fontSize={"large"} onClick={handleLogoClick} cursor={"pointer"}>MakanMatch</Text>
                </Box>
                <Spacer />
                {user ? (
                    <Avatar size={"sm"} cursor={'pointer'} onClick={handleAvatarClick} src={`${import.meta.env.VITE_BACKEND_URL}/cdn/getProfilePicture?userID=${user.userID}`}/>
                ) : (
                    <Avatar size={"sm"} cursor={'pointer'} onClick={handleAvatarClick} />
                )}
            </Flex>
            {isAdminAccount ? (
                <AdminSidebar isOpen={isOpen} onClose={onClose} />
            ) : (
                <Sidebar isOpen={isOpen} onClose={onClose} />
            )}
        </>
    )
}

export default Navbar