/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import server from './networking.js'
import { useDispatch } from 'react-redux';
import { fetchUser, setLoading } from './slices/AuthState';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem('jwt')) {
            dispatch(fetchUser());
        } else {
            dispatch(setLoading(true))
        }
    }, []);

    return (
        <div className='defaultLayout'>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default App
