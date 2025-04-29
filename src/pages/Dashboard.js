import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { Component } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import ProductList from './ProductList';
import AddProduct from './AddProduct';
import Home from './Home';
import { colors } from '@mui/material';

// const NAVIGATION = [
//     { path: '/dashboard/home', title: 'Home', icon: <DashboardIcon /> },
//     { path: '/dashboard/products', title: 'Products', icon: <ShoppingCartIcon /> },
//     { path: '/dashboard/add', title: 'Add Product', icon: <LibraryAddIcon /> },
//   ];
  
  // export default function Dashboard() {
  //   return (
  //     <Box sx={{ display: 'flex' }}>
  //       {/* Sidebar */}
  //       <Box
  //         sx={{
  //           width: 250,
  //           height: '100vh',
  //           bgcolor: 'primary.main',
  //           color: 'white',
  //           p: 2,
  //         }}
  //       >
  //         <Typography variant="h5" sx={{ mb: 2 }}>
  //           Dashboard
  //         </Typography>
  //         {NAVIGATION.map((item) => (
  //           <Box key={item.title} sx={{ mb: 2 }}>
  //             <Link to={item.path} style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
  //               {item.icon}
  //               <Typography sx={{ ml: 1 }}>{item.title}</Typography>
  //             </Link>
  //           </Box>
  //         ))}
  //       </Box>
  
  //       {/* Content Area */}
  //       <Box sx={{ flexGrow: 1, p: 3 }}>
  //         <Routes>
  //           <Route path="/dashboard/home" element={<Home />} />
  //           <Route path="/dashboard/products" element={<ProductList />} />
  //           <Route path="/dashboard/add" element={<AddProduct />} />
  //         </Routes>
  //       </Box>
  //     </Box>
  //   );
  // }

const NAVIGATION = [
  {
    segment: 'home',
    title: 'Home',
    icon: <DashboardIcon />
  },
  {
    segment: 'list',
    title: 'Products',
    icon: <ShoppingCartIcon />
  },
  {
    segment: 'add',
    title: 'Add Product',
    icon: <LibraryAddIcon/>
  }
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

/*Routing and Contents according to Routes currently rendered by this function mf*/
function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Routes>
        <Route path='/home' element={<Home/>}/>
        <Route path='/add' element={<AddProduct/>}/>
        <Route path='/list' element={<ProductList/>}/>
      </Routes>
    </Box>
  );
}

/*Dashboard rendering*/
export default function Dashboard(props) {

  return (
    // preview-start
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        title: 'smartPOS',
        homeUrl: 'http://localhost:3000/home',
      }}

      theme={demoTheme}
    >
      <DashboardLayout>
        <DemoPageContent/>
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}