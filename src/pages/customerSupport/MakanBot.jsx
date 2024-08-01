import { Box, Card, CardBody, Heading, Text, Image, CardFooter, FormControl, Input, useMediaQuery, useToast } from '@chakra-ui/react';
import Logo from '../../assets/Logo.png';
import { FaPaperPlane } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { reloadAuthToken } from '../../slices/AuthState';
import server from "../../networking";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { marked } from 'marked';

function MakanBot() {
    const [isSmallerThan880] = useMediaQuery("(max-width: 880px)");
    const [promptResult, setPromptResult] = useState("Having doubts? MakanBot is here to help.");
    const [conversationHistory, setConversationHistory] = useState([]);

    const toast = useToast();
    const dispatch = useDispatch();

    const authToken = useSelector((state) => state.auth.authToken);

    const suggestedPrompts = [
        {
            displayMessage: "Reservations",
            prompt: "As a guest, how could I reserve a meal slot?"
        },
        {
            displayMessage: "Payments",
            prompt: "How do I make payments for my meal?"
        },
        {
            displayMessage: "Cancellations",
            prompt: "How do I cancel a reservation?"
        },
        {
            displayMessage: "Host's reviews",
            prompt: "How do I view a host's profile and reviews?"
        },
        {
            displayMessage: "Hosting a meal",
            prompt: "As a host, how could I host a meal for the community?"
        }
    ]

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

    const autofillSuggestedPrompt = (prompt) => {
        document.getElementById("promptInput").value = prompt;
    }

    function cleanText(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        let decodedText = textarea.value;

        decodedText = decodedText.replace(/<\/?[^>]+(>|$)/g, "");

        decodedText = decodedText
            .replace(/(\*\*|__)/g, '') // Bold
            .replace(/(\*|_)/g, '') // Italic
            .replace(/~~/g, '') // Strikethrough
            .replace(/`/g, '') // Inline code
            .replace(/```[\s\S]*?```/g, '') // Code blocks
            .replace(/!\[.*?\]\(.*?\)/g, '') // Images
            .replace(/\[.*?\]\(.*?\)/g, '') // Links
            .replace(/^\s*\n/gm, '') // Remove empty lines
            .replace(/\n{2,}/g, '\n') // Reduce multiple newlines to a single newline
            .replace(/\\/g, "");

        return decodedText;
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
                const data = { messagePrompt: messagePrompt, conversationHistory: conversationHistory };
                const response = await server.post("/makanBot/queryMakanBotWithUserPrompt", data);
                dispatch(reloadAuthToken(authToken));
                if (response.status === 200) {
                    var convoHistory = [];
                    setConversationHistory(prevHistory => {
                        convoHistory.push(...prevHistory);
                        convoHistory.push({
                            role: "user",
                            content: cleanText(messagePrompt)
                        })
                        convoHistory.push({
                            role: "assistant",
                            content: cleanText(response.data.message)
                        });
                        return convoHistory;
                    });
                    setPromptResult(response.data.message);
                } else {
                    console.log("Non-200 status code response received when attempting to run MakanBot prompt; response: ", response.data)
                    displayToast("Failed to process prompt", response.message, "error", 3000, true);
                }
            } catch (err) {
                dispatch(reloadAuthToken(authToken));
                if (err.response && err.response.data && typeof err.response.data == "string") {
                    if (err.response.data.startsWith("UERROR")) {
                        console.log("User error occurred in running MakanBot prompt; response: ", err.response.data)
                        displayToast("Something went wrong", err.response.data.substring("UERROR: ".length), "error", 3000, true);
                    } else {
                        if (err.response.data == "ERROR: OpenAIChat is not available at this time.") {
                            console.log("Server informed that MakanBot is unavaiable.")
                            displayToast("Oops!", "MakanBot is not available at this time. Please try again later!", "info", 3000, true);
                            return;
                        }
                        console.log("Error occurred in running MakanBot prompt; response: ", err.response.data)
                        displayToast("Something went wrong", "Failed to run prompt. Please try again!", "error", 3000, true);
                    }
                } else {
                    console.log("Unknown error occurred in running MakanBot prompt; error: ", err)
                    displayToast("Something went wrong", "Failed to run prompt. Please try again!", "error", 3000, true);
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
        <>
            <style>
                {`
                    ::-webkit-scrollbar {
                        display: none;
                    }
                `}
            </style>
            <Box
                boxShadow={"0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"}
                borderRadius={"lg"}
                padding={15}
                display="flex"
                justifyContent="space-between"
                height={"80vh"}
                minW={"202px"}
            >
                {!isSmallerThan880 && (
                    <Card width="29%">
                        <CardBody>
                            <Heading fontSize="22px" mb={5} textAlign={"left"} fontWeight={"bold"} color="grey">Suggested topics: </Heading>
                            {suggestedPrompts.map((prompt, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Box
                                        backgroundColor={"#F1F4FF"}
                                        padding={3}
                                        borderRadius={"3xl"}
                                        cursor={"pointer"}
                                        mb={4}
                                        sx={{
                                            transition: 'background-color 0.2s ease-in-out',
                                            _hover: {
                                                backgroundColor: "#E2E8F0",
                                                transition: 'background-color 0.2s ease-in-out'
                                            }
                                        }}
                                    >
                                        <Text textAlign={"center"} ml={2} color="#4A5568" maxHeight="36px" overflow="hidden" textOverflow={"ellipsis"} onClick={() => autofillSuggestedPrompt(prompt.prompt)}>{prompt.displayMessage}</Text>
                                    </Box>
                                </motion.div>
                            ))}
                        </CardBody>
                        <CardFooter display="flex" flexDir={"column"} mt={-4}>
                            <Box display="flex" justifyContent={"center"} mt={-3}>
                                <Image src={Logo} height="100px" maxWidth="100px" />
                            </Box>
                            <Text fontSize={"25px"} textAlign="center" mt={-2} bgGradient={"linear(to-br, #ff86d6, #ffa14a)"} bgClip={"text"} fontFamily={"Short Stack"}>MakanBot</Text>
                        </CardFooter>
                    </Card>
                )}
                <Card width={isSmallerThan880 ? "100%" : "69%"}>
                    <CardBody>
                        <Heading as="h1" size="lg" textAlign="center" mb={5} bgGradient={"linear(to-br, #ff86d6, #ffa14a)"} bgClip={"text"} fontFamily={"Short Stack"}>MakanBot</Heading>
                        <Box
                            position="relative"
                            height="100%"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            overflow="hidden"
                        >
                            <Box
                                backgroundColor="#F1F4FF"
                                width={isSmallerThan880 ? "100%" : "80%"}
                                height="auto"
                                maxHeight="308px"
                                borderRadius="2xl"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                                overflow="scroll"
                                padding={10}
                            >
                                <motion.div
                                    key={promptResult}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ margin: 'auto', textAlign: promptResult === "Having doubts? MakanBot is here to help." ? 'center' : 'left' }}
                                    // Render Markdown as HTML
                                    dangerouslySetInnerHTML={{ __html: marked(promptResult) }}
                                />
                            </Box>
                        </Box>
                    </CardBody>
                    <CardFooter>
                        <Box display="flex" justifyContent={"space-between"} width="100%">
                            <Box width="100%">
                                <FormControl>
                                    <Input id="promptInput" type='text' borderRadius={"3xl"} padding={5} width="95%" placeholder="Enter a prompt here" onKeyDown={handleKeyDown} />
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
        </>
    );
}

export default MakanBot;