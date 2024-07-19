import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Text, Flex, Avatar, Button, Spinner, useToast, FormControl, FormLabel, Stack, 
    Editable, EditableInput, EditablePreview, AlertDialog, AlertDialogOverlay, AlertDialogHeader, AlertDialogBody,
    AlertDialogFooter, AlertDialogContent, useDisclosure
} from "@chakra-ui/react";
import { logout } from "../../slices/AuthState";
import GuestSidebar from "../../components/identity/GuestSideNav";
import HostSidebar from "../../components/identity/HostSideNav";
import server from "../../networking";
import configureShowToast from '../../components/showToast';
import ChangePassword from "../../components/identity/ChangePassword";

const MyAccount = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const cancelRef = React.useRef()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isDiscardOpen, onOpen: onDiscardOpen, onClose: onDiscardClose } = useDisclosure();
    const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [accountInfo, setAccountInfo] = useState(null);
    const [originalAccountInfo, setOriginalAccountInfo] = useState(null);
    const { user, loaded, error } = useSelector((state) => state.auth);
    const [accountLoaded, setAccountLoaded] = useState(false);

    useEffect(() => {
        if (loaded == true) {
            const fetchAccountInfo = async () => {
                try {
                    const userID = user.userID;
                    const response = await server.get(`/cdn/accountInfo?userID=${userID}`);
                    setAccountInfo(response.data);
                    setOriginalAccountInfo(response.data);
                    setAccountLoaded(true);
                } catch (err) {
                    console.log("Error fetching account info:", err);
                    showToast("Unable to retrieve account information", "Please try again", 3000, true, "error");
                    navigate('/');
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
        } else if (!accountInfo.contactNum || !/^\d{8}$/.test(accountInfo.contactNum)) {
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
                address: accountInfo.address,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                if (res.status == 200 && res.data.startsWith("SUCCESS")) {
                    showToast("Changes saved", "Your account details have been updated.", 3000, true, "success");
                    setOriginalAccountInfo({ ...accountInfo });
                } else if (res.data.startsWith("UERROR")) {
                    showToast("Invalid input", res.data.substring("UERROR: ".length), 3000, true, "error");
                } else {
                    console.log(res.data);
                    showToast("ERROR", "Failed to save changes. Please try again.", 3000, true, "error");
                }
            })
            .catch((err) => {
                console.log(err);
                showToast("ERROR", "Failed to save changes. Please try again.", "error");
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
        server.delete("/identity/myAccount/deleteAccount", {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            if (res.status == 200 && res.data.startsWith("SUCCESS")) {
                showToast("We're sorry to see you go! :(", "See you again next time!", 3000, true, "success");
                // Remove the jwt
                dispatch(logout());
                localStorage.removeItem('jwt');
                navigate("/auth/login");
            } else {
                console.log(res.data);
                showToast("ERROR", "Failed to delete account.", 3000, true, "error");
            }
        })
        .catch((err) => {
            console.error("Error deleting account:", err);
            showToast("ERROR", "Failed to delete account.", 3000, true, "error");
        })
        .finally(() => {
            onDeleteClose();
        });
    };

    const toggleChangePassword = () => {
        setPasswordModalOpen(!isPasswordModalOpen);
    };

    const handleCloseModal = () => {
        setPasswordModalOpen(false);
    };

    const handleChangePassword = (values, { setSubmitting, setFieldError }) => {
        server.put("/identity/myAccount/changePassword", {
                userID: user.userID,
                userType: user.userType,
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            })
            .then((res) => {
                if (res.status == 200 && res.data.startsWith("SUCCESS")) {
                    setPasswordModalOpen(false);
                    showToast("Password changed", "Your password has been updated!", 3000, true, "success");
                } else if (res.data.startsWith("UERROR")) {
                    setFieldError("currentPassword", "Incorrect current password")
                    showToast("ERROR", res.data.substring("UERROR: ".length), 3000, true, "error");
                }
            })
            .catch((err) => {
                console.error("Error changing password:", err);
                showToast("ERROR", "Your password cannot be changed. Please try again.", 3000, true, "error");
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    if (!accountLoaded) {
        return <Spinner />;
    }

    if (error) {
        console.log(error);
        return <Spinner />;
    }

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

                <Stack direction={["column", "row"]} p={4} mt={20} justifyContent="space-between" width="100%" spacing={"20px"}>
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
                            >
                                <EditablePreview p={2} borderRadius={10} />
                                <EditableInput p={2} borderRadius={10} />
                            </Editable>
                        </FormControl>

                        <FormControl mb={2}>
                            <FormLabel>Contact</FormLabel>
                            <Editable 
                                value={accountInfo.contactNum || "Enter your contact number"} 
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

                        <FormControl mb={2}>
                            <FormLabel>Address</FormLabel>
                            <Editable
                                value={accountInfo.address || "Enter your address"}
                                onChange={(value) => setAccountInfo({ ...accountInfo, address: value })}
                                textAlign={"left"}
                                borderColor={"black"}
                                borderWidth={1}
                                borderRadius={10}
                            >
                                <EditablePreview p={2} borderRadius={10} />
                                <EditableInput p={2} borderRadius={10} />
                            </Editable>
                        </FormControl>

                        <Button variant={"MMPrimary"} mb={4} onClick={(toggleChangePassword)} position="absolute" bottom={0} left={6}>
                            Change Password
                        </Button>

                        <ChangePassword isOpen={isPasswordModalOpen} onClose={handleCloseModal} onSubmit={handleChangePassword} />
                    </Box>

                    <Box p={2} width={"22%"}>
                        <FormControl mb={2}>
                            <FormLabel>Favorite Cuisine</FormLabel>
                            <Text textAlign={"left"} pt={2} pb={2}>
                                {accountInfo.favCuisine || "None"}
                            </Text>
                        </FormControl>

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

                            <Button colorScheme="red" onClick={handleDeleteAccount} borderRadius={10} position="absolute" bottom={0} mb={4}>
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