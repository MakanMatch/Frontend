import React from 'react'
import { useSelector } from 'react-redux'

function Home() {
    const Universal = useSelector(state => state.universal)

    return <div>
        <p>Home</p>
        <p>{Universal.systemName}, {Universal.systemVersion}</p>
    </div>
}

export default Home