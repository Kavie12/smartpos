import axios from "axios";

export const NoAuthApi = axios.create({
    baseURL: "http://localhost:8080/api/v1"
});

export const AuthApi = axios.create({
    baseURL: "http://localhost:8080/api/v1"
});

AuthApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem("jwtToken")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

AuthApi.interceptors.response.use(
    response => {
        if (response.status === 403) {
            alert("Session expired. Please logout and login again.");
        }
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);