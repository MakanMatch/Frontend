/* eslint-disable no-unused-vars */
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import FoodListingsPage from './pages/Listings/FoodListingsPage'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Navbar />
                            <Home />
                        </>
                    } />

                    <Route path="/listings" element={<FoodListingsPage/>} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App