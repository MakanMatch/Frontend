import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Text, Flex, Avatar, Button, Spacer, Spinner, useToast, FormControl, FormLabel, Stack, 
    Editable, EditableInput, EditablePreview
} from "@chakra-ui/react";
import { logout, fetchUser } from "../../slices/AuthState";
import GuestSidebar from "../../components/identity/GuestSideNav";
import HostSidebar from "../../components/identity/HostSideNav";
import server from "../../networking";
import configureShowToast from '../../components/showToast';

const MyAccount = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast()
    const showToast = configureShowToast(toast);
    const [isHovered, setIsHovered] = useState(false);
    const [accountInfo, setAccountInfo] = useState(null);
    const [originalAccountInfo, setOriginalAccountInfo] = useState(null);
    const { user, loaded, error } = useSelector((state) => state.auth);
    

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
                setOriginalAccountInfo(response.data);
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

    const hasChanges = () => {
        return JSON.stringify(accountInfo) !== JSON.stringify(originalAccountInfo);
    };

    const handleSaveChanges = () => {
        server.put('/identity/myAccount/updateAccountDetails', {
            userID: user.userID,
            username: accountInfo.username,
            email: accountInfo.email,
            contactNum: accountInfo.contactNum,
            address: accountInfo.address,
        })
        .then(response => {
            if (response.status === 200) {
                showToast('Changes saved', 'Your account details have been updated.', 3000, true, 'success');
                setOriginalAccountInfo({ ...accountInfo });
                setChangesMade(false);
            } else {
                showToast('ERROR', 'Failed to save changes. Please try again.', 3000, true, 'error');
            }
        })
        .catch(err => {
            console.error("Error saving changes:", err);
            showToast('ERROR', 'Failed to save changes. Please try again.', 'error');
        });
    };

    const handleCancelChanges = () => {
        setAccountInfo({ ...originalAccountInfo });
    };

    return (
        <Flex>
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
                <Stack direction={['column', 'row']} p={4} mt={20} justifyContent="space-between" width="100%" spacing={"20px"}>
                    <Box p={2} width={"50%"}>

                        <FormControl mb={2}>
                            <FormLabel>Username</FormLabel>
                            <Editable 
                                value={accountInfo.username}
                                onChange={(value) => setAccountInfo({ ...accountInfo, username: value })}
                                textAlign={'left'} 
                                borderColor={'black'} 
                                borderWidth={1} 
                                borderRadius={10}
                            >
                                <EditablePreview p={2}/>
                                <EditableInput p={2}/>
                            </Editable>
                        </FormControl>

                        <FormControl mb={2}>
                            <FormLabel>Email</FormLabel>
                            <Editable 
                                value={accountInfo.email} 
                                onChange={(value) => setAccountInfo({ ...accountInfo, email: value })}
                                textAlign={'left'} 
                                borderColor={'black'} 
                                borderWidth={1} 
                                borderRadius={10}
                            >
                                <EditablePreview p={2}/>
                                <EditableInput p={2}/>
                            </Editable>
                        </FormControl>

                        <FormControl mb={2}>
                            <FormLabel>Contact</FormLabel>
                            <Editable 
                                value={accountInfo.contactNum || "Enter your contact number"} 
                                onChange={(value) => setAccountInfo({ ...accountInfo, contactNum: value })}
                                textAlign={'left'} 
                                borderColor={'black'} 
                                borderWidth={1} 
                                borderRadius={10}
                            >
                                <EditablePreview p={2}/>
                                <EditableInput p={2}/>
                            </Editable>
                        </FormControl>

                        <FormControl mb={2}>
                            <FormLabel>Address</FormLabel>
                            <Editable 
                                value={accountInfo.address || "Enter your address"} 
                                onChange={(value) => setAccountInfo({ ...accountInfo, address: value })}
                                textAlign={'left'} 
                                borderColor={'black'} 
                                borderWidth={1} 
                                borderRadius={10}
                            >
                                <EditablePreview p={2}/>
                                <EditableInput p={2}/>
                            </Editable>
                        </FormControl>

                        <Button
                            variant={"MMPrimary"}
                            mb={4}
                            onClick={() => console.log("Change password clicked")}
                            position="absolute" 
                            bottom={0}
                            left={6}
                        >
                            Change Password
                        </Button>
                    </Box>
    
                    <Box p={2} width={"25%"}>
                        
                        <FormControl mb={2}>
                            <FormLabel>Favorite Cuisine</FormLabel>
                            <Text textAlign={'left'} pt={2} pb={2}>{accountInfo.favCuisine || "None"}</Text>
                        </FormControl>

                        <FormControl mb={2}>
                            <FormLabel>Meals Matched</FormLabel>
                            <Text textAlign={'left'} pt={2} pb={2}>{accountInfo.mealsMatched + " meals"}</Text>
                        </FormControl>

                        <FormControl mb={2}>
                            <FormLabel>Meals Matched</FormLabel>
                            <Text textAlign={'left'} pt={2} pb={2}>{calculateAccountAge() + " days"}</Text>
                        </FormControl>

                        
                    </Box>

                    <Box p={2} width={"16%"}>
                        <Flex justifyContent={"flex-end"} flexDirection={"column"}>
                            {hasChanges() && (
                                <>
                                    <Button
                                        variant={"MMPrimary"}
                                        onClick={handleSaveChanges}
                                        width="full"
                                        mb={2}
                                    >
                                        Save Changes
                                    </Button>

                                    <Button
                                        colorScheme="red"
                                        borderRadius={10}
                                        onClick={handleCancelChanges}
                                        width="full"
                                        mb={4}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            )}
                            <Button
                                colorScheme="red"
                                onClick={() => console.log("Delete account clicked")}
                                borderRadius={10}
                                position="absolute"
                                bottom={0}
                                mb={4}
                            >
                                Delete Account
                            </Button>
                        </Flex>
                    </Box>
                </Stack>
            </Box>
        </Flex>
    );
    
};

export default MyAccount;
