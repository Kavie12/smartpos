import { createContext, ReactNode, useContext, useState } from "react";
import Api from "../services/Api";

export type AuthContextType = {
    login: (username: string, password: string) => void;
    isAuthenticated: boolean;
    token: string | null;
    isProcessing: boolean;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

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
    const [token, setToken] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = (username: string, password: string) => {
        setIsProcessing(true);
        Api.post("/auth/authenticate", { username, password })
            .then(res => {
                setIsAuthenticated(true);
                setToken(res.data);
            })
            .catch(err => {
                setIsAuthenticated(false);
                setToken(null);
                if (err.response) {
                    if (err.response.status === 403) setError("Credentials do not match.");
                    else setError("An unexpected error occurred.");
                } else if (err.code === "ERR_NETWORK") {
                    setError("Server is offline.");
                } else {
                    setError("Something went wrong. Please try again.");
                }
            })
            .finally(() => setIsProcessing(false));
    }

    return <AuthContext.Provider value={{ login, isAuthenticated, token, isProcessing, error, setError }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;


