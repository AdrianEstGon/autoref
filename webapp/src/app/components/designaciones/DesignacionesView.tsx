import React, { useState } from 'react';
import { 
  Container, Typography, Paper, Box, Button, Drawer, List, ListItem, ListItemText, Badge, Grid 
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NavigationBar from '../barra_navegacion/NavBar'; // Barra de navegación
import Tooltip from '@mui/material/Tooltip';

const DesignacionesView = () => {
  const [openNotifications, setOpenNotifications] = useState(false);

  // Simulación de notificaciones
  const notifications = [
    { id: 1, message: 'Nueva designación: Equipo A vs Equipo B', date: '12/03/2025' },
    { id: 2, message: 'Cambio de horario en partido: Equipo C vs Equipo D', date: '15/03/2025' },
    { id: 3, message: 'Recuerda confirmar tu disponibilidad', date: '18/03/2025' },
  ];

  return (
    <div>
      {/* Barra de navegación */}
      <NavigationBar />

      {/* Botón de Notificaciones flotante */}
      <Tooltip title="Notificaciones" arrow>
        <Button
          variant="contained"
          color="warning"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: '#FFD700',
            color: '#000',
            '&:hover': { backgroundColor: '#FFC107' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            width: 80,  // Ancho fijo
            height: 80, // Alto fijo
            borderRadius: '50%', // Borde redondeado (circular)
            padding: 0, // Elimina el padding para que sea un círculo perfecto
          }}
          onClick={() => setOpenNotifications(true)}
        >
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon sx={{ fontSize: 30 }} /> {/* Tamaño del icono */}
          </Badge>
        </Button>
      </Tooltip>

      {/* Panel de Notificaciones */}
      <Drawer anchor="right" open={openNotifications} onClose={() => setOpenNotifications(false)}>
        <Box sx={{ width: 300, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Notificaciones
          </Typography>
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification.id} divider>
                <ListItemText 
                  primary={notification.message} 
                  secondary={`Fecha: ${notification.date}`} 
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Contenido principal */}
      <Container sx={{ marginTop: 4 }}>
        {/* Mis designaciones */}
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 3, backgroundColor: '#e3f2fd' }}>
          <Typography variant="h6" gutterBottom textAlign="center" marginBottom={2}>
            Mis designaciones
          </Typography>
          
          {/* Ajustamos la grid para que los items se muestren uno debajo del otro */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">1. Partido: Equipo A vs Equipo B - Fecha: 12/03/2025</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">2. Partido: Equipo C vs Equipo D - Fecha: 15/03/2025</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">3. Partido: Equipo E vs Equipo F - Fecha: 18/03/2025</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default DesignacionesView;
