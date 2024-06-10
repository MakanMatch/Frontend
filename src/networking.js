import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.BACKEND_URL,
})

export default instance;