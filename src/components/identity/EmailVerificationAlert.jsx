import React, { useEffect, useState } from "react";
import { Alert, AlertIcon, Box, Button, Spacer, useToast } from '@chakra-ui/react'
import server from '../../networking'
import configureShowToast from "../showToast";
import { useDispatch } from "react-redux";

function EmailVerificationAlert({ email, userType, emailVerificationTime }) {
    const [cooldown, setCooldown] = useState(0);
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const dispatch = useDispatch();

    const calculateVerificationTime = () => {
        const verificationTime = new Date(emailVerificationTime);
        const day = verificationTime.getDate()
        const month = verificationTime.getMonth() + 1
        const year = verificationTime.getFullYear()
        const lastDay = `${day}/${month}/${year}`
        return lastDay
    }

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleResendEmail = () => {
        server.post('/identity/emailVerification/send', { email })
            .then((res) => {
                dispatch(reloadAuthToken(authToken))
                if (res.data && res.data.startsWith("SUCCESS")) {
                    setCooldown(30);
                    showToast('Verification email sent.', 'Check your email for the verification link.', 3000, true, 'success')
                } else {
                    showToast('Error.', res.data, 3000, true, 'error')
                }
            })
            .catch((err) => {
                dispatch(reloadAuthToken(authToken))
                console.log(err)
                showToast('Error', err.response?.data || 'Failed to send verification email.', 3000, true, 'error')
            });
    }

    return (
        <Box flexDirection={"column"} justifyContent={"center"}>
            <Alert status='warning' mt={6} mb={-5} borderRadius={10} display="flex" alignItems="center">
                <AlertIcon />
                {userType === 'Admin' ? (
                    <>
                        Your email has NOT been verified.
                        <Spacer />
                    </>
                ) : (
                    <>
                        You must verify your email by <strong>&nbsp;{calculateVerificationTime()}</strong>, otherwise your account will be locked.
                        <Spacer />
                    </>
                )}
                <Spacer />
                <Button size={"sm"} onClick={handleResendEmail} isDisabled={cooldown > 0}>
                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
                </Button>
            </Alert>
        </Box>

    )
}

export default EmailVerificationAlert