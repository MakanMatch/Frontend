import React, { useState, useEffect } from 'react'
import SubmitReviews from '../../components/reviews/SubmitReviews';
import SortReviews from '../../components/reviews/SortReviews';
import { Button, Box, Flex, HStack, Text, Image, Spacer, useToast, Heading, useClipboard, Tooltip } from '@chakra-ui/react';
import server from '../../networking';
import { ArrowBackIcon, PhoneIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import configureShowToast from '../../components/showToast';
import { useDisclosure } from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
} from '@chakra-ui/react'

function Reviews() {
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const navigate = useNavigate();
    const [hostName, setHostName] = useState("");
    const [hostAddress, setHostAddress] = useState("");
    const [hostContactNum, setHostContactNum] = useState(0);
    const [hostHygieneGrade, setHostHygieneGrade] = useState(0);
    const { onCopy, hasCopied } = useClipboard(hostContactNum)
    const [searchParams] = useSearchParams();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const hostID = searchParams.get('hostID');
    const guestID = searchParams.get('guestID');     

    const getColorScheme = (hygieneGrade) => {
        if (hygieneGrade >= 5) return 'green';
        if (hygieneGrade >= 4) return 'teal';
        if (hygieneGrade >= 3) return 'yellow';
        if (hygieneGrade >= 2) return 'orange';
        return 'red';
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
            if (!response.data) {
                showToast("No host information found", "Please try again later.", 3000, true, "info")
            } else {
                setHostName(response.data.username);
                setHostAddress(response.data.address);
                setHostContactNum(response.data.contactNum);
                setHostHygieneGrade(response.data.hygieneGrade);
            }
        } catch (error) {
            toast.closeAll();
            showToast("Error fetching host information", "Please try again later", 3000, true, "error");
            console.error("Error fetching host info:", error);
        }
    };

    const fetchGuestInfo = async () => {
        try {
            const response = await server.get(`/cdn/accountInfo?userID=${guestID}`);
            if (!response.data) {
                showToast("No guest information found", "Please try again later.", 3000, true, "info")
            }
        } catch (error) {
            toast.closeAll();
            showToast("Error fetching guest information", "Directing you back to homepage", 3000, true, "error");
            console.error("Error fetching guest info:", error);
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        }
    
    }

    useEffect(() => {
        fetchHostInfo();
        fetchGuestInfo();
    }, []);

    return (
        <Box p={2} position="relative" width="100%">
            <Button
                onClick={handleGoBack}
                position='absolute'
                top={{ md:10, base: 10}}
                left={{ md: 4, base: 0}}
                zIndex={10}
            >
                <ArrowBackIcon />
            </Button>
            <Flex direction={{ base: 'column', md: 'row' }} wrap='wrap' align='center' justify='center' >
                <Spacer display={{ base: 'none', md: 'block' }}  minWidth="50px" maxWidth="50px"/>
                <Box>
                    <Flex direction={{ base: 'column', md: 'row' }} align="center" mb={4} gap={3}>
                        <Spacer display={{ base: 'none', md: 'block' }} />
                        <Image
                            borderRadius='full'
                            boxSize='100px'
                            src='https://bit.ly/dan-abramov'
                            alt='Dan Abramov'
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
                            <Tooltip label={`Hygiene grade for ${hostName}`} aria-label="Hygiene grade tooltip">
                            <Button variant="solid" colorScheme={colorScheme} size="md" borderRadius="10px" cursor="default" >
                                {hostHygieneGrade}
                            </Button>
                            </Tooltip>
                            <Spacer display={{ base: 'none', md: 'block' }} />
                            <SubmitReviews 
                                hostName={hostName}
                                guestID={guestID}
                                hostID={hostID}
                            />
                        </Flex>
                    </Flex>
                </Box>
                <Spacer display={{ base: 'none', md: 'block' }} />
                <Box display="flex" justifyContent="center" alignItems="center" background="gray.200" borderRadius="15px" p={5} mb={4}>
                    <Flex alignItems="center" maxWidth="100%">
                        <Tooltip label="This box contains the host address" aria-label="Host address tooltip">
                            <InfoOutlineIcon mr={2} />
                        </Tooltip>
                        <Text fontSize="m" whiteSpace="normal" wordBreak="break-word">
                            {hostAddress}
                        </Text>
                    </Flex>
                </Box>
            </Flex>
            <Heading mt={5} size="lg"><Text>Reviews</Text></Heading>
            <SortReviews 
                hostID={hostID}
                guestID={guestID}
            />
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent maxW="max-content" background="transparent" boxShadow="none">
                        <Image
                            boxSize='500px'
                            borderRadius='full'
                            src='https://bit.ly/dan-abramov'
                            alt='Dan Abramov'
                        />
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default Reviews