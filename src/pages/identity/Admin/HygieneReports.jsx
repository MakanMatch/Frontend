import { Heading, Card, CardHeader, CardBody, Stack, StackDivider, HStack, Box, Text } from "@chakra-ui/react";
import HostManagementCard from "../../../components/identity/HostManagementCard";
import server from ".././../../networking"
import { useState, useEffect } from "react";

function HygieneReports() {
    const [hosts, setHosts] = useState([])

    const fetchAllHosts = async () => {
        try {
            const response = await server.get('/cdn/fetchAllUsers?fetchHostsOnly=true');
            if (response.status === 200) {
                const hostsArray = Object.values(response.data);
                setHosts(hostsArray);
                return hostsArray;
            }
        } catch (error) {
            console.error('Error fetching hosts:', error);
        }
        return [];
    };

    const getAllProfilePictures = async (hostsArray) => {
        try {
            const hostsWithPictures = await Promise.all(
                hostsArray.map(async (host) => {
                    host.profilePicture = `${import.meta.env.VITE_BACKEND_URL}/cdn/getProfilePicture?userID=${host.userID}`
                    return host;
                })
            );
            setHosts(hostsWithPictures);
        } catch (error) {
            console.error('Error fetching profile pictures:', error);
        }
    };

    useEffect(() => {
        fetchAllHosts().then((hostsArray) => {
            if (hostsArray && hostsArray.length > 0) {
                getAllProfilePictures(hostsArray);
            }
        });
    }, []);

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
                    {hosts.length > 0 ? (
                        hosts
                            .filter((host) => host.hygieneGrade > 0 && host.hygieneGrade <= 2.5)
                            .map((host) => (
                                <HostManagementCard
                                    key={host.userID}
                                    username={host.username}
                                    email={host.email}
                                    hygieneGrade={host.hygieneGrade}
                                    hostID={host.userID}
                                    profilePicture={host.profilePicture}
                                />
                            ))
                    ) : (
                        <Text>No hosts flagged.</Text>
                    )}
                    </Stack>
                </CardBody>
            </Card>
        </>
    )
}

export default HygieneReports