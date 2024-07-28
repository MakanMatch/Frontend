import { Heading, Card, CardHeader, CardBody, Stack, StackDivider, HStack, Box, Text } from "@chakra-ui/react";
import UserManagementCard from "../../../components/identity/UserManagementCard";
import server from ".././../../networking"
import { useState, useEffect } from "react";

function UserManagement() {
    const [users, setUsers] = useState([])
    const fetchAllUsers = async () => {
        const response = await server.get('/cdn/fetchAllUsers')
        if (response.status === 200) {
            console.log(response.data)
            setUsers(response.data)
        }
    }

    useEffect(() => {
        fetchAllUsers()
        console.log("Ran")
    }, [])
    
    return (
        <>
            <Heading size='lg' textAlign={"center"} mt={10} mb={5}>User Management</Heading>
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
                    {users.length > 0 ? (
                        users.map((user) => (
                            <UserManagementCard
                                key={user.userID}
                                username={user.username}
                                email={user.email}
                                userType={user.userType}
                                userID={user.userID}
                            />
                        ))
                    ) : (
                        <Text>No users found.</Text>
                    )}
                    </Stack>
                </CardBody>
            </Card>
        </>
    )
}

export default UserManagement