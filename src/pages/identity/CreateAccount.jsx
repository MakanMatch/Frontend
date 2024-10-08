import React, { useState, useEffect } from 'react';
import {
    Box, Heading, Input, Button, Text, VStack, useToast, Checkbox, InputGroup, InputRightElement,
    FormControl, FormLabel, FormErrorMessage, Link, IconButton, HStack, useMediaQuery
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import * as Yup from 'yup';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import server from '../../networking';
import configureShowToast from '../../components/showToast';

function CreateAccount() {
    const navigate = useNavigate();
    const toast = useToast()
    const showToast = configureShowToast(toast);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isHostAccount, setIsHostAccount] = useState(false);
    const authToken = useSelector((state) => state.auth.authToken);

    const [isSmallerThan944] = useMediaQuery("(max-width: 944px)");
    const [isSmallerThan766] = useMediaQuery("(max-width: 766px)");

    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    useEffect(() => {
        if (authToken) {
            showToast("Logged In", "You are already logged in!", 3000, true, 'success')
            navigate('/');
        }
    }, [authToken]);

    // Validation schema
    const validationSchema = Yup.object().shape({
        fname: Yup.string()
            .matches(/^[a-zA-Z\s]*$/, 'First Name cannot contain numbers')
            .required('First Name is required'),
        lname: Yup.string()
            .matches(/^[a-zA-Z\s]*$/, 'Last Name cannot contain numbers')
            .required('Last Name is required'),
        username: Yup.string()
            .matches(/^\S*$/, 'Username cannot contain spaces')
            .required('Username is required'),
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
        blkNo: Yup.lazy((value, context) =>
            isHostAccount ? Yup.string() : Yup.string().notRequired()
        ),
        street: Yup.lazy((value, context) =>
            isHostAccount ? Yup.string().required('Street is required') : Yup.string().notRequired()
        ),
        postalCode: Yup.lazy((value, context) =>
            isHostAccount ? Yup.string().required('Postal code is required') : Yup.string().notRequired()
        ),
        unitNum: Yup.lazy((value, context) =>
            isHostAccount ? Yup.string() : Yup.string().notRequired()
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
                if (res && res.data && res.data.startsWith("SUCCESS")) {
                    showToast('Account created', 'Please verify your email to continue', 3000, true, 'success');
                    if (res.data.startsWith("SUCCESS")) {
                        navigate(`/auth/emailVerification?email=${submitValues.email}&fromCreateAccount=true`);
                    }
                } else {
                    showToast('Account creation failed', 'An error has occurred creating the account.', 3000, true, '');
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
                if (err.response.data.startsWith("ERROR")) {
                    showToast('Account creation failed', err.response.data.substring("ERROR: ".length), 3000, true, 'error');
                }
                showToast('Account creation failed.', err.response.data.substring("UERROR: ".length), 3000, true, 'error');
                actions.setSubmitting(false);
            });
    };

    const formik = useFormik({
        initialValues: {
            fname: '',
            lname: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            contactNum: '',
            blkNo: '',
            street: '',
            postalCode: '',
            unitNum: '',
            isHostAccount: false
        },
        validationSchema,
        onSubmit: handleSubmit,
    });

        return (
            <>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box display="flex" justifyContent={"center"}>
                        <Box
                            w={isSmallerThan944 ? (isSmallerThan766 ? "95%" : "70%") : "50%"}
                            h="100%"
                            bg="rgba(255, 255, 255, 0.80)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            borderRadius={15}
                        >
                            <VStack spacing={4} margin={10} overflow="hidden">
                                <Heading as="h1" size="xl" mb={4} mt={10} textAlign="center" padding={5}>
                                    Create an account
                                </Heading>
                                <Box as="form" onSubmit={formik.handleSubmit}>
                                    {!isSmallerThan944 ? (
                                        <HStack spacing={4} mb={4}>
                                            <FormControl isRequired isInvalid={formik.errors.fname && formik.touched.fname} flex={1}>
                                                <FormLabel fontSize='15px'>First Name</FormLabel>
                                                <Input
                                                    name="fname"
                                                    placeholder='First Name'
                                                    borderColor='black'
                                                    size='md'
                                                    borderRadius='5px'
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.fname}
                                                    width="100%"
                                                />
                                                <FormErrorMessage fontSize='12px'>{formik.errors.fname}</FormErrorMessage>
                                            </FormControl>
                                            <FormControl isRequired isInvalid={formik.errors.lname && formik.touched.lname} flex={1}>
                                                <FormLabel fontSize='15px'>Last Name</FormLabel>
                                                <Input
                                                    name="lname"
                                                    placeholder='Last Name'
                                                    borderColor='black'
                                                    size='md'
                                                    borderRadius='5px'
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.lname}
                                                />
                                                <FormErrorMessage fontSize='12px'>{formik.errors.lname}</FormErrorMessage>
                                            </FormControl>
                                        </HStack>
                                    ) : (
                                        <>
                                            <FormControl isRequired isInvalid={formik.errors.fname && formik.touched.fname} flex={1} mb={4}>
                                                <FormLabel fontSize='15px'>First Name</FormLabel>
                                                <Input
                                                    name="fname"
                                                    placeholder='First Name'
                                                    borderColor='black'
                                                    size='md'
                                                    borderRadius='5px'
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.fname}
                                                    width="100%"
                                                />
                                                <FormErrorMessage fontSize='12px'>{formik.errors.fname}</FormErrorMessage>
                                            </FormControl>
                                            <FormControl isRequired isInvalid={formik.errors.lname && formik.touched.lname} flex={1} mb={4}>
                                                <FormLabel fontSize='15px'>Last Name</FormLabel>
                                                <Input
                                                    name="lname"
                                                    placeholder='Last Name'
                                                    borderColor='black'
                                                    size='md'
                                                    borderRadius='5px'
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.lname}
                                                />
                                                <FormErrorMessage fontSize='12px'>{formik.errors.lname}</FormErrorMessage>
                                            </FormControl>
                                        </>
                                    )}

                                    <FormControl isRequired isInvalid={formik.errors.username && formik.touched.username} mb={4}>
                                        <FormLabel fontSize='15px'>Username</FormLabel>
                                        <Input
                                            name="username"
                                            placeholder='Username'
                                            borderColor='black'
                                            size='md'
                                            borderRadius='5px'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.username}
                                        />
                                        <FormErrorMessage fontSize='12px'>{formik.errors.username}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isRequired isInvalid={formik.errors.email && formik.touched.email} mb={4}>
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
                                    <FormControl isRequired isInvalid={formik.errors.password && formik.touched.password} mb={4}>
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
                                    <FormControl isRequired isInvalid={formik.errors.confirmPassword && formik.touched.confirmPassword} mb={4}>
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
                                            <FormControl isRequired isInvalid={formik.errors.contactNum && formik.touched.contactNum} mb={4}>
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
                                            {!isSmallerThan944 ? (
                                                <>
                                                    <HStack spacing={4} mb={4}>
                                                        <FormControl isInvalid={formik.errors.blkNo && formik.touched.blkNo} flex={1}>
                                                            <FormLabel fontSize='15px'>Block Number</FormLabel>
                                                            <Input
                                                                name="blkNo"
                                                                placeholder='Eg. 301A'
                                                                borderColor='black'
                                                                size='md'
                                                                borderRadius='5px'
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.blkNo}
                                                            />
                                                            <FormErrorMessage fontSize='12px'>{formik.errors.blkNo}</FormErrorMessage>
                                                        </FormControl>
                                                        <FormControl isInvalid={formik.errors.unitNum && formik.touched.unitNum} flex={1}>
                                                            <FormLabel fontSize='15px'>Unit Number</FormLabel>
                                                            <Input
                                                                name="unitNum"
                                                                placeholder='Eg. 07-15'
                                                                borderColor='black'
                                                                size='md'
                                                                borderRadius='5px'
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.unitNum}
                                                            />
                                                            <FormErrorMessage fontSize='12px'>{formik.errors.unitNum}</FormErrorMessage>
                                                        </FormControl>
                                                    </HStack>
                                                    <HStack spacing={4} mb={4}>
                                                        <FormControl isRequired isInvalid={formik.errors.street && formik.touched.street} flex={1}>
                                                            <FormLabel fontSize='15px'>Street </FormLabel>
                                                            <Input
                                                                name="street"
                                                                placeholder='Eg. Madagascar Lane'
                                                                borderColor='black'
                                                                size='md'
                                                                borderRadius='5px'
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.street}
                                                            />
                                                            <FormErrorMessage fontSize='12px'>{formik.errors.street}</FormErrorMessage>
                                                        </FormControl>
                                                        <FormControl isRequired isInvalid={formik.errors.postalCode && formik.touched.postalCode} flex={1}>
                                                            <FormLabel fontSize='15px'>Postal Code</FormLabel>
                                                            <Input
                                                                name="postalCode"
                                                                placeholder='Eg. 542301'
                                                                borderColor='black'
                                                                size='md'
                                                                borderRadius='5px'
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.postalCode}
                                                            />
                                                            <FormErrorMessage fontSize='12px'>{formik.errors.postalCode}</FormErrorMessage>
                                                        </FormControl>
                                                    </HStack>
                                                </>
                                            ) : (
                                                <>
                                                    <FormControl isInvalid={formik.errors.blkNo && formik.touched.blkNo} flex={1} mb={4}>
                                                        <FormLabel fontSize='15px'>Block Number</FormLabel>
                                                        <Input
                                                            name="blkNo"
                                                            placeholder='Eg. 301A'
                                                            borderColor='black'
                                                            size='md'
                                                            borderRadius='5px'
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.blkNo}
                                                        />
                                                        <FormErrorMessage fontSize='12px'>{formik.errors.blkNo}</FormErrorMessage>
                                                    </FormControl>
                                                    <FormControl isInvalid={formik.errors.unitNum && formik.touched.unitNum} flex={1} mb={4}>
                                                        <FormLabel fontSize='15px'>Unit Number</FormLabel>
                                                        <Input
                                                            name="unitNum"
                                                            placeholder='Eg. 07-15'
                                                            borderColor='black'
                                                            size='md'
                                                            borderRadius='5px'
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.unitNum}
                                                        />
                                                        <FormErrorMessage fontSize='12px'>{formik.errors.unitNum}</FormErrorMessage>
                                                    </FormControl>
                                                    <FormControl isRequired isInvalid={formik.errors.street && formik.touched.street} flex={1} mb={4}>
                                                        <FormLabel fontSize='15px'>Street </FormLabel>
                                                        <Input
                                                            name="street"
                                                            placeholder='Eg. Madagascar Lane'
                                                            borderColor='black'
                                                            size='md'
                                                            borderRadius='5px'
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.street}
                                                        />
                                                        <FormErrorMessage fontSize='12px'>{formik.errors.street}</FormErrorMessage>
                                                    </FormControl>
                                                    <FormControl isRequired isInvalid={formik.errors.postalCode && formik.touched.postalCode} flex={1} mb={4}>
                                                        <FormLabel fontSize='15px'>Postal Code</FormLabel>
                                                        <Input
                                                            name="postalCode"
                                                            placeholder='Eg. 542301'
                                                            borderColor='black'
                                                            size='md'
                                                            borderRadius='5px'
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            value={formik.values.postalCode}
                                                        />
                                                        <FormErrorMessage fontSize='12px'>{formik.errors.postalCode}</FormErrorMessage>
                                                    </FormControl>
                                                </>
                                            )}
                                        </>
                                    )}
                                    <Button
                                        variant={"MMPrimary"}
                                        isLoading={formik.isSubmitting}
                                        type='submit'
                                        width='150px'
                                        mb={5}
                                        mt={1}
                                    >
                                        Get Started
                                    </Button>
                                </Box>
                                <Text textAlign='center' fontSize='12px' mb={5}>
                                    Already have an account? <Link href='/auth/login' color='teal.500'><Text as='u'>Sign In</Text></Link>
                                </Text>
                            </VStack>
                        </Box>
                    </Box>
                </motion.div>
            </>
        );
    }

    export default CreateAccount;