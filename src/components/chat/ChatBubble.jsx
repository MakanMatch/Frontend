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
  useBreakpointValue,
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
  receiver,
  image,
  senderProfilePicture,
  receiverProfilePicture,
}) {
  const menuItemColor = useColorModeValue("teal.500", "teal.200");
  const menuItemHoverBg = useColorModeValue("teal.100", "teal.600");

  const bubbleMaxWidth = useBreakpointValue({ base: "90%", md: "70%" });
  const imageSize = useBreakpointValue({ base: "150px", md: "200px" });
  const avatarSize = useBreakpointValue({ base: "30px", md: "40px" });

  function getProfilePictureLink(userID) {
    if (!userID) {
      return null;
    }
    return `${
      import.meta.env.VITE_BACKEND_URL
    }/cdn/getProfilePicture?userID=${userID}`;
  };
  
  return (
    <Box
      position="relative"
      marginY={2}
      maxW={bubbleMaxWidth}
      alignSelf={isSender ? "flex-end" : "flex-start"}
      borderRadius={image ? "10px" : "lg"} // Apply borderRadius conditionally
      _hover={{ ".menu-button": { opacity: 1 } }}
    >
      <Flex alignItems="center">
        {!isSender && (
          <Avatar
            src={getProfilePictureLink(receiverProfilePicture)}
            name={receiver}
            alt="Profile"
            boxSize={avatarSize}
            borderRadius="full"
            marginRight={3}
            marginTop="-20px" // Adjust for smaller screens
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
                  h={imageSize}
                  w={imageSize}
                  objectFit="contain"
                />
              </Box>
            )}
            <Text textAlign={image ? "left" : "center"}>
              {message}
            </Text>
            <Flex align="center" fontSize="xs" color={isSender ? "gray.300" : "gray.500"} mt={1}>
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
                  fontSize="xs"
                  color={isSender ? "gray.300" : "gray.500"}
                  marginLeft={2}
                  mt={1}
                >
                  (edited)
                </Text>
              )}
            </Flex>
          </Box>
        </Box>
        {isSender && (
          <Avatar
            src={getProfilePictureLink(senderProfilePicture)}
            name={sender}
            alt="Profile"
            boxSize={avatarSize}
            borderRadius="full"
            marginLeft={3}
            marginTop="-30px" // Adjust for smaller screens
          />
        )}
      </Flex>
    </Box>
  );
}

export default ChatBubble;
