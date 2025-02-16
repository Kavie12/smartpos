import { AppBar, Box, Button, CssBaseline, Toolbar, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router";

type NavbarProps = {
    full?: boolean;
}

export default function Navbar({ full = false }: NavbarProps) {
    let navigate = useNavigate();

    const logout = () => {
        axios.get('http://localhost:8080/users/logout', {
            withCredentials: true
        })
            .then(() => {
                navigate("/login");
            })
            .catch(err => {
                console.log(err);
            });
    }
    return (
        <>
            <CssBaseline />
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            SmartPOS
                        </Typography>
                        {full && <Button color="inherit" onClick={logout}>Logout</Button>}
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    );
}