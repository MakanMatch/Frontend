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
  useMediaQuery,
} from "@chakra-ui/react";
import { FiSmile, FiCamera } from "react-icons/fi";
import ChatBubble from "../../components/chat/ChatBubble";
import ChatHistory2 from "../../components/chat/ChatHistory2";

function ChatUi2() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSmallerThan950px] = useMediaQuery("(min-width: 950px)");

  const ws = useRef(null);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_BACKEND_WS_URL;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
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

      console.log("Received message:", receivedMessage);
      if (receivedMessage.action === "edit") {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === receivedMessage.id
              ? { ...msg, message: receivedMessage.message, edited: true }
              : msg
          )
        );
      } else if (receivedMessage.action === "delete") {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== receivedMessage.id)
        );
      } else if (receivedMessage.action === "reload") {
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
  }, []);

  const sendMessage = () => {
    if (ws.current && messageInput.trim() !== "") {
      const newMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "James",
        message: messageInput,
        timestamp: `${new Date().getHours()}:${new Date()
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      };

      ws.current.send(JSON.stringify(newMessage));
      console.log("Sent message:", newMessage);

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleEditPrompt = (messageId, currentMessage) => {
    const newMessage = prompt("Edit your message:", currentMessage);
    if (newMessage && newMessage.trim() !== "") {
      const editedMessage = {
        id: messageId,
        action: "edit",
        sender: "James",
        message: newMessage,
        timestamp: `${new Date().getHours()}:${new Date()
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      };
      ws.current.send(JSON.stringify(editedMessage));
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

  return (
    <Flex>
      <ChatHistory2 />
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
            src="https://bit.ly/dan-abramov"
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
              Chat with Jamie Oliver (Host) Rating: 2 ⭐
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
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.message}
                timestamp={msg.timestamp}
                isSender={msg.sender === "James"}
                photoUrl={
                  msg.sender === "James"
                    ? "https://randomuser.me/api/portraits/men/4.jpg"
                    : "https://bit.ly/dan-abramov"
                }
                onEdit={() => handleEditPrompt(msg.id, msg.message)}
                onDelete={() => handleDeletePrompt(msg.id)}
                edited={msg.edited}
              />
            ))}
          </VStack>
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
              placeholder="Type a message"
              bg="white"
              color="black"
              borderColor="gray.300"
              _placeholder={{ color: "gray.500" }}
              flex="1"
              height="48px"
              fontSize="lg"
              padding={4}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Flex>
        </Box>
      </Center>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={deleteDialogOpen}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Message
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this message?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button variant="ghost" onClick={closeDeleteDialog}>
                Cancel
              </Button>
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

export default ChatUi2;
