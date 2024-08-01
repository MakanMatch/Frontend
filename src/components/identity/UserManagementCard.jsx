import { Avatar, Box, HStack, Text, Menu, MenuButton, MenuItem, MenuList, IconButton, useToast, Link, Spinner } from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import configureShowToast from '../../components/showToast';
import server from "../../networking";

function UserManagementCard({ username, email, userType, userID }) {
    const toast = useToast()
    const showToast = configureShowToast(toast)
    const navigate = useNavigate()
    const [banned, setBanned] = useState(false)
    const [banLoaded, setBanLoaded] = useState(false)

    const profilePicture = `${import.meta.env.VITE_BACKEND_URL}/cdn/getProfilePicture?userID=${userID}`

    const handleDeleteUser = async () => {
        try {
            const response = await server.delete(`/identity/myAccount/deleteAccount?adminPrivilege=true&targetUserID=${userID}&userType=${userType}`)
            if (response.status === 200) {
                window.location.reload()
                showToast("Success", "User deleted successfully", 3000, true, "success")
            }
        } catch (error) {
            console.error(error)
            showToast("Error", "An error occurred while deleting the user", 3000, true, "error")
        }
    };

    const handleToggleBanUser = async () => {
        try {
            const response = await server.post("/admin/userManagement/banUser", { userID })
            if (response.status === 200) {
                setBanned(response.data.banned)
                showToast("Success", `User ${response.data.banned === true ? "banned" : "un-banned"} successfully!`, 3000, true, "success")
            }
        } catch (error) {
            console.error(error)
            showToast("Error", "An error occurred while banning the user", 3000, true, "error")
        }
    }

    const fetchBanState = async () => {
        try {
            const response = await server.get(`/admin/userManagement/fetchBanState?userID=${userID}`)
            if (response.status === 200) {
                setBanned(response.data.banned)
                setBanLoaded(true)
            }
        } catch (error) {
            console.error(error)
            showToast("Error", "An error occurred fetching user data", 3000, true, "error")
        }
    }

    const handleClickUsername = () => {
        if (userType === "Host") {
            navigate("/reviews", { state: { hostID: userID } });
        } else if (userType === "Guest") {
            navigate(`/guestInfo?userID=${userID}`)
        }
    }

    useEffect(() => {
        fetchBanState()
    }, [userID])

	return (
        <HStack display="flex" justifyContent={"space-between"} color={banned === true ? "red" : "black"}>
            <Box display="flex" alignItems="center" width={"40%"} ml={3}>
                <Avatar src={profilePicture}/>
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
                        <MenuItem color="red" onClick={handleDeleteUser}>Delete user</MenuItem>
                        <MenuItem color={banned === true ? "green" : "red"} onClick={handleToggleBanUser}>{banned === false ? "Ban" : "Un-ban"} user</MenuItem>
                    </MenuList>
                </Menu>
            </Box>
            
        </HStack>
    );
}

export default UserManagementCard;