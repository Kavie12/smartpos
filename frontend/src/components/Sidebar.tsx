import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, useLocation } from 'react-router';
import { AddBox, Inventory, LocalShipping, Logout, Money, People, Work } from '@mui/icons-material';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';
import { DRAWER_WIDTH } from '../data/Constants';

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface DrawerLinkProps {
  icon?: React.ReactElement<unknown>;
  text: string;
  to: string;
}

const DrawerLink = ({ icon, text, to }: DrawerLinkProps) => {
  const location = useLocation();
  const { open } = useSidebar();

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        component={Link}
        to={to}
        selected={location.pathname === to}
        sx={[
          {
            minHeight: 48,
            px: 2.5,
          },
          open
            ? {
              justifyContent: 'initial',
            }
            : {
              justifyContent: 'center',
            },
        ]}
      >
        {
          icon ?
            <ListItemIcon
              sx={[
                {
                  minWidth: 0,
                  justifyContent: 'center',
                },
                open
                  ? {
                    mr: 3,
                  }
                  : {
                    mr: 'auto',
                  },
              ]}
            >
              {icon}
            </ListItemIcon>
            :
            null
        }
        <ListItemText
          primary={text}
          sx={[
            open
              ? {
                opacity: 1,
              }
              : {
                opacity: 0,
              },
          ]}
        />
      </ListItemButton>
    </ListItem>
  );
}

interface DrawerButtonProps {
  icon?: React.ReactElement<unknown>;
  text: string;
  fn: () => void;
}

const DrawerButton = ({ icon, text, fn }: DrawerButtonProps) => {
  const { open } = useSidebar();

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        onClick={fn}
        sx={[
          {
            minHeight: 48,
            px: 2.5,
          },
          open
            ? {
              justifyContent: 'initial',
            }
            : {
              justifyContent: 'center',
            },
        ]}
      >
        {
          icon ?
            <ListItemIcon
              sx={[
                {
                  minWidth: 0,
                  justifyContent: 'center',
                },
                open
                  ? {
                    mr: 3,
                  }
                  : {
                    mr: 'auto',
                  },
              ]}
            >
              {icon}
            </ListItemIcon>
            :
            null
        }
        <ListItemText
          primary={text}
          sx={[
            open
              ? {
                opacity: 1,
              }
              : {
                opacity: 0,
              },
          ]}
        />
      </ListItemButton>
    </ListItem>
  );
}

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function Sidebar() {
  const theme = useTheme();

  const { open, setOpen } = useSidebar();
  const { logout } = useAuth();

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <DrawerLink
          text="Billing"
          to="/billing"
          icon={<Money />}
        />
        <DrawerLink
          text="Stock"
          to="/stock"
          icon={<AddBox />}
        />
        <DrawerLink
          text="Products"
          to="/products"
          icon={<Inventory />}
        />
        <DrawerLink
          text="Suppliers"
          to="/suppliers"
          icon={<LocalShipping />}
        />
        <DrawerLink
          text="Loyalty Members"
          to="/loyalty_members"
          icon={<People />}
        />
        <DrawerLink
          text="Employees"
          to="/employees"
          icon={<Work />}
        />
      </List>
      <Divider />
      <List>
        <DrawerButton
          text="Logout"
          fn={logout}
          icon={<Logout />}
        />
      </List>
    </Drawer>
  );
}