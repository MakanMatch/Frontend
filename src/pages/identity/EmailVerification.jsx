import React from 'react';
import { 
    Box, Heading, Text, VStack, Image 
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

function EmailVerification() {
    const location = useLocation();
    const email = new URLSearchParams(location.search).get('email');

    return (
        <Box
            bgPosition="center"
            display="flex"
            bgColor={'gray'}
            minHeight="100vh"
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
                        src="https://via.placeholder.com/300" // Replace with your image URL
                        alt="Email verification"
                        boxSize="300px"
                        objectFit="cover"
                        mb={4}
                    />
                    <Text fontSize="lg" textAlign="center">
                        We've just sent a verification email to {email}. Click the link provided to verify your email!
                    </Text>
                </VStack>
            </Box>
        </Box>
    );
}

export default EmailVerification;
