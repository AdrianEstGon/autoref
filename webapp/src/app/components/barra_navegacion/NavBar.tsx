import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem, Typography, Box, IconButton, useMediaQuery, Drawer } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';  
import AccountCircleIcon from '@mui/icons-material/AccountCircle';  
import MenuIcon from '@mui/icons-material/Menu';  
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const [anchorElPanel, setAnchorElPanel] = useState<null | HTMLElement>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const role = window.localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  const handleMenuPanelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElPanel(event.currentTarget);
  };

  const handleClosePanelMenu = () => {
    setAnchorElPanel(null);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('userLogged');
    window.localStorage.removeItem('userRole');
    window.location.href = '/';
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClosePanelMenu();
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Button color="inherit" fullWidth onClick={() => navigate('/miPerfil')}>Mi perfil</Button>
      <Button color="inherit" fullWidth onClick={() => navigate('/misDesignaciones')}>Mis Designaciones</Button>
      <Button color="inherit" fullWidth>Mi Historial</Button>
      <Button color="inherit" fullWidth>Disponibilidad</Button>
      
      {userRole === 'Admin' && (
        <>
          <Button color="inherit" fullWidth onClick={handleMenuPanelClick}>Panel de control</Button>
          <Menu
            anchorEl={anchorElPanel}
            open={Boolean(anchorElPanel)}
            onClose={handleClosePanelMenu}
          >
            <MenuItem onClick={() => handleNavigate('/gestionUsuarios/usuariosView')}>Gestión de usuarios</MenuItem>
            <MenuItem onClick={() => handleNavigate('/gestionPartidos/partidosView')}>Gestión de partidos</MenuItem>
            <MenuItem onClick={() => handleNavigate('/gestionDesignaciones')}>Gestión de designaciones</MenuItem>
          </Menu>
        </>
      )}
      
      <Button color="inherit" fullWidth onClick={handleLogout}>Cerrar sesión</Button>
    </Box>
  );

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open menu"
              edge="start"
              sx={{ mr: 2 }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Button color="inherit" sx={{ marginRight: 'auto', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/miPerfil')}>
            <AccountCircleIcon sx={{ mr: 1 }} />
            Mi perfil
          </Button>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button color="inherit" onClick={() => navigate('/misDesignaciones')}>Mis Designaciones</Button>
              <Button color="inherit">Mi Historial</Button>
              <Button color="inherit">Disponibilidad</Button>

              {userRole === 'Admin' && (
                <>
                  <Button color="inherit" onClick={handleMenuPanelClick}>
                    Panel de control
                  </Button>
                  <Menu
                    anchorEl={anchorElPanel}
                    open={Boolean(anchorElPanel)}
                    onClose={handleClosePanelMenu}
                  >
                    <MenuItem onClick={() => handleNavigate('/gestionUsuarios/usuariosView')}>Gestión de usuarios</MenuItem>
                    <MenuItem onClick={() => handleNavigate('/gestionPartidos/partidosView')}>Gestión de partidos</MenuItem>
                    <MenuItem onClick={() => handleNavigate('/gestionDesignaciones')}>Gestión de designaciones</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}

          <Button color="inherit" onClick={handleLogout} sx={{ display: 'flex', alignItems: 'center' }}>
            <ExitToAppIcon sx={{ mr: 1 }} />
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>
    </div>
  );
};

export default NavigationBar;
