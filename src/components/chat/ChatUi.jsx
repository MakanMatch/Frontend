// import React from "react";
// import { Box, Input, Image, Text, Center, Flex, Container, VStack, Spacer, IconButton } from "@chakra-ui/react";
// import { FiSmile, FiCamera } from "react-icons/fi"
// import ChatBubble from "../../components/chat/ChatBubble";

// function ChatUi() {
//   return (
//     <Center flexDirection="column" alignItems="center" p={5}>
//       <Box
//         bg='white'
//         w="70%"
//         p={2}
//         borderTopRadius={20}
//         h="30%"
//         textColor={"black"}
//         alignItems="center"
//         display='flex'
//         border = "1px"
//         borderColor="black"
//       >
//         <Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' borderRadius={50} w="10%" h="10%" />
//         <Box>
//           <Text marginLeft={5} fontSize={30}>Chat with Jamie Oliver (Host) Rating: 2 ⭐</Text>
//           <Spacer h = "4"/>
//           <Text w='17%' fontSize={20} marginTop={-3}>Online</Text>
//         </Box>
//       </Box>
//       <Box bg="gray.100" w="70%" h="100vh" p={4} display="flex" flexDirection="column" borderLeft= "1px" borderRight="1px" borderBottom="1px" borderColor="black">
//       <Text marginBottom={"10"}>24 June 2024</Text>

//       <VStack spacing={4} align="stretch" flex="1" overflowY="auto">
//         <ChatBubble message="Hello! How can I help you today?" timestamp="10:00 AM" isSender={false} />
//         <ChatBubble message="Hi! I have a question about my order." timestamp="10:01 AM" isSender={true} />
//         <ChatBubble message="Sure, what would you like to know?" timestamp="10:02 AM" isSender={false} />
//         <ChatBubble message="I haven't received my package yet." timestamp="10:03 AM" isSender={true} />
//       </VStack>
//       <Flex mt={4} align="center">
//         <IconButton
//           aria-label="Add emoji"
//           icon={<FiSmile boxSize={6} />} 
//           variant="ghost"
//           colorScheme="gray"
//           mr={2}
//         />
//         <IconButton
//           aria-label="Add photo"
//           icon={<FiCamera boxSize={6} />} 
//           variant="ghost"
//           colorScheme="gray"
//           mr={2}
//         />
//         <Input 
//           placeholder="Type a message" 
//           bg="white" 
//           color="black" 
//           borderColor="gray.300" 
//           _placeholder={{ color: 'gray.500' }}
//           flex="1" 
//           height="48px" 
//           fontSize="lg" 
//           padding={4}
//         />
//       </Flex>
//     </Box>
//     </Center>
//   );
// }

// export default ChatUi;
import React from "react";
import { Box, Input, Image, Text, Center, Flex, VStack, Spacer, IconButton } from "@chakra-ui/react";
import { FiSmile, FiCamera } from "react-icons/fi";
import ChatBubble from "../../components/chat/ChatBubble";

function ChatUi() {
  return (
    <Center flexDirection="column" alignItems="center" p={5}>
      <Box
        bg="white"
        w="70%"
        p={2}
        borderTopRadius={20}
        h="auto"
        textColor="black"
        alignItems="center"
        display="flex"
        border="1px"
        borderColor="black"
      >
        <Image src="https://bit.ly/dan-abramov" alt="Dan Abramov" borderRadius="full" w="10%" h="10%" />
        <Box >
          <Text marginLeft={5} fontSize={30}>Chat with Jamie Oliver (Host) Rating: 2 ⭐</Text>
          <Spacer h={4} />
          <Text w='17%' fontSize={20} marginTop={-3}>Online</Text>
        </Box>
      </Box>
      <Box
        bg="gray.100"
        w="70%"
        h="calc(100vh - 160px)" // Adjusting height to fit the screen properly
        p={4}
        display="flex"
        flexDirection="column"
        borderLeft="1px"
        borderRight="1px"
        borderBottom="1px"
        borderColor="black"
      >
        <Text marginBottom={10}>24 June 2024</Text>
        <VStack spacing={4} align="stretch" flex="1" overflowY="auto">
          <ChatBubble message="Hello! How can I help you today?" timestamp="10:00 AM" isSender={false} photoUrl="https://bit.ly/dan-abramov" />
          <ChatBubble message="Hi! I have a question about my order." timestamp="10:01 AM" isSender={true} photoUrl="https://miro.medium.com/v2/resize:fit:640/format:webp/1*XKpA4-JcY06QcMOiPB1zaQ.jpeg"/>
          <ChatBubble message="Sure, what would you like to know?" timestamp="10:02 AM" isSender={false} photoUrl="https://bit.ly/dan-abramov" />
          <ChatBubble message="I haven't received my package yet." timestamp="10:03 AM" isSender={true} photoUrl="https://miro.medium.com/v2/resize:fit:640/format:webp/1*XKpA4-JcY06QcMOiPB1zaQ.jpeg"/>
        </VStack>
        <Flex mt={4} align="center">
          <IconButton
            aria-label="Add emoji"
            icon={<FiSmile boxSize={8} />} // Adjusts the size of the icon
            variant="ghost"
            colorScheme="gray"
            mr={2}
          />
          <IconButton
            aria-label="Add photo"
            icon={<FiCamera boxSize={8} />} // Adjusts the size of the icon
            variant="ghost"
            colorScheme="gray"
            mr={2}
          />
          <Input
            placeholder="Type a message"
            bg="white"
            color="black"
            borderColor="gray.300"
            _placeholder={{ color: 'gray.500' }}
            flex="1"
            height="48px"
            fontSize="lg"
            padding={4}
          />
        </Flex>
      </Box>
    </Center>
  );
}

export default ChatUi;

