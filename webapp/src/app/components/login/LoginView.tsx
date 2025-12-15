import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Toaster, toast } from 'react-hot-toast';
import userService from '../../services/UserService';

const defaultTheme = createTheme();

function LoginView() {
  const [logo, setLogo] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const userLogged = window.localStorage.getItem('userLogged');
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
        let userLogin = await checkUserAndPassword(email, password);

        if (userLogin.message === 'Inicio de sesión exitoso') {
          const token = userLogin.token;

          if (token) {
            window.localStorage.setItem('authToken', token);
            const now = new Date();
            const localTimestamp = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString();
            userLogin.timestamp = localTimestamp;

            window.localStorage.setItem('userLogged', JSON.stringify(userLogin));
            window.localStorage.setItem('userId', userLogin.id);

            if (userLogin.fotoPerfil) {
              window.localStorage.setItem('fotoPerfil', userLogin.fotoPerfil);
            }
          }

          toast.success('Inicio de sesión exitoso', { duration: 1500 });
        }

        return true;
      } catch (error) {
        toast.error('Error al iniciar sesión', { duration: 1500 });
        return false;
      }
    } else {
      toast.error('Falta completar algún campo', { duration: 1500 });
      return false;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsChecking(true);
    let isAllOk = await checkEmailOrUsername();
    setIsChecking(false);
    if (isAllOk) {
      navigate('/misDesignaciones');
    }
  };

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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/fondo4.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
          },
        }}
      >
        <CssBaseline />
        {/* Círculos decorativos animados */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'float 6s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translate(0, 0)' },
              '50%': { transform: 'translate(-20px, 20px)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-10%',
            left: '-5%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />

        <Grid
          item
          xs={11}
          sm={8}
          md={5}
          lg={4}
          sx={{ display: 'flex', justifyContent: 'center', zIndex: 1 }}
        >
          <Grid
            item
            xs={12}
            component={Paper}
            elevation={24}
            sx={{
              padding: 5,
              borderRadius: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '5px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          >
            <div><Toaster /></div>
            <Box
              sx={{
                my: 4,
                mx: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Logo mejorado */}
              <Box
                sx={{
                  mb: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                {logo && (
                  <Box
                    component="img"
                    src={logo}
                    alt="Logo de AutoRef"
                    sx={{
                      height: 80,
                      width: 'auto',
                      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                    }}
                  />
                )}
                <Box>
                  <Typography 
                    component="h1" 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textAlign: 'center',
                    }}
                  >
                    Bienvenido
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#64748b',
                      textAlign: 'center',
                      mt: 0.5,
                    }}
                  >
                    Ingresa a tu cuenta para continuar
                  </Typography>
                </Box>
              </Box>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="login"
                  data-testid="login"
                  label="Correo electrónico"
                  name="email"
                  value={email}
                  autoComplete="email"
                  onChange={handleEmailChange}
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      bgcolor: '#f8fafc',
                      '&:hover': {
                        bgcolor: '#f1f5f9',
                      },
                      '&.Mui-focused': {
                        bgcolor: 'white',
                      },
                    },
                  }}
                />
                <FormControl 
                  variant="outlined" 
                  fullWidth 
                  sx={{ 
                    mt: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      bgcolor: '#f8fafc',
                      '&:hover': {
                        bgcolor: '#f1f5f9',
                      },
                      '&.Mui-focused': {
                        bgcolor: 'white',
                      },
                    },
                  }}
                >
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
                          sx={{
                            color: '#64748b',
                            '&:hover': {
                              color: '#2563eb',
                            },
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                {isChecking && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      gap: 2,
                      mt: 3,
                      p: 2,
                      borderRadius: '12px',
                      bgcolor: '#f8fafc',
                    }}
                  >
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Verificando credenciales...
                    </Typography>
                  </Box>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isChecking}
                  sx={{ 
                    mt: 4, 
                    mb: 2,
                    py: 1.5,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: '#cbd5e1',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  Iniciar sesión
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default LoginView;
