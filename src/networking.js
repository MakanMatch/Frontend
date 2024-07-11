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

export default instance;