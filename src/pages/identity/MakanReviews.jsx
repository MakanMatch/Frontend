import React from 'react';
import { Box, Text } from "@chakra-ui/react";
import HostSideNav from "../../components/identity/HostSideNav";

const MakanReviews = () => {
    return (
        <Box display="flex">
            <HostSideNav />
            <Box width="75%" ml={10}>
                <Text fontSize="xl" fontWeight="bold">Makan Reviews</Text>
            </Box>
        </Box>
    );
};

export default MakanReviews;