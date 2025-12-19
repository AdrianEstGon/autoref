import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import PublicIcon from '@mui/icons-material/Public';
import { Toaster, toast } from 'react-hot-toast';
import userService from '../../services/UserService';

function LoginView() {
  const [logo, setLogo] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    setLogo('./logo.png');
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
      const role = window.localStorage.getItem('userRole');
      if (role === 'Club') {
        navigate('/club/inscripciones');
      } else if (role === 'Federacion' || role === 'Admin') {
        navigate('/federacion/mutua');
      } else {
        navigate('/misDesignaciones');
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        position: 'relative',
        overflow: 'hidden',
        p: 3,
      }}
    >
      <Toaster />
      
      {/* Elementos decorativos sutiles */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74, 144, 226, 0.1) 0%, transparent 70%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(44, 95, 141, 0.15) 0%, transparent 70%)',
        }}
      />

      {/* Card de login centrada */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 4,
          borderRadius: 3,
          bgcolor: 'white',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {logo && (
            <Box
              component="img"
              src={logo}
              alt="AutoRef"
              sx={{
                height: 64,
                width: 'auto',
                mb: 2,
              }}
            />
          )}
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{ color: '#0f172a', mb: 0.5 }}
          >
            Iniciar sesión
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ingresa tus credenciales para continuar
          </Typography>
        </Box>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="login"
            data-testid="login"
            label="Usuario o correo electrónico"
            name="email"
            value={email}
            autoComplete="email"
            onChange={handleEmailChange}
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#f8fafc',
                '&:hover': { bgcolor: '#f1f5f9' },
                '&.Mui-focused': { bgcolor: 'white' },
              },
            }}
          />
          
          <FormControl
            variant="outlined"
            fullWidth
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#f8fafc',
                '&:hover': { bgcolor: '#f1f5f9' },
                '&.Mui-focused': { bgcolor: 'white' },
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
                    sx={{ color: '#64748b', '&:hover': { color: '#4A90E2' } }}
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
                borderRadius: 2,
                bgcolor: '#f8fafc',
              }}
            >
              <CircularProgress size={24} sx={{ color: '#4A90E2' }} />
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
            startIcon={<LoginIcon />}
            sx={{
              mt: 4,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(30, 41, 59, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                boxShadow: '0 6px 20px rgba(30, 41, 59, 0.5)',
              },
              '&:disabled': { background: '#cbd5e1' },
            }}
          >
            Iniciar sesión
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary">o</Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<PublicIcon />}
            onClick={() => navigate('/')}
            sx={{
              py: 1.5,
              borderRadius: 2,
              borderColor: '#e2e8f0',
              color: '#64748b',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#4A90E2',
                bgcolor: alpha('#4A90E2', 0.04),
                color: '#4A90E2',
              },
            }}
          >
            Acceder al portal público
          </Button>
        </Box>

        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          sx={{ mt: 3, color: '#94a3b8' }}
        >
          © {new Date().getFullYear()} AutoRef
        </Typography>
      </Paper>
    </Box>
  );
}

export default LoginView;
