import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import NavigationBar from "../barra_navegacion/NavBar";
import moment from "moment";
import partidosService from "../../services/PartidoService";
import { Link } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const DesignacionesView = () => {
  const [partidos, setPartidos] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPartidoId, setSelectedPartidoId] = useState<string | null>(null);
  const [selectedEstado, setSelectedEstado] = useState<number | null>(null);
  const [disabledButtons, setDisabledButtons] = useState<Record<string, boolean>>({});


  useEffect(() => {
    const cargarPartidosDesignados = async () => {
      try {
        const usuarioId = localStorage.getItem("userId");
        if (!usuarioId) return;

        const partidosDesignados = await partidosService.getPartidosByUserId(usuarioId);

        
        if (Array.isArray(partidosDesignados)) {
          const partidosPasados = partidosDesignados.filter((partido) =>
            moment(partido.fecha).isAfter(moment())
          );

          const partidosOrdenados = partidosPasados.sort((a, b) =>
            moment(a.fecha).isBefore(moment(b.fecha)) ? -1 : 1
          );

          setPartidos(partidosOrdenados);
        } else {
          setPartidos([]);
        }
      } catch (error) {
        console.error("Error al cargar los partidos designados:", error);
        setPartidos([]);
      }
    };

    cargarPartidosDesignados();
  }, []);

  const handleConfirm = async () => {
    if (!selectedPartidoId || selectedEstado === null) return;
  
    try {
      const partido = partidos.find((p) => p.id === selectedPartidoId);
      if (!partido) return;
  
      const usuarioId = localStorage.getItem("userId");
      if (!usuarioId) return;
  
      if (partido.arbitro1Id === usuarioId) {
        partido.EstadoArbitro1 = selectedEstado;
      } else if (partido.arbitro2Id === usuarioId) {
        partido.EstadoArbitro2 = selectedEstado;
      } else if (partido.anotadorId === usuarioId) {
        partido.EstadoAnotador = selectedEstado;
      } else {
        console.error("El usuario no tiene un rol en este partido.");
        return;
      }
  
      const updatedPartido = await partidosService.actualizarPartido(partido);
  
      setPartidos((prevPartidos) =>
        prevPartidos.map((p) => (p.id === selectedPartidoId ? updatedPartido : p))
      );
  
      setDisabledButtons((prev) => ({ ...prev, [selectedPartidoId]: true }));
    } catch (error) {
      console.error("Error al actualizar la designación:", error);
    } finally {
      setDialogOpen(false);
      setSelectedPartidoId(null);
      setSelectedEstado(null);
    }
  };
  

  const handleOpenDialog = (partidoId: string, estado: number) => {
    setSelectedPartidoId(partidoId);
    setSelectedEstado(estado);
    setDialogOpen(true);
  };

  const handleCancel = () => {
    setDialogOpen(false);
    setSelectedPartidoId(null);
    setSelectedEstado(null);
  };
  
  

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

      <Container sx={{ marginTop: 4 }}>
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            marginBottom: 3,
            minHeight: "80vh",
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            position: "relative",  // Necesario para posicionar los botones
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", backgroundColor: "#f9f9f9" }}>
            <Typography variant="h4" textAlign="center" color="#333" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
              Mis Designaciones
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {partidos.length > 0 ? (
              partidos.map((partido) => (
                <Grid item xs={12} key={partido.id}>
                  <Box sx={{ display: "flex", height: "100%" }}>
                    <Paper
                      elevation={2}
                      sx={{ display: "flex", flexDirection: "row", width: "100%", height: "100%" }}
                    >
                      {/* Card - 90% */}
                      <Box sx={{ flex: 9, display: "flex" }}>
                        <Link
                          to={`/detallesPartido/${partido.id}`}
                          style={{ textDecoration: "none", width: "100%" }}
                        >
                          <Card
                            sx={{
                              backgroundColor: "#F0F4F8",
                              borderRadius: "12px 0 0 12px",
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              "&:hover": {
                                boxShadow: 6,
                                transform: "scale(1.02)",
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
                                {moment(`${partido.fecha} ${partido.hora}`, "YYYY-MM-DD HH:mm").format(
                                  "dddd, DD MMMM YYYY - HH:mm"
                                )}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Lugar: {partido.lugar}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Categoría: {partido.categoria}
                              </Typography>

                              <Grid container spacing={2} mt={2}>
                                {partido.arbitro1 && (
                                  <Grid item xs={12} sm={4} key="arbitro1">
                                    <Typography variant="body2">Árbitro 1: {partido.arbitro1}</Typography>
                                  </Grid>
                                )}
                                {partido.arbitro2 && (
                                  <Grid item xs={12} sm={4} key="arbitro2">
                                    <Typography variant="body2">Árbitro 2: {partido.arbitro2}</Typography>
                                  </Grid>
                                )}
                                {partido.anotador && (
                                  <Grid item xs={12} sm={4} key="anotador">
                                    <Typography variant="body2">Anotador: {partido.anotador}</Typography>
                                  </Grid>
                                )}
                              </Grid>

                            </CardContent>
                          </Card>
                        </Link>
                      </Box>

                      {/* Botones - 10% */}
                      <Box
                        sx={{
                          flex: 1,
                          backgroundColor: "#f0f4f8",
                          borderLeft: "2px solid #d0d0d0",
                          borderRadius: "0 12px 12px 0",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          paddingY: 1,
                        }}
                      >
                        <Tooltip title="Aceptar designación" arrow placement="right">
                          <IconButton
                            onClick={() => handleOpenDialog(partido.id, 1)}
                            sx={{
                              backgroundColor: "#4CAF50",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#45a049",
                              },
                            }}
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Rechazar designación" arrow placement="right">
                          <IconButton
                             onClick={() => handleOpenDialog(partido.id, 2)}
                            sx={{
                              backgroundColor: "#F44336",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#e53935",
                              },
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Paper>
                  </Box>
                </Grid>



              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginTop: "20%",
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
      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>Confirmar acción</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas {selectedEstado === 1 ? 'aceptar' : 'rechazar'} esta designación?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="error">
            Cancelar
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    
  );
};

export default DesignacionesView;
