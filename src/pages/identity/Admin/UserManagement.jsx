import { Heading, Card, CardHeader, CardBody, Stack, StackDivider, HStack, Box, Text, 
    useToast, Spinner, Button, ButtonGroup 
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { reloadAuthToken } from '../../../slices/AuthState';
import { motion } from 'framer-motion';
import UserManagementCard from "../../../components/identity/UserManagementCard";
import configureShowToast from '../../../components/showToast';
import server from ".././../../networking"

function UserManagement() {
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filter, setFilter] = useState("All");
    const dispatch = useDispatch();
    const toast = useToast();
    const showToast = configureShowToast(toast)
    const [usersLoaded, setUsersLoaded] = useState(false)
    const { user, authToken, loaded } = useSelector((state) => state.auth);
    const [userStats, setUserStats] = useState({ totalUsers: 0, hosts: 0, guests: 0, bannedUsers: 0 });

    const fetchAllUsers = async () => {
        try {
            const response = await server.get('/cdn/fetchAllUsers')
            dispatch(reloadAuthToken(authToken))
            if (response.status === 200) {
                setUsers(response.data)
                calculateUserStats(response.data);
                setUsersLoaded(true)
            }
        }
        catch (error) {
            dispatch(reloadAuthToken(authToken))
            console.log("Error: ", error)
            if (error.response && error.response.data && typeof error.response.data == "string") {
                console.log("Failed to fetch users; response: " + error.response.data)
                if (error.response.data.startsWith("UERROR")) {
                    showToast(
                        "Uh-oh!",
                        error.response.data.substring("UERROR: ".length),
                        3500,
                        true,
                        "info",
                    )
                } else {
                    showToast(
                        "Something went wrong",
                        "Failed to fetch users. Please try again",
                        3500,
                        true,
                        "error",
                    )
                }
            } else {
                console.log("Unknown error occurred when fetching users; error: " + error)
                showToast(
                    "Something went wrong",
                    "Failed to fetch users. Please try again",
                    3500,
                    true,
                    "error",
                )
            }
        }
    }

    useEffect(() => {
        if (loaded == true) {
            fetchAllUsers()
        }
    }, [loaded])

    useEffect(() => {
        filterUsers();
    }, [filter, users]);

    const calculateUserStats = (users) => {
        const totalUsers = users.length;
        const hosts = users.filter(user => user.userType === 'Host').length;
        const guests = users.filter(user => user.userType === 'Guest').length;
        const bannedUsers = users.filter(user => user.banned).length;
        setUserStats({ totalUsers, hosts, guests, bannedUsers });
    };

    const filterUsers = () => {
        if (filter === "All") {
            setFilteredUsers(users);
        } else if (filter === "Hosts") {
            setFilteredUsers(users.filter(user => user.userType === 'Host'));
        } else if (filter === "Guests") {
            setFilteredUsers(users.filter(user => user.userType === 'Guest'));
        } else if (filter === "Banned") {
            setFilteredUsers(users.filter(user => user.banned));
        }
    };
    
    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Heading size='lg' textAlign={"center"} mt={10} mb={6}>User Management</Heading>
            </motion.div>

            <ButtonGroup mb={4} display="flex" justifyContent="center" spacing={6}>
                <Button 
                    fontSize={"15px"} 
                    padding={"0 7 0 7"} 
                    borderRadius={25} 
                    onClick={() => setFilter("All")} 
                    variant={filter === "All" ? "MMPrimary" : null}
                >
                    All: {userStats.totalUsers}
                </Button>
                <Button 
                    fontSize={"15px"} 
                    padding={"0 7 0 7"} 
                    borderRadius={25} 
                    onClick={() => setFilter("Hosts")} 
                    variant={filter === "Hosts" ? "MMPrimary" : null} 
                >
                    Hosts: {userStats.hosts}
                </Button>
                <Button 
                    fontSize={"15px"} 
                    padding={"0 7 0 7"} 
                    borderRadius={25} 
                    onClick={() => setFilter("Guests")} 
                    variant={filter === "Guests" ? "MMPrimary" : null}
                >
                    Guests: {userStats.guests}
                </Button>
                <Button 
                    fontSize={"15px"} 
                    padding={"0 7 0 7"} 
                    borderRadius={25} 
                    onClick={() => setFilter("Banned")} 
                    variant={filter === "Banned" ? "MMPrimary" : null}
                >
                    Banned: {userStats.bannedUsers}
                </Button>
            </ButtonGroup>

            {usersLoaded ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card p={2}>
                        <CardHeader>
                            <HStack>
                                <Box display="flex" alignItems="center" width={"40%"} ml={3}>
                                    <Box ml={3}>
                                        <Heading size='sm' minWidth={"290px"} maxWidth={"290px"} overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={'nowrap'} textAlign={"left"} ml={-3}>
                                            User
                                        </Heading>
                                    </Box>
                                </Box>

                                <Box width={"37%"}>
                                    <Heading size='sm' minWidth={"290px"} maxWidth={"290px"} overflow={"hidden"} textOverflow={"ellipsis"} whiteSpace={'nowrap'} textAlign={"left"}>
                                        Email
                                    </Heading>
                                </Box>
                                
                                <Box width={"20%"}>
                                    <Heading size='sm' textAlign={"left"}>
                                        Role
                                    </Heading>
                                </Box>
                                
                                <Box width={"3%"}>
                                    <Text size='sm'>
                                    </Text>
                                </Box>
                            </HStack>
                        </CardHeader>
                        <CardBody>
                            <Stack divider={<StackDivider />} spacing='4'>
                            {filteredUsers && filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <UserManagementCard
                                            key={user.userID}
                                            fname={user.fname}
                                            lname={user.lname}
                                            username={user.username}
                                            email={user.email}
                                            userType={user.userType}
                                            contactNum={user.contactNum}
                                            userID={user.userID}
                                            banned={user.banned}
                                            fetchAllUsers={fetchAllUsers}
                                        />
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <Text>No users found.</Text>
                                    </motion.div>
                                )}
                            </Stack>
                        </CardBody>
                    </Card>
                </motion.div>
            ) : (
                <Spinner size="lg" mt={10} />
            )}
        </>
    )
}

export default UserManagement