import { Text, Box } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

function CalenderUI() {
    return (
        <>
            <Box 
                boxShadow="0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)" 
                borderRadius="10px" 
                display="flex" 
                flexDirection="column" 
            >
                <Text textAlign="left" ml={5} padding="10px" fontSize="30px">Schedule</Text>
                <Box 
                    borderRadius="10px" 
                    boxShadow="0 2px 4px 2px rgba(0.1, 0.1, 0.1, 0.1)" 
                    width="90%" 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    mx="auto"
                >
                    <Box display="flex" justifyContent="center" alignItems="center" padding="10px">
                        <ChevronLeftIcon w={8} h={8} mt={-0.5} mr={2} />
                        <Text fontSize="20px" fontWeight="bold">July 2024</Text>
                        <ChevronRightIcon w={8} h={8} mt={-0.5} ml={2} />
                    </Box>
                </Box>

                <Box display="flex" justifyContent="space-evenly" padding="10px" width="100%">
                    <Text textAlign="center" fontSize="20px" color="#515F7C">Monday</Text>
                    <Text textAlign="center" fontSize="20px" color="#515F7C">Tuesday</Text>
                    <Text textAlign="center" fontSize="20px" color="#515F7C">Wednesday</Text>
                    <Text textAlign="center" fontSize="20px" color="#515F7C">Thursday</Text>
                    <Text textAlign="center" fontSize="20px" color="#515F7C">Friday</Text>
                    <Text textAlign="center" fontSize="20px" color="#515F7C">Saturday</Text>
                    <Text textAlign="center" fontSize="20px" color="#515F7C">Sunday</Text>
                </Box>
            </Box>
        </>
    );
}

export default CalenderUI;