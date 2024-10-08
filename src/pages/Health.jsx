import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import server from '../networking';
import { Box, Button, Heading, Text } from '@chakra-ui/react';

function Health() {
    const Universal = useSelector(state => state.universal)
    const [healthCheck, setHealthCheck] = useState('Contacting...')

    useEffect(() => {
        checkHealth()
    }, [])

    const checkHealth = () => {
        setHealthCheck('Contacting...')
        server.get("/misc/health")
        .then(response => {
            if (response.status == 200) {
                setHealthCheck(response.data)
            }
        })
        .catch(err => {
            setHealthCheck('Error: ' + err.message)
        })
    }

    return <Box>
        <Heading as={"h1"}>Home</Heading>
        <Text>{Universal.systemName}, {Universal.systemVersion}</Text>
        <Text>Backend health check: {healthCheck}</Text>
        <Button mt={"20px"} onClick={checkHealth} variant={"MMPrimary"}>Check Health</Button>
    </Box>
}

export default Health