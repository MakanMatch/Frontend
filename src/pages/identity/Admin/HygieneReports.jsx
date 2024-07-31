import { useToast, Heading, Card, CardHeader, CardBody, Stack, StackDivider, HStack, Box, Text } from "@chakra-ui/react";
import HostManagementCard from "../../../components/identity/HostHygieneManagementCard";
import server from ".././../../networking"
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import configureShowToast from '../../../components/showToast';

function HygieneReports() {
    const [hosts, setHosts] = useState([])
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const { user, authToken, loaded } = useSelector((state) => state.auth);

    const fetchAllHosts = async () => {
        try {
            const response = await server.get('/cdn/fetchAllUsers?fetchHostsOnly=true');
            if (response.status === 200) {
                setHosts(response.data);
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching hosts:', error);
            showToast("Unable to retrieve hosts", "Please try again later", 3000, true, "error")
        }
    };

    useEffect(() => {
        if (loaded == true) {
            fetchAllHosts();
        }
    }, [loaded]);

    return (
        <>
            <Heading size='lg' textAlign={"center"} mt={10} mb={5}>Hygiene Reports</Heading>
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
                                Hygiene Rating
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
                        {hosts ? hosts.map((host) => (
                            <HostManagementCard
                                key={host.userID}
                                username={host.username}
                                email={host.email}
                                hygieneGrade={host.hygieneGrade}
                                hostID={host.userID}
                            />
                        )) : (
                            <Text>No hosts found.</Text>
                        )}
                    </Stack>
                </CardBody>
            </Card>
        </>
    )
}

export default HygieneReports