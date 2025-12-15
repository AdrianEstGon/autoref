'use client';
import * as React from 'react';
import './page.css';
import AppRouter from './routes/Router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoogleMapsWrapper from './utils/GoogleMapsAPI';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GoogleMapsWrapper>
        <div className="App">
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ zIndex: 9999 }}
          />
          <AppRouter />
        </div>
      </GoogleMapsWrapper>
    </ThemeProvider>
  );
}

export default App;

