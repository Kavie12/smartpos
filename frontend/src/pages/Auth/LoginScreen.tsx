import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { CredentialsType } from "../../types/types";

export default function LoginScreen() {

    const [credentials, setCredentials] = useState<CredentialsType>({
        username: "",
        password: ""
    });
    const { login, isProcessing, error, setError } = useAuth();

    const loginHandler = () => {
        setError(null);

        if (!credentials.username || !credentials.password) {
            setError("Fill all the details.");
            return;
        }

        login(credentials.username, credentials.password);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: "12%" }}>
            <Typography textAlign="center" variant="h4" sx={{ fontWeight: "bold" }}>Welcome to SmartPOS</Typography>
            <Typography textAlign="center" variant="body1" sx={{ mt: 1 }}>Sign in with your credentials</Typography>
            <Container component="form" action={loginHandler} maxWidth="xs">
                <Stack spacing={2} useFlexGap sx={{ mt: 4 }}>

                    <TextField
                        id="username"
                        label="Username"
                        variant="outlined"
                        onChange={e => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                        value={credentials.username}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        onChange={e => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                        value={credentials.password}
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 4 }}
                        type="submit"
                        loading={isProcessing}
                        disableElevation
                        size="large"
                        id="loginBtn"
                    >
                        Sign in
                    </Button>
                    {error && <Typography textAlign="center" variant="subtitle1" color="error">{error}</Typography>}
                </Stack>
            </Container>
        </Container >
    );
}