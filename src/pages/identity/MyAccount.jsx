import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Text, Flex, Avatar, Button, Spacer, Spinner, useToast
} from "@chakra-ui/react";
import { logout, fetchUser } from "../../slices/AuthState";
import GuestSidebar from "../../components/identity/GuestSideNav";
import HostSidebar from "../../components/identity/HostSideNav";
import server from "../../networking";
import configureShowToast from '../../components/showToast';

const MyAccount = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);
    const [accountInfo, setAccountInfo] = useState(null);
    const { user, loaded, error } = useSelector((state) => state.auth);
    const toast = useToast()
    const showToast = configureShowToast(toast);

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('jwt');
        navigate("/auth/login");
    };

    useEffect(() => {
        if (!loaded) {
            dispatch(fetchUser());
        }
    }, [dispatch, loaded]);

    useEffect(() => {
        if (loaded && !user) {
            // console.log(localStorage.getItem("jwt"));
            navigate("/auth/login");
        }
    }, [loaded, user, navigate]);

    useEffect(() => {
        const fetchAccountInfo = async () => {
            try {
                const userID = user.userID;
                const response = await server.get(`/cdn/accountInfo?userID=${userID}`);
                setAccountInfo(response.data);
            } catch (err) {
                console.log("Error fetching account info:", err);
            }
        };

        if (user && user.userID) {
            fetchAccountInfo();
        }
    }, [user]);

    if (!loaded) {
        console.log("Not loaded");
        return <Spinner />;
    }

    if (error) {
        console.log(error);
        return <Spinner />;
    }

    if (!accountInfo) {
        return <Spinner />;
    }

    const calculateAccountAge = () => {
        const createdAt = new Date(accountInfo.createdAt);
        const currentDate = new Date();
        const diffInMilliseconds = currentDate - createdAt;
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
        return diffInDays;
    };

    const bannerStyles = {
        guest: {
            backgroundImage: "url('/src/assets/GuestBanner.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        },
        host: {
            backgroundImage: "url('/src/assets/HostBanner.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
        },
    };

    return (
        <Flex height="100vh">
            {/* Conditionally render the sidebar based on user type */}
            {accountInfo.userType === "Guest" ? <GuestSidebar /> : <HostSidebar />}
    
            {/* Right side content */}
            <Box width="75%" ml={10} position="relative">
                {/* Profile banner */}
                <Box
                    height="25%"
                    position="relative"
                    borderRadius={15}
                    {...(accountInfo.userType === "Guest"
                        ? bannerStyles.guest
                        : bannerStyles.host)}
                >
                    <Flex align="center" justify="flex-end" height="100%" pr={10}>
                        <Heading mr={5} size={"2xl"} color="Black">
                            {accountInfo.userType}
                        </Heading>
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
                            name={accountInfo.username}
                            src="https://via.placeholder.com/150"
                            position="relative"
                            bg="white"
                            border="4px solid white"
                        >
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
                                    <Text fontSize="sm" color="white">
                                        Edit Picture
                                    </Text>
                                </Box>
                            )}
                        </Avatar>
                    </Box>
                </Box>
    
                {/* Account info part */}
                <Flex p={4} mt={20} justifyContent="space-between" width="100%">
                    <Box flex="1">
                        <Heading size="md" mb={4}>
                            Basic Information
                        </Heading>
                        <Text>Username: {accountInfo.username}</Text>
                        <Text>Email: {accountInfo.email}</Text>
                        <Text>Contact: {accountInfo.contactNum}</Text>
                        <Text>Address: {accountInfo.address}</Text>
                        <Button
                            colorScheme="purple"
                            mb={4}
                            onClick={() => console.log("Change password clicked")}
                        >
                            Change Password
                        </Button>
                    </Box>
    
                    <Box flex="1">
                        <Heading size="md" mb={4}>
                            Additional Information
                        </Heading>
                        <Text>Favorite Cuisine: {accountInfo.favCuisine}</Text>
                        <Text>Meals Matched: {accountInfo.mealsMatched}</Text>
                        <Text>Account Age: {calculateAccountAge()} days</Text>
                        <Spacer />
                        <Button
                            colorScheme="red"
                            onClick={() => console.log("Delete account clicked")}
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
