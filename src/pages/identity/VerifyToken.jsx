import React, { useEffect } from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import server from '../../networking';

function VerifyToken() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get token from searchParams
    const token = searchParams.get('token');
    const userID = searchParams.get('userID')

    useEffect(() => {
        if (token) {
            server.post('/identity/emailVerification/verify', { userID, token })
                .then((res) => {
                    if (res.data.startsWith('SUCCESS')) {
                        navigate('/'); // Navigate to myAccount on successful verification
                    } else {
                        // Handle error case, e.g., token expired or invalid
                        console.error('Verification failed:', res.data);
                        // Optionally show a message to the user
                    }
                })
                .catch((err) => {
                    console.error('Error verifying token:', err);
                    // Handle error, show error message to user
                });
        }
    }, [token, navigate]);

    return (
        <Box
            bgPosition="center"
            display="flex"
            justifyContent="center"
            alignItems="center"
            h="100vh"
        >
            <VStack spacing={4}>
                <Heading as="h1" size="xl" mb={4} textAlign="center">
                    Verifying Email...
                </Heading>
                <Text>Please wait while we verify your email...</Text>
            </VStack>
        </Box>
    );
}

export default VerifyToken;
