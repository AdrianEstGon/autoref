import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
  Grid,
  Card,
  CardContent,
  IconButton,
  Fab,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NavigationBar from "../barra_navegacion/NavBar";
import Tooltip from "@mui/material/Tooltip";
import moment from "moment";
import partidosService from "../../services/PartidoService";
import { Link } from "react-router-dom";

const DesignacionesView = () => {
  const [openNotifications, setOpenNotifications] = useState(false);
  const [partidos, setPartidos] = useState<any[]>([]);
  const [notificaciones, setNotificaciones] = useState([
    { id: 1, message: "Nuevo partido asignado", date: "2025-03-25" },
    { id: 2, message: "Cambio en el horario de un partido", date: "2025-03-24" },
  ]);

  useEffect(() => {
    const cargarPartidosDesignados = async () => {
      try {
        const usuarioId = localStorage.getItem("userId");
        if (!usuarioId) return;

        const partidosDesignados = await partidosService.getPartidosByUserId(usuarioId);

        // Verificar que la respuesta sea un array antes de aplicar filter
        if (Array.isArray(partidosDesignados)) {
          const partidosPasados = partidosDesignados.filter((partido) =>
            moment(partido.fecha).isAfter(moment())
          );
          
          // Ordenar los partidos por fecha y hora (de antes a después)
          const partidosOrdenados = partidosPasados.sort((a, b) => 
            moment(a.fecha).isBefore(moment(b.fecha)) ? -1 : 1
          );

          setPartidos(partidosOrdenados);
        } else {
          setPartidos([]); // Evitar errores estableciendo un array vacío
        }
      } catch (error) {
        console.error("Error al cargar los partidos designados:", error);
        setPartidos([]);
      }
    };

    cargarPartidosDesignados();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: '#eafaff',
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavigationBar />
  
      {/* Botón de Notificaciones */}
      <Box position="fixed" bottom={16} right={16}>
        <Tooltip title="Notificaciones">
          <Fab
            sx={{
              backgroundColor: "yellow",
              "&:hover": { backgroundColor: "gold" },
            }}
            onClick={() => setOpenNotifications(true)}
          >
            <Badge badgeContent={notificaciones.length} color="error">
              <NotificationsIcon sx={{ color: "black", fontSize: 32 }} />
            </Badge>
          </Fab>
        </Tooltip>
      </Box>
  
      <Container sx={{ marginTop: 4 }}>
      <Paper
          elevation={3}
          sx={{
            padding: 2,
            marginBottom: 3,
            minHeight: "80vh",
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
          }}
        >
          {/* Contenedor del Título con Línea Separadora */}
          <Box
            sx={{
              backgroundColor: "#f9f9f9",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h4" textAlign="center" color="#333" sx={{ fontWeight: 'bold', marginBottom:2 }}>
              Mis Designaciones
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {partidos.length > 0 ? (
              partidos.map((partido) => (
                <Grid item xs={12} key={partido.id}>
                  <Link to={`/detallesPartido/${partido.id}`} style={{ textDecoration: "none" }}>
                    <Card
                      sx={{
                        backgroundColor: "#F0F4F8",
                        borderRadius: "12px",
                        width: "100%",
                        cursor: "pointer",
                        "&:hover": {
                          boxShadow: 6,
                          transform: "scale(1.05)",
                          transition: "all 0.3s ease",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" color="primary">
                          {partido.equipoLocal} - {partido.equipoVisitante}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {moment(partido.fecha).format("dddd, DD MMMM YYYY - HH:mm")}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Lugar: {partido.lugar}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Categoría: {partido.categoria}
                        </Typography>
  
                        <Grid container spacing={2} mt={2}>
                        <Grid item xs={12} sm={4}>
                          {partido.arbitro1 && (
                            <Typography variant="body2">
                              Árbitro 1: {partido.arbitro1}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          {partido.arbitro2 && (
                            <Typography variant="body2">
                              Árbitro 2: {partido.arbitro2}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          {partido.anotador && (
                            <Typography variant="body2">
                              Anotador: {partido.anotador}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))
            ) : (
              <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      marginTop: '20%',
                      padding: 4,
                    }}
                  >
                    <Typography color="black">
                      No tienes partidos designados.
                    </Typography>
                  </Box>
            )}
          </Grid>
        </Paper>
      </Container>
  
      {/* Panel de Notificaciones */}
      <Drawer anchor="right" open={openNotifications} onClose={() => setOpenNotifications(false)}>
        <Box sx={{ width: 400, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Notificaciones
          </Typography>
          <List>
            {notificaciones.length > 0 ? (
              notificaciones.map((notification) => (
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
    </Box>
  );
}  

export default DesignacionesView;
