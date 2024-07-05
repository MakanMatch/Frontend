import React, { useState, useEffect } from 'react'
import SubmitReviews from '../../components/reviews/SubmitReviews';
import SortReviews from '../../components/reviews/SortReviews';
import { Button, Box, Input, Flex, HStack, Text, Container, Image, Textarea, Spacer, useToast, Heading, Center, useClipboard, Tooltip } from '@chakra-ui/react';
import server from '../../networking';
import { ArrowBackIcon, PhoneIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import configureShowToast from '../../components/showToast';

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
    let hostID = searchParams.get('hostID'); // change to const afterwards
    if (!hostID) {
        hostID = "272d3d17-fa63-49c4-b1ef-1a3b7fe63cf4";
    }

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

    useEffect(() => {
        fetchHostInfo();
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
                        />
                        <Spacer display={{ base: 'none', md: 'block' }} />
                        <Flex direction="column" align={{ base: 'center', md: 'left' }} ml={{ base: 0, md: 4 }} textAlign={{ base: 'center', md: 'left' }}>
                            <Text fontSize={{ base: '2xl', md: '4xl' }}>{hostName}</Text>
                            <HStack spacing={2}>
                                <PhoneIcon />
                                <Tooltip label={hasCopied ? "Copied!" : "Click to copy"} closeOnClick={false}>
                                    <Text fontSize={{ base: 'sm', md: 'md' }} cursor="pointer" onClick={onCopy}>
                                        {hostContactNum}
                                    </Text>
                                </Tooltip>
                            </HStack>
                        </Flex>
                        <Flex gap={3}>
                            <Spacer display={{ base: 'none', md: 'block' }} />
                            <Button variant="solid" colorScheme={colorScheme} size="md" borderRadius="10px" cursor="default" >
                                {hostHygieneGrade}
                            </Button>
                            <Spacer display={{ base: 'none', md: 'block' }} />
                            <SubmitReviews />
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
            <SortReviews />
        </Box>
    )
}

export default Reviews