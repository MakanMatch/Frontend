import { useEffect } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import { useDispatch } from 'react-redux';
import { fetchUser } from './slices/AuthState';

function IdentityRoot() {
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem('jwt')) {
            dispatch(fetchUser());
        }
    }, [dispatch]);

    return (
        <div className='identityLayout'>
            <div className='contentWrapper'>
                <Navbar />
                <Outlet />
            </div>
        </div>
    )
}

export default IdentityRoot
