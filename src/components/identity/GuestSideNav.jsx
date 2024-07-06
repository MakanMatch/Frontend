import React from 'react';
import { Box, Button, Text } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../slices/AuthState';

const GuestSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.clear();
        navigate("/login");
    };

    return (
        <Box width="25%" bg="gray.100" p={4} borderRadius={15}>
            <Text>Guest Sidebar</Text>
            <Button colorScheme="purple" mb={4} onClick={handleLogout}>
                Logout
            </Button>
        </Box>
    );
};

export default GuestSidebar;
