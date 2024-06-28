import React, { useState } from 'react'
import { Button, Card, CardBody, CardFooter, TabPanel, Heading, Image, Text, Box, SlideFade, CardHeader, Flex, Avatar} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { BiLike } from 'react-icons/bi';
import { FaUtensils, FaSoap } from "react-icons/fa";

const CreateReview = ({
    key,
    username,
    foodRating,
    hygieneRating,
    dateCreated,
    comments,
    images,
    likeCount,
}) => {

    const [imageIndex, setImageIndex] = useState(0);
    const handlePrevImage = () => {
        if (imageIndex === 0) {
            setImageIndex(images.length - 1);
        } else {
            setImageIndex(imageIndex - 1);
        }
    }
    const handleNextImage = () => {
        if (imageIndex === images.length - 1) {
            setImageIndex(0);
        } else {
            setImageIndex(imageIndex + 1);
        }
    }

    return (
        <TabPanel>
            <Card maxW='md' variant="elevated" key={key}>
                <CardHeader>
                    <Flex spacing='4'>
                        <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                            {username ? (
                                <Avatar name={username} src='https://bit.ly/sage-adebayo' />
                            ) : (
                                <Avatar src='https://bit.ly/sage-adebayo' />
                            )}
                            <Box>
                                <Heading textAlign="left" size='sm'>{username ? username : "Guest"}</Heading>
                                <Flex gap={3}>
                                    <Flex gap={3}>
                                        <Box pt="4px">
                                            <FaUtensils />
                                        </Box>
                                        <Text>{foodRating}</Text>
                                    </Flex>
                                    <Flex gap={3}>
                                        <Box pt="2px">
                                            <FaSoap />
                                        </Box>
                                        <Text>{hygieneRating}</Text>
                                    </Flex>
                                </Flex>
                            </Box>
                        </Flex>
                        <Text>{new Date(dateCreated).toLocaleDateString()}</Text>
                    </Flex>
                </CardHeader>
                <CardBody>
                    <Text textAlign="left">
                        {comments}
                    </Text>
                </CardBody>
                {images.length > 0 && (
                    <Box position="relative">
                        {images.length > 1 && (
                            <Box position={"absolute"} top="50%" transform="translateY(-50%)" width={"100%"}>
                                <ChevronLeftIcon boxSize={8} ml={-1} mt={-4} onClick={handlePrevImage} color={"#A9A9A9"} _hover={{ cursor: "pointer", color: "#515F7C", transition: "0.2s ease" }} position={"absolute"} left="-5" zIndex={1} />
                                <ChevronRightIcon boxSize={8} mr={-1} mt={-4} onClick={handleNextImage} color={"#A9A9A9"} _hover={{ cursor: "pointer", color: "#515F7C", transition: "0.2s ease" }} position={"absolute"} right="-5" zIndex={1} />
                            </Box>
                        )}
                        <SlideFade in={true} offsetY="20px">
                            <Image
                                key={images[imageIndex]}
                                src={images[imageIndex]}
                                alt="Food listing image"
                                borderRadius="lg"
                                minWidth={"100%"}
                                minHeight={"108px"}
                                maxHeight={"108px"}
                                objectFit="cover"
                                style={{ pointerEvents: "none" }}
                            />
                        </SlideFade>
                    </Box>

                )}
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
                        Like {likeCount}
                    </Button>
                </CardFooter>
            </Card>
        </TabPanel>
    )
}

export default CreateReview