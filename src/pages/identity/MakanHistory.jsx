import React from 'react';
import { Box, Text } from "@chakra-ui/react";
import GuestSideNav from "../../components/identity/GuestSideNav";

const MakanHistory = () => {
    return (
        <Box display="flex">
            <GuestSideNav />
            <Box width="75%" ml={10}>
                <Text fontSize="xl" fontWeight="bold">Makan History</Text>
            </Box>
        </Box>
    );
};

export default MakanHistory;