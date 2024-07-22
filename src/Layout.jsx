/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import server from './networking.js'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, setLoading } from './slices/AuthState';
import { useToast } from '@chakra-ui/react'
import showToast from './components/showToast.js'

function App() {
    const dispatch = useDispatch();
    const toast = useToast();
    const sToast = showToast(toast);
    const { user, loaded, error } = useSelector(state => state.auth)

    useEffect(() => {
        if (localStorage.getItem('jwt')) {
            dispatch(fetchUser());
        } else {
            dispatch(setLoading(true))
        }
    }, []);

    useEffect(() => {
        if (error) {
            console.log("Auth failed to load; error: " + error)
            sToast("Something went wrong", "We failed to load information for you. Please try again.", 3000, true, "error")
        }
    }, [error])

    return (
        <div className='defaultLayout'>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default App
