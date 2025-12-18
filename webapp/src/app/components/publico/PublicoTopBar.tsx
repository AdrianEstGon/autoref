import React from 'react';
import { AppBar, Toolbar, Box, Button, Container, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const PublicoTopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path: string) => navigate(path);
  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255,255,255,0.86)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        color: '#0f172a',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box
            onClick={() => go('/')}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.25, cursor: 'pointer', userSelect: 'none' }}
          >
            <Box component="img" src="/logo.png" alt="AutoRef" sx={{ width: 34, height: 34 }} />
            <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
              AutoRef
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => go('/')}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 999,
                backgroundColor: isActive('/') ? 'rgba(74,144,226,0.10)' : 'transparent',
              }}
            >
              Inicio
            </Button>
            <Button
              color="inherit"
              onClick={() => go('/noticias')}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 999,
                backgroundColor: isActive('/noticias') ? 'rgba(74,144,226,0.10)' : 'transparent',
              }}
            >
              Noticias
            </Button>
            <Button
              variant="contained"
              onClick={() => go('/login')}
              sx={{
                textTransform: 'none',
                fontWeight: 800,
                borderRadius: 999,
                px: 2.25,
                background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)',
              }}
            >
              Iniciar sesión
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default PublicoTopBar;


