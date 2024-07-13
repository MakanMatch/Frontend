import { useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import { useDispatch } from "react-redux";
import { fetchUser, setLoading } from './slices/AuthState';

const contentWrapperStyles = {
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
}

function AuthRoot() {
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem('jwt')) {
            dispatch(fetchUser());
        } else {
            dispatch(setLoading(true))
        }
    }, []);

    return (
        <div className="authLayout">
            <div style={contentWrapperStyles}>
                <Navbar />
                <Outlet />
            </div>
        </div>
    );
}

export default AuthRoot;
