import React, { useState, useEffect } from 'react';
import { Button, Box, Input, Flex, Text, Container, Image, Textarea, Spacer, Icon, Heading, Avatar } from '@chakra-ui/react';
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { BiLike } from 'react-icons/bi';
import { FaUtensils,FaSoap } from "react-icons/fa";
import server from '../../networking'

function SortReviews() {

    return (
        <Tabs mt={8} variant="soft-rounded" size='sm' minWidth="310px">
            <TabList justifyContent='center' >
                <Tab><Text>Most Recent</Text></Tab>
                <Tab><Text>Highest Rating</Text></Tab>
                <Tab><Text>Lowest Rating</Text></Tab>
                <Tab><Text>Images</Text></Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Card maxW='md' variant="elevated">
                        <CardHeader>
                            <Flex spacing='4'>
                                <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                                    <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
                                    <Box>
                                        <Heading textAlign="left" size='sm'>Segun Adebayo</Heading>
                                        <Flex gap={3}>
                                            <Flex gap={3}>
                                                <Box pt="4px">
                                                <FaUtensils/>
                                                </Box>
                                                <Text>5</Text>
                                            </Flex>
                                            <Flex gap={3}>
                                                <Box pt="2px">
                                                <FaSoap/>
                                                </Box>
                                                <Text>5</Text>
                                            </Flex>
                                        </Flex>
                                    </Box>
                                </Flex>
                                <Text>2024/2/2</Text>
                            </Flex>
                        </CardHeader>
                        <CardBody>
                            <Text textAlign="left">
                                With Chakra UI, I wanted to sync the speed of development with the speed
                                of design. I wanted the developer to be just as excited as the designer to
                                create a screen.
                            </Text>
                        </CardBody>
                        <Image
                            objectFit='cover'
                            src='https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                            alt='Chakra UI'
                        />

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