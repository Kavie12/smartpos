import axios from "axios";

export const NoAuthApi = axios.create({
    baseURL: "http://localhost:8080/api/v1"
});

export const AuthApi = axios.create({
    baseURL: "http://localhost:8080/api/v1"
});

AuthApi.interceptors.request.use(
    config => {
        const authObject = JSON.parse(localStorage.getItem("authObject") ?? '{}');
        if (authObject) {
            config.headers.Authorization = `Bearer ${authObject.token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

AuthApi.interceptors.response.use(
    response => response,
    error => {
        if (
            error.response?.status === 401 &&
            error.response?.data?.error === "JWT_EXPIRED"
        ) {
            localStorage.removeItem("auth");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);