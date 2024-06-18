import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Reviews from './components/reviews/SubmitReviews'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Navbar />
            <Home />
            <Reviews />
        </>
    )
}

export default App