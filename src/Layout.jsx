import { useEffect, useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import server from './networking.js'
import { useDispatch } from 'react-redux';
import { fetchUser } from './slices/AuthState';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem('jwt')) {
            dispatch(fetchUser());
        }
    }, [dispatch]);

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default App
