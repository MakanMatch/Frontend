import { Box, Card, CardBody, Heading, Stack, StackDivider } from "@chakra-ui/react";
import GuestSideNav from "../../components/identity/GuestSideNav";
import MakanHistoryCard from "../../components/identity/MakanHistoryCard";

const MakanHistory = () => {
    return (
        <Box display="flex">
            <GuestSideNav />
            <Card width="75%" ml={10} borderRadius={15} boxShadow="0 2px 4px 2px rgba(0.2, 0.2, 0.2, 0.2)">
                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <Box>
                            <Heading p={2} ml={2} size={"lg"} textAlign="left">
                                Previous Visits
                            </Heading>
                        </Box>
                        <Box>
                            <MakanHistoryCard />
                        </Box>
                    </Stack>
                </CardBody>
            </Card>
        </Box>
    );
};

export default MakanHistory;