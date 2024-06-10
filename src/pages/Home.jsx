import React from 'react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import server from '../networking';

function Home() {
    const Universal = useSelector(state => state.universal)
    const [healthCheck, setHealthCheck] = useState('Contacting...')

    useEffect(() => {
        checkHealth()
    })

    const checkHealth = () => {
        // setHealthCheck('Checking...')
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

    return <div>
        <p>Home</p>
        <p>{Universal.systemName}, {Universal.systemVersion}</p>
        <p>Backend health check: {healthCheck}</p>
        <button onClick={checkHealth}>Check Health</button>
    </div>
}

export default Home