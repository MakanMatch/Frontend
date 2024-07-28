import { Avatar, Box, HStack, Heading, Text } from '@chakra-ui/react'
import { BsThreeDotsVertical } from 'react-icons/bs';

function UserManagementCard({ username, email, userType }) {
	return (
        <HStack display="flex" justifyContent={"space-between"}>
            <Box display="flex" alignItems="center" width={"40%"} ml={3}>
                <Avatar />
                <Box ml={3}>
                    <Heading size='sm' minWidth={"290px"} maxWidth={"290px"} overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={'nowrap'} textAlign={"left"}>
                        {username}
                    </Heading>
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
            
            <Box width={"3%"}>
                <Text size='sm'>
                    <BsThreeDotsVertical />
                </Text>
            </Box>
            
        </HStack>
    );
}

export default UserManagementCard