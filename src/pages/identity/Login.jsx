import React from 'react'
import { Box, Heading, Input, Button, Text, VStack, Checkbox, InputGroup, InputRightElement, FormControl, FormLabel, FormErrorMessage, Link } from '@chakra-ui/react'


function Login() {
    return (
        <Box>
            <div>Login</div>
            <Text textAlign='center' fontSize='12px' mb={5}>
                Already have an account? <Link href='./createAccount'>Sign Up</Link>
            </Text>
        </Box>
    )
}

export default Login