import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useSidebar } from "../context/SidebarContext";
import { Link } from "react-router";
import { Dashboard, LocalShipping, People, Settings, Work } from "@mui/icons-material";

interface ListItemLinkProps {
    icon?: React.ReactElement<unknown>;
    text: string;
    to: string;
}

function ListItemLink({ icon, text, to }: ListItemLinkProps) {
    return (
        <ListItem>
            <ListItemButton component={Link} to={to}>
                {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
                <ListItemText primary={text} />
            </ListItemButton>
        </ListItem>
    );
}

export default function Sidebar() {

    const { open, setOpen } = useSidebar();

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                <ListItemLink
                    text="Dashboard"
                    to="/dashboard"
                    icon={<Dashboard />}
                />
                <ListItemLink
                    text="Suppliers"
                    to="/suppliers"
                    icon={<LocalShipping />}
                />
                <ListItemLink
                    text="Loyalty Members"
                    to="/loyalty_members"
                    icon={<People />}
                />
                <ListItemLink
                    text="Employees"
                    to="/employees"
                    icon={<Work />}
                />
            </List>
            <Divider />
            <List>
                <ListItemLink
                    text="Settings"
                    to="/dashboard"
                    icon={<Settings />}
                />
            </List>
        </Box>
    );

    return (
        <div>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}