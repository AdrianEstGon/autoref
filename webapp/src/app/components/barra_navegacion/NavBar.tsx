import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem, Box, IconButton, useMediaQuery, Drawer, Avatar, Typography, List, CardContent, Card, Divider, Collapse, Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';  
import AccountCircleIcon from '@mui/icons-material/AccountCircle';  
import MenuIcon from '@mui/icons-material/Menu';  
import PeopleIcon from '@mui/icons-material/People';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge } from '@mui/material';
import notificacionesService from '../../services/NotificacionService';
import toast from 'react-hot-toast';

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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [slidingOutNotification, setSlidingOutNotification] = useState<string | null>(null); 
  const [userLogged, setUserLogged] = useState<any | null>(null);

useEffect(() => {
  const storedUser = window.localStorage.getItem('userLogged');
  const infoUser = storedUser ? JSON.parse(storedUser) : null;
  setUserLogged(infoUser);

  if (infoUser) {
    const sessionExpired = hasSessionExpired(infoUser);
    if (sessionExpired) {
      window.localStorage.removeItem('userLogged');
      window.localStorage.removeItem('userRole');
      window.localStorage.removeItem('fotoPerfil');
      setUserLogged(null);
      navigate('/');
      toast.error('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
    }
  }
}, []);

const hasSessionExpired = (dataUser: any) => {
  const currentTime = new Date().getTime();
  const userTime = new Date(dataUser.timestamp).getTime();
  const threeHour = 60 * 60 * 1000 * 3;
  return (currentTime - userTime) >= threeHour; // 3 horas de inactividad
};
  
  useEffect(() => {
    const role = window.localStorage.getItem('userRole');
    const foto = window.localStorage.getItem('fotoPerfil');
    setUserRole(role);
    setProfilePhoto(foto && foto !== '{}' ? foto : null);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userLogged') || '{}');
        if (!user?.id) return;
  
        const ahora = new Date();
  
        // 1. Eliminar notificaciones antiguas (comparar fecha completa)
        const todas = await notificacionesService.getNotificaciones(); 
        await Promise.all(todas.map(async (n: any) => {
          const fechaNoti = new Date(n.fecha);
          if (fechaNoti < ahora) {
            await notificacionesService.eliminarNotificacion(n.id);
          }
        }));
  
        // 2. Cargar notificaciones del usuario
        const notificacionesUsuario = await notificacionesService.getNotificacionesPorUsuario(user.id);
        const futuras = notificacionesUsuario.filter((n: any) => {
          const fecha = new Date(n.fecha);
          return fecha >= ahora && !n.leida;
        });
  
        setNotifications(futuras);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      }
    };
  
    fetchNotifications();
  }, []);
  
  
  

  const marcarComoLeida = async (id: string) => {
    try {
      const notificacion = notifications.find((n) => n.id === id);
      if (!notificacion) return;

      const notificacionActualizada = { ...notificacion, leida: true };

      await notificacionesService.actualizarNotificacion(id, notificacionActualizada);

      // Marca la notificación para que se deslice hacia la derecha
      setSlidingOutNotification(id);

      // Elimina la notificación después de un pequeño retraso para que se vea el efecto de deslizamiento
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setSlidingOutNotification(null); // Resetea la notificación deslizada
      }, 500); // 500 ms (tiempo de la animación) antes de eliminarla
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };
//coment
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

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 1 }}>
            <IconButton 
              color="inherit" 
              onClick={() => setOpenNotifications(true)}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <Badge 
                badgeContent={notifications.length} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    minWidth: 20,
                    height: 20,
                  },
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Drawer 
              anchor="right" 
              open={openNotifications} 
              onClose={() => setOpenNotifications(false)}
              PaperProps={{
                sx: {
                  width: isMobile ? '100vw' : 420,
                  background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
                },
              }}
            >
              <Box
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h5" fontWeight="700" sx={{ color: '#1e293b' }}>
                    🔔 Notificaciones
                  </Typography>
                  <IconButton 
                    onClick={() => setOpenNotifications(false)} 
                    size="small"
                    sx={{
                      bgcolor: '#f1f5f9',
                      '&:hover': { bgcolor: '#e2e8f0' },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Divider sx={{ mb: 2, borderColor: '#e2e8f0' }} />

                <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
                  {notifications.length > 0 ? (
                    <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {notifications.map((notification) => (
                        <Card
                          key={notification.id}
                          elevation={0}
                          sx={{
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: slidingOutNotification === notification.id 
                              ? 'translateX(100%)' 
                              : 'translateX(0)',
                            opacity: slidingOutNotification === notification.id ? 0 : 1,
                            overflow: 'hidden',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
                              borderColor: '#2563eb',
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2.5, pb: 7 }}>
                            <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  bgcolor: '#2563eb',
                                  mt: 1,
                                  flexShrink: 0,
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#475569',
                                  lineHeight: 1.6,
                                  fontSize: '0.9rem',
                                }}
                              >
                                {notification.mensaje}
                              </Typography>
                            </Box>
                          </CardContent>

                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 12,
                              right: 12,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Tooltip title="Marcar como leída" arrow>
                              <IconButton
                                size="small"
                                onClick={() => marcarComoLeida(notification.id)}
                                sx={{
                                  bgcolor: '#10b981',
                                  color: 'white',
                                  '&:hover': {
                                    bgcolor: '#059669',
                                    transform: 'scale(1.05)',
                                  },
                                  transition: 'all 0.2s',
                                }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Card>
                      ))}
                    </List>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        py: 8,
                      }}
                    >
                      <NotificationsIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                      <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                        No hay notificaciones
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                        Estás al día con todo
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Drawer>

            <Tooltip title="Mi perfil" arrow>
              <IconButton 
                onClick={handleMenuPanelPerfilClick}
                sx={{
                  p: 0.5,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                {profilePhoto ? (
                  <Avatar 
                    src={profilePhoto} 
                    sx={{ 
                      width: 36, 
                      height: 36,
                      border: '2px solid white',
                    }} 
                  />
                ) : (
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36,
                      bgcolor: '#8b5cf6',
                      border: '2px solid white',
                    }}
                  >
                    <AccountCircleIcon />
                  </Avatar>
                )}
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorElPanelPerfil}
              open={Boolean(anchorElPanelPerfil)}
              onClose={handleClosePanelMenuPerfil}
              PaperProps={{
                elevation: 3,
                sx: {
                  mt: 1.5,
                  borderRadius: '12px',
                  minWidth: 200,
                  overflow: 'visible',
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                  '& .MuiMenuItem-root': {
                    borderRadius: '8px',
                    mx: 1,
                    my: 0.5,
                    '&:hover': {
                      bgcolor: 'rgba(37, 99, 235, 0.08)',
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => handleNavigate('/miPerfil')}>
                <AccountCircleIcon sx={{ mr: 1.5, color: '#2563eb' }} /> 
                Mi perfil
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  color: '#ef4444',
                  '&:hover': {
                    bgcolor: 'rgba(239, 68, 68, 0.08)',
                  },
                }}
              >
                <ExitToAppIcon sx={{ mr: 1.5 }} /> 
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          PaperProps={{
            sx: {
              background: 'linear-gradient(180deg, #2563eb 0%, #1e40af 100%)',
              color: 'white',
              width: 280,
            },
          }}
        >
          <Box
            sx={{
              p: 3,
            }}
            role="presentation"
            onClick={handleDrawerToggle}
            onKeyDown={handleDrawerToggle}
          >
            {/* Header del drawer */}
            <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  component="img"
                  src="/logo.png"
                  alt="AutoRef"
                  sx={{
                    height: 40,
                    width: 40,
                    filter: 'brightness(0) invert(1)',
                  }}
                />
                <Typography variant="h6" fontWeight="700">
                  AutoRef
                </Typography>
              </Box>
            </Box>

            <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Button 
                fullWidth
                color="inherit" 
                onClick={() => navigate('/misDesignaciones')}
                sx={{
                  justifyContent: 'flex-start',
                  borderRadius: '10px',
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                Mis Designaciones
              </Button>
              <Button 
                fullWidth
                color="inherit" 
                onClick={() => navigate('/miDisponibilidad')}
                sx={{
                  justifyContent: 'flex-start',
                  borderRadius: '10px',
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                Disponibilidad
              </Button>
              <Button 
                fullWidth
                color="inherit" 
                onClick={() => navigate('/miHistorial')}
                sx={{
                  justifyContent: 'flex-start',
                  borderRadius: '10px',
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                Mi Historial
              </Button>

              {userRole === 'Admin' && (
                <>
                  <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                  <Typography 
                    variant="subtitle2" 
                    fontWeight="600" 
                    sx={{ 
                      mb: 1, 
                      px: 2,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      opacity: 0.8,
                    }}
                  >
                    Panel de control
                  </Typography>
                  <Button 
                    fullWidth
                    color="inherit"
                    onClick={() => handleNavigate('/gestionUsuarios/usuariosView')}
                    sx={{
                      justifyContent: 'flex-start',
                      borderRadius: '10px',
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                      },
                    }}
                  >
                    <PeopleIcon sx={{ mr: 1.5 }} /> Gestión de usuarios
                  </Button>
                  <Button 
                    fullWidth
                    color="inherit"
                    onClick={() => handleNavigate('/gestionPartidos/partidosView')}
                    sx={{
                      justifyContent: 'flex-start',
                      borderRadius: '10px',
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                      },
                    }}
                  >
                    <SportsSoccerIcon sx={{ mr: 1.5 }} /> Gestión de partidos
                  </Button>
                  <Button 
                    fullWidth
                    color="inherit"
                    onClick={() => handleNavigate('/gestionDesignaciones/panelDesignaciones')}
                    sx={{
                      justifyContent: 'flex-start',
                      borderRadius: '10px',
                      py: 1.5,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                      },
                    }}
                  >
                    <AssignmentIcon sx={{ mr: 1.5 }} /> Gestión de designaciones
                  </Button>
                </>
              )}
            </List>
          </Box>
        </Drawer>

    </div>
  );
};

export default NavigationBar;
