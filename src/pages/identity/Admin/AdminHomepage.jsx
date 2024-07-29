import { Heading, Text, Grid, Box, Image, Stack, Card, CardBody, Divider, 
CardFooter, ButtonGroup, Button,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { reloadAuthToken } from "../../../slices/AuthState";


function AdminHomepage() {
    const navigate = useNavigate();
    const { user, loaded, error, authToken } = useSelector((state) => state.auth);

    

    return (
        <>
            <Heading mt={10} mb={5}>Hi, John Appleseed!</Heading>
            <Text size={'md'}>Welcome Back to MakanMatch!</Text>
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
                            <Button variant={"MMPrimary"} colorScheme='blue' onClick={() => navigate('/admin/adminAccount')}>
                                View More
                            </Button>
                        </ButtonGroup>
                    </CardFooter>
                </Card>
            </Box>
        </>
    )
}

export default AdminHomepage