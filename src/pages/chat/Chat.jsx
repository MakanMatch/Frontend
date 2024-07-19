import React, { useState, useEffect, useRef } from "react";
import {
	Box,
	Input,
	Image,
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
	const chatBottomRef = useRef(null); // Reference to the bottom of chat container
	const { user, loaded, error } = useSelector((state) => state.auth);

	const ws = useRef(null);
	useEffect(() => {
		if (!loaded) {
			dispatch(fetchUser());
		}
	}, [dispatch, loaded]);

	useEffect(() => {
		if (loaded && !user) {
			// console.log(localStorage.getItem("jwt"));
			navigate("/auth/login");
		}
	}, [loaded, user, navigate]);
	useEffect(() => {
		const wsUrl = import.meta.env.VITE_BACKEND_WS_URL;
		ws.current = new WebSocket(wsUrl);


		ws.current.onopen = () => {
			console.log("Connected to WebSocket server");
			ws.current.send(JSON.stringify({ action: "connect", userID: user.userID, username: user.username }))
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


			if (receivedMessage.type === "chat_history") {
				setMessages(receivedMessage.messages);
			} else if (receivedMessage.action === "edit") {
				setMessages((prevMessages) =>
					prevMessages.map((msg) =>
						msg.messageID === receivedMessage.id
							? { ...msg, message: receivedMessage.message }
							: msg
					)
				);
			} else if (receivedMessage.action === "delete") {
				setMessages((prevMessages) =>
					prevMessages.filter((msg) => msg.messageID !== receivedMessage.id)
				);
			} else if (receivedMessage.action === "error") {
				alert(receivedMessage.message);
				window.location.reload();
			} else {
				setMessages((prevMessages) => [...prevMessages, receivedMessage]);
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
	}, [loaded, user]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const sendMessage = () => {
		if (ws.current && messageInput.trim() !== "") {
			const newMessage = {
				action: "send",
				sender: user.username,
				message: messageInput,
				datetime: new Date().toISOString(),
				replyTo: replyTo ? replyTo.message : null,
				replyToID: replyTo ? replyTo.messageID : null,
			};

			ws.current.send(JSON.stringify(newMessage));

			setMessageInput("");
			setReplyTo(null); // Clear the reply state after sending
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

	return (
		<Flex>
			<ChatHistory />
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
					<Image
						src="https://randomuser.me/api/portraits/men/4.jpg"
						alt="UserA"
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
							Chat with {user ? user.username : 'Guest'}
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
									photoUrl={
										msg.sender === user.username
											? "https://bit.ly/dan-abramov"
											: "https://randomuser.me/api/portraits/men/4.jpg"
									}
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

			{/* Edit Message Modal */ }
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

	{/* Delete Message AlertDialog */ }
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