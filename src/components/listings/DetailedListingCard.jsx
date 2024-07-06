import { Box, Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, Link, Progress, Stack, Text } from "@chakra-ui/react";
import { InfoOutlineIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { FaWallet, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function DetailedListingCard() {
    const navigate = useNavigate();
    return (
        <>
            <style>
                {`
                    .ratingBox {
                        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
                        -webkit-touch-callout: none;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                    }
                `}
            </style>
            <Card maxW="md" maxH="78vh" borderRadius={6} overflow="hidden">
                <CardBody>
                    <Box position="relative" width="fit-content">
                        <Image
                            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                            alt="Green double couch with wooden legs"
                            borderRadius="5px"
                            minWidth="100%"
                            minHeight="175px"
                            maxHeight="175px"
                            objectFit="cover"
                            style={{ pointerEvents: "none" }}
                        />
                        <Text
                            borderRadius="50%"
                            height="40px"
                            width="40px"
                            boxShadow="0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            position="absolute"
                            top="10px"
                            left="10px"
                            zIndex="10"
                            backgroundColor="white"
                            cursor="pointer"
                            onClick={() => navigate("/")}>
                            <ArrowBackIcon height="50%" />
                        </Text>
                    </Box>
                    <Stack mt="3" spacing={0}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            flexDirection="row"
                            mt={2}
                            mb={2}
                        >
                            <Heading size="md" mt={-2}>Living room Sofa</Heading>
                            <Text mt={-2}>🤍</Text>
                        </Box>
                        <Box className="ratingBox">
                            <Box display="flex" alignItems="center">
                                <Text fontSize={"10px"} mr={1} ml={0.5}>1⭐️</Text>
                                <Progress
                                    colorScheme="green"
                                    size="sm"
                                    value={70}
                                    mb={2}
                                    borderRadius="5px"
                                    flex={1}
                                />
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Text fontSize={"10px"} mr={1}>2⭐️</Text>
                                <Progress
                                    colorScheme="green"
                                    size="sm"
                                    value={90}
                                    mb={2}
                                    borderRadius="5px"
                                    flex={1}
                                />
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Text fontSize={"10px"} mr={1}>3⭐️</Text>
                                <Progress
                                    colorScheme="green"
                                    size="sm"
                                    value={30}
                                    mb={2}
                                    borderRadius="5px"
                                    flex={1}
                                />
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Text fontSize={"10px"} mr={1}>4⭐️</Text>
                                <Progress
                                    colorScheme="green"
                                    size="sm"
                                    value={10}
                                    mb={2}
                                    borderRadius="5px"
                                    flex={1}
                                />
                            </Box>
                            <Box display="flex" alignItems="center">
                                <Text fontSize={"10px"} mr={1}>5⭐️</Text>
                                <Progress
                                    colorScheme="green"
                                    size="sm"
                                    value={20}
                                    borderRadius="5px"
                                    flex={1}
                                />
                            </Box>
                        </Box>
                        <Link mt={2} mb={-4} textAlign="left" color="blue" fontSize={"13px"}>View all reviews</Link>
                    </Stack>
                </CardBody>
                <Divider />
                <Box ml={4} mt={2} textAlign="left" fontSize={"15px"}>
                    <Box display="flex" justifyContent={"left"} mb={1}>
                        <Text mr={1}><InfoOutlineIcon fill="#515F7C" /></Text><Text ml={1}>Chilli Crab for Dinner</Text>
                    </Box>

                    <Box display="flex" justifyContent={"left"} mb={1}>
                        <Text mr={1} mt={1}><FaMapMarkerAlt fill="#515F7C" /></Text><Text ml={1}>Pasir Ris Ave 1</Text>
                    </Box>

                    <Box display="flex" justifyContent={"left"} mb={1}>
                        <Text mt={1.5} mr={1}><FaWallet fill="#515F7C" /></Text><Text flex={1} ml={1} mt={0.5}>$3.50 per pax</Text>
                    </Box>

                    <Box display="flex" justifyContent={"left"} mb={1}>
                        <Text mr={1} mt={0.5}><FaUser fill="#515F7C" /></Text><Text ml={1}>2 slots left</Text>
                    </Box>
                </Box>
                <CardFooter display="flex" justifyContent="center">
                    <ButtonGroup spacing="2">
                        <Button variant="MMPrimary" colorScheme="blue">
                            Proceed
                        </Button>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </>
    );
}

export default DetailedListingCard;
