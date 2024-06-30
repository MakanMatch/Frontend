import React, { useEffect, useState, useContext } from 'react';
import {
    Box, Heading, Input, Button, Text, VStack, FormControl, FormLabel, FormErrorMessage, useToast, InputGroup, InputRightElement, IconButton,
    Spinner, Flex, Avatar, Tooltip, Spacer
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import UserContext from '../../context/UserContext';
import server from '../../networking';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
    // const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, setUser, loaded } = useContext(UserContext);
    const [isHovered, setIsHovered] = useState(false);

    const handleLogout = () => {
        setUser(null)
        localStorage.clear()
        navigate("/login")
        return
    }

    useEffect(() => {
        if (loaded === true) {
            setLoading(false)
            if (user == null) {
                navigate("/login")
            }
        }
    }, [loaded])

    if (loading) {
        return <Spinner />
    }

    if (error) {
        return <div>{error}</div>;
    }

    const calculateAccountAge = () => {
        const createdAt = new Date(user.createdAt);
        const currentDate = new Date();
        const diffInMilliseconds = currentDate - createdAt;
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
        return diffInDays;
    };

    return (
        <Flex height="100vh">
            {/* Left side box */}
            <Box width="25%" bg="gray.100" p={4} borderRadius={15}>
                {/* Content for the left side */}
                Left Sidebar
            </Box>

            {/* Right side content */}
            <Box width="75%" ml={10} position="relative">
                {/* Profile banner */}
                <Box bg="blue.500" height="25%" position="relative" borderRadius={15}>
                    <Flex align="center" justify="flex-end" height="100%" pr={10}>
                        <Heading color="white">Guest</Heading>
                    </Flex>
                    {/* Circle avatar */}
                    <Box
                        position="absolute"
                        bottom="-70px"
                        left="20%"
                        transform="translateX(-50%)"
                        zIndex={1}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        overflow="visible"
                    >
                        <Avatar
                            size="3xl"
                            name="User Name"
                            src="https://via.placeholder.com/150"
                            position="relative"
                            bg="white"
                            border="4px solid white"
                        >
                            {/* Translucent overlay on hover */}
                            {isHovered && (
                                <Box
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    right={0}
                                    bottom={0}
                                    bg="rgba(0, 0, 0, 0.5)"
                                    zIndex={2}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    borderRadius="50%"
                                >
                                    <Text fontSize="sm" color="white">Edit Picture</Text>
                                </Box>
                            )}

                            {/* Tooltip */}
                            <Tooltip label="Edit Picture" placement="top">
                                <Box
                                    position="absolute"
                                    top="50%"
                                    left="50%"
                                    transform="translate(-50%, -50%)"
                                    zIndex={3}
                                    textAlign="center"
                                >
                                    {/* This empty box is necessary for tooltip positioning */}
                                </Box>
                            </Tooltip>
                        </Avatar>
                    </Box>
                </Box>

                {/* Account info part */}
                <Flex bg="gray.200" p={4} mt={20} justifyContent="space-between" width="100%">
                    {/* Left side */}
                    <Box flex="1">
                        <Heading size="md" mb={4}>Basic Information</Heading>
                        <Text>Username: {user.username}</Text>
                        <Text>Email: {user.email}</Text>
                        <Text>Contact: {user.contactNum}</Text>
                        <Text>Address: {user.address}</Text>
                        {/* Change Password Button */}
                        <Button
                            colorScheme="purple"
                            mb={4}
                            onClick={() => {
                                // Handle change password logic here
                                console.log("Change password clicked");
                            }}
                        >
                            Change Password
                        </Button>
                    </Box>

                    {/* Right side */}
                    <Box flex="1">
                        <Heading size="md" mb={4}>Additional Information</Heading>
                        <Text>Favorite Cuisine: {user.favCuisine}</Text>
                        <Text>Meals Matched: {user.mealsMatched}</Text>
                        <Text>Account Age: {calculateAccountAge()} days</Text>
                        {/* Spacer for alignment */}
                        <Spacer />
                        {/* Delete Account Button */}
                        <Button
                            colorScheme="red"
                            onClick={() => {
                                // Handle delete account logic here
                                console.log("Delete account clicked");
                            }}
                        >
                            Delete Account
                        </Button>
                    </Box>
                </Flex>
            </Box>
        </Flex>
    );
};


export default MyAccount;