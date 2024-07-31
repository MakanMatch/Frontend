import { Box, Card, CardBody, Heading, Text, Image, CardFooter, FormControl, Input, useMediaQuery, useToast } from '@chakra-ui/react';
import Logo from '../../assets/Logo.png';
import { AddIcon } from '@chakra-ui/icons';
import { FaPaperPlane } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { reloadAuthToken } from '../../slices/AuthState';
import server from "../../networking";
import { motion } from 'framer-motion';
import { useState } from 'react';

function MakanBot() {
    const [isSmallerThan845] = useMediaQuery("(max-width: 845px)");
    const [promptResult, setPromptResult] = useState("Having doubts? MakanBot is here to help.");

    const toast = useToast();
    const dispatch = useDispatch();

    const authToken = useSelector((state) => state.auth.authToken);

    function displayToast(title, description, status, duration, isClosable) {
        toast.closeAll();
        toast({
            title: title,
            description: description,
            status: status,
            duration: duration,
            isClosable: isClosable
        });
    }

    const handleSubmitPrompt = async () => {
        const messagePrompt = document.getElementById("promptInput").value;
        if (messagePrompt.trim() === "") {
            displayToast("Prompt cannot be empty", "Please enter a valid prompt", "error", 3000, true);
            return;
        } else {
            setPromptResult("Hold tight! MakanBot is processing your request...");
            document.getElementById("promptInput").value = "";
            try {
                const response = await server.post("/makanBot/queryMakanBotWithUserPrompt", { messagePrompt: messagePrompt });
                dispatch(reloadAuthToken(authToken));
                if (response.status === 200) {
                    setPromptResult(response.data.message);
                }
            } catch (error) {
                dispatch(reloadAuthToken(authToken));
                if (error.response && error.response.data && typeof error.response.data === "string") {
                    console.log("Failed to add listing; response: " + error.response);
                    if (error.response.data.startsWith("UERROR")) {
                        displayToast(
                            "Uh-oh!",
                            error.response.data.substring("UERROR: ".length),
                            "info",
                            3500,
                            true
                        );
                    } else {
                        displayToast(
                            "Something went wrong",
                            "Failed to add listing. Please try again",
                            "error",
                            3500,
                            true
                        );
                    }
                } else {
                    console.log("Unknown error occurred when adding listing; error: " + error);
                    displayToast(
                        "Something went wrong",
                        "Failed to add listing. Please try again",
                        "error",
                        3500,
                        true
                    );
                }
            }
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSubmitPrompt();
        }
    };

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
                    <Box backgroundColor={"#F1F4FF"} width="80%" height="70%" margin="auto" borderRadius={"2xl"} mt={5} display="flex" justifyContent={"center"}>
                        <motion.div
                            key={promptResult}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            style={{ margin: 'auto' }}
                        >
                            <Text>{promptResult}</Text>
                        </motion.div>
                    </Box>
                </CardBody>
                <CardFooter>
                    <Box display="flex" justifyContent={"space-between"} width="100%">
                        <Box width="100%">
                            <FormControl>
                                <Input id="promptInput" type='text' borderRadius={"3xl"} width="95%" placeholder="Enter a prompt here" onKeyDown={handleKeyDown} />
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
                            <FaPaperPlane fontSize={"25px"} color="#515F7C" onClick={handleSubmitPrompt} />
                        </Box>
                    </Box>
                </CardFooter>
            </Card>
        </Box>
    );
}

export default MakanBot;