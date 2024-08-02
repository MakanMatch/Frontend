import React from 'react';
import { Box, Button, Text, Icon, Card } from "@chakra-ui/react";
import { StarIcon, CalendarIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../slices/AuthState';

const HostSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('jwt');
        navigate("/auth/login");
    };

    // Derive active page based on current pathname
    const activePage = location.pathname.split("/").pop();

    const handleNavigation = (path) => {
        navigate(`/identity/${path}`);
    };

    const DrawerHover = {
        _hover: {
          bg: "#E4EBF8"
        },
        borderRadius: "20px",
    };

    return (
        <Card h="720px" width="310px" borderRadius={15} boxShadow="0 2px 4px 2px rgba(0.2, 0.2, 0.2, 0.2)" p={4}>
            <Button 
                color="#515F7C" 
                mb={2} 
                justifyContent="left" 
                colorScheme="white" 
                sx={{ ...DrawerHover, bg: activePage === "myAccount" ? "#E4EBF8" : "transparent" }} 
                mt={4} 
                onClick={() => handleNavigation('myAccount')}
            >
                <Icon viewBox="0 0 24 24" boxSize={5}><path fill="#515F7C" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></Icon>
                <Text ml={2}>Account Information</Text>
            </Button>

            <Button 
                color="#515F7C" 
                mb={2} 
                justifyContent="left" 
                colorScheme="white" 
                sx={{ ...DrawerHover, bg: activePage === "makanReviews" ? "#E4EBF8" : "transparent" }}
                onClick={() => navigate('/reviews', { state: {
                    hostID: user.userID
                }})}
            >
                <StarIcon />
                <Text ml={3}>Makan Reviews</Text>
            </Button>

            <Button 
                color="#515F7C" 
                mb={2} 
                justifyContent="left" 
                colorScheme="white" 
                sx={{ ...DrawerHover, bg: activePage === "schedule" ? "#E4EBF8" : "transparent" }}
                onClick={() => handleNavigation('schedule')}
            >
                <CalendarIcon />
                <Text ml={3}>Schedule</Text>
            </Button>

            <Box position="absolute" bottom={0} width="calc(100% - 2rem)" textAlign="center" p={4}>
                <Button colorScheme="red" width="50%" onClick={handleLogout} mx="auto" borderRadius={10}>
                    Logout
                </Button>
            </Box>
        </Card>
    );
};

export default HostSidebar;
