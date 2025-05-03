import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

const AppTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2c3848',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#F4F6F8',
            paper: '#E0E3E7'
        },
        text: {
            primary: '#212121',
            secondary: '#37474F',
        },
    },
    shape: {
        borderRadius: 8,
    },
    typography: {
        button: {
            textTransform: 'none',
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: grey[900],
                    color: '#FFFFFF',
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                },
            },
        },
    }
});

export default AppTheme;