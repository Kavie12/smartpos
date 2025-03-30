import { createContext, ReactNode, useContext, useState } from "react";
import { NoAuthApi } from "../services/Api";

type AuthContextType = {
    login: (username: string, password: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isProcessing: boolean;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const authContext = useContext(AuthContext);

    if (authContext == null) {
        throw new Error("useAuth must be used within an AuthProvider.");
    }

    return authContext;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = (username: string, password: string) => {
        setIsProcessing(true);
        NoAuthApi.post("/auth/authenticate", { username, password })
            .then(res => {
                const token = res.data;
                localStorage.setItem("jwtToken", token);
                setIsAuthenticated(true);
            })
            .catch(err => {
                setIsAuthenticated(false);
                if (err.response) {
                    if (err.response.status === 403) setError("Credentials do not match.");
                    else setError("An unexpected error occurred.");
                } else if (err.code === "ERR_NETWORK") {
                    setError("Failed connecting to the server.");
                } else {
                    setError("Something went wrong. Please try again.");
                }
            })
            .finally(() => setIsProcessing(false));
    }

    const logout = () => {
        localStorage.removeItem("jwtToken");
        setIsAuthenticated(false);
    };

    return <AuthContext.Provider value={{ login, logout, isAuthenticated, isProcessing, error, setError }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;