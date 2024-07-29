import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Text, Flex, Heading, useToast, Spinner, Avatar, FormControl, FormLabel, 
    Editable, EditablePreview, EditableInput, Button, Stack, useDisclosure,
    Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, IconButton, Input, ButtonGroup, useMediaQuery
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { FocusLock } from "@chakra-ui/react";
import configureShowToast from '../../../components/showToast';
import server from "../../../networking";
import { reloadAuthToken } from "../../../slices/AuthState";

function AdminAccount() {
    const navigate = useNavigate();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const dispatch = useDispatch();
    const { user, authToken, loaded } = useSelector((state) => state.auth);
    const [profilePicture, setProfilePicture] = useState(null);
    const [accountLoaded, setAccountLoaded] = useState(false);
    const [accountInfo, setAccountInfo] = useState({});
    const [originalAccountInfo, setOriginalAccountInfo] = useState(null);
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isDiscardOpen, onOpen: onDiscardOpen, onClose: onDiscardClose } = useDisclosure();

    const [isSmallerThan560] = useMediaQuery("(max-width: 560px)"); // for linkedin card design (optional)

    useEffect(() => {
        console.log("ran")
        if (loaded == true) {
            console.log("passed")
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
                    navigate('/admin');
                }
            };

            if (user && user.userID) {
                fetchAccountInfo();
            } else {
                // if (!passwordChangeInProgress && !deleteInProgress) {
                //     showToast("Redirecting to login", "Please log in first.", 3000, true, "error");
                //     navigate('/auth/login');
                // }
            }
        }
    }, [loaded, user]);

    if (!loaded || !user) {
        return <Spinner />
    }

    const TextInput = React.forwardRef((props, ref) => {
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

    const PopoverForm = () => {
        const { onOpen, onClose, isOpen } = useDisclosure();
        const firstFieldRef = React.useRef(null);
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

    return (
        <>
            <Box justifyContent={'center'} display={'flex'}>
                <Box 
                    backgroundImage={'/src/assets/AdminBanner.jpg'}
                    width="65vw"
                    height="20vh"
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
                        bottom="-50px"
                        left={isSmallerThan560 ? "50%" : "16%"}
                        transform="translateX(-50%)"
                        zIndex={1}
                        cursor={"pointer"}
                        overflow="visible"
                    >
                        <Avatar
                            size="xl"
                            position="relative"
                            bg="white"
                            border="4px solid white"
                            // onClick={(toggleEditPicture)}
                            icon={<Avatar size='xl'/>}
                        />
                    </Box>
                </Box>
            </Box>

            <PopoverForm />

            <Box justifyContent={'center'} display={'flex'}>
                <Stack direction={["column", "row"]} p={4} spacing={"20px"} width={"65vw"}>
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

                                <Button width="15%">Edit</Button>

                                {/* <ChangeAddress isOpen={isChangeAddressModalOpen} onClose={handleChangeAddressCloseModal} accountInfo={accountInfo} setAccountInfo={setAccountInfo} setOriginalAccountInfo={setOriginalAccountInfo}/> */}
                            </Flex>
                        </FormControl>

                        <Box display="flex" justifyContent={"left"}>
                            <Button variant={"MMPrimary"} mt={6}>
                                Change Password
                            </Button>
                        </Box>

                        {/* <ChangePassword isOpen={isPasswordModalOpen} onClose={handlePasswordCloseModal} onSubmit={handleChangePassword} /> */}

                    </Box>

                    <Box width={"30%"} display="flex" justifyContent={"right"} mr={-4}>
                        {/* <Flex justifyContent={"flex-end"} flexDirection={"column"}> */}
                            {/* {hasChanges() && (
                                <>
                                    <Button p={6} variant={"MMPrimary"} width="full" mb={5}>
                                        Save Changes
                                    </Button>

                                    <Button p={6} colorScheme="red" borderRadius={10} width="full" mb={4}>
                                        Cancel
                                    </Button>
                                </>
                            )} */}

                            <Button colorScheme="red" borderRadius={10} position="absolute" bottom={"7.5%"}>
                                Delete Account
                            </Button>
                        {/* </Flex> */}
                    </Box>
                </Stack>
            </Box>
        </>
        
    )
}


export default AdminAccount;