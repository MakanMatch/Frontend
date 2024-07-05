import { useEffect, useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'
import UserContext from './context/UserContext.js'
import server from './networking.js'

function App() {
    const [user, setUser] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const fetchUser = () => {
            if (localStorage.getItem("jwt")) {
                server.get("/cdn/MyAccount", {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`
                    }
                })
                    .then((res) => {
                        if (res && res.data) {
                            setUser(res.data)
                        } else {
                            console.log("An error has occurred.")
                            console.log(res.data)
                        }
                        setLoaded(true)
                    })
                    .catch((err) => {
                        console.log(err)
                        console.log(`${err.response.data}`);
                        setLoaded(true)
                    });
            } else {
                console.log("No active user session locally.")
                setLoaded(true)
            };
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return (
        // This is a temporary measure. Pivot to using redux soon.
        <UserContext.Provider value={{ user, setUser, loaded, setLoaded }}>
            <Navbar />
            <Outlet />
        </UserContext.Provider>
    )
}

export default App