import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Menu } from "@mui/icons-material";
import { IconButton, styled, Toolbar, Typography } from "@mui/material";
import { DRAWER_WIDTH } from '../data/Constants';

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    variants: [
        {
            props: ({ open }) => open,
            style: {
                marginLeft: DRAWER_WIDTH,
                width: `calc(100% - ${DRAWER_WIDTH}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
            },
        },
    ],
}));

export default function Navbar({ openSidebar, setOpenSidebar }: { openSidebar: boolean, setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>> }) {

    const handleDrawerOpen = () => {
        setOpenSidebar(true);
    };

    return (
        <AppBar position="fixed" elevation={0} open={openSidebar} color="primary">
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={[
                        {
                            marginRight: 5,
                        },
                        openSidebar && { display: 'none' },
                    ]}
                >
                    <Menu />
                </IconButton>
                <Typography variant="h6" noWrap component="div">
                    SMARTPOS
                </Typography>
            </Toolbar>
        </AppBar>
    );
}