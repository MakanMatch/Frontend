/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import "./App.css";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, setLoading } from "./slices/AuthState.js";
import { useToast } from "@chakra-ui/react";
import showToast from "./components/showToast.js";

const contentWrapperStyles = {
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box'
}

function AuthRoot() {
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
        if (loaded == true) {
            const urlPath = location.pathname;
            if (user) {
                if (user.userType == "Admin" && !urlPath.startsWith("/admin")) {
                    navigate("/admin");
                } else if (user.userType != "Admin" && urlPath.startsWith("/admin")) {
                    navigate("/");
                }
            } else {
                if (urlPath.startsWith("/admin")) {
                    navigate("/");
                }
            }
        }
    }, [loaded, user])

    useEffect(() => {
        if (error) {
            console.log("Auth failed to load; error: " + error)
            sToast("Something went wrong", "We failed to load information for you. Please try again.", 3000, true, "error")
        }
    }, [error])

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
