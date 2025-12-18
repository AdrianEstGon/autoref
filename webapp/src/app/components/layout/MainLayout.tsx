import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  useMediaQuery,
  Card,
  CardContent,
  Tooltip,
  Collapse,
  Chip,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import notificacionesService from '../../services/NotificacionService';

const drawerWidth = 280;
const collapsedDrawerWidth = 110;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [slidingOutNotification, setSlidingOutNotification] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = window.localStorage.getItem('userLogged');
    const infoUser = storedUser ? JSON.parse(storedUser) : null;

    if (infoUser) {
      const sessionExpired = hasSessionExpired(infoUser);
      if (sessionExpired) {
        window.localStorage.removeItem('userLogged');
        window.localStorage.removeItem('userRole');
        window.localStorage.removeItem('fotoPerfil');
        navigate('/');
        toast.error('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
      }
    }

    const role = window.localStorage.getItem('userRole');
    const foto = window.localStorage.getItem('fotoPerfil');
    setUserRole(role);
    setProfilePhoto(foto && foto !== '{}' ? foto : null);
    
    // Construir nombre completo
    const nombre = infoUser?.nombre || '';
    const apellido = infoUser?.primerApellido || '';
    const nombreCompleto = `${nombre} ${apellido}`.trim() || 'Usuario';
    setUserName(nombreCompleto);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userLogged') || '{}');
        if (!user?.id) return;

        const ahora = new Date();
        const todas = await notificacionesService.getNotificaciones();
        await Promise.all(todas.map(async (n: any) => {
          const fechaNoti = new Date(n.fecha);
          if (fechaNoti < ahora) {
            await notificacionesService.eliminarNotificacion(n.id);
          }
        }));

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

  const hasSessionExpired = (dataUser: any) => {
    const currentTime = new Date().getTime();
    const userTime = new Date(dataUser.timestamp).getTime();
    const threeHour = 60 * 60 * 1000 * 3;
    return (currentTime - userTime) >= threeHour;
  };

  const marcarComoLeida = async (id: string) => {
    try {
      const notificacion = notifications.find((n) => n.id === id);
      if (!notificacion) return;
      const notificacionActualizada = { ...notificacion, leida: true };
      await notificacionesService.actualizarNotificacion(id, notificacionActualizada);
      setSlidingOutNotification(id);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setSlidingOutNotification(null);
      }, 500);
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => {
    window.localStorage.removeItem('userLogged');
    window.localStorage.removeItem('userRole');
    window.localStorage.removeItem('fotoPerfil');
    window.location.href = '/';
  };

  const isAdmin = userRole === 'Admin';
  const isFederacion = userRole === 'Federacion';
  const isComite = userRole === 'ComiteArbitros';
  const isClub = userRole === 'Club';
  const isPublico = userRole === 'Publico';

  const menuItems = (() => {
    if (isClub) {
      return [{ text: 'Inscripciones', icon: <HowToRegIcon />, path: '/club/inscripciones' }];
    }

    if (isPublico) {
      // De momento solo perfil; las vistas públicas (calendario/resultados/clasificación) se añadirán cuando estén definidas
      return [];
    }

    // Árbitro (y también Comité/Admin si quieren usar su perfil personal)
    return [
      { text: 'Mis Designaciones', icon: <DashboardIcon />, path: '/misDesignaciones' },
      { text: 'Disponibilidad', icon: <CalendarMonthIcon />, path: '/miDisponibilidad' },
      { text: 'Mi Historial', icon: <HistoryIcon />, path: '/miHistorial' },
    ];
  })();

  const adminMenuItems = (() => {
    if (isAdmin) {
      return [
        { text: 'Gestión de Usuarios', icon: <PeopleAltIcon />, path: '/gestionUsuarios/usuariosView' },
        { text: 'Gestión de Partidos', icon: <SportsVolleyballIcon />, path: '/gestionPartidos/partidosView' },
        { text: 'Gestión de Designaciones', icon: <AssignmentIndIcon />, path: '/gestionDesignaciones/panelDesignaciones' },
        { text: 'Mutua', icon: <HealthAndSafetyIcon />, path: '/federacion/mutua' },
        { text: 'Competiciones', icon: <EmojiEventsIcon />, path: '/federacion/competiciones' },
        { text: 'Equipos', icon: <SportsVolleyballIcon />, path: '/federacion/equipos' },
        { text: 'Categorías', icon: <CategoryIcon />, path: '/federacion/categorias' },
      ];
    }

    if (isFederacion) {
      return [
        { text: 'Gestión de Partidos', icon: <SportsVolleyballIcon />, path: '/gestionPartidos/partidosView' },
        { text: 'Mutua', icon: <HealthAndSafetyIcon />, path: '/federacion/mutua' },
        { text: 'Competiciones', icon: <EmojiEventsIcon />, path: '/federacion/competiciones' },
        { text: 'Equipos', icon: <SportsVolleyballIcon />, path: '/federacion/equipos' },
        { text: 'Categorías', icon: <CategoryIcon />, path: '/federacion/categorias' },
      ];
    }

    if (isComite) {
      return [
        { text: 'Gestión de Partidos', icon: <SportsVolleyballIcon />, path: '/gestionPartidos/partidosView' },
        { text: 'Gestión de Designaciones', icon: <AssignmentIndIcon />, path: '/gestionDesignaciones/panelDesignaciones' },
      ];
    }

    return [];
  })();

  const getRoleLabel = () => {
    if (userRole === 'Admin') return 'Administrador';
    if (userRole === 'Federacion') return 'Federación';
    if (userRole === 'Club') return 'Club';
    if (userRole === 'ComiteArbitros') return 'Comité de Árbitros';
    if (userRole === 'Publico') return 'Público';
    return 'Árbitro';
  };

  const getRoleChipColor = () => {
    if (userRole === 'Admin' || userRole === 'Federacion') return '#4A90E2';
    if (userRole === 'ComiteArbitros') return '#2C5F8D';
    if (userRole === 'Club') return '#5B7C99';
    return '#7BA7D9';
  };

  const isActive = (path: string) => location.pathname === path;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Header */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          cursor: !isMobile ? 'pointer' : 'default',
          '&:hover': !isMobile ? {
            bgcolor: alpha(theme.palette.common.white, 0.05),
          } : {},
          transition: 'background-color 0.2s',
        }}
        onClick={() => !isMobile && setCollapsed(!collapsed)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Logo con fondo blanco */}
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'white',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 0.5,
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="AutoRef"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>
          {!collapsed && (
            <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
              AutoRef
            </Typography>
          )}
        </Box>
      </Box>

      {/* User Profile Card */}
      {!collapsed && (
        <Box sx={{ p: 2 }}>
          <Card
            sx={{
              background: alpha(theme.palette.common.white, 0.1),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  src={profilePhoto || undefined}
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: '#4A90E2',
                    border: '2px solid white',
                  }}
                >
                  {!profilePhoto && <AccountCircleIcon />}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600} sx={{ color: 'white' }}>
                    {userName}
                  </Typography>
                  <Chip
                    label={getRoleLabel()}
                    size="small"
                    sx={{
                      mt: 0.5,
                      height: 20,
                      fontSize: '0.65rem',
                      bgcolor: getRoleChipColor(),
                      color: 'white',
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Navigation Items */}
      <Box sx={{ flex: 1, px: 2, py: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: alpha(theme.palette.common.white, 0.5),
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            pl: 1,
            display: collapsed ? 'none' : 'block',
          }}
        >
          Menú Principal
        </Typography>
        <List sx={{ mt: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={collapsed ? item.text : ''} placement="right">
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: '4px',
                    py: 1.5,
                    px: collapsed ? 2 : 2,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    bgcolor: isActive(item.path)
                      ? alpha(theme.palette.common.white, 0.15)
                      : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.white, 0.1),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive(item.path) ? 'white' : alpha(theme.palette.common.white, 0.7),
                      minWidth: collapsed ? 0 : 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive(item.path) ? 600 : 500,
                        fontSize: '0.9rem',
                        color: 'white',
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        {/* Admin Section */}
        {(isAdmin || isFederacion || isComite) && (
          <>
            <Divider sx={{ my: 2, borderColor: alpha(theme.palette.common.white, 0.1) }} />
            {!collapsed && (
              <ListItemButton
                onClick={() => setAdminExpanded(!adminExpanded)}
                sx={{
                  borderRadius: '4px',
                  py: 1,
                  '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.1) },
                }}
              >
                <ListItemIcon sx={{ color: alpha(theme.palette.common.white, 0.7), minWidth: 40 }}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Panel de Control"
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: alpha(theme.palette.common.white, 0.7),
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                />
                {adminExpanded ? (
                  <ExpandLessIcon sx={{ color: alpha(theme.palette.common.white, 0.5) }} />
                ) : (
                  <ExpandMoreIcon sx={{ color: alpha(theme.palette.common.white, 0.5) }} />
                )}
              </ListItemButton>
            )}
            <Collapse in={adminExpanded || collapsed} timeout="auto" unmountOnExit>
              <List sx={{ mt: 1 }}>
                {adminMenuItems.map((item) => (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip title={collapsed ? item.text : ''} placement="right">
                      <ListItemButton
                        onClick={() => {
                          navigate(item.path);
                          if (isMobile) setMobileOpen(false);
                        }}
                        sx={{
                          borderRadius: '4px',
                          py: 1.5,
                          px: collapsed ? 2 : 2,
                          ml: collapsed ? 0 : 1,
                          justifyContent: collapsed ? 'center' : 'flex-start',
                          bgcolor: isActive(item.path)
                            ? alpha(theme.palette.common.white, 0.15)
                            : 'transparent',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.common.white, 0.1),
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: isActive(item.path) ? 'white' : alpha(theme.palette.common.white, 0.7),
                            minWidth: collapsed ? 0 : 40,
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        {!collapsed && (
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                              fontWeight: isActive(item.path) ? 600 : 500,
                              fontSize: '0.85rem',
                              color: 'white',
                            }}
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </>
        )}
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 2, borderTop: `1px solid ${alpha(theme.palette.common.white, 0.1)}` }}>
        <Tooltip title={collapsed ? 'Cerrar Sesión' : ''} placement="right">
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '4px',
              py: 1.5,
              justifyContent: collapsed ? 'center' : 'flex-start',
              bgcolor: alpha('#64748B', 0.1),
              '&:hover': {
                bgcolor: alpha('#64748B', 0.2),
              },
            }}
          >
            <ListItemIcon sx={{ color: '#94A3B8', minWidth: collapsed ? 0 : 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Cerrar Sesión"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#94A3B8',
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: collapsed ? collapsedDrawerWidth : drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              background: 'linear-gradient(180deg, #2C5F8D 0%, #1e3a5f 100%)',
              borderRight: 'none',
              borderRadius: 0,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: collapsed ? collapsedDrawerWidth : drawerWidth,
              background: 'linear-gradient(180deg, #2C5F8D 0%, #1e3a5f 100%)',
              borderRight: 'none',
              borderRadius: 0,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Top AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'white',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isMobile && (
                <IconButton onClick={handleDrawerToggle} sx={{ color: '#1e293b' }}>
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" fontWeight={600} sx={{ color: '#1e293b' }}>
                {menuItems.find((item) => isActive(item.path))?.text ||
                  adminMenuItems.find((item) => isActive(item.path))?.text ||
                  'AutoRef'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications */}
              <IconButton
                onClick={() => setNotificationsOpen(true)}
                sx={{
                  bgcolor: '#f1f5f9',
                  '&:hover': { bgcolor: '#e2e8f0' },
                }}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon sx={{ color: '#64748b' }} />
                </Badge>
              </IconButton>

              {/* User Menu */}
              <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0.5 }}>
                <Avatar
                  src={profilePhoto || undefined}
                  sx={{ width: 36, height: 36, bgcolor: '#4A90E2' }}
                >
                  {!profilePhoto && <AccountCircleIcon />}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={() => setAnchorElUser(null)}
                PaperProps={{
                  sx: { mt: 1.5, borderRadius: '8px', minWidth: 200 },
                }}
              >
                <MenuItem onClick={() => { navigate('/miPerfil'); setAnchorElUser(null); }}>
                  <AccountCircleIcon sx={{ mr: 1.5, color: '#4A90E2' }} />
                  Mi Perfil
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: '#64748B' }}>
                  <LogoutIcon sx={{ mr: 1.5 }} />
                  Cerrar Sesión
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Notifications Drawer */}
        <Drawer
          anchor="right"
          open={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          PaperProps={{
            sx: {
              width: isMobile ? '100%' : 400,
              bgcolor: '#f8fafc',
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight={700}>
                🔔 Notificaciones
              </Typography>
              <IconButton onClick={() => setNotificationsOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  sx={{
                    mb: 2,
                    transition: 'all 0.3s',
                    transform: slidingOutNotification === notification.id ? 'translateX(100%)' : 'translateX(0)',
                    opacity: slidingOutNotification === notification.id ? 0 : 1,
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1.5 }}>
                      {notification.mensaje}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title="Marcar como leída">
                        <IconButton
                          size="small"
                          onClick={() => marcarComoLeida(notification.id)}
                          sx={{ bgcolor: '#4A90E2', color: 'white', '&:hover': { bgcolor: '#2C5F8D' } }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <NotificationsIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                <Typography color="text.secondary">No hay notificaciones</Typography>
              </Box>
            )}
          </Box>
        </Drawer>

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            overflow: 'auto',
            bgcolor: '#f1f5f9',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;

