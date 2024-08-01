import { Avatar, Box, Editable, Flex, Heading, Stack, FormControl, FormLabel, Button, EditablePreview, EditableInput, ButtonGroup, Popover, PopoverTrigger, PopoverContent,  PopoverArrow, PopoverCloseButton, IconButton, Text, useDisclosure, Spinner, useToast, Input } from '@chakra-ui/react'
import { EditIcon } from '@chakra-ui/icons';
import { useState, useEffect, useRef, forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams  } from 'react-router-dom';
import { reloadAuthToken } from '../../slices/AuthState';
import { logout } from '../../slices/AuthState';
import ChangeAddress from '../../components/identity/ChangeAddress';
import configureShowToast from '../../components/showToast';
import server from '../../networking';

function PublicGuestProfile() {
    const navigate = useNavigate();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const cancelRef = useRef()
    const { user, authToken, loaded } = useSelector((state) => state.auth);
    const [profilePicture, setProfilePicture] = useState(null);
    const [accountLoaded, setAccountLoaded] = useState(false);
    const [accountInfo, setAccountInfo] = useState({});
    const [originalAccountInfo, setOriginalAccountInfo] = useState(null);
    const [passwordChangeInProgress, setPasswordChangeInProgress] = useState(false);
    const [isChangeAddressModalOpen, setChangeAddressModalOpen] = useState(false);

    useEffect(() => {
        if (loaded == true) {
            const fetchAccountInfo = async () => {
                try {
                    // const userID = user.userID;
                    const userID = searchParams.get('userID')
                    console.log("User ID: ", userID);
                    const response = await server.get(`/cdn/accountInfo?userID=${userID}`);
                    dispatch(reloadAuthToken(authToken))              
                    setAccountInfo(response.data);
                    setOriginalAccountInfo(response.data);
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
                if (!passwordChangeInProgress) {
                    showToast("Redirecting to login", "Please log in first.", 3000, true, "error");
                    navigate('/auth/login');
                }
            }
        }
    }, [loaded, user]);

    if (!loaded || !user) {
        return <Spinner />
    }

    const handleChangeName = (fname, lname, onClose) => {
        server.put("/identity/myAccount/changeName", {
            fname: fname,
            lname: lname
        })
        .then((res) => {
            dispatch(reloadAuthToken(authToken))
            if (res.status === 200 && res.data === "SUCCESS: Nothing to update.") {
                showToast("No changes made", "You are good to go!", 3000, true, "success");
                onClose();
            } else if (res.status === 200 && res.data.startsWith("SUCCESS")) {
                showToast("Name changed", "Your name has been updated!", 3000, true, "success");
                onClose();
            }
        })
        .catch((err) => {
            dispatch(reloadAuthToken(authToken))
            if (err.response && err.response.status !== 200) {
                showToast("Invalid Input", err.response.data.substring("UERROR: ".length), 3000, true, "error");
            } else {
                console.error("Error changing name:", err);
                showToast("ERROR", "Failed to change name.", 3000, true, "error");
            }
        });
    };

    const hasChanges = () => {
        return JSON.stringify(accountInfo) !== JSON.stringify(originalAccountInfo);
    };

    const handleSaveChanges = () => {
        if (!validateFields()) {
            return;
        }

        server.put("/identity/myAccount/updateAccountDetails", {
            username: accountInfo.username,
            email: accountInfo.email,
            contactNum: accountInfo.contactNum,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            dispatch(reloadAuthToken(authToken))
            if (res.status == 200 && res.data.startsWith("SUCCESS")) {
                showToast("Changes saved", "Your account details have been updated.", 3000, true, "success");
                setOriginalAccountInfo({ ...accountInfo });
            }
        })
        .catch((error) => {
            dispatch(reloadAuthToken(authToken))
                console.log("Error: ", error)
                if (error.response && error.response.data && typeof error.response.data == "string") {
                    console.log("Failed to update account details; response: " + error.response.data)
                    if (error.response.data.startsWith("UERROR")) {
                        showToast(
                            "Uh-oh!",
                            error.response.data.substring("UERROR: ".length),
                            3500,
                            true,
                            "info",
                        )
                    } else {
                        showToast(
                            "Something went wrong",
                            "Failed to update account details. Please try again",
                            3500,
                            true,
                            "error",
                        )
                    }
                } else {
                    console.log("Unknown error occurred when updating account details; error: " + error)
                    showToast(
                        "Something went wrong",
                        "Failed to update account details. Please try again",
                        3500,
                        true,
                        "error",
                    )
                }
        });
    };

    const handleCancelChanges = () => {
        onDiscardOpen();
    };

    const confirmDiscardChanges = () => {
        setAccountInfo({ ...originalAccountInfo });
        onDiscardClose();
        showToast("Changes not saved", "All changes made have been discarded.", 3000, true, "warning");
    };

    const toggleChangeAddress = () => {
        setChangeAddressModalOpen(!isChangeAddressModalOpen)
    };

    const handleChangeAddressCloseModal = () => {
        setChangeAddressModalOpen(false);
    };

    const calculateAccountAge = () => {
        const createdAt = new Date(accountInfo.createdAt);
        const currentDate = new Date();
        const diffInMilliseconds = currentDate - createdAt;
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
        return diffInDays;
    };

    const TextInput = forwardRef((props, ref) => {
        return (
            <FormControl>
                <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
                <Input ref={ref} id={props.id} {...props} />
            </FormControl>
        );
    });

    
    const Form = ({ firstFieldRef, onCancel, onSave, fname, setFname, lname, setLname }) => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                onSave(fname, lname);
            }
        };

        const handleFnameChange = (e) => {
            if (e.target.value.length <= 30) {
                setFname(e.target.value);
            }
        };
    
        const handleLnameChange = (e) => {
            if (e.target.value.length <= 30) {
                setLname(e.target.value);
            }
        };
    
        return (
            <Stack spacing={4}>
                <TextInput
                    label='First name'
                    id='first-name'
                    ref={firstFieldRef}
                    value={fname}
                    onChange={handleFnameChange}
                    onKeyDown={handleKeyDown}
                />
                <TextInput
                    label='Last name'
                    id='last-name'
                    value={lname}
                    onChange={handleLnameChange}
                    onKeyDown={handleKeyDown}
                />
                <ButtonGroup display='flex' justifyContent='flex-end'>
                    <Button variant='outline' onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button 
                        colorScheme='teal' 
                        onClick={() => onSave(fname, lname)}
                        onKeyDown={handleKeyDown}
                    >
                        Save
                    </Button>
                </ButtonGroup>
            </Stack>
        );
    }

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('jwt');
        navigate("/auth/login");
    };

    const PopoverForm = () => {
        const { onOpen, onClose, isOpen } = useDisclosure();
        const firstFieldRef = useRef(null);
        const [fname, setFname] = useState(accountInfo.fname);
        const [lname, setLname] = useState(accountInfo.lname);
        const [localAccountInfo, setLocalAccountInfo] = useState(accountInfo);
    
        const onSave = (fname, lname) => {
            handleChangeName(fname, lname, () => {
                setLocalAccountInfo({ fname, lname });
                onClose();
            });
        };
    
        const handleOpen = () => {
            setFname(localAccountInfo.fname);
            setLname(localAccountInfo.lname);
            onOpen();
        };
    
        const handleCancel = () => {
            setFname(localAccountInfo.fname);
            setLname(localAccountInfo.lname);
            onClose();
        };
    
        useEffect(() => {
            if (!isOpen) {
                setFname(localAccountInfo.fname);
                setLname(localAccountInfo.lname);
            }
        }, [isOpen]);
    
        return (
            <Box display='flex' alignItems='center' mt="2%" ml="35%">
                <Box display='flex' alignItems='center' mr={3}>
                    <Text fontSize={25}><b>{localAccountInfo.fname} {localAccountInfo.lname}</b></Text>
                    <Popover
                        isOpen={isOpen}
                        initialFocusRef={firstFieldRef}
                        onOpen={handleOpen}
                        onClose={onClose}
                        placement='right'
                        closeOnBlur={false}
                    >
                        {user && user.userType === "Admin" && (
                            <PopoverTrigger>
                                <IconButton size='sm' icon={<EditIcon />} ml={2} />
                            </PopoverTrigger>
                        )}
                        <PopoverContent p={5}>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <Form
                                firstFieldRef={firstFieldRef}
                                onCancel={handleCancel}
                                onSave={onSave}
                                fname={fname}
                                setFname={setFname}
                                lname={lname}
                                setLname={setLname}
                            />
                        </PopoverContent>
                    </Popover>
                </Box>
            </Box>
        );
    };

    return (
        <>
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
                        // left={isSmallerThan560 ? "50%" : "16%"}
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

            <PopoverForm />

            <Box justifyContent={'center'} display={'flex'} mt={3}>
                <Stack direction={["column", "row"]} p={4} spacing={"5%"} width={"65vw"}>
                    <Box p={2} width={"70%"} justifyContent={"flex"}>
                    <FormControl mb={2}>
                            <FormLabel>Username</FormLabel>
                            <Editable
                                value={accountInfo.username}
                                onChange={(value) => setAccountInfo({ ...accountInfo, username: value })}
                                // onChange={(value) => {           
                                //     const { username, ...rest } = accountInfo;
                                //     setAccountInfo({ ...rest, username: value });
                                // }}
                                textAlign={"left"}
                                borderColor={"black"}
                                borderWidth={1}
                                borderRadius={10}
                                isDisabled={user && user.userType !== "Admin"}
                            >
                                <EditablePreview p={2} borderRadius={10} />
                                <EditableInput p={2} borderRadius={10} />
                            </Editable>
                        </FormControl>

                        <FormControl mb={2}>
                            <FormLabel>Email</FormLabel>
                            <Editable
                                value={accountInfo.email}
                                onChange={(value) => setAccountInfo({ ...accountInfo, email: value })}
                                // onChange={(value) => {
                                //     const { email, ...rest } = accountInfo;
                                //     setAccountInfo({ ...rest, email: value });
                                // }}
                                textAlign={"left"}
                                borderColor={"black"}
                                borderWidth={1}
                                borderRadius={10}
                                overflow={"hidden"}
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                                isDisabled={user && user.userType !== "Admin"}
                            >
                                <EditablePreview p={2} borderRadius={10} />
                                <EditableInput p={2} borderRadius={10} />
                            </Editable>
                        </FormControl>

                        <FormControl mb={2}>
                            <FormLabel>Contact</FormLabel>
                            <Editable 
                                value={accountInfo.contactNum || ''} 
                                placeholder="Enter your contact number"
                                onChange={(value) => setAccountInfo({ ...accountInfo, contactNum: value })}
                                // onChange={(value) => {
                                //     const { contactNum, ...rest } = accountInfo;
                                //     setAccountInfo({ ...rest, contactNum: value });
                                // }}
                                textAlign={"left"}
                                borderColor={"black"}
                                borderWidth={1}
                                borderRadius={10}
                                isDisabled={user && user.userType !== "Admin"}
                            >
                                <EditablePreview p={2} borderRadius={10} />
                                <EditableInput p={2} borderRadius={10} />
                            </Editable>
                        </FormControl>
                        {user && user.userType === "Admin" && (
                            <FormControl>
                                <FormLabel>Address</FormLabel>
                                <Flex alignItems="center" justifyContent={"space-between"}>
                                    <Box 
                                        textAlign={"left"}
                                        borderColor={"black"}
                                        borderWidth={1}
                                        borderRadius={10}
                                        overflow={"hidden"}
                                        width="80%"
                                        height="40px"
                                        isDisabled={user && user.userType !== "Admin"}
                                    >
                                        <Text p={2} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{accountInfo.address || "Enter your address"}</Text>
                                    </Box>

                                    
                                    <Button width="15%" onClick={toggleChangeAddress}>Edit</Button>

                                    <ChangeAddress isOpen={isChangeAddressModalOpen} onClose={handleChangeAddressCloseModal} accountInfo={accountInfo} setAccountInfo={setAccountInfo} setOriginalAccountInfo={setOriginalAccountInfo}/>
                                </Flex>
                            </FormControl>
                        )}
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

                    {user && user.userType === "Admin" && (
                        <Box width={"15%"} display="flex" justifyContent={"right"} flexDirection="column" alignItems="flex-end" mr={-4}>
                            {hasChanges() && (
                                <>
                                    <Button p={4} variant={"MMPrimary"} onClick={handleSaveChanges} width={'full'} mb={5}>
                                        Save Changes
                                    </Button>

                                    <Button p={4} colorScheme="red" borderRadius={10} onClick={handleCancelChanges} width={'full'} mb={4}>
                                        Cancel
                                    </Button>
                                </>
                            )}

                            <Button colorScheme="red" borderRadius={10} width={'10%'} position="absolute" bottom={"8%"} onClick={handleLogout}>
                                Logout
                            </Button>
                        </Box>
                    )}
                </Stack>
            </Box>
        </>
    )
}

export default PublicGuestProfile;