import { createContext, ReactNode, useContext, useState } from "react";
import Api from "../services/Api";

type AuthContextType = {
    login: (username: string, password: string) => void;
    isAuthenticated: boolean;
    token: string | null;
    isProcessing: boolean;
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

    const login = (username: string, password: string) => {
        setIsProcessing(true);
        Api.post("/login", { username, password })
            .then(res => {
                setIsAuthenticated(true);
                setToken(res.data);
            })
            .catch(() => {
                setIsAuthenticated(false);
                setToken(null);
            })
            .finally(() => setIsProcessing(false));
    }

    return <AuthContext.Provider value={{ login, isAuthenticated, token, isProcessing }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;


