import { AppBar, Button, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";

export default function NavBar() {
    return(
        <>
        <AppBar style={{backgroundColor: "purple"}}>
            <Toolbar>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/list">Product</Button>
                <Button color="inherit" component={Link} to="/add">Add</Button>
            </Toolbar>
        </AppBar>
        </>
    );
}