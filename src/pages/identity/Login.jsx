import React, { useState } from 'react';
import { Box, Heading, Input, Button, Text, VStack, useToast, InputGroup, InputRightElement, FormControl, FormLabel, FormErrorMessage, Link, IconButton } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import server from '../../networking';
import { useDispatch, useSelector } from 'react-redux';
import { changeAuthToken, setUser } from '../../slices/AuthState';

function Login() {
    const navigate = useNavigate();
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const authToken = useSelector((state) => state.auth.authToken);

    const handleShowPassword = () => setShowPassword(!showPassword);

    // Submit function
    const handleSubmit = (values, actions) => {
        server.post("/loginAccount", values, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (res && res.data) {
                    console.log("Account logged in successfully.");
                    toast({
                        title: 'Login successful.',
                        description: "Welcome back to MakanMatch!",
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    // Set the JWT token in localStorage
                    localStorage.setItem('jwt', res.data.accessToken);
                    dispatch(changeAuthToken(res.data.accessToken));
                    const authStateData = { userID: res.data.user.userID, username: res.data.user.username, userType: res.data.user.userType }
                    dispatch(setUser(authStateData));
                    navigate("/");
                } else {
                    console.log("An error has occurred logging in to the account.")
                    toast({
                        title: 'Login failed.',
                        description: "Invalid username or password.",
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            })
            .catch((err) => {
                console.log(err)
                if (err.response.data === "UERROR: Invalid username or email or password.") {
                    formik.setFieldError('usernameOrEmail', 'Invalid username or email.');
                    formik.setFieldError('password', 'Incorrect password.');
                }
                toast({
                    title: 'Login failed.',
                    description: "Invalid username or password.",
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            });

        actions.setSubmitting(false);
    };

    // Formik hook
    const formik = useFormik({
        initialValues: {
            usernameOrEmail: '',
            password: '',
        },
        validationSchema: Yup.object({
            usernameOrEmail: Yup.string().required('Username or email is required'),
            password: Yup.string().required('Password is required'),
        }),
        onSubmit: handleSubmit,
    });
    return (
        <Box
            bgPosition="center"
            display="flex"
        >
            <Box
                w="50%"
                h="100%"
                bg="rgba(255, 255, 255, 0.85)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius={15}
            >
                <VStack spacing={4} w="full">
                    <Heading as="h1" size="xl" mb={4} mt={20} textAlign="center">
                        Sign in to MakanMatch
                    </Heading>
                    <Box as="form" onSubmit={formik.handleSubmit}>
                        <FormControl isInvalid={formik.errors.usernameOrEmail && formik.touched.usernameOrEmail} mb={4}>
                            <FormLabel fontSize='15px'>Username or Email</FormLabel>
                            <Input
                                name="usernameOrEmail"
                                placeholder='Username or Email'
                                borderColor='black'
                                size='sm'
                                borderRadius='5px'
                                w='400px'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.usernameOrEmail}
                            />
                            <FormErrorMessage fontSize='12px'>{formik.errors.usernameOrEmail}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={formik.errors.password && formik.touched.password} mb={4}>
                            <FormLabel fontSize='15px'>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    name="password"
                                    placeholder='Password'
                                    type={showPassword ? 'text' : 'password'}
                                    borderColor='black'
                                    size='sm'
                                    borderRadius='5px'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                                <InputRightElement width='4.5rem'>
                                    <IconButton
                                        h='1.5rem'
                                        size='sm'
                                        mb={2}
                                        onClick={handleShowPassword}
                                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage fontSize='12px'>{formik.errors.password}</FormErrorMessage>
                        </FormControl>
                        <Box w="100%" display="flex" justifyContent="start">
                            <Link
                                href='/identity/accountRecovery'
                                fontSize='12px'
                                color='teal.500'
                                mb={5}
                            >
                                <Text as='u'>
                                    Forgot username or password?
                                </Text>
                            </Link>
                        </Box>
                        <Button
                            colorScheme='purple'
                            isLoading={formik.isSubmitting}
                            type='submit'
                            width='150px'
                            mb={5}
                        >
                            Login
                        </Button>
                    </Box>
                    <Text textAlign='center' fontSize='12px' mb={5}>
                        Don't have an account? <Link href='/identity/createAccount' color='teal.500'><Text as='u'>Sign Up</Text></Link>
                    </Text>
                </VStack>
            </Box>
        </Box>
    );
}

export default Login;
