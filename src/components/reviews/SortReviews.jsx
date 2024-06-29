import React, { useState, useEffect } from 'react';
import { Button, Box, Input, Flex, Text, Container, Image, Textarea, Spacer, Icon, Heading, Avatar, useToast } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { BiLike } from 'react-icons/bi';
import { FaUtensils, FaSoap } from "react-icons/fa";
import server from '../../networking'

function SortReviews() {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState(0)
    const [reviews, setReviews] = useState([])

    const fetchReviews = async (hostID, sortOrder) => {
        try {
            const response = await server.get(`/cdn/getReviews?hostID=${hostID}&order=${sortOrder}`); //hardcoded hostID
            if (response.status == 200 && response.data) {
                setReviews(response.data);
                const reviewsWithGuestInfo = await Promise.all(response.data.map(async (review) => {
                    const guestInfoResponse = await server.get(`/cdn/accountInfo?userID=${review.guestID}`);
                    if (guestInfoResponse.data) {
                        review.guestInfo = guestInfoResponse.data;
                    } else {
                        review.guestInfo = null;
                    }
                    return review;
                }));
                setReviews(reviewsWithGuestInfo);
            } else if (response.data && response.data.startsWith("ERROR")) {
                toast({
                    title: "No reviews found",
                    description: "Please try again later.",
                    status: 'info',
                    duration: 2500,
                    isClosable: false,
                });
            }
        } catch (error) {
            toast({
                title: "An error occurred",
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    }

    useEffect(() => {
        let sortOrder = ""
        switch (activeTab) {
            case 0:
                sortOrder = "mostRecent"
                break;
            case 1:
                sortOrder = "highestRating"
                break;
            case 2:
                sortOrder = "lowestRating"
                break;
            case 3:
                sortOrder = "images"
                break;
            default:
                sortOrder = "mostRecent"
                break;
        }
        fetchReviews("272d3d17-fa63-49c4-b1ef-1a3b7fe63cf4", sortOrder); //hardcoded hostID, should be dynamic, retrieve from URL
    }, [activeTab]);

    return (
        <Tabs mt={8} variant="soft-rounded" size='sm' minWidth="310px" onChange={(index) => setActiveTab(index)}>
            <TabList justifyContent='center' >
                <Tab><Text>Most Recent</Text></Tab>
                <Tab><Text>Highest Rating</Text></Tab>
                <Tab><Text>Lowest Rating</Text></Tab>
                <Tab><Text>Images</Text></Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    {reviews.map(review => (
                        <Card maxW='md' variant="elevated" key={review.reviewID}>
                            <CardHeader>
                                <Flex spacing='4'>
                                    <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                                        {review.guestInfo ? (
                                            <Avatar name={review.guestInfo.username} src='https://bit.ly/sage-adebayo' />
                                        ) : (
                                            <Avatar src='https://bit.ly/sage-adebayo' />
                                        )}
                                        <Box>
                                            <Heading textAlign="left" size='sm'>{review.guestInfo ? review.guestInfo.username : "Guest"}</Heading>
                                            <Flex gap={3}>
                                                <Flex gap={3}>
                                                    <Box pt="4px">
                                                        <FaUtensils />
                                                    </Box>
                                                    <Text>{review.foodRating}</Text>
                                                </Flex>
                                                <Flex gap={3}>
                                                    <Box pt="2px">
                                                        <FaSoap />
                                                    </Box>
                                                    <Text>{review.hygieneRating}</Text>
                                                </Flex>
                                            </Flex>
                                        </Box>
                                    </Flex>
                                    <Text>{new Date(review.dateCreated).toLocaleDateString()}</Text>
                                </Flex>
                            </CardHeader>
                            <CardBody>
                                <Text textAlign="left">
                                    {review.comments}
                                </Text>
                            </CardBody>
                            {/* {review.image && (
                                <Image
                                    objectFit='cover'
                                    src={review.image}
                                    alt='Review Image'
                                />
                            )} */}
                            <CardFooter
                                justify='space-between'
                                flexWrap='wrap'
                                sx={{
                                    '& > button': {
                                        minW: '136px',
                                    },
                                }}
                            >
                                <Button flex='1' variant='ghost' leftIcon={<BiLike />}>
                                    Like
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </TabPanel>
                <TabPanel>
                    <p>Highest Rating Reviews</p>
                </TabPanel>
                <TabPanel>
                    <p>Lowest Rating Reviews</p>
                </TabPanel>
                <TabPanel>
                    <p>Images Reviews</p>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default SortReviews