import React, { useState } from 'react';
import { Box, Heading, Input, Button, Text, VStack, useToast, InputGroup, InputRightElement, FormControl, FormLabel, FormErrorMessage, Link } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import server from '../../networking';

function Login() {
    const navigate = useNavigate();
    const toast = useToast();
    const [showPassword, setShowPassword] = React.useState(false);

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
                console.log(res.data);
                console.log("Account logged in successfully.");
                toast({
                    title: 'Login successful.',
                    description: "Welcome back to MakanMatch!",
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
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
            console.log("error")
            console.log(`${err.response.data}`);
            if (err.response.data === "Invalid username or email or password.") {
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
                bg="rgba(255, 255, 255, 0.8)"
                display="flex"
                alignItems="center"
                justifyContent="center"
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
                                    <Button mb='8px' h='1.5rem' size='xs' onClick={handleShowPassword}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage fontSize='12px'>{formik.errors.password}</FormErrorMessage>
                        </FormControl>
                        <Box w="100%" display="flex" justifyContent="start">
                            <Link
                                href='/accountRecovery'
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
                        Don't have an account? <Link href='./createAccount' color='teal.500'><Text as='u'>Sign Up</Text></Link>
                    </Text>
                </VStack>
            </Box>
        </Box>
    );
}

export default Login;