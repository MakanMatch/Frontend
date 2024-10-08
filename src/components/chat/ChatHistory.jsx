import React from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  VStack,
  useMediaQuery,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

function ChatHistory({
  chatHistory = [],
  onUserClick,
  lastMessage,
  chatPartnerUsernames,
  drawerOpen,
  closeDrawer,
  profilePhoto,
}) {
  const [isSmallerThan950px] = useMediaQuery("(max-width: 950px)");

  // Filter out any undefined or invalid chat IDs
  const validChatHistory = chatHistory.filter(
    (chatID) => chatID && chatPartnerUsernames[chatID]
  );

  function getProfilePictureLink(userID) {
    if (!userID) {
      return null;
    }
    return `${
      import.meta.env.VITE_BACKEND_URL
    }/cdn/getProfilePicture?userID=${userID}`;
  }

  if (isSmallerThan950px) {
    // Use Drawer for smaller screens
    return (
      <Drawer
        isOpen={drawerOpen}
        placement="left"
        onClose={closeDrawer}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Messages</DrawerHeader>
          <DrawerBody p={4}>
            <VStack spacing={0} align="stretch">
              {validChatHistory.map((chatID, index) => (
                <Flex
                  key={chatID}
                  align="center"
                  p={2}
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                  borderBottom={
                    index < validChatHistory.length - 1 ? "1px solid" : "none"
                  }
                  borderColor="gray.200"
                  onClick={() => {
                    onUserClick(chatID); // Call the user click handler
                    closeDrawer(); // Close the drawer
                  }}
                  w="100%"
                >
                  <Avatar
                    src={getProfilePictureLink(profilePhoto[chatID])}
                    name={chatPartnerUsernames[chatID]}
                    mr={2}
                    minW="45px"
                    minH="45px"
                  />
                  <Box flex="1" minW={0}>
                    <Text
                      fontWeight="bold"
                      fontSize="sm"
                      textAlign="left"
                      isTruncated
                    >
                      {chatPartnerUsernames[chatID] || `Chat ${chatID}`}
                    </Text>
                    <Text
                      fontSize="xs" // Responsive font size
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
          </DrawerBody>
          <DrawerFooter>{/* Optional footer content */}</DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  } else {
    closeDrawer();
  }

  // Original design for larger screens
  return (
    <Box
      bg="white"
      w="30%" // Width for larger screens
      minW="100px"
      h="90%" // Height for larger screens
      p={4}
      boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
      borderRadius="10px"
      overflow="hidden"
      borderColor="gray.200"
      border="1px solid"
      position="static"
      top="auto"
      left="auto"
      zIndex="auto"
    >
      <Text fontSize="2xl" mb={6} textAlign="left">
        Messages
      </Text>
      <VStack spacing={0} align="stretch">
        {validChatHistory.map((chatID, index) => (
          <Flex
            key={chatID}
            align="center"
            p={3}
            _hover={{ bg: "gray.100", cursor: "pointer" }}
            borderBottom={
              index < validChatHistory.length - 1 ? "1px solid" : "none"
            }
            borderColor="gray.200"
            onClick={() => onUserClick(chatID)}
            w="100%"
          >
            <Avatar
              src={getProfilePictureLink(profilePhoto[chatID])}
              name={chatPartnerUsernames[chatID]}
              mr={2}
              minW="45px"
              minH="45px"
            />
            <Box flex="1" minW={0}>
              <Text fontWeight="bold" fontSize="md" textAlign="left">
                {chatPartnerUsernames[chatID] || `Chat ${chatID}`}
              </Text>
              <Text
                fontSize="sm" // Responsive font size
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
