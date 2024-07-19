import React from 'react';
import { Box } from "@chakra-ui/react";
import HostSideNav from "../../components/identity/HostSideNav";
import CalenderUI from "../../components/identity/CalenderUI"

const Schedule = () => {
    return (
        <Box display="flex">
            <HostSideNav />
            <Box width="75%" ml={10}>
                <CalenderUI/>
            </Box>
        </Box>
    );
};

export default Schedule;