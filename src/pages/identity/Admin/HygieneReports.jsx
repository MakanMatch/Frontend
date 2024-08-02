import { useToast, Heading, Card, CardHeader, CardBody, Stack, StackDivider, HStack, Box, Text, Center, Fade, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reloadAuthToken } from "../../../slices/AuthState";
import { motion } from "framer-motion";
import HostManagementCard from "../../../components/identity/HostHygieneManagementCard";
import configureShowToast from '../../../components/showToast';
import server from ".././../../networking";

function HygieneReports() {
    const [hosts, setHosts] = useState([])
    const [hostsLoaded, setHostsLoaded] = useState(false)
    const toast = useToast();
    const dispatch = useDispatch();
    const showToast = configureShowToast(toast);
    const { user, authToken, loaded } = useSelector((state) => state.auth);

    const fetchAllHosts = async () => {
        try {
            const response = await server.get('/cdn/fetchAllUsers?fetchHostsOnly=true');
            dispatch(reloadAuthToken(authToken))              
            if (response.status === 200) {
                setHosts(response.data);
                setHostsLoaded(true);
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken))              
            if (error.response && error.response.data && typeof error.response.data == "string") {
                console.log("Failed to fetch host data; response: " + error.response)
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
                        "Failed to fetch host data. Please try again",
                        3500,
                        true,
                        "error"
                    )
                }
            } else {
                console.log("Unknown error occurred when fetching host data; error: " + error)
                showToast(
                    "Something went wrong",
                    "Failed to fetch host data. Please try again",
                    3500,
                    true,
                    "error"
                )
            }
        }
    };

    useEffect(() => {
        if (loaded == true) {
            fetchAllHosts();
        }
    }, [loaded]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Heading size='lg' textAlign={"center"} mt={10} mb={5}>Hygiene Reports</Heading>
            </motion.div>
            {hostsLoaded === true ? (
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
                                hosts.map((host) => (
                                    <HostManagementCard
                                        key={host.userID}
                                        username={host.username}
                                        email={host.email}
                                        hygieneGrade={host.hygieneGrade}
                                        hostID={host.userID}
                                    />
                                ))
                            ) : (
                                <Text>No hosts found.</Text>
                            )}
                            </Stack>
                        </CardBody>
                    </Card>
                </motion.div>
            ) : (
                <Center height="100vh">
                    <Fade in={!loaded}>
                        <Spinner size="xl" />
                    </Fade>
                </Center>
            )}
        </>
    )
}

export default HygieneReports