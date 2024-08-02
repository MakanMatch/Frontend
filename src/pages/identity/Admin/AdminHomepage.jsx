import { Heading, Text, Grid, Box, Image, Stack, Card, CardBody, Divider, CardFooter, ButtonGroup, Button, useToast, Spinner, Center, Fade } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import configureShowToast from '../../../components/showToast';


function AdminHomepage() {
    const navigate = useNavigate();
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const { user, authToken, loaded } = useSelector((state) => state.auth);

    useEffect(() => {
        if (loaded == true) {
            if (!user) {
                navigate("/auth/login")
                showToast("Please login first.", "")
                return;
            }
        }
    }, [loaded, user])

    if (!loaded || !user) {
        return (
            <Center height="100vh">
                <Fade in={!loaded}>
                    <Spinner size="xl" />
                </Fade>
            </Center>
        )
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Heading mt={10} mb={5}>Hi, {user.username}!</Heading>
                <Text size={'md'} mb={5}>Welcome Back to MakanMatch!</Text>
                <Box display="flex" justifyContent="space-between">
                    <Card width="32%">
                        <CardBody>
                            <Stack mt='6' spacing='3'>
                                <Heading size='md' textAlign={"left"} mt={-5}>User Management</Heading>
                                <Text textAlign={"left"} mt={5}>
                                    View and manage all registered MakanMatch users.
                                </Text>
                            </Stack>
                        </CardBody>
                        <Divider />
                        <CardFooter>
                            <ButtonGroup spacing='2'>
                                <Button variant={"MMPrimary"} colorScheme='blue' onClick={() => navigate('/admin/userManagement')}>
                                    View More
                                </Button>
                            </ButtonGroup>
                        </CardFooter>
                    </Card>
                    
                    <Card width="32%">
                        <CardBody>
                            <Stack mt='6' spacing='3'>
                                <Heading size='md' textAlign={"left"} mt={-5}>Hygiene Reports</Heading>
                                <Text textAlign={"left"} mt={5}>
                                    View hosts with poor hygiene rating and issue warnings accordingly.
                                </Text>
                            </Stack>
                        </CardBody>
                        <Divider />
                        <CardFooter>
                            <ButtonGroup spacing='2'>
                                <Button variant={"MMPrimary"} colorScheme='blue' onClick={() => navigate('/admin/hygieneReports')}>
                                    View More
                                </Button>
                            </ButtonGroup>
                        </CardFooter>
                    </Card>
                    
                    <Card width="32%">
                        <CardBody>
                            <Stack mt='6' spacing='3'>
                                <Heading size='md' textAlign={"left"} mt={-5}>My Account</Heading>
                                <Text textAlign={"left"} mt={5}>
                                    View and manage your admin account.
                                </Text>
                            </Stack>
                        </CardBody>
                        <Divider />
                        <CardFooter>
                            <ButtonGroup spacing='2'>
                                <Button variant={"MMPrimary"} colorScheme='blue' onClick={() => navigate('/admin/myAccount')}>
                                    View More
                                </Button>
                            </ButtonGroup>
                        </CardFooter>
                    </Card>
                </Box>
            </motion.div>
        </>
    )
}

export default AdminHomepage