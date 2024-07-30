import React from "react";
import {
  Box,
  Text,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Avatar,
  Image,
} from "@chakra-ui/react";
import { FiEdit, FiTrash2, FiMoreVertical } from "react-icons/fi";
import { FaReply } from "react-icons/fa";

function ChatBubble({
  message,
  timestamp,
  isSender,
  onEdit,
  onDelete,
  onReply,
  repliedMessage,
  edited,
  sender,
  reciever,
  image,  // Add image prop here
}) {
  const menuItemColor = useColorModeValue("teal.500", "teal.200");
  const menuItemHoverBg = useColorModeValue("teal.100", "teal.600");

  return (
    <Box
      position="relative"
      marginY={2}
      maxW="70%"
      alignSelf={isSender ? "flex-end" : "flex-start"}
    >
      <Flex alignItems="center">
        {!isSender && (
          <Avatar
            name={reciever}
            alt="Profile"
            boxSize="40px"
            borderRadius="full"
            marginRight={3}
            marginTop="-40px"
          />
        )}
        <Box position="relative" width="100%">
          <Box
            bg={isSender ? "blue.500" : "gray.200"}
            color={isSender ? "white" : "black"}
            borderRadius="lg"
            p={3}
            pb={4} // Adding bottom padding
            pt={6} // Adding top padding to accommodate the menu button
            position="relative"
          >
            <Box position="absolute" top={1} right={1}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FiMoreVertical />}
                  size="sm"
                  variant="ghost"
                />
                <MenuList>
                  {!isSender && (
                    <MenuItem
                      icon={<FaReply />}
                      onClick={onReply}
                      _hover={{ bg: menuItemHoverBg, color: menuItemColor }}
                      color={menuItemColor}
                    >
                      Reply
                    </MenuItem>
                  )}
                  {isSender && (
                    <>
                      <MenuItem
                        icon={<FiEdit />}
                        onClick={onEdit}
                        _hover={{ bg: menuItemHoverBg, color: menuItemColor }}
                        color={menuItemColor}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        icon={<FiTrash2 />}
                        onClick={onDelete}
                        _hover={{ bg: menuItemHoverBg, color: menuItemColor }}
                        color={menuItemColor}
                      >
                        Delete
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </Menu>
            </Box>
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
            {image && (
              <Box mb={2}>
                <Image src={image} alt="Message Image" borderRadius="md" />
              </Box>
            )}
            <Text>
              {message}
              {edited && (
                <Text
                  as="span"
                  fontSize="xs" // Making the text smaller
                  color={isSender ? "gray.300" : "gray.500"}
                  marginLeft={2}
                >
                  (edited)
                </Text>
              )}
            </Text>

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
          </Box>
        </Box>
        {isSender && (
          <Avatar
            name={sender}
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
