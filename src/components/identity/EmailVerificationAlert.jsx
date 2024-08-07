import React, { useEffect, useState } from "react";
import { Alert, AlertIcon, Box, Button, Spacer, useToast } from '@chakra-ui/react'
import server from '../../networking'
import configureShowToast from "../showToast";

function EmailVerificationAlert({ email, calculateAccountAge, userType }) {
    const [cooldown, setCooldown] = useState(0);
    const toast = useToast();
    const showToast = configureShowToast(toast);

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
                if (res.data && res.data.startsWith("SUCCESS")) {
                    setCooldown(30);
                    showToast('Verification email sent.', 'Check your email for the verification link.', 3000, true, 'success')
                } else {
                    showToast('Error.', res.data, 3000, true, 'error')
                }
            })
            .catch((err) => {
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
                        Your email has NOT been verified. Your account will be locked in {7 - calculateAccountAge()} days.
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