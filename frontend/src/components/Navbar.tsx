import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { AddBox, Home, Menu, PointOfSale } from "@mui/icons-material";
import { IconButton, Stack, styled, Toolbar, Tooltip, Typography } from "@mui/material";
import { DRAWER_WIDTH } from '../data/Constants';
import { Link } from 'react-router';
import { ReactElement } from 'react';

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

function NavLink({ to, icon, title }: { to: string, icon: ReactElement<any, any>, title: string }) {
    return (
        <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
            <Tooltip title={title}>
                <IconButton color="inherit">
                    {icon}
                </IconButton>
            </Tooltip>
        </Link>
    );
}

export default function Navbar({ openSidebar, setOpenSidebar }: { openSidebar: boolean, setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>> }) {

    const handleDrawerOpen = () => {
        setOpenSidebar(true);
    };

    return (
        <AppBar position="fixed" elevation={0} open={openSidebar}>
            <Toolbar>
                <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
                    <Stack direction="row" alignItems="center">
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
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <NavLink to="/dashboard" icon={<Home />} title="Dashboard" />
                        <NavLink to="/billing/create_bill" icon={<PointOfSale />} title="Create Bill" />
                        <NavLink to="/stock_records/add_stock_record" icon={<AddBox />} title="Add Stock Record" />
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}