import axios from "axios";

export const NoAuthApi = axios.create({
    baseURL: "http://localhost:8080/api/v1"
});

export const AuthApi = axios.create({
    baseURL: "http://localhost:8080/api/v1"
});

AuthApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwtToken")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);