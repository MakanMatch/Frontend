import { Avatar, Box, HStack, Text, Menu, MenuButton, MenuItem, MenuList, IconButton, useToast } from '@chakra-ui/react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import configureShowToast from '../../components/showToast';
import server from "../../networking";

function UserManagementCard({ username, email, userType, userID }) {
    const toast = useToast()
    const showToast = configureShowToast(toast)

    const profilePicture = `${import.meta.env.VITE_BACKEND_URL}/cdn/getProfilePicture?userID=${userID}`
    
    const handleDeleteUser = async () => {
        try {
            const response = await server.delete(`/identity/myAccount/deleteAccount?adminPrivilege=true&targetUserID=${userID}&userType=${userType}`)
            // const response = await server.delete('/identity/myAccount/deleteAccount')
            if (response.status === 200) {
                window.location.reload()
                showToast("Success", "User deleted successfully", 3000, true, "success")
            }
        } catch (error) {
            console.error(error)
            showToast("Error", "An error occurred while deleting the user", 3000, true, "error")
        }
    };

    const handleBanUser = () => {
        console.log("Ban user");
    }

	return (
        <HStack display="flex" justifyContent={"space-between"}>
            <Box display="flex" alignItems="center" width={"40%"} ml={3}>
                <Avatar src={profilePicture}/>
				<Box ml={3}>
					<Text size='sm' minWidth={"290px"} maxWidth={"290px"} overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={'nowrap'} textAlign={"left"}>
						{username}
					</Text>
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
                        <MenuItem color="red" onClick={handleBanUser}>Ban user</MenuItem>
                    </MenuList>
                </Menu>
            </Box>
            
        </HStack>
    );
}

export default UserManagementCard