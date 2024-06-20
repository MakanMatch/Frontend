import React, { useState } from 'react';
import { Box, Heading, Input, Button, Text, VStack, useToast, Checkbox, InputGroup, InputRightElement, FormControl, FormLabel, FormErrorMessage, Link } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import instance from '../../networking';

function CreateAccount() {
    const navigate = useNavigate();
    const toast = useToast();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Passwords must match')
                .required('Confirm Password is required'),
        }),
        onSubmit: (values, actions) => {
            const { confirmPassword,...submitValues } = values;
            const data = JSON.stringify(submitValues, null, 2);
            console.log(data)
            console.log(submitValues)
            instance.post("/createGuestAccount", data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
               .then((res) => {
                    if (res && res.data) {
                        console.log(res.data);
                        console.log("Account created successfully.");
                        toast({
                            title: 'Account created.',
                            description: "Welcome to MakanMatch!",
                            status: 'success',
                            duration: 3000,
                            isClosable: true,
                        });
                        navigate("/");
                    } else {
                        console.log("An error has occured creating the account.")
                        toast({
                            title: 'Account creation failed.',
                            description: "An error has occured creating the account.",
                            status: 'error',
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                })
               .catch(function (err) {
                    console.log("error")
                    console.log(err)
                    console.log(`${err.response.data.message}`);
                    if (err.response.data.message === "Username already exists.") {
                        formik.setFieldError('username', 'Username already exists.');
                    } else if (err.response.data.message === "Email already exists.") {
                        formik.setFieldError('email', 'Email already exists.');
                    }
                    toast({
                        title: 'Account creation failed.',
                        description: `${err.response.data.message}`,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                });
        
            actions.setSubmitting(false);
        },
    });

    return (
        <Box
            bgPosition="center"
            display="flex"
            bgColor={'gray'}
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
                        Create an account
                    </Heading>
                    <Box as="form" onSubmit={formik.handleSubmit}>
                        <FormControl isInvalid={formik.errors.username && formik.touched.username} mb={4}>
                            <FormLabel fontSize='15px'>Username</FormLabel>
                            <Input
                                name="username"
                                placeholder='Username'
                                borderColor='black'
                                size='sm'
                                borderRadius='5px'
                                w="400px"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.username}
                            />
                            <FormErrorMessage fontSize='12px'>{formik.errors.username}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={formik.errors.email && formik.touched.email} mb={4}>
                            <FormLabel fontSize='15px'>Email</FormLabel>
                            <Input
                                name="email"
                                placeholder='Email'
                                type='email'
                                borderColor='black'
                                size='sm'
                                borderRadius='5px'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                            <FormErrorMessage fontSize='12px'>{formik.errors.email}</FormErrorMessage>
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
                        <FormControl isInvalid={formik.errors.confirmPassword && formik.touched.confirmPassword} mb={4}>
                            <FormLabel fontSize='15px'>Confirm Password</FormLabel>
                            <InputGroup>
                                <Input
                                    name="confirmPassword"
                                    placeholder='Confirm Password'
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    borderColor='black'
                                    size='sm'
                                    borderRadius='5px'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.confirmPassword}
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button mb='8px' h='1.5rem' size='xs' onClick={handleShowConfirmPassword}>
                                        {showConfirmPassword ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage fontSize='12px'>{formik.errors.confirmPassword}</FormErrorMessage>
                        </FormControl>
                        <Box w="100%" display="flex" justifyContent="start">
                            <Checkbox fontSize='15px' mb={5}>I want to be a host</Checkbox>
                        </Box>
                        <Button
                            colorScheme='purple'
                            isLoading={formik.isSubmitting}
                            type='submit'
                            width='150px'
                            mb={5}
                        >
                            Get Started
                        </Button>
                    </Box>
                    <Text textAlign='center' fontSize='12px' mb={5}>
                        Already have an account? <Link href='./login' color='teal.500'>Sign In</Link>
                    </Text>
                </VStack>
            </Box>
        </Box>
    );
}

export default CreateAccount;
