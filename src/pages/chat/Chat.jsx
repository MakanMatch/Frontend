import React, { useState, useEffect, useRef } from "react";
import { Box, Input, Text, Center, Flex, VStack, Spacer, IconButton, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Avatar, useToast, Spinner } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import ChatBubble from "../../components/chat/ChatBubble";
import ChatHistory from "../../components/chat/ChatHistory";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeAuthToken, fetchUser, logout } from "../../slices/AuthState";
import configureShowToast from "../../components/showToast";
import { FaCamera } from "react-icons/fa";
import server from '../../networking';

function ChatUi() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [editMessageId, setEditMessageId] = useState(null);
    const [editMessageContent, setEditMessageContent] = useState("");
    const [chatHistory, setChatHistory] = useState([]); // Array of chat IDs
    const [chatPartnerUsernames, setChatPartnerUsernames] = useState({}); // Object to map chat ID to username
    const [chatSelected, setChatSelected] = useState(null);
    const [status, setStatus] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // New state for image preview
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false); // New state for image preview modal
    const [imageName, setImageName] = useState(""); // New state for image name
    const [confirmedImage, setConfirmedImage] = useState(""); // New state for confirmed image
    const chatBottomRef = useRef(null);
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const { user, loaded, error, authToken } = useSelector((state) => state.auth);
    const ws = useRef(null);

    function getImageLink (userID, imageName) {
        if (!userID || !imageName) {
            return null;
        }
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getImageForChat?userID=${userID}&imageName=${imageName}`;
    }
    function setupWS() {
        const wsUrl = import.meta.env.VITE_BACKEND_WS_URL;
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            localStorage.setItem("wsConnected", "true");
            console.log("Connected to WebSocket server!");
            ws.current.send(
                JSON.stringify({
                    action: "connect",
                    authToken: authToken,
                })
            );
        };

        ws.current.onmessage = async (event) => {
            let receivedMessage;
            if (event.data instanceof Blob) {
                const text = await event.data.text();
                try {
                    receivedMessage = JSON.parse(text);
                } catch (error) {
                    console.error("Error parsing message from Blob:", error);
                    return;
                }
            } else {
                try {
                    receivedMessage = JSON.parse(event.data);
                } catch (error) {
                    console.error("Error parsing message:", error);
                    return;
                }
            }

            if (receivedMessage.event && typeof receivedMessage.event == "string") {
                if (receivedMessage.event == "error") {
                    console.log("Error message from server: " + receivedMessage.message)
                    if (typeof receivedMessage.message == "string") {
                        if (receivedMessage.message == "ERROR: TokenExpiredError") {
                            dispatch(logout());
                            localStorage.removeItem('jwt')
                            localStorage.setItem("intentionalWSClose", "true")
                            navigate("/auth/login");
                            showToast("Please login first", "Your session has expired. Please login again.", 3500, true, "error")
                        } else if (receivedMessage.message.startsWith("UERROR")) {
                            showToast("Something went wrong", receivedMessage.message.substring("UERROR: ".length), 1500, true, "error")
                        } else {
                            showToast("Something went wrong", "An error occurred. Try refreshing.", 1500, true, "error")
                        }
                    } else {
                        showToast("Something went wrong", "An error occurred. Try refreshing.", 1500, true, "error")
                    }
                    return;
                } else if (receivedMessage.event == "refreshToken") {
                    if (receivedMessage.token) {
                        console.log(receivedMessage.message)
                        dispatch(changeAuthToken(receivedMessage.token))
                        localStorage.setItem('jwt', receivedMessage.token);
                    }
                }
            }
        
            if (receivedMessage.action === "chat_id") {
                setChatHistory((prevChatHistory) => {
                    if (!prevChatHistory.includes(receivedMessage.chatID)) {
                        return [...prevChatHistory, receivedMessage.chatID];
                    }
                    return prevChatHistory;
                });
                if (receivedMessage.username1 === user.username) {
                    setChatPartnerUsernames((prevUsernames) => ({
                        ...prevUsernames,
                        [receivedMessage.chatID]: receivedMessage.username2,
                    }));
                } else {
                    setChatPartnerUsernames((prevUsernames) => ({
                        ...prevUsernames,
                        [receivedMessage.chatID]: receivedMessage.username1,
                    }));
                }
            } else if (receivedMessage.action === "chat_history") {
                setMessages(receivedMessage.previousMessages);
                setStatus(receivedMessage.currentStatus);
            } else if (receivedMessage.action === "send") {
                console.log("Received message: ", receivedMessage)
                setMessages((prevMessages) => [
                    ...prevMessages,
                    receivedMessage.message,]);
            } else if (receivedMessage.action === "edit") {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.messageID === receivedMessage.messageID
                            ? { ...msg, message: receivedMessage.message, edited: true }
                            : msg
                    )
                );
            } else if (receivedMessage.action === "delete") {
                setMessages((prevMessages) =>
                    prevMessages.filter(
                        (msg) => msg.messageID !== receivedMessage.messageID
                    )
                );
            } else if (receivedMessage.action === "chat_partner_offline") {
                console.log(`Received chatID ${receivedMessage.chatID}`)
                console.log(`Selected chatID ${localStorage.getItem("selectedChatID")}`)
                if (receivedMessage.chatID == localStorage.getItem("selectedChatID")) {
                    console.log("Chat partner is offline")
                    setStatus(false);
                }
            } else if (receivedMessage.action === "chat_partner_online") {
                console.log(`Received chatID ${receivedMessage.chatID}`)
                console.log(`Selected chatID ${localStorage.getItem("selectedChatID")}`)
                if (receivedMessage.chatID == localStorage.getItem("selectedChatID")) {
                    console.log("Chat partner is online")
                    setStatus(true);
                }
            } else {
                showToast("Something went wrong", "Unknown response received from server.", 1500, true, "error")
            }
        };

        ws.current.onerror = (error) => {
            showToast("Something went wrong", "Your connection was interrupted. Try refreshing.", 1500, true)
            console.log("WebSocket error occurred: " + error)
        };

        ws.current.onclose = () => {
            localStorage.removeItem("wsConnected")
            console.log("Disconnected from WebSocket server");
            if (localStorage.getItem("intentionalWSClose") == "true") {
                console.log("WebSocket connection closed intentionally.")
                localStorage.removeItem("intentionalWSClose")
            } else {
                showToast("Something went wrong", "Your connection was interrupted. Try refreshing.", 1500, true, "error")
            }
        };
    }

    useEffect(() => {
        if (!loaded) {
            dispatch(fetchUser());
        }
    }, [loaded]);

    useEffect(() => {
        window.onbeforeunload = (event) => {
            const e = event || window.event;
            e.preventDefault();
            if (e) {
                e.returnValue = ''
            }

            localStorage.removeItem("wsConnected")
            return ''
        }

        if (loaded == true) {
            if (!user) {
                navigate("/auth/login");
                showToast(
                    "Please login first",
                    "You need to login to use chat features.",
                    3500,
                    true,
                    "error"
                );
                return;
            }

            if (localStorage.getItem("wsConnected") !== "true") {
                setupWS();
            }
        }
    }, [loaded]);

    useEffect(() => {
        return () => {
            try {
                localStorage.setItem("intentionalWSClose", "true")
                ws.current.close();
            } catch (err) {
                console.log("Couldn't close socket connection; error: ", err)
            }
        }
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (ws.current && messageInput.trim() !== "" && (image === null || (image !== null && messageInput.trim() !== ""))) {
            const imagesToBeSubmitted = image ? true : false;
            const newMessage = {
                action: "send",
                senderID: user.userID,
                chatID: chatSelected,
                message: messageInput,
                datetime: new Date().toISOString(),
                replyToID: replyTo ? replyTo.messageID : null,
            };
    
            if (imagesToBeSubmitted) {
                const formData = new FormData();
                formData.append("image", image);
    
                try {
                    const response = await server.post("/chat/uploadImage", formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        transformRequest: formData => formData
                    });
    
                    console.log(response);
                    if (response.status === 200) {
                        const imageName = response.data.imageName;
                        const messageWithImage = {  
                            action: "finalise_send",
                            imageName: imageName,
                            message: newMessage,
                        };
    
                        ws.current.send(JSON.stringify(messageWithImage));
                    }
                } catch (error) {
                    console.error("Error uploading image: ", error);
                    showToast("Something went wrong", "Error uploading image. Try again.", 1500, true, "error");
                }
            } else {
                ws.current.send(JSON.stringify(newMessage));
            }
    
            setMessageInput("");
            setReplyTo(null);
        }
    };
    

    const fetchChatHistory = (chatID) => {
        if (ws.current) {
            const request = {
                action: "chat_history",
                userID: user.userID,
                chatID: chatID,
            };
            ws.current.send(JSON.stringify(request));
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    const openEditModal = (messageId, currentMessage) => {
        setEditMessageId(messageId);
        setEditMessageContent(currentMessage);
    };

    const closeEditModal = () => {
        setEditMessageId(null);
        setEditMessageContent("");
    };

    const handleEditMessage = () => {
        if (editMessageId && editMessageContent.trim() !== "") {
            const editedMessage = {
                id: editMessageId,
                userID: user.userID,
                chatID: chatSelected,
                action: "edit",
                sender: user.username,
                message: editMessageContent,
                datetime: new Date().toISOString(),
            };
            ws.current.send(JSON.stringify(editedMessage));
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.messageID === editMessageId
                        ? { ...msg, message: editMessageContent, edited: true }
                        : msg
                )
            );
            closeEditModal();
        }
    };

    const handleDeletePrompt = (messageId) => {
        setMessageToDelete(messageId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteMessage = () => {
        console.log(chatSelected);
        if (messageToDelete) {
            const deleteMessage = {
                id: messageToDelete,
                userID: user.userID,
                action: "delete",
                chatID: chatSelected,
            };
            ws.current.send(JSON.stringify(deleteMessage));
            setDeleteDialogOpen(false);
            setMessageToDelete(null);
        }
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    const handleReply = (message) => {
        setReplyTo(message);
    };

    const cancelReply = () => {
        setReplyTo(null);
    };

    const scrollToBottom = () => {
        if (chatBottomRef.current) {
            chatBottomRef.current.scrollIntoView();
        }
    };

    const formatDate = (date) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const shouldDisplayDate = (currentMessage, previousMessage) => {
        if (!previousMessage) return true;
        const currentDate = new Date(currentMessage.datetime).toDateString();
        const previousDate = new Date(previousMessage.datetime).toDateString();
        return currentDate !== previousDate;
    };

    const handleChatClick = (clickedChatID) => {
        console.log("Clicked: ", clickedChatID)
        setChatSelected((prev) => {
            if (prev == null) {
                localStorage.setItem("selectedChatID", clickedChatID)
                return clickedChatID
            } else if (prev != clickedChatID) {
                localStorage.setItem("selectedChatID", clickedChatID)
                return clickedChatID
            } else {
                localStorage.removeItem("selectedChatID")
                return null
            }
        });
        fetchChatHistory(clickedChatID);
    };

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setImageName(file.name);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
                setImagePreviewOpen(true); // Open the preview popup
            };
            reader.readAsDataURL(file);
        }
    }

    function handleImagePreviewClose() {
        setImagePreviewOpen(false);
    }

    function handleConfirmImage() {
        setConfirmedImage(imageName); // Set confirmed image
        setImagePreviewOpen(false);
    }

    if (!loaded || !user) {
        return <Spinner />
    }

    return (
        <Flex>
            <ChatHistory
                onUserClick={handleChatClick}
                chatHistory={chatHistory}
                chatPartnerUsernames={chatPartnerUsernames}
            />

            {chatSelected != null ? (
                <Center flexDirection="column" alignItems="center" p={5} flex="1">
                    <Box
                        bg="white"
                        w="75%"
                        p={2}
                        borderRadius={20}
                        h="auto"
                        textColor="black"
                        alignItems="center"
                        display="flex"
                        boxShadow={"0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"}
                        mb={4}
                        mt={-4}
                    >
                        <Avatar
                            name={chatPartnerUsernames[chatSelected]}
                            borderRadius="full"
                            w={{ base: "20%", md: "10%" }}
                            h="100%"
                            minH={"55px"}
                            maxH={"55px"}
                            minW={"55px"}
                            maxW={"55px"}
                        />
                        <Box mt={-10} ml={{ base: 0, md: 5 }} minW={"495px"}>
                            <Text fontSize={20} mt={2} textAlign={"left"}>
                                {chatPartnerUsernames[chatSelected]
                                    ? chatPartnerUsernames[chatSelected]
                                    : "Chat"}
                            </Text>
                            <Spacer h={3} />
                            <Text
                                fontSize="sm"
                                mb={-8}
                                textAlign={"left"}
                                color={status ? "green.500" : "gray.300"}
                            >
                                {status ? "Online" : "Offline"}
                            </Text>
                        </Box>
                    </Box>
                    <Box
                        bg="gray.100"
                        w="75%"
                        h="70vh"
                        p={4}
                        display="flex"
                        flexDirection="column"
                        borderRadius={20}
                        boxShadow={"0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"}
                    >
                        <VStack spacing={4} align="stretch" flex="1" overflowY="auto">
                            {messages.map((msg, index) => (
                                <React.Fragment key={msg.messageID}>
                                    {shouldDisplayDate(msg, messages[index - 1]) && (
                                        <Text
                                            fontSize="sm"
                                            color="gray.500"
                                            textAlign="center"
                                            mb={2}
                                        >
                                            {formatDate(msg.datetime)}
                                        </Text>
                                    )}
                                    <ChatBubble
                                        message={msg.message}
                                        timestamp={new Date(msg.datetime).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                        isSender={msg.senderID === user.userID}
                                        sender={msg.sender}
                                        reciever={chatPartnerUsernames[chatSelected]}
                                        onEdit={() => openEditModal(msg.messageID, msg.message)}
                                        onDelete={() => handleDeletePrompt(msg.messageID)}
                                        onReply={() => handleReply(msg)}
                                        repliedMessage={msg.replyTo}
                                        edited={msg.edited}
                                        image={msg.image ? getImageLink(msg.senderID, msg.image) : null}
                                    />
                                </React.Fragment>
                            ))}
                            <div ref={chatBottomRef} /> {/* Ref to scroll to */}
                        </VStack>
                        {replyTo && (
                            <Flex
                                bg="gray.200"
                                p={2}
                                borderRadius="md"
                                mb={2}
                                align="center"
                                justify="space-between"
                            >
                                <Text fontSize="sm" fontStyle="italic">
                                    Replying to: {replyTo.message}
                                </Text>
                                <IconButton
                                    aria-label="Cancel reply"
                                    icon={<FiX />}
                                    variant="ghost"
                                    colorScheme="red"
                                    size="sm"
                                    onClick={cancelReply}
                                />
                            </Flex>
                        )}
                        <Flex mt={4} align="center">
                            <Input type="file" id="file" style={{ display: "none" }} onChange={handleFileChange} />
                            <IconButton
                                aria-label="Attach image"
                                icon={<FaCamera />}
                                variant="ghost"
                                colorScheme="gray"
                                size="md"
                                onClick={() => document.getElementById("file").click()}
                                mr={2}
                            />
                            <Input
                                placeholder="Type a message..."
                                flex="1"
                                mr={2}
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <Button colorScheme="teal" onClick={sendMessage}>
                                Send
                            </Button>
                        </Flex>
                    </Box>
                </Center>
            ) : (
                <Center flex="1">
                    <Text fontSize="xl" color="gray.500">
                        Select a chat to start messaging or make a reservation.
                    </Text>
                </Center>
            )}
            {/* Edit Message Modal */}
            <Modal isOpen={editMessageId !== null} onClose={closeEditModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Edit Message</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            value={editMessageContent}
                            onChange={(e) => setEditMessageContent(e.target.value)}
                            placeholder="Edit your message..."
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleEditMessage}>
                            Save
                        </Button>
                        <Button onClick={closeEditModal}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/* Image Preview Modal */}
            <Modal isOpen={imagePreviewOpen} onClose={handleImagePreviewClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Image Preview</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Flex direction="column" align="center">
                            <Avatar size="2xl" src={imagePreview} alt={imageName} mb={4} />
                            <Text>{imageName}</Text>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleConfirmImage}>
                            Confirm
                        </Button>
                        <Button variant="outline" onClick={handleImagePreviewClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {/* Delete Message AlertDialog */}
            <AlertDialog
                isOpen={deleteDialogOpen}
                leastDestructiveRef={undefined}
                onClose={closeDeleteDialog}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Message
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to delete this message? You can't undo this
                            action afterwards.
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button onClick={closeDeleteDialog}>Cancel</Button>
                            <Button colorScheme="red" onClick={handleDeleteMessage} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Flex>
    );
}

export default ChatUi;
