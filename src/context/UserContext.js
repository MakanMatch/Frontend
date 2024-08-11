import { createContext } from 'react';
// import server from '../networking'



const UserContext = createContext({
    user: null,
    loaded: false,
    setUser: () => { },
    setLoaded: () => { }
});

export default UserContext;