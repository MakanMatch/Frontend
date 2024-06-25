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
import Sidebar from "../../components/chat/SideBar"; // Import the Sidebar component

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

    ws.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
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
        sender: "UserA", // Replace with dynamic sender information
        message: messageInput,
        timestamp:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes().toString().padStart(2, "0")
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
            src="https://bit.ly/dan-abramov"
            alt="Dan Abramov"
            borderRadius="full"
            w="10%"
            h="100%"
          />
          <Box>
            <Text marginLeft={5} fontSize={20}>
              Chat with Jamie Oliver (Host) Rating: 2 ⭐
            </Text>
            <Spacer h={4} />
            <Text
              w="17%"
              fontSize={15}
              marginTop={-3}
              marginLeft={"7px"}
              color={"green"}
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
            {messages.map((msg, index) => (
              <ChatBubble
                key={index}
                message={msg.message}
                timestamp={msg.timestamp}
                isSender={msg.sender === "UserA"} // Replace with appropriate logic
                photoUrl={msg.sender === "UserA" ? "https://bit.ly/dan-abramov" : "https://randomuser.me/api/portraits/women/1.jpg"} // Replace with appropriate avatar URL
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
    </Flex>
  );
}

export default ChatUi;
