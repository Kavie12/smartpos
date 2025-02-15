import { Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [processing, setProcessing] = useState(false);

    const login = () => {
        if (username != "" && password != "") {
            setProcessing(true);
            axios.post('http://localhost:8080/users/login', {
                username: username,
                password: password
            }, {
                withCredentials: true
            })
                .then(res => {
                    console.log(res);
                    setProcessing(false);
                    setError("");
                })
                .catch(err => {
                    console.log(err);
                    setProcessing(false);
                    setError("Error. Please try again.");
                });
        } else {
            setError("Please fill all the details!");
        }
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="xs" sx={{ mt: 10 }}>
                <Paper sx={{ p: 4 }} elevation={2}>
                    <Typography textAlign="center" variant="h4" color="primary" sx={{ fontWeight: "bold" }}>SmartPOS</Typography>
                    <Stack spacing={2} useFlexGap sx={{ mt: 4 }}>
                        <TextField id="username" label="Username" variant="standard" onChange={e => setUsername(e.target.value)} />
                        <TextField id="password" label="Password" variant="standard" type="password" onChange={e => setPassword(e.target.value)} />
                        <Button variant="text" sx={{ alignSelf: "end", mt: 4 }} onClick={login} loading={processing}>
                            Login
                        </Button>
                        <Typography textAlign="center" variant="subtitle1" color="error">{error}</Typography>
                    </Stack>
                </Paper>
            </Container>
        </>
    );
}