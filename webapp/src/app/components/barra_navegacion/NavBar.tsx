import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem, Box, IconButton, useMediaQuery, Drawer, Avatar, ListItem, ListItemText, Typography, List } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';  
import AccountCircleIcon from '@mui/icons-material/AccountCircle';  
import MenuIcon from '@mui/icons-material/Menu';  
import PeopleIcon from '@mui/icons-material/People';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge, Menu as MuiMenu, MenuItem as MuiMenuItem } from '@mui/material';
import moment from 'moment'; // Asegúrate de tener moment instalado





const NavigationBar = () => {
  const [anchorElPanel, setAnchorElPanel] = useState<null | HTMLElement>(null);
  const [anchorElPanelPerfil, setAnchorElPanelPerfil] = useState<null | HTMLElement>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Tienes un nuevo mensaje', date: new Date() },
    { id: 2, message: 'Nueva designación disponible', date: new Date() },
    { id: 3, message: 'Recordatorio: disponibilidad pendiente', date: new Date() }
  ]); 


  useEffect(() => {
    const role = window.localStorage.getItem('userRole');
    const foto = window.localStorage.getItem('fotoPerfil');
    setUserRole(role);
    setProfilePhoto(foto && foto !== '{}' ? foto : null);
  }, []);

  useEffect(() => {
    const actualizarFotoPerfil = () => {
      const foto = localStorage.getItem("fotoPerfil");
      setProfilePhoto(foto && foto !== '{}' ? foto : null);
    };
  
    window.addEventListener("storage", actualizarFotoPerfil);
    
    return () => {
      window.removeEventListener("storage", actualizarFotoPerfil);
    };
  }, []);


  const handleMenuPanelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElPanel(event.currentTarget);
  };

  const handleMenuPanelPerfilClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElPanelPerfil(event.currentTarget);
  };

  const handleClosePanelMenu = () => {
    setAnchorElPanel(null);
  };

  const handleClosePanelMenuPerfil = () => {
    setAnchorElPanelPerfil(null);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('userLogged');
    window.localStorage.removeItem('userRole');
    window.localStorage.removeItem('fotoPerfil');
    window.location.href = '/';
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleClosePanelMenu();
  };

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

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button color="inherit" onClick={() => navigate('/misDesignaciones')}>Mis Designaciones</Button>
              <Button color="inherit" onClick={() => navigate('/miDisponibilidad')}>Disponibilidad</Button>
              <Button color="inherit" onClick={() => navigate('/miHistorial')}>Mi Historial</Button>

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
                    <MenuItem onClick={() => handleNavigate('/gestionUsuarios/usuariosView')}>
                      <PeopleIcon sx={{ mr: 1 }} /> Gestión de usuarios
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/gestionPartidos/partidosView')}>
                      <SportsSoccerIcon sx={{ mr: 1 }} /> Gestión de partidos
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/gestionDesignaciones/panelDesignaciones')}>
                      <AssignmentIcon sx={{ mr: 1 }} /> Gestión de designaciones
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}

<Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
  <IconButton color="inherit" onClick={() => setOpenNotifications(true)} sx={{ mr: 2 }}>
    <Badge badgeContent={notifications.length} color="error">
      <NotificationsIcon />
    </Badge>
  </IconButton>

  {/* Panel de Notificaciones */}
  <Drawer anchor="right" open={openNotifications} onClose={() => setOpenNotifications(false)}>
    <Box sx={{ width: 400, padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Notificaciones
      </Typography>
      <List>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <ListItem key={notification.id} divider>
              <ListItemText
                primary={notification.message}
                secondary={`Fecha: ${moment(notification.date).format("DD/MM/YYYY")}`}
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body2" textAlign="center">
            No hay notificaciones.
          </Typography>
        )}
      </List>
    </Box>
  </Drawer>

  <Button title="Mi perfil" color="inherit" sx={{ display: 'flex', alignItems: 'center' }} onClick={handleMenuPanelPerfilClick}>
    {profilePhoto ? (
      <Avatar src={profilePhoto} sx={{ width: 32, height: 32, mr: 1 }} />
    ) : (
      <AccountCircleIcon sx={{ mr: 1 }} />
    )}
  </Button>

  <Menu
    anchorEl={anchorElPanelPerfil}
    open={Boolean(anchorElPanelPerfil)}
    onClose={handleClosePanelMenuPerfil}
  >
    <MenuItem onClick={() => handleNavigate('/miPerfil')}>
      <AccountCircleIcon sx={{ mr: 1 }} /> Mi perfil
    </MenuItem>
    <MenuItem onClick={handleLogout}>
      <ExitToAppIcon sx={{ mr: 1, color: 'red' }} /> Cerrar sesión
    </MenuItem>
  </Menu>
</Box>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavigationBar;
