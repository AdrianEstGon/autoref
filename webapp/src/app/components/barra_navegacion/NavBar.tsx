import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem, Typography, Box, IconButton, useMediaQuery, Drawer } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';  
import AccountCircleIcon from '@mui/icons-material/AccountCircle';  
import MenuIcon from '@mui/icons-material/Menu';  // Icon for mobile menu
import { useTheme } from '@mui/material/styles';

const NavigationBar = () => {
  const [anchorElPanel, setAnchorElPanel] = useState<null | HTMLElement>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false); // State to handle mobile drawer
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  // Check if screen is mobile size

  useEffect(() => {
    // Get user role from localStorage
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
    setMobileOpen(!mobileOpen); // Toggle the mobile menu
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Button color="inherit" fullWidth>Mi perfil</Button>
      <Button color="inherit" fullWidth>Mis Designaciones</Button>
      <Button color="inherit" fullWidth>Mi Historial</Button>
      <Button color="inherit" fullWidth>Disponibilidad</Button>
      
      {/* Panel de control visible only for Admin */}
      {userRole === 'Admin' && (
        <>
          <Button color="inherit" fullWidth onClick={handleMenuPanelClick}>Panel de control</Button>
          <Menu
            anchorEl={anchorElPanel}
            open={Boolean(anchorElPanel)}
            onClose={handleClosePanelMenu}
          >
            <MenuItem onClick={handleClosePanelMenu}>Gestión de usuarios</MenuItem>
            <MenuItem onClick={handleClosePanelMenu}>Gestión de partidos</MenuItem>
            <MenuItem onClick={handleClosePanelMenu}>Gestión de designaciones</MenuItem>
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
          {/* Mobile menu icon */}
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

          {/* Mi perfil aligned to the left with icon */}
          <Button color="inherit" sx={{ marginRight: 'auto', display: 'flex', alignItems: 'center' }}>
            <AccountCircleIcon sx={{ mr: 1 }} />
            Mi perfil
          </Button>

          {/* Centered menu for larger screens */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button color="inherit">Mis Designaciones</Button>
              <Button color="inherit">Mi Historial</Button>
              <Button color="inherit">Disponibilidad</Button>

              {/* Menu for Admin */}
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
                    <MenuItem onClick={handleClosePanelMenu}>Gestión de usuarios</MenuItem>
                    <MenuItem onClick={handleClosePanelMenu}>Gestión de partidos</MenuItem>
                    <MenuItem onClick={handleClosePanelMenu}>Gestión de designaciones</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}

          {/* Logout button */}
          <Button color="inherit" onClick={handleLogout} sx={{ display: 'flex', alignItems: 'center' }}>
            <ExitToAppIcon sx={{ mr: 1 }} />
            Cerrar sesión
          </Button>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
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
