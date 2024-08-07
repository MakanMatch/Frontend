import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Box, Heading, Spinner, Text, useToast, VStack } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import server from '../../networking';
import configureShowToast from '../../components/showToast';
import { reloadAuthToken } from '../../slices/AuthState';

function VerifyToken() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState('');
    const toast = useToast()
    const showToast = configureShowToast(toast);
    const dispatch = useDispatch();
    const authToken = useSelector((state) => state.auth.authToken);

    // Get token and userID from searchParams
    const token = searchParams.get('token');
    const userID = searchParams.get('userID');

    useEffect(() => {
        if (token && userID) {
            server.post('/identity/emailVerification/verify', { userID, token })
                .then((res) => {
                    dispatch(reloadAuthToken(authToken))
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
                .catch((error) => {
                    dispatch(reloadAuthToken(authToken))
                    setMessage("Something went wrong, please try again!");
                    console.log("Error: ", error)
                    if (error.response && error.response.data && typeof error.response.data == "string") {
                        console.log("Error verifying token; response: " + error.response.data)
                        if (error.response.data.startsWith("UERROR")) {
                            showToast(
                                "Uh-oh!",
                                error.response.data.substring("UERROR: ".length),
                                3500,
                                true,
                                "info",
                            )
                        } else {
                            showToast(
                                "Something went wrong",
                                "Failed to verify token. Please try again",
                                3500,
                                true,
                                "error",
                            )
                        }
                    } else {
                        console.log("Unknown error occurred when verifying token; error: " + error)
                        showToast(
                            "Something went wrong",
                            "Failed to verify token. Please try again",
                            3500,
                            true,
                            "error",
                        )
                    }
                });
        } else {
            setMessage("Invalid link, please try again.");
        }
    }, [token, userID, navigate]);

    return (
        <Box
            w="50%"
            h="500px"
            bg="rgba(255, 255, 255, 0.80)"
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