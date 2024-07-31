import { Box, Card, CardBody, Heading, Text, Image, CardFooter, FormControl, Input, useMediaQuery } from '@chakra-ui/react'
import Logo from '../../assets/Logo.png'
import { AddIcon } from '@chakra-ui/icons'
import { FaPaperPlane } from 'react-icons/fa'

function MakanBot() {
    const [isSmallerThan845] = useMediaQuery("(max-width: 845px)");
    return (
        <Box
            boxShadow={"0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"}
            borderRadius={"lg"}
            padding={15}
            display="flex"
            justifyContent="space-between"
            height={"80vh"}
        >
            {!isSmallerThan845 && (
                <Card width="24%">
                    <CardBody>
                        <Box display="flex" justifyContent={"center"} mt={-3}>
                            <Image src={Logo} height="100px" maxWidth="100px" />
                        </Box>
                        <Text fontSize={"25px"} textAlign="center" mt={-2} bgGradient={"linear(to-br, #ff86d6, #ffa14a)"} bgClip={"text"} fontFamily={"Short Stack"}>MakanBot</Text>
                        <Box
                            backgroundColor={"#F1F4FF"}
                            padding={3}
                            borderRadius={"3xl"}
                            cursor={"pointer"}
                            mt={2}
                            sx={{
                                transition: 'background-color 0.2s ease-in-out',
                                _hover: {
                                    backgroundColor: "#E2E8F0",
                                    transition: 'background-color 0.2s ease-in-out'
                                }
                            }}
                        >
                            <Box display="flex">
                                <AddIcon color={"#4A5568"} mt={1} ml={2}/>
                                <Text textAlign={"left"} ml={2} color="#4A5568">New chat</Text>
                            </Box>
                        </Box>
                    </CardBody>
                </Card>
            )}
            <Card width={isSmallerThan845 ? "100%" : "74%"}>
                <CardBody>
                    <Heading as="h1" size="lg" textAlign="center">MakanBot</Heading>
                    <Text textAlign="center" fontSize="xl">MakanBot is here to help you with any questions you may have!</Text>
                </CardBody>
                <CardFooter>
                    <Box display="flex" justifyContent={"space-between"} width="100%">
                        <Box width="100%">
                            <FormControl>
                                <Input type='text' borderRadius={"3xl"} width="95%" placeholder="Enter a prompt here" />
                            </FormControl>
                        </Box>
                        <Box
                            mt={2}
                            mr={2}
                            cursor={"pointer"}
                            sx={{ 
                                transition: 'transform 0.2s ease-in-out',
                                _hover: {
                                    transform: 'translateY(-5px)',
                                    transition: 'transform 0.2s ease-in-out'
                                } 
                            }}
                        >
                            <FaPaperPlane fontSize={"25px"} color="#515F7C" />
                        </Box>
                    </Box>
                </CardFooter>
            </Card>
        </Box>
    )
}

export default MakanBot