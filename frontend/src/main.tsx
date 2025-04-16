import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { RouterProvider } from 'react-router';
import AuthProvider from './context/AuthContext.tsx';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppTheme from './data/AppTheme.tsx';
import BillingProvider from './context/BillingContext.tsx';
import AppRoutes from './routes/AppRoutes.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BillingProvider>
        <ThemeProvider theme={AppTheme}>
          <CssBaseline />
          <RouterProvider router={AppRoutes} />
        </ThemeProvider>
      </BillingProvider>
    </AuthProvider>
  </StrictMode>
);