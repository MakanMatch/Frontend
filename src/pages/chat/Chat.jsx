import React, { useState, useEffect, useRef } from "react";
import {
	Box,
	Input,
	Text,
	Center,
	Flex,
	VStack,
	Spacer,
	IconButton,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Avatar,
} from "@chakra-ui/react";
import { FiSmile, FiCamera, FiX } from "react-icons/fi";
import ChatBubble from "../../components/chat/ChatBubble";
import ChatHistory from "../../components/chat/ChatHistory";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../../slices/AuthState";

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
	const [chatID, setChatID] = useState(null);
	const [chatHistory, setChatHistory] = useState([]); // Array of chat IDs
	const [chatPartnerUsernames, setChatPartnerUsernames] = useState({}); // Object to map chat ID to username
	const [chatSelected, setChatSelected] = useState(null);
	const [isChatVisible, setIsChatVisible] = useState(false);
	const chatBottomRef = useRef(null);
	const { user, loaded, error } = useSelector((state) => state.auth);

	const ws = useRef(null);
	useEffect(() => {
		if (!loaded) {
			dispatch(fetchUser());
		}
	}, [dispatch, loaded]);

	useEffect(() => {
		if (loaded && !user) {
			navigate("/auth/login");
		}
	}, [loaded, user, navigate]);

	useEffect(() => {
		const wsUrl = import.meta.env.VITE_BACKEND_WS_URL;
		ws.current = new WebSocket(wsUrl);

		ws.current.onopen = () => {
			console.log("Connected to WebSocket server");
			ws.current.send(
				JSON.stringify({
					action: "connect",
					userID: user.userID,
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
			if (receivedMessage.action === "chat_id") {
				setChatID(receivedMessage.chatID);
				setChatHistory((prevChatHistory) => {
					const chatHistorySet = new Set(prevChatHistory);
					chatHistorySet.add(receivedMessage.chatID);
					return Array.from(chatHistorySet);
				});
				if(receivedMessage.username1 === user.username){
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
			} else if (receivedMessage.previousMessages) {
				setMessages(receivedMessage.previousMessages);
			} else if (receivedMessage.action === "send") {
				setMessages((prevMessages) => [...prevMessages, receivedMessage]);
			}
			else if (receivedMessage.action === "edit") {
				setMessages((prevMessages) =>
					prevMessages.map((msg) =>
						msg.messageID === receivedMessage.messageID
							? { ...msg, message: receivedMessage.message, edited: true }
							: msg
					)
				);
				console.log(messages);
			}else if (receivedMessage.action === "delete") {
				setMessages((prevMessages) =>
					prevMessages.filter((msg) => msg.messageID !== receivedMessage.id)
				);
			}
		};

		ws.current.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		ws.current.onclose = () => {
			console.log("Disconnected from WebSocket server");
		};

		return () => {
			if (ws.current) {
				ws.current.close();
			}
		};
	}, [loaded, user, messages]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const sendMessage = () => {
		if (ws.current && messageInput.trim() !== "") {
			const newMessage = {
				action: "send",
				sender: user.username,
				userID: user.userID,
				chatID: chatSelected,
				message: messageInput,
				datetime: new Date().toISOString(),
				replyTo: replyTo ? replyTo.message : null,
				replyToID: replyTo ? replyTo.messageID : null,
			};

			ws.current.send(JSON.stringify(newMessage));

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
		if (messageToDelete) {
			const deleteMessage = {
				id: messageToDelete,
				action: "delete",
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
			chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
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

	const toggleChatVisibility = () => {
		setIsChatVisible((prev) => !prev);
	};

	const handleChatClick = (clickedChatID) => {
		setChatSelected(clickedChatID);
		fetchChatHistory(clickedChatID);
		toggleChatVisibility();
	};
	return (

		<Flex>
			<ChatHistory
				onUserClick={handleChatClick}
				chatHistory={chatHistory}
				chatPartnerUsernames={chatPartnerUsernames} // Pass the map of chat partner usernames
			/>

			{isChatVisible ? (
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
							name = {chatPartnerUsernames[chatSelected]}
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
                  ? `Chat with ${chatPartnerUsernames[chatSelected]}`
                  : "Chat"}
							</Text>
							<Spacer h={3} />
							<Text fontSize={15} color="green" textAlign={"left"} mb={-8}>
								Online
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
										isSender={msg.sender === user.username}
										sender={user.username}
										reciever={chatPartnerUsernames[chatSelected]}
										onEdit={() => openEditModal(msg.messageID, msg.message)}
										onDelete={() => handleDeletePrompt(msg.messageID)}
										onReply={() => handleReply(msg)}
										repliedMessage={msg.replyTo}
										edited={msg.edited}
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
							<IconButton
								aria-label="Add emoji"
								icon={<FiSmile boxSize={8} />}
								variant="ghost"
								colorScheme="gray"
								mr={2}
							/>
							<IconButton
								aria-label="Add photo"
								icon={<FiCamera boxSize={8} />}
								variant="ghost"
								colorScheme="gray"
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
			): (
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
		</Flex >
	);
}

export default ChatUi;