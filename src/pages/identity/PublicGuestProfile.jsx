import { Avatar, Box, Editable, Flex, Heading, Stack, FormControl, FormLabel, EditablePreview, EditableInput, 
    Text, Spinner, useToast, Button } from '@chakra-ui/react'
import { useState, useEffect, useRef, forwardRef } from 'react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams  } from 'react-router-dom';
import { reloadAuthToken } from '../../slices/AuthState';
import { logout } from '../../slices/AuthState';
import configureShowToast from '../../components/showToast';
import server from '../../networking';

function PublicGuestProfile() {
    const navigate = useNavigate();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { user, authToken, loaded } = useSelector((state) => state.auth);
    const [profilePicture, setProfilePicture] = useState(null);
    const [accountLoaded, setAccountLoaded] = useState(false);
    const [accountInfo, setAccountInfo] = useState({});

    useEffect(() => {
        if (loaded == true) {
            const fetchAccountInfo = async () => {
                try {
                    const userID = searchParams.get('userID')
                    console.log("User ID: ", userID);
                    const response = await server.get(`/cdn/accountInfo?userID=${userID}`);
                    dispatch(reloadAuthToken(authToken))              
                    setAccountInfo(response.data);
                    setAccountLoaded(true);
                    setProfilePicture(`${import.meta.env.VITE_BACKEND_URL}/cdn/getProfilePicture?userID=${userID}`);
                } catch (err) {
                    console.log("Error fetching account info:", err);
                    if (err.response && err.response.status && err.response.status == 404) {
                        dispatch(logout());
                        localStorage.removeItem('jwt');
                    }
                    showToast("Unable to retrieve account information", "Please try again", 3000, true, "error");
                    navigate('/admin');
                }
            };

            if (user && user.userID) {
                fetchAccountInfo();
            } else {
                showToast("Redirecting to login", "Please log in first.", 3000, true, "error");
                navigate('/auth/login');
            }
        }
    }, [loaded, user]);

    if (!loaded || !user) {
        return <Spinner />
    }

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    }

    const calculateAccountAge = () => {
        const createdAt = new Date(accountInfo.createdAt);
        const currentDate = new Date();
        const diffInMilliseconds = currentDate - createdAt;
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
        return diffInDays;
    };

    return (
        <>
            <Button
                onClick={handleGoBack}
                position="absolute" top={{base: "10vh", md: "17vh"}} left="5vw" 
                // base is for smaller screen size and md is for larger laptop screen size
            >
                <ArrowBackIcon />
            </Button>
            <Box justifyContent={'center'} display={'flex'}>    
                <Box 
                    backgroundImage={'/src/assets/GuestBanner.png'}
                    width="65vw"
                    height="25vh"
                    position="relative"
                    borderRadius={15}
                    backgroundSize="cover"
                    backgroundPosition="center"
                >
                    <Flex align="center" justify="flex-end" height="100%" pr={10}>
                        <Heading mr={5} size={'xl'} color="Black">
                            Guest
                        </Heading>
                    </Flex>

                    <Box
                        position="absolute"
                        bottom="-70px"
                        left={"16%"}
                        transform="translateX(-50%)"
                        zIndex={1}
                        overflow="visible"
                    >
                        <Avatar
                            size="2xl"
                            // src={profilePicture}
                            position="relative"
                            bg="white"
                            border="4px solid white"
                            icon={<Avatar size='2xl'/>}
                        />
                    </Box>
                </Box>
            </Box>

            <Box justifyContent={'center'} display={'flex'} mt={20}>
                <Stack direction={["column", "row"]} p={4} spacing={"5%"} width={"65vw"}>
                    <Box p={2} width={"70%"} justifyContent={"flex"}>
                        <FormControl mb={2}>
                            <FormLabel>Name</FormLabel>
                            <Editable
                                value={`${accountInfo.fname} ${accountInfo.lname}`}
                                textAlign={"left"}
                                borderColor={"black"}
                                borderWidth={1}
                                borderRadius={10}
                                isDisabled="true"
                            >
                                <EditablePreview p={2} borderRadius={10} />
                                <EditableInput p={2} borderRadius={10} />
                            </Editable>
                        </FormControl>

                        <FormControl mb={2}>
                            <FormLabel>Username</FormLabel>
                            <Editable
                                value={accountInfo.username}
                                textAlign={"left"}
                                borderColor={"black"}
                                borderWidth={1}
                                borderRadius={10}
                                isDisabled="true"
                            >
                                <EditablePreview p={2} borderRadius={10} />
                                <EditableInput p={2} borderRadius={10} />
                            </Editable>
                        </FormControl>
                    </Box>

                    <Box p={2} width={"25%"}>
                        <FormControl mb={2}>
                            <FormLabel>Meals Matched</FormLabel>
                            <Text textAlign={"left"} pt={2} pb={2}>
                                {accountInfo.mealsMatched + " meals"}
                            </Text>
                        </FormControl>

                        <FormControl mb={2}>
                            <FormLabel>Account Age</FormLabel>
                            <Text textAlign={"left"} pt={2} pb={2}>
                                {calculateAccountAge() + " days"}
                            </Text>
                        </FormControl>
                    </Box>
                </Stack>
            </Box>
        </>
    )
}

export default PublicGuestProfile;