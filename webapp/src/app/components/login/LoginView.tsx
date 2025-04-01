import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './Login';

const defaultTheme = createTheme();

function LoginView() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid 
        container 
        component="main" 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundImage: 'url(/fondo4.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <CssBaseline />
        <Grid 
          item 
          xs={12} 
          sm={10} 
          md={10} 
          lg={8} 
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Login />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default LoginView;
