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
} from "@chakra-ui/react";
import { FiSmile, FiCamera } from "react-icons/fi";
import ChatBubble from "../../components/chat/ChatBubble";
import Sidebar from "../../components/chat/SideBar"; // Import the Sidebar component

function ChatUi() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [editMode, setEditMode] = useState({ active: false, messageId: null });
  const [editedMessage, setEditedMessage] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const ws = useRef(null);
  const cancelRef = useRef();

  useEffect(() => {
    // Connect to WebSocket server
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.current.onmessage = async (event) => {
      let receivedMessage;
    
      if (event.data instanceof Blob) {
        // Convert Blob to text
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
      // Update messages state with received message
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === receivedMessage.id ? receivedMessage : msg
        )
      );
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    // Cleanup function to close WebSocket connection on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
        console.log("WebSocket connection closed");
      }
    };
  }, []);

  const sendMessage = () => {
    if (ws.current && messageInput.trim() !== "") {
      const newMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "UserA", // Replace with dynamic sender information
        message: messageInput,
        timestamp: `${new Date().getHours()}:${new Date()
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      };

      // Send message to WebSocket server
      ws.current.send(JSON.stringify(newMessage));
      console.log("Sent message:", newMessage);

      // Update messages state with sent message
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Clear input field
      setMessageInput("");
    }
  };

  const handleEditPrompt = (messageId, currentMessage) => {
    const editedMessage = window.prompt("Edit Message:", currentMessage);
    if (editedMessage !== null) {
      handleEdit(messageId, editedMessage);
    }
  };

  const handleEdit = (messageId, editedMessage) => {
    if (ws.current && editedMessage.trim() !== "") {
      const editedMessageObj = {
        id: messageId, // Ensure you're passing the correct message ID
        sender: "UserA", // Replace with actual sender info
        message: editedMessage,
        edited: true,
        timestamp: `${new Date().getHours()}:${new Date()
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      };
  
      ws.current.send(JSON.stringify(editedMessageObj));
      console.log("Editing message:", editedMessageObj);
  
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === editedMessageObj.id ? editedMessageObj : msg
        )
      );
    }
  };
  

  const handleDeletePrompt = (messageId) => {
    setEditMode({ active: true, messageId: messageId }); // Ensure editMode is set correctly
    setDeleteConfirmation(true);
    cancelRef.current = () => setDeleteConfirmation(false);
  };
  
  const handleDelete = () => {
    const messageId = editMode.messageId; // Retrieve messageId from editMode
    if (ws.current && messageId) { // Ensure messageId is valid
      const deleteMessageObj = {
        id: messageId,
        sender: "UserA", // Replace with actual sender info if needed
        action: "delete",
      };
  
      ws.current.send(JSON.stringify(deleteMessageObj));
      console.log("Deleting message:", deleteMessageObj);
  
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    }
    setDeleteConfirmation(false);
  };
  
  

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <Flex>
      <Sidebar /> {/* Include the Sidebar component */}
      <Center flexDirection="column" alignItems="center" p={5} flex="1">
        <Box
          bg="white"
          w="70%"
          p={2}
          borderTopRadius={20}
          h="auto"
          textColor="black"
          alignItems="center"
          display="flex"
          border="1px"
          borderColor="black"
        >
          <Image
            src="https://randomuser.me/api/portraits/men/4.jpg"
            alt="Dan Abramov"
            borderRadius="full"
            w="10%"
            h="100%"
          />
          <Box>
            <Text marginLeft={5} fontSize={20}>
              Chat with James Davies
            </Text>
            <Spacer h={4} />
            <Text
              fontSize={15}
              marginTop={-3}
              color={"green"}
              textAlign={"left"}
              marginLeft={"22px"}
            >
              Online
            </Text>
          </Box>
        </Box>
        <Box
          bg="gray.100"
          w="70%"
          h="calc(100vh - 160px)"
          p={4}
          display="flex"
          flexDirection="column"
          borderLeft="1px"
          borderRight="1px"
          borderBottom="1px"
          borderColor="black"
        >
          <VStack spacing={4} align="stretch" flex="1" overflowY="auto">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg.message}
                timestamp={msg.timestamp}
                isSender={msg.sender === "UserA"} // Replace with appropriate logic
                photoUrl={
                  msg.sender === "UserA"
                    ? "https://bit.ly/dan-abramov"
                    : "https://randomuser.me/api/portraits/men/4.jpg"
                } // Replace with appropriate avatar URL
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
      <AlertDialog
        isOpen={deleteConfirmation}
        leastDestructiveRef={cancelRef}
        onClose={() => setDeleteConfirmation(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Message
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this message?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setDeleteConfirmation(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={() => handleDelete(editMode.messageId)} ml={3}>
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
