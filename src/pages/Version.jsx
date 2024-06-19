import { Text } from '@chakra-ui/react'
import React from 'react'
import { useSelector } from 'react-redux'

function Version() {
    const Universal = useSelector(state => state.universal)

    return (
        <Text>System version: {Universal.systemVersion}</Text>
    )
}

export default Version