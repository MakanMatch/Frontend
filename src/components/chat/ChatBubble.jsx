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
  receiver, // Corrected spelling from "reciever"
  image,
}) {
  const menuItemColor = useColorModeValue("teal.500", "teal.200");
  const menuItemHoverBg = useColorModeValue("teal.100", "teal.600");

  return (
    <Box
      position="relative"
      marginY={2}
      maxW="70%"
      alignSelf={isSender ? "flex-end" : "flex-start"}
      borderRadius={image ? "10px" : "lg"} // Apply borderRadius conditionally
      _hover={{ ".menu-button" : {opacity: 1}}}
    >
      <Flex alignItems="center">
        {!isSender && (
          <Avatar
            name={receiver} // Corrected spelling from "reciever"
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
            borderRadius={image ? "10px" : "lg"} // Apply borderRadius conditionally
            p={3}
            pb={4} // Adding bottom padding
            pt={6} // Adding top padding to accommodate the menu button
            position="relative"
            wordBreak="break-word" // Ensure words break properly
            overflowWrap="break-word" // Ensure long words wrap
          >
            <Box 
            position="absolute" 
            top={1} 
            right={1}
            className="menu-button"
            opacity={0} // Hide the menu button by default
            transition={"opacity 0.2s ease"} // Add a transition effect
            >
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
              <Box mb={2} textAlign="left">
                <Image
                  src={image}
                  alt="Message Image"
                  borderRadius="md"
                  h="200px"
                  w="200px"
                  objectFit="contain"
                />
              </Box>
            )}
            <Text textAlign={image ? "left" : "center"}>
              {message}
            </Text>

            <Flex align="center" fontSize="xs" color={isSender ? "gray.300" : "gray.500"} mt={1} >
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
            {edited && (
                <Text
                  as="span"
                  fontSize="xs" // Making the text smaller
                  color={isSender ? "gray.300" : "gray.500"}
                  marginLeft={2}
                  mt={1} // Adjusted marginTop to align with timestamp
                >
                  (edited)
                </Text>
              )}
              </Flex>
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
