import React, { useState, useEffect } from 'react';
import {
    Box, Heading, Text, VStack, Image, Button, useToast
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import server from '../../networking';

function EmailVerification() {
    const location = useLocation();
    const email = new URLSearchParams(location.search).get('email');
    const [cooldown, setCooldown] = useState(0);
    const toast = useToast();

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const sendEmailVerification = () => {
        server.post('/identity/emailVerification/sendVerificationEmail', { email })
            .then((res) => {
                if (res.data && res.data.startsWith("SUCCESS")) {
                    setCooldown(30);
                    toast({
                        title: 'Verification email sent.',
                        description: "Check your email for the verification link.",
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
                console.log(err)
                toast({
                    title: 'Error',
                    description: err.response?.data || 'Failed to send verification email.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            });
    };

    return (
        <Box
            bgPosition="center"
            display="flex"
        >
            <Box
                w="50%"
                bg="rgba(255, 255, 255, 0.8)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={8}
            >
                <VStack spacing={4} w="full">
                    <Heading as="h1" size="xl" mb={4} textAlign="center">
                        Verify your email
                    </Heading>
                    <Image
                        src="/placeholderImage.png"
                        alt="Email verification"
                        boxSize="300px"
                        objectFit="cover"
                        mb={4}
                    />
                    <Text fontSize="lg" textAlign="center">
                        We've just sent a verification link to your email. Click the link provided to verify your email!
                    </Text>
                    <Box>
                        <Button onClick={sendEmailVerification} colorScheme='purple' isDisabled={cooldown > 0}>
                            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Verification Email'}
                        </Button>
                    </Box>
                </VStack>
            </Box>
        </Box>
    );
}

export default EmailVerification;
