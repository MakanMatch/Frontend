import React, { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, Text, VStack, useToast, InputGroup, InputRightElement, FormControl, FormLabel, FormErrorMessage, Link, IconButton, useMediaQuery } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import server from '../../networking';
import { useDispatch, useSelector } from 'react-redux';
import { changeAuthToken, setUser } from '../../slices/AuthState';
import configureShowToast from '../../components/showToast';

function Login() {
    const navigate = useNavigate();
    const toast = useToast()
    const showToast = configureShowToast(toast);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const { authToken, loaded } = useSelector((state) => state.auth);

    const [isSmallerThan800] = useMediaQuery("(max-width: 800px)");
    const [isSmallerThan323] = useMediaQuery("(max-width: 323px)");

    useEffect(() => {
        if (authToken) {
            showToast("Logged In", "You are already logged in!", 3000, true, 'success')
            navigate('/');
        }
    }, [loaded]);

    const handleShowPassword = () => setShowPassword(!showPassword);

    // Submit function
    const handleSubmit = (values, actions) => {
        setIsLoading(true);
        server.post("/loginAccount", values, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                setIsLoading(false);
                if (res.status == 200) {
                    console.log("Account logged in successfully.");
                    showToast('Login successful', 'Welcome back to MakanMatch!', 3000, true, 'success')
                    
                    localStorage.setItem('jwt', res.data.accessToken);
                    dispatch(changeAuthToken(res.data.accessToken));

                    const authStateData = { userID: res.data.user.userID, username: res.data.user.username, userType: res.data.user.userType }
                    dispatch(setUser(authStateData));

                    if (res.data.user.userType == "Admin"){
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                } else {
                    console.log("Non-200 status code response when attempting to login, response: " + res.data);
                    showToast('Login failed', 'Invalid username or password.', 3000, true, 'error')
                }
            })
            .catch((err) => {
                setIsLoading(false);
                console.log("Error in attempting to login, error: ", err)
                if (err.response && err.response.data && typeof err.response.data == "string") {
                    if (err.response.data.startsWith("UERROR")) {
                        if (err.response.data === "UERROR: Invalid username or email or password.") {
                            formik.setFieldError('usernameOrEmail', 'Invalid username or email.');
                            formik.setFieldError('password', 'Incorrect password.');
                            showToast('Login failed', 'Invalid username or password.', 3000, true, 'error')
                        } else {
                            showToast('Login failed', err.response.data.substring("UERROR: ".length), 3000, true, 'error')
                        }
                    } else {
                        showToast('Login failed', 'An error occurred in logging you in. Please try again.', 3000, true, 'error')
                    }
                } else {
                    showToast('Login failed', 'An error occurred in logging you in. Please try again.', 3000, true, 'error')
                }
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
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box
                    bgPosition="center"
                    display="flex"
                    justifyContent="center"
                >
                    <Box
                        w={isSmallerThan800 ? (isSmallerThan323 ? "100%" : "80%") : "45%"}
                        h="100%"
                        bg="rgba(255, 255, 255, 0.80)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius={15}
                    >
                        <VStack spacing={4} w="full" overflow="hidden">
                            <Heading as="h1" size="xl" mb={4} mt={20} textAlign="center" padding={5}>
                                Sign in to MakanMatch
                            </Heading>
                            <Box as="form" onSubmit={formik.handleSubmit} marginLeft={10} marginRight={10}>
                                <FormControl isInvalid={formik.errors.usernameOrEmail && formik.touched.usernameOrEmail} mb={4}>
                                    <FormLabel fontSize='15px'>Username or Email</FormLabel>
                                    <Input
                                        name="usernameOrEmail"
                                        placeholder='Username or Email'
                                        borderColor='black'
                                        size='md'
                                        borderRadius='5px'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.usernameOrEmail}
                                        width={!isSmallerThan800 ? "300px" : "100%"}
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
                                            size='md'
                                            borderRadius='5px'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.password}
                                        />
                                        <InputRightElement width='4.5rem'>
                                            <IconButton
                                                h='1.5rem'
                                                size='sm'
                                                mb={1.1}
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
                                        href='/auth/accountRecovery'
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
                                    variant={"MMPrimary"}
                                    isLoading={isLoading}
                                    type='submit'
                                    width='150px'
                                    mb={5}
                                    loadingText="Logging in..."
                                >
                                    Login
                                </Button>
                            </Box>
                            <Text textAlign='center' fontSize='12px' mb={5}>
                                Don't have an account? <Link href='/auth/createAccount' color='teal.500'><Text as='u'>Sign Up</Text></Link>
                            </Text>
                        </VStack>
                    </Box>
                </Box>
            </motion.div>
        </>
    );
}

export default Login;
