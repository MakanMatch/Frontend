import React, { useEffect, useState, useRef, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Text, Flex, Avatar, Button, Spinner, useToast, FormControl, FormLabel, Stack, 
    Editable, EditableInput, EditablePreview, AlertDialog, AlertDialogOverlay, AlertDialogHeader, AlertDialogBody,
    AlertDialogFooter, AlertDialogContent, useDisclosure, Popover, PopoverTrigger, PopoverContent, PopoverArrow, 
    PopoverCloseButton, IconButton, Input, ButtonGroup, Alert, AlertIcon
} from "@chakra-ui/react";
import { EditIcon, } from "@chakra-ui/icons";
import { logout } from "../../slices/AuthState";
import MyAccountSideBar from "../../components/identity/MyAccountSidebar";
import server from "../../networking";
import configureShowToast from '../../components/showToast';
import ChangePassword from "../../components/identity/ChangePassword";
import EditPicture from "../../components/identity/EditPicture";
import ChangeAddress from "../../components/identity/ChangeAddress";
import { reloadAuthToken } from '../../slices/AuthState';
import EmailVerificationAlert from "../../components/identity/EmailVerificationAlert";

const MyAccount = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const cancelRef = useRef()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isDiscardOpen, onOpen: onDiscardOpen, onClose: onDiscardClose } = useDisclosure();
    const [isEditPictureModalOpen, setEditPictureModalOpen] = useState(false);
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [passwordChangeInProgress, setPasswordChangeInProgress] = useState(false);
    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [isChangeAddressModalOpen, setChangeAddressModalOpen] = useState(false);
    const [accountInfo, setAccountInfo] = useState({});
    const [originalAccountInfo, setOriginalAccountInfo] = useState(null);
    const { user, loaded, error, authToken } = useSelector((state) => state.auth);
    const [accountLoaded, setAccountLoaded] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);

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
                    if (err && err.response && err.response.status && err.response.status == 404) {
                        dispatch(logout());
                        localStorage.removeItem('jwt');
                    }
                    showToast("Unable to retrieve account information", "Please try again", 3000, true, "error");
                    navigate('/');
                }
            };

            if (user && user.userID) {
                fetchAccountInfo();
            } else {
                if (!passwordChangeInProgress && !deleteInProgress) {
                    showToast("Redirecting to login", "Please log in first.", 3000, true, "error");
                    navigate('/auth/login');
                }
            }
        }
    }, [loaded, user]);

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
                userID: user.userID,
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

    const handleDeleteAccount = () => {
        onDeleteOpen();
    };

    const confirmDeleteAccount = () => {
        setDeleteInProgress(true);
        server.delete("/identity/myAccount/deleteAccount", {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            dispatch(reloadAuthToken(authToken))
            if (res.status == 200 && res.data.startsWith("SUCCESS")) {
                showToast("We're sorry to see you go! :(", "See you again next time!", 3000, true, "success");
                // Remove the jwt
                dispatch(logout());
                localStorage.removeItem('jwt');
                navigate("/auth/login");
            } else {
                showToast("ERROR", "Failed to delete account.", 3000, true, "error");
            }
        })
        .catch((err) => {
            dispatch(reloadAuthToken(authToken))
            console.error("Error deleting account:", err);
            showToast("ERROR", "Failed to delete account.", 3000, true, "error");
        })
        .finally(() => {
            onDeleteClose();
            setDeleteInProgress(false);
        });
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
            } else {
                showToast("Something went wrong", "Please try again later.", 3000, true, "error");
            }
        })
        .catch((err) => {
            dispatch(reloadAuthToken(authToken))
            if (err.response && err.response.status === 400) {
                showToast("Invalid Input", err.response.data.substring("UERROR: ".length), 3000, true, "error");
            } else {
                console.error("Error changing name:", err);
                showToast("ERROR", "Failed to change name.", 3000, true, "error");
            }
        });
    };

    if (!accountLoaded) {
        return <Spinner />;
    }

    if (error) {
        console.log(error);
        return <Spinner />;
    }

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
            <Box display='flex' alignItems='center' mt="3%" ml="30%">
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

    return (
        <Flex>
            <MyAccountSideBar />

            {/* Right side content */}
            <Box width="75%" ml={10} position="relative">
                {/* Profile banner */}
                <Box
                    height="25%"
                    position="relative"
                    borderRadius={15}
                    {...(user.userType === "Guest"
                        ? bannerStyles.guest
                        : bannerStyles.host)}
                >
                    <Flex align="center" justify="flex-end" height="100%" pr={10}>
                        <Heading mr={5} size={'2xl'} color="Black">
                            {user.userType}
                        </Heading>
                    </Flex>

                    <Box
                        position="absolute"
                        bottom="-70px"
                        left="16%"
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

                <PopoverForm />

                {!accountInfo.emailVerified && (
                    <EmailVerificationAlert email={accountInfo.email} userType={user.userType} emailVerificationTime={accountInfo.emailVerificationTime}/>
                )}
                
                <Stack direction={["column", "row"]} p={4} mt={4} justifyContent="space-between" width="100%" spacing={"20px"} height={"50vh"}>
                    <Box p={2} width={"50%"}>
                        <FormControl mb={2}>
                            <FormLabel>Username</FormLabel>
                            <Editable
                                value={accountInfo.username}
                                onChange={(value) => setAccountInfo({ ...accountInfo, username: value })}
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
                                textAlign={"left"}
                                borderColor={"black"}
                                borderWidth={1}
                                borderRadius={10}
                            >
                                <EditablePreview p={2} borderRadius={10} />
                                <EditableInput p={2} borderRadius={10} />
                            </Editable>
                        </FormControl>

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
                                >
                                    <Text p={2} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">{accountInfo.address || "Enter your address"}</Text>
                                </Box>

                                <Button onClick={toggleChangeAddress}>Edit</Button>

                                <ChangeAddress isOpen={isChangeAddressModalOpen} onClose={handleChangeAddressCloseModal} accountInfo={accountInfo} setAccountInfo={setAccountInfo} setOriginalAccountInfo={setOriginalAccountInfo}/>
                            </Flex>
                        </FormControl>

                        <Button variant={"MMPrimary"} mt={5} onClick={(toggleChangePassword)} position="absolute" bottom={0} left={6}>
                            Change Password
                        </Button>

                        <ChangePassword isOpen={isPasswordModalOpen} onClose={handlePasswordCloseModal} onSubmit={handleChangePassword} />
                    </Box>

                    <Box p={2} width={"22%"}>

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

                    <Box p={2} width={"18%"}>
                        <Flex justifyContent={"flex-end"} flexDirection={"column"}>
                            {hasChanges() && (
                                <>
                                    <Button p={6} variant={"MMPrimary"} onClick={handleSaveChanges} width="full" mb={5}>
                                        Save Changes
                                    </Button>

                                    <Button p={6} colorScheme="red" borderRadius={10} onClick={handleCancelChanges} width="full" mb={4}>
                                        Cancel
                                    </Button>
                                </>
                            )}

                            <Button colorScheme="red" onClick={handleDeleteAccount} borderRadius={10} position="absolute" bottom={0}>
                                Delete Account
                            </Button>
                        </Flex>
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

            {/* Delete Account Confirmation Modal */}
            <AlertDialog
                isOpen={isDeleteOpen}
                leastDestructiveRef={cancelRef}
                onClose={onDeleteClose}
                size="sm"
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Account
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onDeleteClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={confirmDeleteAccount} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Flex>
    );
};

export default MyAccount;