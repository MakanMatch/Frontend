import React from "react";
import {
  Box,
  Text,
  Flex,
  Image,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaReply } from "react-icons/fa";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

function ChatBubble({
  message,
  timestamp,
  isSender,
  photoUrl,
  onEdit,
  onDelete,
  onReply,
  repliedMessage,
}) {
  return (
    <Box
      position="relative"
      marginY={2}
      maxW="70%"
      alignSelf={isSender ? "flex-end" : "flex-start"}
    >
      <Flex alignItems="center">
        {!isSender && (
          <Image
            src={photoUrl}
            alt="Profile"
            boxSize="40px"
            borderRadius="full"
            marginRight={3}
            marginTop="-40px"
          />
        )}
        <Box position="relative">
          {isSender ? (
            <ChevronLeftIcon
              color="blue.500"
              boxSize={8}
              position="absolute"
              top="25%"
              transform="translateY(-50%)"
              right="-20px"
            />
          ) : (
            <ChevronRightIcon
              color="black.200"
              boxSize={8}
              position="absolute"
              top="25%"
              transform="translateY(-50%)"
              left="-20px"
            />
          )}
          <Box
            bg={isSender ? "blue.500" : "gray.200"}
            color={isSender ? "white" : "black"}
            borderRadius="lg"
            p={3}
            position="relative"
          >
            {repliedMessage && (
              <Box
                bg={isSender ? "blue.300" : "gray.100"}
                p={2}
                borderRadius="md"
                mb={2}
              >
                <Text fontSize="sm" color={isSender ? "white" : "black"}>
                  {repliedMessage}
                </Text>
              </Box>
            )}
            <Text>{message}</Text>
            {timestamp && (
              <Text
                fontSize="xs"
                color={isSender ? "gray.300" : "gray.500"}
                marginTop={1}
                textAlign="right"
              >
                {timestamp}
              </Text>
            )}
            {!isSender && (
              <Flex mt={2} justifyContent="flex-end">
                <Tooltip label="Reply" hasArrow>
                  <IconButton
                    icon={<FaReply />}
                    size="sm"
                    onClick={onReply}
                    variant="ghost"
                    colorScheme="teal"
                  />
                </Tooltip>
              </Flex>
            )}
            {isSender && (
              <Flex mt={2} justifyContent="flex-end">
                <Tooltip label="Edit" hasArrow>
                  <IconButton
                    icon={<FiEdit />}
                    size="sm"
                    onClick={onEdit}
                    mr={2}
                    variant="ghost"
                    colorScheme="gray"
                  />
                </Tooltip>
                <Tooltip label="Delete" hasArrow>
                  <IconButton
                    icon={<FiTrash2 />}
                    size="sm"
                    onClick={onDelete}
                    variant="ghost"
                    colorScheme="red"
                  />
                </Tooltip>
              </Flex>
            )}
          </Box>
        </Box>
        {isSender && (
          <Image
            src={photoUrl}
            alt="Profile"
            boxSize="40px"
            borderRadius="full"
            marginLeft={3}
            marginTop="-60px" // Adjusted marginTop to align with message bubble
          />
        )}
      </Flex>
    </Box>
  );
}

export default ChatBubble;