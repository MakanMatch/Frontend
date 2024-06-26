import React, { useState, useEffect } from 'react'
import SubmitReviews from '../../components/reviews/SubmitReviews';
import SortReviews from '../../components/reviews/SortReviews';
import { Button, Box, Input, Flex, Card, Text, Container, Image, Textarea, Spacer, useToast, Heading, Center } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import server from '../../networking'
import { ArrowBackIcon, PhoneIcon, InfoOutlineIcon } from '@chakra-ui/icons';

function Reviews() {
    const toast = useToast();
    const [reviews, setReviews] = useState([]);
    const [hostName, setHostName] = useState("");
    const [hostAddress, setHostAddress] = useState("");
    const [hostContactNum, setHostContactNum] = useState(0);
    const [hostHygieneGrade, setHostHygieneGrade] = useState(0);

    function ShowToast(title, description, status, duration) {
        toast({
            title: title,
            description: description,
            status: status,
            duration: duration,
            isClosable: false,
        });
    }

    const getColorScheme = (hygieneGrade) => {
        if (hygieneGrade >= 5) return 'green';
        if (hygieneGrade >= 4) return 'teal';
        if (hygieneGrade >= 3) return 'yellow';
        if (hygieneGrade >= 2) return 'orange';
        return 'red';
    };

    const colorScheme = getColorScheme(hostHygieneGrade);

    const fetchReviews = async () => {
        try {
            const response = await server.get(`/cdn/getReviews?hostID=${"272d3d17-fa63-49c4-b1ef-1a3b7fe63cf4"}&order=${"mostRecent"}`); //hardcoded hostID and order
            setReviews(response.data);
        } catch (error) {
            toast.closeAll();
            ShowToast(
                "Error fetching reviews",
                "Please try again later.",
                "error",
                2500
            );
            console.error("Error fetching reviews:", error);
        }
    }

    const fetchHostInfo = async () => {
        try {
            const response = await server.get(`/cdn/accountInfo?userID=${"272d3d17-fa63-49c4-b1ef-1a3b7fe63cf4"}`);
            setHostName(response.data.username);
            setHostAddress(response.data.address);
            setHostContactNum(response.data.contactNum);
            setHostHygieneGrade(response.data.hygieneGrade);
        } catch (error) {
            toast.closeAll();
            ShowToast(
                "Error fetching host information",
                "Please try again later.",
                "error",
                2500
            );
            console.error("Error fetching host info:", error);
        }
    };

    useEffect(() => {
        fetchReviews();
        fetchHostInfo();
    }, []);

    return (
        <Box p={4}>
            <Flex>
                <Box>
                    <Flex direction="row" align="center" mb={4} gap={3}>
                        <Button><ArrowBackIcon /></Button>
                        <Spacer />
                        <Image
                            borderRadius='full'
                            boxSize='100px'
                            src='https://bit.ly/dan-abramov'
                            alt='Dan Abramov'
                        />
                        <Spacer />
                        <Flex direction="column" align="left" ml={4}>
                            <Text fontSize="4xl">{hostName}</Text>
                            <Flex direction="row" align="center" gap={2}>
                                <PhoneIcon />
                                <Text fontSize="md">{hostContactNum}</Text>
                            </Flex>
                        </Flex>
                        <Spacer />
                        <Button variant="solid" colorScheme={colorScheme} size="md" borderRadius="10px">
                            {hostHygieneGrade}
                        </Button>
                        <Spacer />
                        <SubmitReviews />
                    </Flex>
                </Box>
                <Spacer />
                <Box display="flex" justifyContent="center" alignItems="center" background="gray.200" borderRadius="20px" p={3}>
                    <Flex alignItems="center" maxWidth="100%">
                        <InfoOutlineIcon mr={2} />
                        <Text fontSize="xl" whiteSpace="normal" wordBreak="break-word">
                            {hostAddress}
                        </Text>
                    </Flex>
                </Box>
            </Flex>
            <SortReviews />
        </Box>
    )
}

export default Reviews