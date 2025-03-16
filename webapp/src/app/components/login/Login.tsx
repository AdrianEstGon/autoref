import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Toaster, toast } from 'react-hot-toast';
import userService from '../../services/userService';

function Login() {
  const [logo, setLogo] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const userLogged = window.localStorage.getItem('userLogged');
    if (userLogged) {
      window.location.href = '/autoRef/home';
    }

    async function fetchData() {
      setLogo('./logo.png');
    }
    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const checkUserAndPassword = async (usernameOrEmail: string, password: string) => {
    const response = await userService.login(usernameOrEmail, password);
    return response;
  };

  const checkEmailOrUsername = async (): Promise<boolean> => {
    if (email && password) {
      try {
        // Llamada al servicio para verificar el usuario y la contraseña
        let userLogin = await checkUserAndPassword(email, password);
  
        if (userLogin.success) {
      
          const token = userLogin.token; 
  
          if (token) {
            // Almacenar el token en localStorage para futuras solicitudes
            window.localStorage.setItem('authToken', token);
            userLogin.timestamp = new Date();
            window.localStorage.setItem('userLogged', JSON.stringify(userLogin));
          }
  
          toast.success('Inicio de sesión exitoso', { duration: 1500 });
        }
  
        return true; // El login fue exitoso
      } catch (error) {
        toast.error('Error al iniciar sesión', { duration: 1500 });
        return false; // El login falló
      }
    } else {
      toast.error('Falta completar algún campo', { duration: 1500 });
      return false; // El login falló debido a campos vacíos
    }
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsChecking(true);
    let isAllOk = await checkEmailOrUsername();
    setIsChecking(false);
    if (isAllOk) {
      // Usar navigate en lugar de window.location.href
      navigate('/misDesignaciones');
    }
  };

  return (
    <Grid 
      item 
      xs={12} 
      sm={8} 
      md={5} 
      component={Paper} 
      elevation={6} 
      square 
      sx={{ 
        padding: 4, 
        borderRadius: 4, 
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div><Toaster /></div>
      <Box
        sx={{
          my: 8,
          mx: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {logo && <img src={logo} alt="Logo de AutoRef" />}
        <Avatar sx={{ m: 1, bgcolor: 'blue' }} />
        <Typography component="h1" variant="h5">
          Iniciar sesión
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="login"
            data-testid="login"
            label="Email"
            name="email"
            value={email}
            autoComplete="email"
            onChange={handleEmailChange}
            autoFocus
          />
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">Contraseña *</InputLabel>
            <OutlinedInput
              name="password"
              label="Contraseña"
              value={password}
              id="password"
              data-testid="password"
              onChange={handlePasswordChange}
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          {isChecking && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
              <CircularProgress />
              <Typography variant="body2">
                Se están comprobando las credenciales...
              </Typography>
            </div>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Iniciar sesión
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}

export default Login;
