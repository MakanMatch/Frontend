import React from "react";
import { Box, Flex, Text, Avatar, VStack } from "@chakra-ui/react";

const users = [
  { name: "Jamie Oliver", lastMessage: "Hey, how are you?", avatar: "https://bit.ly/dan-abramov" },
  { name: "Kent C. Dodds", lastMessage: "I'll be offline for a while.", avatar: "https://bit.ly/kent-c-dodds" },
  { name: "Ryan Florence", lastMessage: "Let's catch up later this week.", avatar: "https://bit.ly/ryan-florence" },
  { name: "James Davis", lastMessage: "Can we discuss this later?", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
];

function Sidebar() {
  return (
    <Box bg="white" w="20%" h="100vh" p={4} borderRight="1px" borderColor="gray.200">
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
          >
            <Avatar src={user.avatar} name={user.name} size="md" mr={3} />
            <Box flex="1">
              <Text fontWeight="bold">{user.name}</Text>
              <Text fontSize="sm" color="gray.500" isTruncated maxW="125px">
                {user.lastMessage}
              </Text>
            </Box>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
}

export default Sidebar;
