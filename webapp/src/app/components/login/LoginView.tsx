import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Login from './Login';

const defaultTheme = createTheme();
const numPhotos = 11;

function LoginView() {
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      const urlLogo = await firebaseUtils.getPhoto('/app/randomImages/' + (Math.floor(Math.random() * numPhotos) + 1) + '.jpg');
      setBackgroundImage(urlLogo);
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Login />
        </Grid>
      </ThemeProvider>
    </div>
  );
}

export default LoginView;
