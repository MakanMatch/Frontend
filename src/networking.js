import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
})

instance.interceptors.request.use((config) => {
    config.headers["content-type"] = "application/json";
    if (localStorage.getItem('jwt')) {
        config.headers["Authorization"] = `Bearer ${localStorage.getItem('jwt')}`
    }
    config.headers["mmapikey"] = import.meta.env.VITE_BACKEND_API_KEY

    return config;
}, (err) => {
    return Promise.reject(err);
})

instance.interceptors.response.use((config) => {
    const refreshedtoken = config.headers.toJSON()['refreshedtoken']

    if (refreshedtoken) {
        localStorage.setItem('jwt', refreshedtoken)
        localStorage.setItem('tokenRefreshed', 'true')
    }

    return config
}, (err) => {
    if (err.response.data.startsWith("ERROR: Token expired") || err.response.data.startsWith("ERROR: User does not exist")) {
        localStorage.removeItem('jwt')
        localStorage.removeItem('tokenRefreshed')
    }

    return Promise.reject(err)
})

export default instance;