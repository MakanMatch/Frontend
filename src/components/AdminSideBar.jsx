/* eslint-disable react/prop-types */
import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, 
    Image, Text, Icon, Box, useToast 
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from '../assets/Logo.png'
import configureShowToast from "../components/showToast"
import { BsPeople } from 'react-icons/bs';
import { BiSolidReport } from 'react-icons/bi';


function AdminSidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { user, authToken } = useSelector(state => state.auth)

    const toast = useToast();

    const DrawerHover = {
        _hover: {
          bg: "#E4EBF8"
        },
        borderRadius: "20px",
    };

    const handleMyAccountClick = () => {
        if (authToken) {
            navigate('/admin/myAccount');
        } else {
            navigate('/auth/login');
        }
        onClose()
    };

    const handleNavigationClick = (path) => {
        navigate(path);
        onClose()
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
                        <Button color={"#515F7C"} mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={() => handleNavigationClick("/admin")}>
                            <Icon viewBox="0 0 24 24" boxSize={6}><path fill="#515F7C" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></Icon>
                            <Text ml={2}>Home</Text>
                        </Button>

                        <Button color="#515F7C" ml={1} mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={() => handleNavigationClick('/admin/userManagement')}>
                            <BsPeople ml={1}/>
                            <Text ml={3}>User Management</Text>
                        </Button>

                        <Button color="#515F7C" ml={1} mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={() => handleNavigationClick("/admin/hygieneReports")}>
                            <BiSolidReport ml={1}/>
                            <Text ml={3}>Hygiene Reports</Text>
                        </Button>

                        <Button color="#515F7C" mb={2} justifyContent={"left"} colorScheme='white' sx={DrawerHover} onClick={handleMyAccountClick}>
                        <Icon viewBox="0 0 24 24" boxSize={6}><path fill="#515F7C" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></Icon>
                            <Text ml={2}>My Account</Text>
                        </Button>
                        
                        <Box position="absolute" bottom="0" textAlign="center" ml={14} mb={2}>
                            <Text color={"#515F7C"}>©2024 MakanMatch</Text>
                        </Box>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default AdminSidebar;