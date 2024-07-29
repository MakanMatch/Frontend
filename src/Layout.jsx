/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser, setLoading } from './slices/AuthState';
import { useToast } from '@chakra-ui/react'
import showToast from './components/showToast.js'

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
        const urlPath = location.pathname;
        if (user) {
            if (user.userType == "Admin" && !urlPath.startsWith("/admin")) {
                navigate("/admin");
            }
        } else {
            if (urlPath.startsWith("/admin")) {
                navigate("/");
            }
        }
    }, [user])

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
