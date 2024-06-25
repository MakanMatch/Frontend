import React, { useState } from 'react';
import {
    Box, Heading, Input, Button, Text, VStack, FormControl, FormLabel, FormErrorMessage, useToast
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import server from '../../networking';

function AccountRecovery() {
    const [showResetFields, setShowResetFields] = useState(false);
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    const sendResetKey = () => {
        server.post('/accountRecovery/resetKey', { usernameOrEmail })
            .then((res) => {
                if (res.data && res.data.startsWith("SUCCESS")) {
                    setShowResetFields(true);
                    toast({
                        title: 'Reset key sent.',
                        description: "Check your email for the reset key.",
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                } else {
                    toast({
                        title: 'Error',
                        description: res.data,
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                }
            })
            .catch((err) => {
                if (err.response.data === "UERROR: Username or email doesn't exist.") {
                    formik.setFieldError('usernameOrEmail', "Username or email doesn't exist.");
                }
                toast({
                    title: 'Error',
                    description: "Username or email doesn' exist.",
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            });
    };

    // Submit function
    const handleSubmit = (values, actions) => {
        server.post('/accountRecovery/resetPassword', { usernameOrEmail, ...values })
            .then((res) => {
                if (res.data && res.data.startsWith("SUCCESS")) {
                    toast({
                        title: 'Password reset successfully.',
                        description: "You can now log in with your new password.",
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                    });
                    navigate('/login');
                }
            })
            .catch((err) => {
                if (err.response.data === "UERROR: Invalid or expired reset key.") {
                    formik.setFieldError('resetKey', 'Invalid or expired reset key.')
                }
                toast({
                    title: 'Error',
                    description: "Invalid or expired reset key.",
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
            resetKey: '',
            newPassword: '',
            confirmNewPassword: '',
        },
        validationSchema: Yup.object({
            resetKey: Yup.string().required('Reset key is required'),
            newPassword: Yup.string()
                .required('New password is required')
                .min(6, 'Password must be at least 6 characters'),
            confirmNewPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                .required('Confirm new password is required'),
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
                p={8}
            >
                <VStack spacing={4} w="full">
                    <Heading as="h1" size="xl" mb={5} textAlign="center">
                        Recover your account
                    </Heading>
                    <Box w="400px" display="flex" justifyContent="start">
                        <Button onClick={() => navigate('/login')} mb={4} colorScheme='purple'>
                            Back
                        </Button>
                    </Box>
                    <FormControl mb={4} w='400px' isInvalid={formik.errors.usernameOrEmail && formik.touched.usernameOrEmail}>
                        <FormLabel fontSize='15px'>Username or Email</FormLabel>
                        <Input
                            name="usernameOrEmail"
                            type="text"
                            value={usernameOrEmail}
                            placeholder='Enter Username or Email'
                            borderColor='black'
                            size='sm'
                            borderRadius='5px'
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                        />
                        <FormErrorMessage fontSize='12px'>{formik.errors.usernameOrEmail}</FormErrorMessage>
                    </FormControl>
                    <Box w="400px" display="flex" justifyContent="start">
                        <Button onClick={sendResetKey} colorScheme='purple'>
                            Send password reset key
                        </Button>
                    </Box>
                    {showResetFields && (
                        <Box as="form" onSubmit={formik.handleSubmit} mt={4} w="400px">
                            <FormControl isInvalid={formik.errors.resetKey && formik.touched.resetKey} mb={4}>
                                <FormLabel>Enter reset key</FormLabel>
                                <Input
                                    name="resetKey"
                                    type="text"
                                    placeholder='Reset Key'
                                    borderColor='black'
                                    size='sm'
                                    borderRadius='5px'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.resetKey}
                                />
                                <FormErrorMessage fontSize='12px'>{formik.errors.resetKey}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={formik.errors.newPassword && formik.touched.newPassword} mb={4}>
                                <FormLabel>Enter new password</FormLabel>
                                <Input
                                    name="newPassword"
                                    type="password"
                                    placeholder='New Password'
                                    borderColor='black'
                                    size='sm'
                                    borderRadius='5px'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.newPassword}
                                />
                                <FormErrorMessage fontSize='12px'>{formik.errors.newPassword}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={formik.errors.confirmNewPassword && formik.touched.confirmNewPassword} mb={4}>
                                <FormLabel>Confirm new password</FormLabel>
                                <Input
                                    name="confirmNewPassword"
                                    type="password"
                                    placeholder='Confirm New Password'
                                    borderColor='black'
                                    size='sm'
                                    borderRadius='5px'
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.confirmNewPassword}
                                />
                                <FormErrorMessage fontSize='12px'>{formik.errors.confirmNewPassword}</FormErrorMessage>
                            </FormControl>
                            <Box w="full" display="flex" justifyContent="start">
                                <Button type="submit" colorScheme='purple'>
                                    Reset Password
                                </Button>
                            </Box>
                        </Box>
                    )}
                </VStack>
            </Box>
        </Box>
    );
}

export default AccountRecovery;