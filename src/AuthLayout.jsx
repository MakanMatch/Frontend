import { useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import { useDispatch } from "react-redux";
import { fetchUser } from "./slices/AuthState.js";

function AuthRoot() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  return (
    <div className="authLayout">
      <div className="contentWrapper">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default AuthRoot;
