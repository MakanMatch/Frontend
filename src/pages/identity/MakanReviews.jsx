import React from 'react';
import { Box, Card, CardBody, Heading, Stack, StackDivider } from "@chakra-ui/react";
import MyAccountSidebar from "../../components/identity/MyAccountSidebar";

const MakanReviews = () => {
    return (
        <Box display="flex">
            <MyAccountSidebar />
            <Card width="75%" ml={10} borderRadius={15} boxShadow="0 2px 4px 2px rgba(0.2, 0.2, 0.2, 0.2)">
                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <Box>
                            <Heading p={2} ml={2} size={"lg"} textAlign="left">
                                My Reviews
                            </Heading>
                        </Box>
                        <Box>

                        </Box>
                    </Stack>
                </CardBody>
            </Card>
        </Box>
    );
};

export default MakanReviews;