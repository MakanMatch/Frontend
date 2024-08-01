import { Avatar, Box, HStack, Text, Link } from '@chakra-ui/react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

function HostHygieneManagementCard({ username, email, hygieneGrade, hostID }) {

    const navigate = useNavigate();

    const handleClickUsername = () => {
        navigate("/reviews", { state: { hostID: hostID } });
    }

    const profilePicture = `${import.meta.env.VITE_BACKEND_URL}/cdn/getProfilePicture?userID=${hostID}`;

	return (
        <HStack display="flex" justifyContent={"space-between"}>
            <Box display="flex" alignItems="center" width={"40%"} ml={3}>
                <Avatar src={profilePicture}/>
                    <Box ml={3}>
                        <Link cursor={"pointer"} size='sm' minWidth={"290px"} maxWidth={"290px"} overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={'nowrap'} textAlign={"left"} onClick={handleClickUsername} fontFamily={"sora"}>
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
                <Text size='sm' textAlign={"left"} color="red">
                    {hygieneGrade} ⭐️
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

export default HostHygieneManagementCard;