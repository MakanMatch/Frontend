import React, { useEffect, useState } from 'react';
import { Box, Heading, Spinner, Text, useToast, VStack } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import server from '../../networking';
import configureShowToast from '../../components/showToast';

function VerifyToken() {
    const toast = useToast()
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const showToast = configureShowToast(toast);

    // Get token and userID from searchParams
    const token = searchParams.get('token');
    const userID = searchParams.get('userID');

    useEffect(() => {
        if (token && userID) {
            server.post('/identity/emailVerification/verify', { userID, token })
                .then((res) => {
                    // console.log(res.data)
                    if (res.data.startsWith('SUCCESS')) {
                        showToast('Email Verified', 'Please log in to continue', 3000, true, 'success');
                        navigate('/auth/login');
                    } else if (res.data.startsWith('UERROR')) {
                        setMessage("Invalid link, please try again.");
                    } else if (res.data.startsWith('ERROR')) {
                        setMessage("Something went wrong, please try again.");
                    } else {
                        console.error('Unexpected response:', res.data);
                    }
                })
                .catch((err) => {
                    console.error('Error verifying token:', err);
                    setMessage("Something went wrong, please try again!");
                });
        } else {
            setMessage("Invalid link, please try again.");
        }
    }, [token, userID, navigate]);

    return (
        // <Box
        //     bgPosition="center"
        //     display="flex"
        //     justifyContent="center"
        // >
        //     <VStack spacing={4}>
        //         <Heading as="h1" size="xl" mt={100} mb={4} textAlign="center">
        //             Verifying Email...
        //         </Heading>
        //         <Text>{message || "Please wait while we verify your email..."}</Text>
        //     </VStack>
        // </Box>
        <Box
            w="50%"
            h="500px"
            bg="rgba(255, 255, 255, 0.85)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius={15}
        >
            <VStack spacing={4} w="full">
                <Heading as="h1" size="xl" mb={10} mt={20} textAlign="center">
                    Verifying Email...
                </Heading>
                <Spinner size={"xl"} />
                <Text mt={10} mb={20}>{message || "Please wait while we verify your email..."}</Text>
            </VStack>
        </Box>
    );
}

export default VerifyToken;