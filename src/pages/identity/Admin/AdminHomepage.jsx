/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Heading, Text, Box, Stack, Card, CardBody, Divider, CardFooter, ButtonGroup, Button, useToast, Spinner, SimpleGrid, useDisclosure, Modal, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, ModalContent, VStack, TableContainer, Table, Td, Th, TableCaption, Tr, Tbody, Thead } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { reloadAuthToken } from "../../../slices/AuthState";
import configureShowToast from "../../../components/showToast";
import server from ".././../../networking";

function AdminHomepage() {
    const navigate = useNavigate();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const { user, authToken, loaded } = useSelector((state) => state.auth);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();

    const [systemMetrics, setSystemMetrics] = useState({});
    const [analyticsAvailable, setAnalyticsAvailable] = useState(false);

    const processMetricsData = (data) => {
        var newData = structuredClone(data);

        if (newData.systemAnalytics) {
            if (newData.systemAnalytics.lastBoot) {
                newData.systemAnalytics.lastBoot = new Date(
                    newData.systemAnalytics.lastBoot
                ).toLocaleString("en-US", {
                    dateStyle: "long",
                    timeStyle: "short",
                });
            }
        }

        return newData;
    };

    const fetchMetrics = async () => {
        // This is a silent request. If it's successful, and only when it is, the system analytics dashboard section will be rendered. Other scenarios will only be logged to the console.

        server
            .get("/admin/getMetrics")
            .then((res) => {
                dispatch(reloadAuthToken(authToken));
                if (res.status == 200) {
                    setSystemMetrics(processMetricsData(res.data));
                    setAnalyticsAvailable(true);
                } else {
                    console.log(
                        "Non-200 status code response received in obtaining system metrics; response: ",
                        res.data
                    );
                }
            })
            .catch((err) => {
                dispatch(reloadAuthToken(authToken));
                setAnalyticsAvailable(false);
                if (
                    err.response &&
                    err.response.data &&
                    typeof err.response.data == "string"
                ) {
                    if (
                        err.response.data ==
                        "ERROR: Analytics are not available at this time."
                    ) {
                        console.log(
                            "System analytics are not available currently."
                        );
                    } else if (err.response.data.startsWith("UERROR")) {
                        console.log(
                            "User error occurred in retrieving system metrics; error: ",
                            err.response.data
                        );
                        showToast(
                            "Something went wrong",
                            err.response.data.substring("UERROR: ".length)
                        );
                    } else {
                        console.log(
                            "Error occurred in retrieving system analytics; error: ",
                            err.response.data
                        );
                    }
                } else {
                    console.log(
                        "Error in retrieving system analytics; error: ",
                        err
                    );
                }
            });
    };

    useEffect(() => {
        if (loaded == true) {
            if (!user) {
                navigate("/auth/login");
                showToast("Please login first.", "");
                return;
            }

            fetchMetrics();
        }
    }, [loaded, user]);

    if (!loaded || !user) {
        return <Spinner size="lg" mt={10} />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Heading mt={10} mb={5}>
                Hi, {user.username}!
            </Heading>
            <Text size={"md"} mb={5}>
                Welcome Back to MakanMatch!
            </Text>
            <Box display="flex" justifyContent="space-between">
                <Card width="32%">
                    <CardBody>
                        <Stack mt="6" spacing="3">
                            <Heading size="md" textAlign={"left"} mt={-5}>
                                User Management
                            </Heading>
                            <Text textAlign={"left"} mt={5}>
                                View and manage all registered MakanMatch users.
                            </Text>
                        </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        <ButtonGroup spacing="2">
                            <Button
                                variant={"MMPrimary"}
                                colorScheme="blue"
                                onClick={() =>
                                    navigate("/admin/userManagement")
                                }
                            >
                                View More
                            </Button>
                        </ButtonGroup>
                    </CardFooter>
                </Card>

                <Card width="32%">
                    <CardBody>
                        <Stack mt="6" spacing="3">
                            <Heading size="md" textAlign={"left"} mt={-5}>
                                Hygiene Reports
                            </Heading>
                            <Text textAlign={"left"} mt={5}>
                                View hosts with poor hygiene rating and issue warnings accordingly.
                            </Text>
                        </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        <ButtonGroup spacing="2">
                            <Button
                                variant={"MMPrimary"}
                                colorScheme="blue"
                                onClick={() =>
                                    navigate("/admin/hygieneReports")
                                }
                            >
                                View More
                            </Button>
                        </ButtonGroup>
                    </CardFooter>
                </Card>

                <Card width="32%">
                    <CardBody>
                        <Stack mt="6" spacing="3">
                            <Heading size="md" textAlign={"left"} mt={-5}>
                                My Account
                            </Heading>
                            <Text textAlign={"left"} mt={5}>
                                View and manage your admin account.
                            </Text>
                        </Stack>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        <ButtonGroup spacing="2">
                            <Button
                                variant={"MMPrimary"}
                                colorScheme="blue"
                                onClick={() => navigate("/admin/myAccount")}
                            >
                                View More
                            </Button>
                        </ButtonGroup>
                    </CardFooter>
                </Card>
            </Box>
            {analyticsAvailable && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card p={5} mt={10}>
                        <VStack alignItems={"center"} mb={"30px"}>
                            <Heading fontSize={"25px"} textAlign={"center"} mt={-5} p={3}>System Dashboard</Heading>
                            <Button variant={"MMPrimary"} onClick={onOpen} maxW={"200px"}>View Requests</Button>
                        </VStack>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }}>
                            <Box textAlign="center" mb={10}>
                                <Text fontSize="md" fontWeight="bold">Last Boot</Text>
                                <Text mt={"10px"}fontSize="lg" color={"#1B3D88"}>{systemMetrics.systemAnalytics.lastBoot}</Text>
                            </Box>

                            <Box textAlign="center" mb={10}>
                                <Text fontSize="md" fontWeight="bold">Account Creations</Text>
                                <Text mt={"10px"} fontSize="lg" color={"#1B3D88"}>{systemMetrics.systemAnalytics.accountCreations}</Text>
                            </Box>

                            <Box textAlign="center" mb={10}>
                                <Text fontSize="md" fontWeight="bold">Listing Creations</Text>
                                <Text mt={"10px"} fontSize="lg" color={"#1B3D88"}>{systemMetrics.systemAnalytics.listingCreations}</Text>
                            </Box>

                            <Box textAlign="center" mb={10}>
                                <Text fontSize="md" fontWeight="bold">Email Dispatches</Text>
                                <Text mt={"10px"} fontSize="lg" color={"#1B3D88"}>{systemMetrics.systemAnalytics.emailDispatches}</Text>
                            </Box>

                            <Box textAlign="center" mb={10}>
                                <Text fontSize="md" fontWeight="bold">File Uploads</Text>
                                <Text mt={"10px"} fontSize="lg" color={"#1B3D88"}>{systemMetrics.systemAnalytics.fileUploads}</Text>
                            </Box>

                            <Box textAlign="center" mb={10}>
                                <Text fontSize="md" fontWeight="bold">Logins</Text>
                                <Text mt={"10px"} fontSize="lg" color={"#1B3D88"}>{systemMetrics.systemAnalytics.logins}</Text>
                            </Box>
                        </SimpleGrid>
                    </Card>
                    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} size="xl">
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Request Analytics</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                {(!systemMetrics.requestAnalytics || systemMetrics.requestAnalytics.length <= 0) && (
                                    <Text>No requests data to show yet.</Text>
                                )}
                                {systemMetrics.requestAnalytics && systemMetrics.requestAnalytics.length > 0 && (
                                    <TableContainer>
                                        <Table variant='simple'>
                                            <TableCaption>Breakdown of requests analysed over time</TableCaption>
                                            <Thead>
                                                <Tr>
                                                    <Th>URL</Th>
                                                    <Th>Method</Th>
                                                    <Th isNumeric>Requests Count</Th>
                                                    <Th isNumeric>Success Responses</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {systemMetrics.requestAnalytics.map(request => (
                                                    <Tr key={request.requestURL + request.method}>
                                                        <Td>{request.requestURL}</Td>
                                                        <Td>{request.method}</Td>
                                                        <Td>{request.requestsCount}</Td>
                                                        <Td>{request.successResponses}</Td>
                                                    </Tr>
                                                ))}
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='blue' mr={3} onClick={onClose}>Close</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </motion.div>
            )}
        </motion.div>
    );
}

export default AdminHomepage;
