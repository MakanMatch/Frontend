import React, { useState, useEffect } from 'react';
import {
    Box, Heading, Text, VStack, Image, Button, useToast, useMediaQuery
} from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import server from '../../networking';
import configureShowToast from '../../components/showToast';

function EmailVerification() {
    const [searchParams] = useSearchParams();
    const [cooldown, setCooldown] = useState(0);
    const toast = useToast()
    const showToast = configureShowToast(toast);

    const [isSmallerThan1040] = useMediaQuery('(max-width: 1040px)');

    const email = searchParams.get('email');
    const resendOnLoad = searchParams.get('resendOnLoad');

    useEffect(() => {
        if (resendOnLoad === 'true') {
            sendEmailVerification()
        }
    }, [])
    
    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const sendEmailVerification = () => {
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
    };

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
                        w={isSmallerThan1040 ? '100%' : '65%'}
                        bg="rgba(255, 255, 255, 0.80)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        p={8}
                        borderRadius={15}
                    >
                        <VStack spacing={4} w="full" overflow="hidden">
                            <Heading as="h1" size="xl" textAlign="center">
                                Verify your email
                            </Heading>
                            <Image
                                src= '/src/assets/EmailVerificationImage.png'
                                alt="Email verification"
                                objectFit="cover"
                                mt={-10}
                            />
                            <Text fontSize="lg" textAlign="center" mt={-5} width={"60%"}>
                                We've just sent a verification link to your email. Click the link provided to verify your email!
                            </Text>
                            <Box>
                                <Button onClick={sendEmailVerification} variant={'MMPrimary'} isDisabled={cooldown > 0} width="100%">
                                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email'}
                                </Button>
                            </Box>
                        </VStack>
                    </Box>
                </Box>
            </motion.div>
        </>
    );
}

export default EmailVerification;
