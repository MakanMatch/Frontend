import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import FoodListingsPage from './pages/Listings/FoodListingsPage'
import Navbar from './components/Navbar'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Navbar />
            <Home />
            <FoodListingsPage />
        </>
    )
}

export default App