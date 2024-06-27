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
} from "@chakra-ui/react";
import { FiSmile, FiCamera } from "react-icons/fi";
import ChatBubble from "../../components/chat/ChatBubble";
import Sidebar from "../../components/chat/SideBar";

function ChatUi() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const ws = useRef(null);

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
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
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
        sender: "Jamie", // Replace with dynamic sender information
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <Flex>
      <Sidebar />
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
            alt="UserA"
            borderRadius="full"
            w={{ base: "20%", md: "10%" }}
            h="100%"
          />
          <Box
            textAlign={{ base: "center", md: "left" }}
            mt={{ base: 2, md: 0 }}
            ml={{ base: 0, md: 5 }}
          >
            <Text fontSize={20}>Chat with James Davies</Text>
            <Spacer h={4} />
            <Text fontSize={15} mt={{ base: -1, md: -3 }} color="green">
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
                isSender={msg.sender === "Jamie"}
                photoUrl={
                  msg.sender === "Jamie"
                    ? "https://bit.ly/dan-abramov"
                    : "https://randomuser.me/api/portraits/men/4.jpg"
                }
                onEdit={() => handleEditPrompt(msg.id, msg.message)}
                onDelete={() => handleDeletePrompt(msg.id)}
                edited={msg.edited}
              />
            ))}
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
        </VStack>
        </Box>
      </Center>
    </Flex>
    );
}


export default ChatUi;
