import axios from "axios";
import { getValueByKey } from "../helpers/local_storage";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
    const token = getValueByKey("authToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});