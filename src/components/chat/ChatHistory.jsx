import React from "react";
import { Box, Flex, Text, Avatar, VStack, useMediaQuery } from "@chakra-ui/react";

function ChatHistory({ chatHistory = [], onUserClick, lastMessage, chatPartnerUsernames }) {
  const [isSmallerThan950px] = useMediaQuery("(max-width: 950px)");

  // Filter out any undefined or invalid chat IDs
  const validChatHistory = chatHistory.filter(chatID => chatID && chatPartnerUsernames[chatID]);

  return (
    <Box
      bg="white"
      w={{ base: "25%", md: "30%" }} // Adjust width for responsiveness
      minW="100px"
      h="90%"
      p={4}
      boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
      borderRadius="10px"
      overflow="hidden"
      borderColor="gray.200"
      border="1px solid"
    >
      <Text fontSize={{ base: "xl", md: "2xl" }} mb={6} textAlign="left">
        Messages
      </Text>
      <VStack spacing={0} align="stretch">
        {validChatHistory.map((chatID, index) => (
          <Flex
            key={chatID}
            align="center"
            p={3}
            _hover={{ bg: "gray.100", cursor: "pointer" }}
            borderBottom={index < validChatHistory.length - 1 ? "1px solid" : "none"}
            borderColor="gray.200"
            onClick={() => onUserClick(chatID)}
            w="100%"
          >
            <Avatar 
              name={chatPartnerUsernames[chatID] || `Chat ${chatID}`} 
              mr={3} 
              minW="55px" 
              minH="55px" 
            />
            <Box flex="1" minW={0}>
              {!isSmallerThan950px && (
                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} textAlign="left">
                  {chatPartnerUsernames[chatID] || `Chat ${chatID}`}
                </Text>
              )}
              <Text
                fontSize={{ base: "xs", md: "sm" }} // Responsive font size
                color="gray.500"
                maxW="100%"
                textAlign="left"
                isTruncated
              >
                {lastMessage}
              </Text>
            </Box>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}

export default ChatHistory;

