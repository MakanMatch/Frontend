import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Image, Text, Icon, Box } from '@chakra-ui/react'
import { CalendarIcon, ChatIcon } from '@chakra-ui/icons'
import { BsQuestionCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from '../assets/Logo.png'
import React from 'react'


function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const authToken = useSelector((state) => state.auth.authToken);

    const DrawerHover = {
        _hover: {
          bg: "#E4EBF8"
        },
        borderRadius: "20px",
    };

    const handleMyAccountClick = () => {
        if (authToken) {
            navigate('/identity/myAccount');
        } else {
            console.log("Sign in first.")
            navigate('/auth/login');
        }
        onClose()
    };

    return (
        <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                    <Flex justifyContent="center" alignItems="center" height="100px">
                        <Image src={Logo} height="100px" maxWidth="100px" />
                    </Flex>
                </DrawerHeader>

                <DrawerBody display={"flex"} flexDirection={"column"}>
                    <Button color={"#515F7C"} mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={() => window.location.href="/"}>
                        <Icon viewBox="0 0 24 24" boxSize={6}><path fill="#515F7C" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></Icon>
                        <Text ml={2}>Home</Text>
                    </Button>

                    <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={() => window.location.href="#"}>
                        <CalendarIcon ml={1}/>
                        <Text ml={3}>Upcoming Reservations</Text>
                    </Button>

                    <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={handleMyAccountClick}>
                    <Icon viewBox="0 0 24 24" boxSize={6}><path fill="#515F7C" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></Icon>
                        <Text ml={2}>My Account</Text>
                    </Button>

                    <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={() => window.location.href="/chat"}>
                        <ChatIcon ml={1}/>
                        <Text ml={3}>Chats</Text>
                    </Button>

                    <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={() => window.location.href="#"}>
                        <Text as={BsQuestionCircle} fontSize="20px" color="#515F7C" ml={0.5} />
                        <Text ml={3}>Customer Support</Text>
                    </Button>
                    
                    <Box position="absolute" bottom="0" textAlign="center" ml={14} mb={2}>
                        <Text color={"#515F7C"}>©2024 MakanMatch</Text>
                    </Box>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}

export default Sidebar