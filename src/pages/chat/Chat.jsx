import React, { useState, useEffect, useRef } from "react";
import { Box, Input, Text, Center, Flex, VStack, Spacer, IconButton, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Avatar, useToast, Spinner, useMediaQuery, useDisclosure, HStack, Fade, AvatarBadge } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import ChatBubble from "../../components/chat/ChatBubble";
import ChatHistory from "../../components/chat/ChatHistory";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeAuthToken, fetchUser, logout } from "../../slices/AuthState";
import configureShowToast from "../../components/showToast";
import { FaCamera } from "react-icons/fa";
import { HamburgerIcon } from "@chakra-ui/icons";
import server from '../../networking';

function ChatUi() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [messages, setMessages] = useState({});
    const [messageInput, setMessageInput] = useState("");
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [editMessageId, setEditMessageId] = useState(null);
    const [editMessageContent, setEditMessageContent] = useState("");
    const [chatHistory, setChatHistory] = useState([]); // Array of chat IDs
    const [chatPartnerUsernames, setChatPartnerUsernames] = useState({}); // Object to map chat ID to username
    const [chatPartnerID, setChatPartnerID] = useState({});
    const [chatSelected, setChatSelected] = useState(null);
    const [nextChat, setNextChat] = useState(null);
    const [status, setStatus] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // New state for image preview
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false); // New state for image preview modal
    const [imageName, setImageName] = useState(""); // New state for image name
    const [confirmedImage, setConfirmedImage] = useState(""); // New state for confirmed image
    const [sendLoading, setSendLoading] = useState(false);
    const chatBottomRef = useRef(null);
    const toast = useToast();
    const showToast = configureShowToast(toast);
    const { user, loaded, error, authToken } = useSelector((state) => state.auth);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const ws = useRef(null);

    function getImageLink(userID, messageID) {
        if (!userID || !messageID) {
            return null;
        }
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getImageForChat?userID=${userID}&messageID=${messageID}`;
    }

    function getProfilePictureLink(userID) {
        if (!userID) {
            return null;
        }
        return `${import.meta.env.VITE_BACKEND_URL}/cdn/getProfilePicture?userID=${userID}`;
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
                setChatPartnerID((prevIDs) => ({
                    ...prevIDs,
                    [receivedMessage.chatID]: receivedMessage.chatPartnerID,
                }));

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
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [receivedMessage.chatID]: [...receivedMessage.previousMessages],
                }));
                setStatus(receivedMessage.currentStatus);
            } else if (receivedMessage.action === "send") {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [receivedMessage.message.chatID]: [
                        ...(prevMessages[receivedMessage.message.chatID] || []),
                        receivedMessage.message,
                    ],
                }));
            } else if (receivedMessage.action === "edit") {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [receivedMessage.chatID]: prevMessages[receivedMessage.chatID].map((msg) =>
                        msg.messageID === receivedMessage.messageID
                            ? { ...msg, message: receivedMessage.message, edited: true } : msg
                    ),
                }));
            } else if (receivedMessage.action === "delete") {
                setMessages((prevMessages) => ({
                    ...prevMessages,
                    [receivedMessage.chatID]: prevMessages[receivedMessage.chatID].filter(
                        (msg) => msg.messageID !== receivedMessage.messageID
                    ),
                }));
            } else if (receivedMessage.action === "chat_partner_offline") {
                if (receivedMessage.chatID == localStorage.getItem("selectedChatID")) {
                    setStatus(false);
                }
            } else if (receivedMessage.action === "chat_partner_online") {
                if (receivedMessage.chatID == localStorage.getItem("selectedChatID")) {
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
        window.onbeforeunload = () => {
            localStorage.removeItem("wsConnected");
        };


        if (loaded == true) {
            if (!user) {
                navigate("/auth/login");
                showToast("Please login first", "You need to login to use chat features.", 3500, true, "error");
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
        if (messageInput === "" && image === null) {
            showToast("Message cannot be empty", "Message cannot be empty please input something", 3500, true, "error")
        }
        if (image !== null && messageInput === "") {
            showToast("Image messages need to have a message with it", "Image messages need to have a message with it", 3500, true, "error")
        }
        if (ws.current && messageInput.trim() !== "" && (image === null || (image !== null && messageInput.trim() !== ""))) {
            setSendLoading(true);
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
                formData.append("senderID", user.userID);
                formData.append("chatID", chatSelected);
                formData.append("message", messageInput);
                formData.append("datetime", new Date().toISOString());
                formData.append("replyToID", replyTo ? replyTo.messageID : null);
                try {
                    const response = await server.post("/chat/createImageMessage", formData, {
                        headers: { 'Content-Type': 'multipart/form-data', },
                        transformRequest: formData => formData
                    });

                    if (response.status === 200) {
                        const chatHistory = {
                            action: "chat_history",
                            chatID: chatSelected,
                        }

                        ws.current.send(JSON.stringify(chatHistory));
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
            setImage(null);
            setConfirmedImage("");
            setSendLoading(false);
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
        if (editMessageContent.trim() === "") {
            showToast("Edited Message cannot be empty", "Edited Message cannot be empty please input something", 3500, true, "error")
        }
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
            closeEditModal();
        }
    };

    const handleDeletePrompt = (messageId) => {
        setMessageToDelete(messageId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteMessage = () => {
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
        setNextChat(() => {
            const prev = chatSelected;
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
        })
        setChatSelected(null);
        fetchChatHistory(clickedChatID);
    };

    useEffect(() => {
        if (nextChat) {
            setChatSelected(nextChat)
            setNextChat(null);
        }
    }, [chatSelected, nextChat]);

    const [isSmallerThan950px] = useMediaQuery("(max-width: 950px)");

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
    const filteredMessages = messages[chatSelected] || [];
    return (
        <Flex direction="column" overflowX="hidden" w="100%" h="100%">
            <Flex direction="row" h="100%" w="100%">
                <ChatHistory
                    onUserClick={handleChatClick}
                    chatHistory={chatHistory}
                    chatPartnerUsernames={chatPartnerUsernames}
                    drawerOpen={isOpen}
                    closeDrawer={onClose}
                    w={{ base: "100%", md: "25%" }}
                    h="100%"
                    display={{ base: chatSelected === null ? "block" : "none", md: "block" }} // Hide ChatHistory on mobile if a chat is selected
                    profilePhoto={chatPartnerID}
                />
                <Flex flex="1" direction="column" overflow="hidden">
                    {chatSelected !== null ? (
                        <Fade in>
                            <Center flexDirection="column" alignItems="center" p={5} flex="1">
                                <Box
                                    bg="white"
                                    w={{ base: "90%", md: "75%" }}
                                    p={2}
                                    borderRadius={20}
                                    h="auto"
                                    textColor="black"
                                    alignItems="center"
                                    display="flex"
                                    boxShadow="0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"
                                    mb={4}
                                    mt={-4}
                                >
                                    <HStack>
                                        {isSmallerThan950px && (
                                            <Button bg={'none'} onClick={onOpen} p={0}><HamburgerIcon /></Button>
                                        )}
                                        <Avatar
                                            size="md"
                                            src={getProfilePictureLink(chatPartnerID[chatSelected])}
                                            name={chatPartnerUsernames[chatSelected]}
                                            borderRadius="full"
                                            w={{ base: "20%", md: "10%" }}
                                            h="100%"
                                            minH="55px"
                                            maxH="55px"
                                            minW="55px"
                                            maxW="55px"
                                        >
                                            {status ? <AvatarBadge boxSize="1em" bg="green.500" /> : <AvatarBadge boxSize="1em" bg="gray.300" />}
                                        </Avatar>
                                    </HStack>
                                    <Box mt={-10} ml={{ base: 2, md: 5 }} minW={{ base: "60%", md: "495px" }}>
                                        <Text fontSize={20} mt={2} textAlign="left">
                                            {chatPartnerUsernames[chatSelected] || "Chat"}
                                        </Text>
                                        <Spacer h={3} />
                                        <Text
                                            fontSize="sm"
                                            mb={-8}
                                            textAlign="left"
                                            color={status ? "green.500" : "gray.300"}
                                        >
                                            {status ? "Online" : "Offline"}
                                        </Text>
                                    </Box>
                                </Box>
                                <Box
                                    bg="gray.100"
                                    w={{ base: "90%", md: "75%" }}
                                    h="70vh"
                                    p={4}
                                    display="flex"
                                    flexDirection="column"
                                    borderRadius={20}
                                    boxShadow="0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"
                                >
                                    <VStack spacing={4} align="stretch" flex="1" overflowY="auto" overflowX="hidden">
                                        {filteredMessages.map((msg, index) => (
                                            <React.Fragment key={msg.messageID}>
                                                {shouldDisplayDate(msg, filteredMessages[index - 1]) && (
                                                    <Text fontSize="sm" color="gray.500" textAlign="center" mb={2}>
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
                                                    receiver={chatPartnerUsernames[chatSelected]}
                                                    onEdit={() => openEditModal(msg.messageID, msg.message)}
                                                    onDelete={() => handleDeletePrompt(msg.messageID)}
                                                    onReply={() => handleReply(msg)}
                                                    repliedMessage={msg.replyTo}
                                                    edited={msg.edited}
                                                    image={msg.image ? getImageLink(msg.senderID, msg.messageID) : null}
                                                    receiverProfilePicture={chatPartnerID[chatSelected]}
                                                    senderProfilePicture={user.userID}
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
                                    {confirmedImage !== "" && (
                                        <Flex
                                            bg="gray.200"
                                            p={2}
                                            borderRadius="md"
                                            mb={2}
                                            align="center"
                                            justify="space-between"
                                        >
                                            <Text fontSize="sm" fontStyle="italic">
                                                {confirmedImage}
                                            </Text>
                                            <IconButton
                                                aria-label="Cancel image"
                                                icon={<FiX />}
                                                variant="ghost"
                                                colorScheme="red"
                                                size="sm"
                                            />
                                        </Flex>
                                    )}
                                    <Flex mt={4} align="center">
                                        <Input type="file" id="file" style={{ display: "none" }} onChange={handleFileChange} accept="image/*" />
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
                                        <Button colorScheme="teal" onClick={sendMessage} isLoading={sendLoading}>
                                            Send
                                        </Button>
                                    </Flex>
                                </Box>
                            </Center>
                        </Fade>
                    ) : (
                        <Center flex="1" flexDirection="column">
                            {isSmallerThan950px ? (
                                <Button onClick={onOpen} mt={"10px"}>Select a chat</Button>
                            ) : (
                                <Text fontSize="xl" color="gray.500">
                                    Select a chat to start messaging or make a reservation.
                                </Text>
                            )}
                        </Center>
                    )}
                </Flex>
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
        </Flex>
    );
}

export default ChatUi;