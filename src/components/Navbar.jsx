import { Box, Center, Container, Heading, Text } from '@chakra-ui/react'
import React from 'react'

function Navbar() {
    return (
        <Container bgGradient={"linear(to-br, #ff86d6, #ffa14a)"} dropShadow={"5px solid"} maxWidth={"100%"} padding={"10px"} rounded={"10px"} mb={"20px"}>
            <Text color={"white"} fontWeight={"bold"}>MakanMatch</Text>
        </Container>
    )
}

export default Navbar