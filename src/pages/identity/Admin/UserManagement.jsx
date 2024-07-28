import { Heading, Card, CardHeader, CardBody, Stack, HStack, StackDivider, Box, Text, Avatar  } from "@chakra-ui/react";
import { BsThreeDotsVertical } from 'react-icons/bs';
import UserManagementCard from "../../../components/identity/UserManagementCard";

function UserManagement() {
    return (
        <>
            <Heading size='lg' textAlign={"center"} mt={10} mb={5}>User Management</Heading>
            <Card>
                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        <UserManagementCard username={"Username1"} email={"username1@gmail.com"} userType={"Host"}/>
                        <UserManagementCard username={"Username2"} email={"userName2@gmail.com.sgsgsgsggssgsgsggsgsgsgsgsgsgggsgsggs"} userType={"Guest"} />
                        <UserManagementCard username={"Username390234570892347085972308574352908"} email={"pmtnssssssssssssssssss@gmail.com"} userType={"Host"} />
                        <UserManagementCard username={"Username3"} email={"XXXXXXXXXXXXXXXXXXX"} userType={"Host"} />
                        <UserManagementCard username={"Username4"} email={"XXXXXXXXXXXXXXXXXXX"} userType={"Guest"} />  
                        <UserManagementCard username={"Username5"} email={"XXXXXXXXXXXXXXXXXXX"} userType={"Guest"} />
                        <UserManagementCard username={"Username6"} email={"XXXXXXXXXXXXXXXXXXX"} userType={"Guest"} />
                        <UserManagementCard username={"Username7"} email={"XXXXXXXXXXXXXXXXXXX"} userType={"Guest"} />
                    </Stack>
                </CardBody>
            </Card>
        </>
    )
}

export default UserManagement