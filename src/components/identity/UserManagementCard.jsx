import { Avatar, Box, HStack, Text, Menu, MenuButton, MenuItem, MenuList, IconButton, useToast, Link, Spinner, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton, useDisclosure, Button, Badge, SlideFade, ScaleFade, Skeleton } from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reloadAuthToken } from '../../slices/AuthState';
import { motion } from 'framer-motion';
import configureShowToast from '../../components/showToast';
import server from "../../networking";
import ManageUserDetails from './ManageUserDetailsModal';

function UserManagementCard({ username, fname, lname, email, userType, contactNum, userID, banned, fetchAllUsers }) {
    const toast = useToast()
    const dispatch = useDispatch()
    const showToast = configureShowToast(toast)
    const navigate = useNavigate()

    const [isBanned, setIsBanned] = useState(banned)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenEditDetails, onOpen: onOpenEditDetails, onClose: onCloseEditDetails } = useDisclosure();
    const cancelRef = useRef()

    const authToken = useSelector((state) => state.auth.authToken)

    const profilePicture = `${import.meta.env.VITE_BACKEND_URL}/cdn/getProfilePicture?userID=${userID}`

    const handleDeleteUser = async () => {
        onClose();
        try {
            const response = await server.delete(`/identity/myAccount/deleteAccount?targetUserID=${userID}&userType=${userType}`)
            dispatch(reloadAuthToken(authToken))
            if (response.status === 200) {
                fetchAllUsers()
                showToast("Success", "User deleted successfully", 3000, true, "success")
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken))
            if (error.response && error.response.data && typeof error.response.data == "string") {
                console.log("Failed to delete user; response: " + error.response)
                if (error.response.data.startsWith("UERROR")) {
                    showToast(
                        "Uh-oh!",
                        error.response.data.substring("UERROR: ".length),
                        3500,
                        true,
                        "info"
                    )
                } else {
                    showToast(
                        "Something went wrong",
                        "Failed to delete user. Please try again",
                        3500,
                        true,
                        "error"
                    )
                }
            } else {
                console.log("Unknown error occurred when deleting user; error: " + error)
                showToast(
                    "Something went wrong",
                    "Failed to delete user. Please try again",
                    3500,
                    true,
                    "error"
                )
            }
        }
    };

    const handleToggleBanUser = async () => {
        try {
            const response = await server.post("/admin/userManagement/toggleBanUser", { userID });
            dispatch(reloadAuthToken(authToken));
            if (response.status === 200) {
                setIsBanned(response.data.banned); // Update local state
                fetchAllUsers();
                showToast("Success", `User ${response.data.banned ? "banned" : "un-banned"} successfully!`, 3000, true, "success");
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken));
            if (error.response && error.response.data && typeof error.response.data == "string") {
                console.log("Failed to ban/un-ban user; response: " + error.response);
                if (error.response.data.startsWith("UERROR")) {
                    showToast(
                        "Uh-oh!",
                        error.response.data.substring("UERROR: ".length),
                        3500,
                        true,
                        "info"
                    );
                } else {
                    showToast(
                        "Something went wrong",
                        "Failed to ban/un-ban user. Please try again",
                        3500,
                        true,
                        "error"
                    );
                }
            } else {
                console.log("Unknown error occurred when attempting to ban/un-ban user; error: " + error);
                showToast(
                    "Something went wrong",
                    "Failed to ban/un-ban user. Please try again",
                    3500,
                    true,
                    "error"
                );
            }
        }
    };    

    const handleClickUsername = () => {
        if (userType === "Host") {
            navigate("/reviews", { state: { hostID: userID } });
        } else if (userType === "Guest") {
            navigate(`/guestInfo?userID=${userID}`)
        }
    }

    const toggleOpenEditDetails = () => {
        onOpenEditDetails()
    }

	return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <HStack display="flex" justifyContent={"space-between"}>
                    <Box display="flex" alignItems="center" width={"40%"} ml={3}>
                        <Avatar src={profilePicture} />
                        <Box ml={3}>
                            <Link 
                                size='sm' 
                                minWidth={"290px"} 
                                maxWidth={"290px"} 
                                overflow={"hidden"} 
                                textOverflow={"ellipsis"} 
                                whiteSpace={'nowrap'} 
                                textAlign={"left"} 
                                onClick={handleClickUsername}
                            >
                                {username}
                            </Link>
                        </Box>
                        {isBanned && (
                            <ScaleFade in>
                                <Badge colorScheme={'red'} ml={"15px"} variant={'solid'} px={3} py={1}>BANNED</Badge>
                            </ScaleFade>
                        )}
                    </Box>

                    <Box width={"37%"}>
                        <Text size='sm' minWidth={"290px"} maxWidth={"290px"} overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={'nowrap'} textAlign={"left"}>
                            {email}
                        </Text>
                    </Box>
                    
                    <Box width={"20%"}>
                        <Text size='sm' textAlign={"left"}>
                            {userType}
                        </Text>
                    </Box>
                    
                    <Box width="3%">
                        <Menu>
                            <MenuButton as={IconButton} icon={<BsThreeDotsVertical />} variant="ghost" cursor="pointer" aria-label="Options" />
                            <MenuList>
                                { !isBanned && <MenuItem onClick={toggleOpenEditDetails}>Edit Details</MenuItem>}
                                <MenuItem color={isBanned ? "green" : "red"} onClick={handleToggleBanUser}>{isBanned ? "Un-ban" : "Ban"} user</MenuItem>
                                <MenuItem color="red" onClick={onOpen}>Delete user</MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                </HStack>
            </motion.div>

            <ManageUserDetails 
                isOpen={isOpenEditDetails} 
                onClose={onCloseEditDetails}
                username={username}
                fname={fname}
                lname={lname}
                email={email}
                contactNum={contactNum} 
                userType={userType}
                fetchAllUsers={fetchAllUsers}
                userID={userID}
            />

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete {username}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <Text>
                            Are you sure? You can't undo this action afterwards.
                        </Text>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button colorScheme='red' onClick={handleDeleteUser} ml={3}>
                        Delete
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}

export default UserManagementCard;