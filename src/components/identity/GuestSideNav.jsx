import React from 'react';
import { Box, Button, Text, Icon, Card } from "@chakra-ui/react";
import { RepeatClockIcon, ChatIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../slices/AuthState';

const GuestSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('jwt');
        navigate("/identity/login");
    };

    const DrawerHover = {
        _hover: {
          bg: "#E4EBF8"
        },
        borderRadius: "20px",
    };

    const handleMyAccountClick = () => {
        navigate("/")
    }


    return (
        <Card width="25%" borderRadius={15} boxShadow="0 2px 4px 2px rgba(0.2, 0.2, 0.2, 0.2)" p={4}>
            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} mt={4} onClick={handleMyAccountClick}>
                <Icon viewBox="0 0 24 24" boxSize={5}><path fill="#515F7C" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></Icon>
                <Text ml={2}>Account Information</Text>
            </Button>

            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover}>
                <RepeatClockIcon />
                <Text ml={3}>Makan History</Text>
            </Button>

            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover}>
                <Icon viewBox="0 0 24 24" boxSize={5}>
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#515F7C" fill="none" strokeWidth="2" />
                </Icon>
                <Text ml={3}>Favourites</Text>
            </Button>

            <Box position="absolute" bottom={0} width="calc(100% - 2rem)" textAlign="center" p={4}>
                <Button colorScheme="purple" width="50%" onClick={handleLogout} mx="auto">
                    Logout
                </Button>
            </Box>
        </Card>
    );
};

export default GuestSidebar;
