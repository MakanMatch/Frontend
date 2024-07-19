import React from 'react';
import { Box, Text } from "@chakra-ui/react";
import GuestSideNav from "../../components/identity/GuestSideNav";

const Favourites = () => {
    return (
        <Box display="flex">
            <GuestSideNav />
            <Box width="75%" ml={10}>
                <Text fontSize="xl" fontWeight="bold">Favourites</Text>
            </Box>
        </Box>
    );
};

export default Favourites;
