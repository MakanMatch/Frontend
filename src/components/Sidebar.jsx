/* eslint-disable react/prop-types */
import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Image, Text, Icon, Box, useDisclosure, useToast, DrawerFooter } from '@chakra-ui/react'
import { CalendarIcon, ChatIcon } from '@chakra-ui/icons'
import { BsQuestionCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from '../assets/Logo.png'
import AddListingModal from './listings/AddListingModal';
import configureShowToast from "../components/showToast"
import { FaRegClipboard } from 'react-icons/fa';


function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { user, authToken } = useSelector(state => state.auth)

    const toast = useToast();
    const showToast = configureShowToast(toast)
    const { isOpen: isAddListingModalOpen, onOpen: onAddListingModalOpen, onClose: onAddListingModalClose } = useDisclosure();

    const DrawerHover = {
        _hover: {
          bg: "#E4EBF8"
        },
        borderRadius: "20px",
    };

    const handleMyAccountClick = () => {
        if (authToken) {
            navigate('/identity/myAccount');
        } else {
            navigate('/auth/login');
        }
        onClose()
    };

    const handleNavigationClick = (path) => {
        navigate(path);
        onClose()
    }

    function handleClickAddListing() {
        onClose();
        if (!authToken || !user) {
            navigate('/auth/login');
            setTimeout(() => {
                showToast("You're not logged in", "Please login first", "info", 3000, true);
            }, 200);
        } else {
            onAddListingModalOpen();
        }
    }
  
    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <Flex justifyContent="center" alignItems="center" height="100px">
                            <Image src={Logo} height="100px" maxWidth="100px" />
                        </Flex>
                    </DrawerHeader>

                    <DrawerBody display={"flex"} flexDirection={"column"}>
                        <Button color={"#515F7C"} mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={() => handleNavigationClick("/")}>
                            <Icon viewBox="0 0 24 24" boxSize={6}><path fill="#515F7C" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></Icon>
                            <Text ml={2}>Home</Text>
                        </Button>

                        <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={() => handleNavigationClick("/reservations/upcoming")}>
                            <CalendarIcon ml={1}/>
                            <Text ml={3}>Upcoming Reservations</Text>
                        </Button>

                        {user && user.userType === "Host" && (
                            <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={() => handleNavigationClick("/myListings")}>
                                <Box ml={0.5}>
                                    <FaRegClipboard fontSize={"20px"}/>
                                </Box>
                                <Text ml={2.5}>My Listings</Text>
                            </Button>
                        )}

                        <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={handleMyAccountClick}>
                        <Icon viewBox="0 0 24 24" boxSize={6}><path fill="#515F7C" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></Icon>
                            <Text ml={2}>My Account</Text>
                        </Button>

                        <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={() => handleNavigationClick("/chat")}>
                            <ChatIcon ml={1}/>
                            <Text ml={3}>Chats</Text>
                        </Button>

                        <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={() => handleNavigationClick("/customerSupport")}>
                            <Text as={BsQuestionCircle} fontSize="20px" color="#515F7C" ml={0.5} />
                            <Text ml={3}>Customer Support</Text>
                        </Button>
                        
                        <Box position="absolute" bottom="0" textAlign="center" ml={14} mb={2}>
                            <Text color={"#515F7C"}>©2024 MakanMatch</Text>
                        </Box>
                    </DrawerBody>
                    <DrawerFooter display="flex" justifyContent="center">
                        {user && user.userType === "Host" && (
                            <Box mb={4}>
                                <Button onClick={handleClickAddListing} variant="MMPrimary" mb={4}>
                                    Host a meal
                                </Button>
                            </Box>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <AddListingModal
                isOpen={isAddListingModalOpen}
                onClose={onAddListingModalClose}
                onOpen={onAddListingModalOpen}
                closeSidebar={onClose}
            />
        </>
    )
}

export default Sidebar