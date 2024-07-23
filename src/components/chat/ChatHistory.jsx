import React from "react";
import { Box, Flex, Text, Avatar, VStack, useMediaQuery } from "@chakra-ui/react";

const users = [
  { name: "James Davis", lastMessage: "Can we discuss this later?", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
  { name: "Charlie", lastMessage: "Hey, how are you?", avatar: "https://media.istockphoto.com/id/510177292/photo/pretty-high-school-girl-in-school-library.webp?b=1&s=170667a&w=0&k=20&c=JTm5ShDmHSyz9-8C4DoC8laMt94apClJH3BiOZdNgaY=" },
  { name: "Kent C. Dodds", lastMessage: "I'll be offline for a while.", avatar: "https://bit.ly/kent-c-dodds" },
  { name: "Ryan Florence", lastMessage: "Let's catch up later this week.", avatar: "https://bit.ly/ryan-florence" },
];

function ChatHistory({ onUserClick, lastMessage, chatPartnerUsername } ) {
  const [isSmallerThan950px] = useMediaQuery("(min-width: 950px)");

  if (!isSmallerThan950px) {
    return null;
  }

  return (
    <Box bg="white" w="30%" minW="100px" h="90%" p={4} boxShadow={"0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)"} borderRadius={"10px"} overflow={"hidden"} borderColor="gray.200">
      <Text fontSize="2xl" mb={6} textAlign={"left"}>Messages</Text>
      <VStack spacing={4} align="stretch" alignContent={"left"}>
        {users.map((user, index) => (
          <Flex 
            key={index} 
            align="center" 
            p={3} 
            _hover={{ bg: "gray.100", cursor: "pointer" }} 
            borderRadius="md" 
            w="100%"
            onClick={() => onUserClick(user.name)} // Trigger the click handler
          >
            <Avatar src={user.avatar} name={chatPartnerUsername} mr={3} minW={"55px"} minH={"55px"} />
            <Box flex="1" minW={0}>
              <Text fontWeight="bold" textAlign={"left"}>{chatPartnerUsername}</Text>
              <Text fontSize="sm" color="gray.500" maxW="100%" textAlign={"left"} isTruncated>
                {lastMessage.message}
              </Text>
            </Box>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}

export default ChatHistory;
