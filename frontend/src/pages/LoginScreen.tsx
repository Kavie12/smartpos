import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { login, isProcessing, error, setError } = useAuth();

    const loginHandler = (e: FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Fill all the details.");
            return;
        }

        login(username, password);
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 20 }}>
            <Typography textAlign="center" variant="h4" sx={{ fontWeight: "bold" }}>Welcome to SmartPOS</Typography>
            <Typography textAlign="center" variant="body1" sx={{ mt: 1 }}>Sign in with your credentials</Typography>
            <form onSubmit={loginHandler}>
                <Stack spacing={2} useFlexGap sx={{ mt: 4 }}>

                    <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        onChange={e => setUsername(e.target.value)}
                        size="small"
                    />
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                        size="small"
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 4 }}
                        type="submit"
                        loading={isProcessing}
                    >
                        Sign in
                    </Button>
                    {error && <Typography textAlign="center" variant="subtitle1" color="error">{error}</Typography>}
                </Stack>
            </form>
        </Container >
    );
}