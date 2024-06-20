import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Reviews from './pages/reviews/Reviews'
function App() {
    const [count, setCount] = useState(0)

    return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
        </BrowserRouter>
      );
}

export default App