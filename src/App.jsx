import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home'
import Navbar from './components/Navbar'
import CreateAccount from './pages/identity/CreateAccount'
import Login from './pages/identity/Login'

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path={"/"} element={<Home />} />
                    <Route path={"/createAccount"} element={<CreateAccount />} />
                    <Route path={"/login"} element={<Login />} />
                </Routes>
            </Router>

        </>
    )
}

export default App