import { Avatar, Box, HStack, Text, Link, Menu, MenuButton, MenuList, MenuItem, IconButton, useToast, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Button, ScaleFade, Badge } from '@chakra-ui/react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reloadAuthToken } from '../../slices/AuthState';
import configureShowToast from '../../components/showToast';
import server from "../../networking";

function HostHygieneManagementCard({ username, email, hygieneGrade, hostID, flaggedForHygiene, fetchAllHosts }) {
    const profilePicture = `${import.meta.env.VITE_BACKEND_URL}/cdn/getProfilePicture?userID=${hostID}`;

    const toast = useToast();
    const dispatch = useDispatch();
    const showToast = configureShowToast(toast);
    const navigate = useNavigate();

    const [warningReason, setWarningReason] = useState("");

    const { isOpen, onOpen, onClose } = useDisclosure();

    const { user, authToken, loaded } = useSelector((state) => state.auth);

    const handleClickUsername = () => {
        navigate("/reviews", { state: { hostID: hostID } });
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if (warningReason.trim() !== "") {
                handleIssueWarning();
            } else {
                showToast("Reason cannot be empty", "Please enter a reason for issuing a warning", 3500, true, "error");
            }
        }
    }

    const handleIssueWarning = async() => {
        const reason = warningReason;
        try {
            const response = await server.post("/admin/hygieneReports/issueWarning", { reason, hostID });
            dispatch(reloadAuthToken(authToken))              
            if (response.status === 200) {
                fetchAllHosts();
                onClose();
                showToast("Warning issued", `${username} has been issued a warning`, 3000, true, "success");
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken))
            if (error.response && error.response.data && typeof error.response.data == "string") {
                console.log("Failed to issue warning to host; response: " + error.response)
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
                        "Failed to issue warning to host. Please try again",
                        3500,
                        true,
                        "error"
                    )
                }
            } else {
                console.log("Unknown error occurred when issuing warning to host; error: " + error)
                showToast(
                    "Something went wrong",
                    "Failed to issue warning to host. Please try again",
                    3500,
                    true,
                    "error"
                )
            }
        }
    }

    const handleUnflagHost = async() => {
        try {
            const response = await server.post("/admin/hygieneReports/unflagHost", { hostID });
            dispatch(reloadAuthToken(authToken))
            if (response.status === 200) {
                fetchAllHosts();
                showToast("Host un-flagged successfully", `${username} has been un-flagged`, 3000, true, "success");
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken))
            if (error.response && error.response.data && typeof error.response.data == "string") {
                console.log("Failed to un-flag host; response: " + error.response)
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
                        "Failed to un-flag host. Please try again",
                        3500,
                        true,
                        "error"
                    )
                }
            } else {
                console.log("Unknown error occurred when un-flagging host; error: " + error)
                showToast(
                    "Something went wrong",
                    "Failed to un-flag host. Please try again",
                    3500,
                    true,
                    "error"
                )
            }
        }
    }

	return (
        <>
            <HStack display="flex" justifyContent={"space-between"}>
                <Box display="flex" alignItems="center" width={"40%"} ml={3}>
                    <Avatar src={profilePicture}/>
                    <Box ml={3}>
                        <Link
                            cursor="pointer"
                            size="sm"
                            minWidth="290px"
                            maxWidth="290px"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            textAlign="left"
                            onClick={handleClickUsername}
                            fontFamily="sora"
                        >
                            {username}
                        </Link>
                    </Box>
                    {flaggedForHygiene === true && (
                        <ScaleFade in>
                            <Badge colorScheme={'red'} ml={"15px"} variant={'solid'} px={3} py={1}>FLAGGED</Badge>
                        </ScaleFade>
                    )}
                </Box>

                <Box width={"37%"}>
                    <Text size='sm' minWidth={"290px"} maxWidth={"290px"} overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={'nowrap'} textAlign={"left"}>
                        {email}
                    </Text>
                </Box>
                
                <Box width={"20%"}>
                    <Text size='sm' textAlign={"left"} color="red">
                        {hygieneGrade} ⭐️
                    </Text>
                </Box>
                
                <Box width={"3%"}>
                    <Menu>
                        <MenuButton as={IconButton} icon={<BsThreeDotsVertical />} variant="ghost" cursor="pointer" aria-label="Options" />
                        <MenuList>
                            {flaggedForHygiene === false ? (
                                <MenuItem color="red" onClick={onOpen}>Issue warning</MenuItem>
                            ) : (
                                <MenuItem color="green" onClick={handleUnflagHost}>Un-flag</MenuItem>
                            )}
                        </MenuList>
                    </Menu>
                </Box>
            </HStack>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                scrollBehavior="inside"
                closeOnOverlayClick={false}
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Issue a warning to {username}</ModalHeader>
                <ModalBody>
                    <FormControl>
                        <FormLabel>Reason for issuing warning</FormLabel>
                        <Input type='text' onChange={(event) => setWarningReason(event.target.value)} onKeyDown={handleKeyDown} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant='MMPrimary' onClick={handleIssueWarning}>Submit</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default HostHygieneManagementCard;