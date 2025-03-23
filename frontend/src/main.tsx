import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { RouterProvider } from 'react-router';
import AuthProvider from './context/AuthContext.tsx';
import AppRouter from './routes/AppRouter.tsx';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppTheme from './data/AppTheme.tsx';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider theme={AppTheme}>
        <CssBaseline />
        <RouterProvider router={AppRouter} />
      </ThemeProvider>
    </AuthProvider>*/
  </StrictMode>
);