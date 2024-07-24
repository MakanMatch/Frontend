import React from "react";
import { Box, Flex, Text, Avatar, VStack, useMediaQuery } from "@chakra-ui/react";

function ChatHistory({ chatHistory = [], onUserClick, lastMessage, chatPartnerUsername }) {
  const [isSmallerThan950px] = useMediaQuery("(min-width: 950px)");

  if (!isSmallerThan950px) {
      return null;
  }

  return (
      <Box
          bg="white"
          w="30%"
          minW="100px"
          h="90%"
          p={4}
          boxShadow={"0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"}
          borderRadius={"10px"}
          overflow={"hidden"}
          borderColor="gray.200"
      >
          <Text fontSize="2xl" mb={6} textAlign={"left"}>
              Messages
          </Text>
          <VStack spacing={4} align="stretch" alignContent={"left"}>
              {chatHistory.map((chatID) => (
                <Flex
                    key={chatID} // Ensure chatID is unique
                    align="center"
                    p={3}
                    _hover={{ bg: "gray.100", cursor: "pointer" }}
                    borderRadius="md"
                    w="100%"
                    onClick={() => onUserClick(chatID)}
                >
                    <Avatar 
                        src={`https://api.adorable.io/avatars/285/${chatID}.png`} 
                        name={chatPartnerUsername || `Chat ${chatID}`} 
                        mr={3} 
                        minW={"55px"} 
                        minH={"55px"} 
                    />
                    <Box flex="1" minW={0}>
                        <Text fontWeight="bold" textAlign={"left"}>
                            {chatPartnerUsername || `Chat ${chatID}`}
                        </Text>
                        <Text fontSize="sm" color="gray.500" maxW="100%" textAlign={"left"} isTruncated>
                             {lastMessage || "No messages yet"}
                        </Text>
                    </Box>
                </Flex>
            ))}
          </VStack>
      </Box>
  );
}

export default ChatHistory;
