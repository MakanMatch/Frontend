import { Avatar, Box, HStack, Text, Link, Menu, MenuButton, MenuList, MenuItem, IconButton, useToast } from '@chakra-ui/react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reloadAuthToken } from '../../slices/AuthState';
import configureShowToast from '../../components/showToast';
import server from "../../networking";

function HostHygieneManagementCard({ username, email, hygieneGrade, hostID }) {
    const profilePicture = `${import.meta.env.VITE_BACKEND_URL}/cdn/getProfilePicture?userID=${hostID}`;

    const toast = useToast();
    const dispatch = useDispatch();
    const showToast = configureShowToast(toast);
    const navigate = useNavigate();

    const { user, authToken, loaded } = useSelector((state) => state.auth);

    const handleClickUsername = () => {
        navigate("/reviews", { state: { hostID: hostID } });
    }

    const handleIssueWarning = async() => {
        try {
            const response = await server.post("/admin/hygieneReports/issueWarning", { hostID });
            dispatch(reloadAuthToken(authToken))              
            if (response.status === 200) {
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
                <Menu>
                    <MenuButton as={IconButton} icon={<BsThreeDotsVertical />} variant="ghost" cursor="pointer" aria-label="Options" />
                    <MenuList>
                        <MenuItem color="red" onClick={handleIssueWarning}>Issue warning</MenuItem>
                    </MenuList>
                </Menu>
            </Box>
            
        </HStack>
    );
}

export default HostHygieneManagementCard;