import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

function ChatBubble({ message, timestamp, isSender }) {
  return (
    <Flex
      justifyContent={isSender ? 'flex-end' : 'flex-start'}
      marginBottom={2}
    >
      {!isSender && (
        <ChevronLeftIcon color="gray.500" boxSize={6} marginRight={-2} />
      )}
      <Box
        bg={isSender ? 'green.500' : 'gray.200'}
        color={isSender ? 'white' : 'black'}
        borderRadius="lg"
        p={3}
        maxWidth="70%"
      >
        <Text>{message}</Text>
        {timestamp && (
          <Text fontSize="xs" color={isSender ? 'gray.300' : 'gray.500'} marginTop={1} textAlign="right">
            {timestamp}
          </Text>
        )}
      </Box>
      {isSender && (
        <ChevronRightIcon color="green.500" boxSize={6} marginLeft={-2} />
      )}
    </Flex>
  );
}

export default ChatBubble;


