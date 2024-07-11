import React, { useState } from 'react';
import {
    Box, Heading, Input, Button, Text, VStack, useToast, Checkbox, InputGroup, InputRightElement,
    FormControl, FormLabel, FormErrorMessage, Link, IconButton
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import server from '../../networking';

function CreateAccount() {
    const navigate = useNavigate();
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isHostAccount, setIsHostAccount] = useState(false);

    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    // Validation schema
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string()
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'Invalid email address'
            )
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
        contactNum: Yup.lazy((value, context) =>
            isHostAccount
                ? Yup.string()
                    .matches(/^[0-9]{8}$/, 'Contact number must be exactly 8 digits')
                    .required('Contact number is required')
                : Yup.string().notRequired()
        ),
        address: Yup.lazy((value, context) =>
            isHostAccount ? Yup.string().required('Address is required') : Yup.string().notRequired()
        )
    });

    // Submit function
    const handleSubmit = (values, actions) => {
        const { confirmPassword, ...submitValues } = values;

        server.post("/createAccount", submitValues, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (res && res.data && res.data === "SUCCESS: Account created. Please verify your email.") {
                    toast({
                        title: 'Account created.',
                        description: "Please verify your email to continue.",
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    navigate(`/auth/emailVerification?email=${submitValues.email}`);
                } else {
                    toast({
                        title: 'Account creation failed.',
                        description: "An error has occurred creating the account.",
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            })
            .catch((err) => {
                if (err.response.data === "UERROR: Username already exists.") {
                    actions.setFieldError('username', 'Username already exists.');
                } else if (err.response.data === "UERROR: Email already exists.") {
                    actions.setFieldError('email', 'Email already exists.');
                } else if (err.response.data === "UERROR: Contact number already exists.") {
                    actions.setFieldError('contactNum', 'Contact number already in use.');
                }
                toast({
                    title: 'Account creation failed.',
                    description: `${err.response.data}`.substring("UERROR: ".length),
                    status: 'error',
                    duration: 3000,
                    isClosable: true,

                });

                actions.setSubmitting(false);
            });
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            contactNum: '',
            address: '',
            isHostAccount: false
        },
        validationSchema,
        onSubmit: handleSubmit,
    });

        return (
            <>
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
                        <Heading as="h1" size="xl" mb={4} mt={10} textAlign="center">
                            Create an account
                        </Heading>
                        <Box as="form" onSubmit={formik.handleSubmit}>
                            <FormControl isInvalid={formik.errors.username && formik.touched.username} mb={4}>
                                <FormLabel fontSize='15px'>Username</FormLabel>
                                <Input
                                    name="username"
                                    placeholder='Username'
                                    borderColor='black'
                                    size='md'
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
                                    size='md'
                                    borderRadius='5px'
                                    required
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
                                            mb={0.5}
                                            onClick={handleShowPassword}
                                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        />
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
                                        size='md'
                                        borderRadius='5px'
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.confirmPassword}
                                    />
                                    <InputRightElement width='4.5rem'>
                                        <IconButton
                                            h='1.5rem'
                                            size='sm'
                                            mb={0.5}
                                            onClick={handleShowConfirmPassword}
                                            icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage fontSize='12px'>{formik.errors.confirmPassword}</FormErrorMessage>
                            </FormControl>
                            <Box w="100%" display="flex" justifyContent="start">
                                <Checkbox
                                    fontSize='15px'
                                    mb={5}
                                    onChange={() => {
                                        setIsHostAccount(!isHostAccount);
                                        formik.setFieldValue('isHostAccount', !isHostAccount);
                                    }}
                                    borderColor={'gray'}
                                >
                                    I want to be a host
                                </Checkbox>
                            </Box>
                            {formik.values.isHostAccount && (
                                <>
                                    <FormControl isInvalid={formik.errors.contactNum && formik.touched.contactNum} mb={4}>
                                        <FormLabel fontSize='15px'>Contact Number</FormLabel>
                                        <Input
                                            name="contactNum"
                                            placeholder='Contact Number'
                                            borderColor='black'
                                            size='md'
                                            borderRadius='5px'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.contactNum}
                                        />
                                        <FormErrorMessage fontSize='12px'>{formik.errors.contactNum}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={formik.errors.address && formik.touched.address} mb={4}>
                                        <FormLabel fontSize='15px'>Address</FormLabel>
                                        <Input
                                            name="address"
                                            placeholder='Address'
                                            borderColor='black'
                                            size='md'
                                            borderRadius='5px'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.address}
                                        />
                                        <FormErrorMessage fontSize='12px'>{formik.errors.address}</FormErrorMessage>
                                    </FormControl>
                                </>
                            )}
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
                            Already have an account? <Link href='/auth/login' color='teal.500'><Text as='u'>Sign In</Text></Link>
                        </Text>
                    </VStack>
                </Box>
            </>
        );
    }

    export default CreateAccount;