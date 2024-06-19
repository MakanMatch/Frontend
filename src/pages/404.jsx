import { Center, Container, Heading, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <Center>
            <VStack spacing={"10px"}>
                <Heading as={"h1"}>Oops! You're lost!</Heading>
                <Text color={"gray.300"} size={"xs"}>404 Not Found</Text>
                <Text>Sorry, seems like you tried to access a page that doesn't exist!</Text>
                <Link to={"/"}><Text variant={"link"}>Go back to the home page here</Text></Link>
            </VStack>
        </Center>
    )
}

export default NotFound