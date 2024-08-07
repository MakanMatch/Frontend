import React, { useState, useEffect } from 'react';
import {
    Box, Text, Heading, Input, Button, VStack, FormControl, FormLabel, FormErrorMessage, useToast, InputGroup, InputRightElement, IconButton, useMediaQuery
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import server from '../../networking';
import configureShowToast from '../../components/showToast';

function AccountRecovery() {
    const [showResetFields, setShowResetFields] = useState(false);
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [isResetKeySent, setIsResetKeySent] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const toast = useToast()
    const showToast = configureShowToast(toast);
    const navigate = useNavigate();
    const { loaded, authToken } = useSelector((state) => state.auth);

    const [isSmallerThan755] = useMediaQuery("(max-width: 755px)");
    const [isSmallerThan560] = useMediaQuery("(max-width: 560px)");

    const handleShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleShowConfirmNewPassword = () => setShowConfirmNewPassword(!showConfirmNewPassword);

    useEffect(() => {
        if (loaded == true) {
            if (authToken) {
                showToast("Logged In", "You are already logged in!", 3000, true, 'success')
                navigate('/');
            }
        }
    }, [loaded]);
    
    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const sendResetKey = () => {
        server.post('/accountRecovery/resetKey', { usernameOrEmail })
            .then((res) => {
                if (res.data && res.data.startsWith("SUCCESS")) {
                    setShowResetFields(true);
                    setIsResetKeySent(true);
                    setCooldown(30);
                    showToast('Reset key sent', 'Check your email for the reset key.', 3000, true, 'success')
                } else {
                    showToast('Error', res.data, 3000, true, 'error')
                }
            })
            .catch((err) => {
                if (err.response.data === "UERROR: Username or email doesn't exist.") {
                    formik.setFieldError('usernameOrEmail', "Username or email doesn't exist.");
                }
                showToast('Error', "Username or email doesn't exist.", 3000, true, 'error')
                console.log(err)
            });
    };

    // Submit function
    const handleSubmit = (values, actions) => {
        server.post('/accountRecovery/resetPassword', { usernameOrEmail, ...values })
            .then((res) => {
                if (res.data && res.data.startsWith("SUCCESS")) {
                    showToast('Password reset successfully.', 'You can now log in with your new password.', 3000, true, 'success')
                    navigate('/auth/login');
                }
            })
            .catch((err) => {
                if (err.response.data === "UERROR: Invalid or expired reset key.") {
                    formik.setFieldError('resetKey', 'Invalid or expired reset key.')
                }
                showToast('Error', 'Invalid or expired reset key.', 3000, true, 'error')
                console.log(err)
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
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box
                    bgPosition="center"
                    display="flex"
                    justifyContent={"center"}
                >
                    <Box
                        w={isSmallerThan755 ? "90%" : "50%"}
                        minW="380px"
                        h="100%"
                        bg="rgba(255, 255, 255, 0.80)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        p={8}
                        borderRadius={15}
                    >
                        <VStack spacing={4} w="full">
                            <Box w={isSmallerThan755 ? "70vw" : "43vw"} display={'flex'} justifyContent={'start'}>
                                <Text
                                    borderRadius="50%"
                                    height="40px"
                                    width="40px"
                                    boxShadow="0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    zIndex="10"
                                    backgroundColor="white"
                                    cursor="pointer"
                                    onClick={() => navigate("/auth/login")}>
                                    <ArrowBackIcon height="50%" />
                                </Text>
                            </Box>
                            <Heading as="h1" size="xl" mb={5} textAlign="center">
                                Recover your account
                            </Heading>
                            <FormControl mb={4} isInvalid={formik.errors.usernameOrEmail && formik.touched.usernameOrEmail} width={isSmallerThan755 ? "65vw" : "90%"}>
                                <FormLabel fontSize='15px'>Username or Email</FormLabel>
                                <Input
                                    name="usernameOrEmail"
                                    type="text"
                                    value={usernameOrEmail}
                                    placeholder='Enter Username or Email'
                                    borderColor='black'
                                    size='md'
                                    borderRadius='5px'
                                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                                    isDisabled={isResetKeySent}
                                />
                                <FormErrorMessage fontSize='12px'>{formik.errors.usernameOrEmail}</FormErrorMessage>
                            </FormControl>
                            <Box display="flex" justifyContent="start">
                                <Button onClick={sendResetKey} variant={"MMPrimary"} isDisabled={cooldown > 0} mb={4}>
                                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Send password reset key'}
                                </Button>
                            </Box>
                            {showResetFields && (
                                <Box as="form" onSubmit={formik.handleSubmit}>
                                    <FormControl isInvalid={formik.errors.resetKey && formik.touched.resetKey} mb={4}>
                                        <FormLabel>Enter reset key</FormLabel>
                                        <Input
                                            name="resetKey"
                                            type="text"
                                            placeholder='Reset Key'
                                            borderColor='black'
                                            size='md'
                                            borderRadius='5px'
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.resetKey}
                                            width={isSmallerThan755 ? "65vw" : "100%"}
                                        />
                                        <FormErrorMessage fontSize='12px'>{formik.errors.resetKey}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={formik.errors.newPassword && formik.touched.newPassword} mb={4}>
                                        <FormLabel>Enter new password</FormLabel>
                                        <InputGroup>
                                            <Input
                                                name="newPassword"
                                                type={showNewPassword ? 'text' : 'password'}
                                                placeholder='New Password'
                                                borderColor='black'
                                                size='md'
                                                borderRadius='5px'
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.newPassword}
                                                width={isSmallerThan755 ? "65vw" : "100%"}
                                            />
                                            <InputRightElement width='4.5rem'>
                                                <IconButton
                                                    h='1.5rem'
                                                    size='sm'
                                                    mb={2.1}
                                                    onClick={handleShowNewPassword}
                                                    icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage fontSize='12px'>{formik.errors.newPassword}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={formik.errors.confirmNewPassword && formik.touched.confirmNewPassword} mb={4} width={isSmallerThan755 ? "65vw" : "38vw"}>
                                        <FormLabel>Confirm new password</FormLabel>
                                        <InputGroup>
                                            <Input
                                                name="confirmNewPassword"
                                                type={showConfirmNewPassword ? 'text' : 'password'}
                                                placeholder='Confirm New Password'
                                                borderColor='black'
                                                size='md'
                                                borderRadius='5px'
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.confirmNewPassword}
                                            />
                                            <InputRightElement width='4.5rem'>
                                                <IconButton
                                                    h='1.5rem'
                                                    size='sm'
                                                    mb={2.1}
                                                    onClick={handleShowConfirmNewPassword}
                                                    icon={showConfirmNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                    aria-label={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                                                />
                                            </InputRightElement>
                                        </InputGroup>
                                        <FormErrorMessage fontSize='12px'>{formik.errors.confirmNewPassword}</FormErrorMessage>
                                    </FormControl>
                                    <Box display="flex" justifyContent="center">
                                        <Button type="submit" variant={"MMPrimary"} mb={4} mt={4}>
                                            Reset Password
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </VStack>
                    </Box>
                </Box>
            </motion.div>
        </>
    );
}

export default AccountRecovery;
