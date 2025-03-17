import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

const AppTheme = createTheme({
    palette: {
        background: {
            default: grey[100]
        },
        primary: {
            main: grey[900]
        },
    },
    typography: {
        button: {
            textTransform: 'none'
        }
    }
});

export default AppTheme;