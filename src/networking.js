import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
})

instance.interceptors.request.use((config) => {
    config.headers["content-type"] = "application/json";
    config.headers["mmapikey"] = import.meta.env.VITE_BACKEND_API_KEY

    return config;
}, (err) => {
    return Promise.reject(err);
})

export default instance;