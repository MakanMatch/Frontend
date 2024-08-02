import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Text, Flex, Avatar, Button, Spinner, useToast, FormControl, FormLabel, Stack, 
    Editable, EditableInput, EditablePreview, AlertDialog, AlertDialogOverlay, AlertDialogHeader, AlertDialogBody,
    AlertDialogFooter, AlertDialogContent, useDisclosure, Popover, PopoverTrigger, PopoverContent, PopoverArrow, 
    PopoverCloseButton, IconButton, Input, ButtonGroup, useMediaQuery
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { FocusLock } from "@chakra-ui/react";
import { logout } from "../../../slices/AuthState";
import configureShowToast from '../../../components/showToast';
import server from "../../../networking";
import { reloadAuthToken } from "../../../slices/AuthState";
import ChangeAddress from "../../../components/identity/ChangeAddress";
import EditPicture from "../../../components/identity/EditPicture";
import ChangePassword from "../../../components/identity/ChangePassword";

function AdminAccount() {
    const navigate = useNavigate();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const dispatch = useDispatch();
    const cancelRef = useRef()
    const { user, authToken, loaded } = useSelector((state) => state.auth);
    const [profilePicture, setProfilePicture] = useState(null);
    const [accountLoaded, setAccountLoaded] = useState(false);
    const [accountInfo, setAccountInfo] = useState({});
    const [originalAccountInfo, setOriginalAccountInfo] = useState(null);
    const { isOpen: isDiscardOpen, onOpen: onDiscardOpen, onClose: onDiscardClose } = useDisclosure();
    const [isEditPictureModalOpen, setEditPictureModalOpen] = useState(false);
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [passwordChangeInProgress, setPasswordChangeInProgress] = useState(false);
    const [isChangeAddressModalOpen, setChangeAddressModalOpen] = useState(false);

    const [isSmallerThan560] = useMediaQuery("(max-width: 560px)"); // for linkedin card design (optional)

    useEffect(() => {
        if (loaded == true) {
            const fetchAccountInfo = async () => {
                try {
                    const userID = user.userID;
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

    const hasChanges = () => {
        return JSON.stringify(accountInfo) !== JSON.stringify(originalAccountInfo);
    };

    const TextInput = React.forwardRef((props, ref) => {
        return (
            <FormControl>
                <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
                <Input ref={ref} id={props.id} {...props} />
            </FormControl>
        );
    });

    const validateFields = () => {
        if (!accountInfo.username || accountInfo.username.trim() === "") {
            showToast("Invalid input", "Username cannot be empty.", 3000, true, "error");
            return false;
        } else if (/\s/.test(accountInfo.username)) {
            showToast("Invalid input", "Username cannot contain spaces.", 3000, true, "error");
            return false;
        } else if (!accountInfo.email || !/\S+@\S+\.\S+/.test(accountInfo.email)) {
            showToast("Invalid input", "Enter a valid email address.", 3000, true, "error");
            return false;
        } else if (accountInfo.contactNum && !/^\d{8}$/.test(accountInfo.contactNum)) {
            showToast("Invalid input", "Contact number must be 8 digits.", 3000, true, "error");
            return false;
        }
        return true;
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

    const toggleChangePassword = () => {
        setPasswordModalOpen(!isPasswordModalOpen);
    };

    const handlePasswordCloseModal = () => {
        setPasswordModalOpen(false);
    };

    const handleChangePassword = (values, { setSubmitting, setFieldError }) => {
        setPasswordChangeInProgress(true);
        server.put("/identity/myAccount/changePassword", {
                userID: user.userID,
                userType: user.userType,
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            })
            .then((res) => {
                dispatch(reloadAuthToken(authToken))
                if (res.status == 200 && res.data.startsWith("SUCCESS")) {
                    setPasswordModalOpen(false);
                    showToast("Password changed", "Please log in with your new password.", 3000, true, "success");
                    dispatch(logout());
                    localStorage.removeItem('jwt');
                    navigate("/auth/login");
                } else if (res.data.startsWith("UERROR")) {
                    setFieldError("currentPassword", "Incorrect current password")
                    showToast("ERROR", res.data.substring("UERROR: ".length), 3000, true, "error");
                }
            })
            .catch((err) => {
                dispatch(reloadAuthToken(authToken))
                console.error("Error changing password:", err);
                showToast("ERROR", "Your password cannot be changed. Please try again.", 3000, true, "error");
            })
            .finally(() => {
                setSubmitting(false);
                setPasswordChangeInProgress(false);
            });
    };

    const toggleChangeAddress = () => {
        setChangeAddressModalOpen(!isChangeAddressModalOpen)
    };

    const handleChangeAddressCloseModal = () => {
        setChangeAddressModalOpen(false);
    };

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
                        <PopoverTrigger>
                            <IconButton size='sm' icon={<EditIcon />} ml={2} />
                        </PopoverTrigger>
                        <PopoverContent p={5}>
                            <FocusLock returnFocus persistentFocus={false}>
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
                            </FocusLock>
                        </PopoverContent>
                    </Popover>
                </Box>
            </Box>
        );
    };

    const toggleEditPicture = () => {
        setEditPictureModalOpen(!isEditPictureModalOpen);
    };

    const handleEditPictureCloseModal = () => {
        setEditPictureModalOpen(false);
    };

    const handleProfilePictureChange = () => {
        window.location.reload();
    };

    const handleRemoveProfilePicture = () => {
        window.location.reload();
        setProfilePicture(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('jwt');
        navigate("/auth/login");
    };

    return (
        <>
            <Box justifyContent={'center'} display={'flex'}>
                <Box 
                    backgroundImage={'/src/assets/AdminBanner.jpg'}
                    width="65vw"
                    height="25vh"
                    position="relative"
                    borderRadius={15}
                    backgroundSize="cover"
                    backgroundPosition="center"
                >
                    <Flex align="center" justify="flex-end" height="100%" pr={10}>
                        <Heading mr={5} size={'xl'} color="Black">
                            Admin
                        </Heading>
                    </Flex>

                    <Box
                        position="absolute"
                        bottom="-70px"
                        left={isSmallerThan560 ? "50%" : "16%"}
                        transform="translateX(-50%)"
                        zIndex={1}
                        cursor={"pointer"}
                        overflow="visible"
                    >
                        <Avatar
                            size="2xl"
                            src={profilePicture}
                            position="relative"
                            bg="white"
                            border="4px solid white"
                            onClick={(toggleEditPicture)}
                            icon={<Avatar size='2xl'/>}
                        />

                        <EditPicture 
                            isOpen={isEditPictureModalOpen} 
                            onClose={handleEditPictureCloseModal} 
                            onSubmit={handleProfilePictureChange} 
                            onRemove={handleRemoveProfilePicture}
                            currentProfilePicture={profilePicture}
                        />
                    </Box>
                </Box>
            </Box>

            <PopoverForm />

            <Box justifyContent={'center'} display={'flex'}>
                <Stack direction={["column", "row"]} p={4} spacing={"12%"} width={"65vw"}>
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
                            >
                                <EditablePreview p={2} borderRadius={10} />
                                <EditableInput p={2} borderRadius={10} />
                            </Editable>
                        </FormControl>

                        {/* <FormControl>
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
                                >
                                    <Text p={2} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{accountInfo.address || "Enter your address"}</Text>
                                </Box>

                                <Button width="15%" onClick={toggleChangeAddress}>Edit</Button>

                                <ChangeAddress isOpen={isChangeAddressModalOpen} onClose={handleChangeAddressCloseModal} accountInfo={accountInfo} setAccountInfo={setAccountInfo} setOriginalAccountInfo={setOriginalAccountInfo}/>
                            </Flex>
                        </FormControl> */}

                        <Box display="flex" justifyContent={"left"}>
                            <Button variant={"MMPrimary"} mt={6} onClick={(toggleChangePassword)}>
                                Change Password
                            </Button>
                        </Box>

                        <ChangePassword isOpen={isPasswordModalOpen} onClose={handlePasswordCloseModal} onSubmit={handleChangePassword} />
                    </Box>

                    <Box width={"18%"} display="flex" justifyContent={"right"} flexDirection="column" alignItems="flex-end" mr={-4}>
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

                            <Button colorScheme="red" borderRadius={10} width={'11%'} position="absolute" bottom={"7.5%"} onClick={handleLogout}>
                                Logout
                            </Button>
                    </Box>
                </Stack>
            </Box>

            {/* Discard Changes Confirmation Modal */}
            <AlertDialog
                isOpen={isDiscardOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDiscardClose}
                size="sm"
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Discard Changes
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to discard all changes?
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDiscardClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={confirmDiscardChanges} ml={3}>
                                Discard
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
        
    )
}


export default AdminAccount;