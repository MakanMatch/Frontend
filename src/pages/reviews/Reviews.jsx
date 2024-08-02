import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import SubmitReviews from '../../components/reviews/SubmitReviews';
import SortReviews from '../../components/reviews/SortReviews';
import { Button, Box, Flex, Text, Spacer, useToast, Heading, Tooltip, Spinner, Avatar } from '@chakra-ui/react';
import server from '../../networking';
import { ArrowBackIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import configureShowToast from '../../components/showToast';
import { useDisclosure } from '@chakra-ui/react';
import { reloadAuthToken } from '../../slices/AuthState';
import {
    Modal,
    ModalOverlay,
    ModalContent,
} from '@chakra-ui/react'

function Reviews() {
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const navigate = useNavigate();
    const { user, loaded, error, authToken } = useSelector((state) => state.auth);
    const [hostName, setHostName] = useState("");
    const [hostApproxAddress, setHostApproxAddress] = useState("");
    const [hostReviewsCount, setHostReviewsCount] = useState(0);
    const [hostHygieneGrade, setHostHygieneGrade] = useState(0);
    const [stateRefresh, refreshState] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [hostID, setHostID] = useState("");
    const dispatch = useDispatch();
    const [initialUserLoginToastIgnore, setInitialUserLoginToastIgnore] = useState(true);
    const hostProfilePicture = `${import.meta.env.VITE_BACKEND_URL}/cdn/getProfilePicture?userID=${hostID}`;

    const getColorScheme = (hygieneGrade) => {
        if (hygieneGrade >= 5) return 'green';
        if (hygieneGrade >= 4) return 'teal';
        if (hygieneGrade >= 3) return 'yellow';
        if (hygieneGrade >= 2) return 'orange';
        if (hygieneGrade >= 1) return 'red';
        return 'gray';
    };

    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    }

    const colorScheme = getColorScheme(hostHygieneGrade);

    const fetchHostInfo = async () => {
        try {
            const response = await server.get(`/cdn/accountInfo?userID=${hostID}`);
            dispatch(reloadAuthToken(authToken))
            if (!response.data) {
                showToast("No host information found", "Please try again later.", 3000, true, "info")
                navigate('/')
                return
            } else {
                setHostName(response.data.username);
                setHostApproxAddress(response.data.approxAddress);
                setHostHygieneGrade(response.data.hygieneGrade);
                setHostReviewsCount(response.data.reviewsCount);
            }
        } catch (error) {
            dispatch(reloadAuthToken(authToken))
            showToast("Error fetching host information", "Please try again later", 3000, true, "error");
            console.error("Error fetching host info:", error);
            navigate('/')
            return
        }
    };

    useEffect(() => {
        if (loaded == true) {
            setInitialUserLoginToastIgnore(false);

            if (location.state && location.state.hostID) {
                setHostID(location.state.hostID);
            } else if (searchParams.has('hostID')) {
                setHostID(searchParams.get('hostID'));
            } else {
                showToast("Error", "Provide a host's information to see their reviews.", 3000, true, "error");
                navigate('/');
            }
        }
    }, [loaded])

    useEffect(() => {
        if (!user && !initialUserLoginToastIgnore) {
            showToast("Please log in", "Login to a MakanMatch account to like and submit reviews!", 3000, true, "info");
        }
    }, [user]);

    useEffect(() => {
        if (hostID) {
            fetchHostInfo();
        }
    }, [hostID, stateRefresh]);

    if (!loaded || !hostID) {
        return <Spinner />
    }

    return (
        <Box p={2} position="relative" width="100%">
            <Button
                onClick={handleGoBack}
                position='absolute'
                top={{ md: 10, base: 10 }}
                left={{ md: 4, base: 0 }}
                zIndex={10}
            >
                <ArrowBackIcon />
            </Button>
            <Flex direction={{ base: 'column', md: 'row' }} wrap='wrap' align='center' justify='center' >
                <Spacer display={{ base: 'none', md: 'block' }} minWidth="50px" maxWidth="50px" />
                <Box>
                    <Flex direction={{ base: 'column', md: 'row' }} align="center" mb={4} gap={3}>
                        <Spacer display={{ base: 'none', md: 'block' }} />
                        <Avatar
                            name={hostName}
                            boxSize='100px'
                            src={hostProfilePicture}
                            onClick={onOpen}
                            cursor="pointer"
                            ml={{ base: 0, md: 4 }}
                        />
                        <Spacer display={{ base: 'none', md: 'block' }} />
                        <Flex direction="column" align={{ base: 'center', md: 'left' }} ml={{ base: 0, md: 4 }} textAlign={{ base: 'center', md: 'left' }}>
                            <Text fontSize={{ base: '2xl', md: '4xl' }}>{hostName}</Text>
                        </Flex>
                        <Flex gap={3}>
                            <Spacer display={{ base: 'none', md: 'block' }} />
                            {hostReviewsCount > 0 && (
                                <>
                                    <Spacer display={{ base: 'none', md: 'block' }} />
                                    <Tooltip label={`Hygiene Rating for ${hostName}`} aria-label="Host Hygiene Rating tooltip">
                                        <Button variant="solid" colorScheme="blue" size="md" borderRadius="10px" cursor="default" >
                                            {hostHygieneGrade}
                                        </Button>
                                    </Tooltip>
                                </>
                            )}
                            <Spacer display={{ base: 'none', md: 'block' }} />
                            {user && user.userID && user.userID != hostID && user.userType !== "Host" && (
                                <SubmitReviews
                                    hostName={hostName}
                                    hostID={hostID}
                                    refreshState={refreshState}
                                    stateRefresh={stateRefresh}
                                />
                            )}
                        </Flex>
                    </Flex>
                </Box>
                <Spacer display={{ base: 'none', md: 'block' }} />
                <Box display="flex" justifyContent="center" alignItems="center" background="gray.200" borderRadius="15px" p={5} mb={4}>
                    <Flex alignItems="center" maxWidth="100%">
                        <Tooltip label="This box contains the host approximate address" aria-label="Host approximate address tooltip">
                            <InfoOutlineIcon mr={2} />
                        </Tooltip>
                        <Text fontSize="m" whiteSpace="normal" wordBreak="break-word">
                            {hostApproxAddress}
                        </Text>
                    </Flex>
                </Box>
            </Flex>
            <Heading mt={5} size="lg"><Text>Reviews</Text></Heading>
            <SortReviews
                hostID={hostID}
                refreshState={refreshState}
                stateRefresh={stateRefresh}
            />
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent maxW="max-content" background="transparent" boxShadow="none">
                    <Avatar
                        name={hostName}
                        boxSize={{ base: '60vw', md: '30vw' }}  // Responsive size for different screen sizes
                        src={hostProfilePicture}
                    />
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default Reviews