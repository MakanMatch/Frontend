import React from 'react';
import { Box, Card, CardBody, Heading, Stack, StackDivider } from "@chakra-ui/react";
import MyAccountSidebar from "../../components/identity/MyAccountSidebar";
import CalenderUI from "../../components/identity/CalenderUI"

const Schedule = () => {
    return (
        <Box display="flex">
            <MyAccountSidebar />
            <Card width="75%" height={"700px"} ml={10} borderRadius={15} boxShadow="0 2px 4px 2px rgba(0.2, 0.2, 0.2, 0.2)">
                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <CalenderUI />
                    </Stack>
                </CardBody>
            </Card>
        </Box>
    );
};

export default Schedule;