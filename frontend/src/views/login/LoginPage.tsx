import { Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";

export default function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, isAuthenticated, isProcessing } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const loginHandler = (e: FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Fill all the details.");
        }

        login(username, password);
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 18 }}>
            <Paper sx={{ p: 4 }} elevation={2}>
                <Typography textAlign="center" variant="h4" color="primary" sx={{ fontWeight: "bold" }}>SmartPOS</Typography>
                <form onSubmit={loginHandler}>
                    <Stack spacing={2} useFlexGap sx={{ mt: 4 }}>
                        <TextField id="username" label="Username" variant="standard" onChange={e => setUsername(e.target.value)} />
                        <TextField id="password" label="Password" variant="standard" type="password" onChange={e => setPassword(e.target.value)} />
                        <Button variant="text" sx={{ alignSelf: "end", mt: 4 }} type="submit" loading={isProcessing}>
                            Login
                        </Button>
                        <Typography textAlign="center" variant="subtitle1" color="error">{error}</Typography>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}