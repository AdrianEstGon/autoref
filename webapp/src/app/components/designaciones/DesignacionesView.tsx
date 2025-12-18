import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Box,
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
  Chip,
  Avatar,
  Divider,
  alpha,
  Tabs,
  Tab,
  TextField,
} from "@mui/material";
import moment from "moment";
import "moment/locale/es";
import partidosService from "../../services/PartidoService";
import { Link } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { usePartidosUsuario } from "../../hooks/usePartidosUsuario";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import PersonIcon from "@mui/icons-material/Person";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { toast } from "react-toastify";

moment.locale("es");

const DesignacionesView = React.memo(() => {
  const { partidos, setPartidos } = usePartidosUsuario({ filterType: "future" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPartidoId, setSelectedPartidoId] = useState<string | null>(null);
  const [selectedEstado, setSelectedEstado] = useState<number | null>(null);
  const [disabledButtons, setDisabledButtons] = useState<Record<string, boolean>>({});
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [motivoRechazo, setMotivoRechazo] = useState<string>("");

  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUsuarioId(id);
  }, []);

  const getEstadoActual = useCallback(
    (partido: any) => {
      if (!usuarioId) return null;
      if (partido.arbitro1Id === usuarioId) return partido.estadoArbitro1;
      if (partido.arbitro2Id === usuarioId) return partido.estadoArbitro2;
      if (partido.anotadorId === usuarioId) return partido.estadoAnotador;
      return null;
    },
    [usuarioId]
  );

  const getMotivoActual = useCallback(
    (partido: any) => {
      if (!usuarioId) return null;
      if (partido.arbitro1Id === usuarioId) return partido.motivoEstadoArbitro1 || null;
      if (partido.arbitro2Id === usuarioId) return partido.motivoEstadoArbitro2 || null;
      if (partido.anotadorId === usuarioId) return partido.motivoEstadoAnotador || null;
      return null;
    },
    [usuarioId]
  );

  const getRolUsuario = useCallback(
    (partido: any) => {
      if (!usuarioId) return null;
      if (partido.arbitro1Id === usuarioId) return "Árbitro 1";
      if (partido.arbitro2Id === usuarioId) return "Árbitro 2";
      if (partido.anotadorId === usuarioId) return "Anotador";
      return null;
    },
    [usuarioId]
  );

  const handleConfirm = useCallback(async () => {
    if (!selectedPartidoId || selectedEstado === null || !usuarioId) return;
    try {
      if (selectedEstado === 2 && !motivoRechazo.trim()) {
        toast.error("Indica un motivo para rechazar la designación");
        return;
      }

      const partido = partidos.find((p) => p.id === selectedPartidoId);
      if (!partido) return;

      const updatedPartido = { ...partido };
      if (partido.arbitro1Id === usuarioId) updatedPartido.estadoArbitro1 = selectedEstado;
      else if (partido.arbitro2Id === usuarioId) updatedPartido.estadoArbitro2 = selectedEstado;
      else if (partido.anotadorId === usuarioId) updatedPartido.estadoAnotador = selectedEstado;
      else return;

      await partidosService.actualizarEstadoDesignacion(
        selectedPartidoId,
        selectedEstado,
        selectedEstado === 2 ? motivoRechazo.trim() : null
      );
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
      setMotivoRechazo("");
    }
  }, [selectedPartidoId, selectedEstado, usuarioId, partidos, motivoRechazo]);

  const handleOpenDialog = useCallback((partidoId: string, estado: number) => {
    setSelectedPartidoId(partidoId);
    setSelectedEstado(estado);
    if (estado !== 2) setMotivoRechazo("");
    setDialogOpen(true);
  }, []);

  const handleCancel = useCallback(() => {
    setDialogOpen(false);
    setSelectedPartidoId(null);
    setSelectedEstado(null);
    setMotivoRechazo("");
  }, []);

  const getEstadoColor = (estado: number | null) => {
    if (estado === 1) return { bg: "#E8F4FA", text: "#2C5F8D", label: "Aceptado" };
    if (estado === 2) return { bg: "#E8ECEF", text: "#64748B", label: "Rechazado" };
    return { bg: "#F0F6FA", text: "#5B7C99", label: "Pendiente" };
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filtrar partidos según la pestaña seleccionada
  const partidosFiltrados = tabValue === 0 
    ? partidos.filter((p) => getEstadoActual(p) === 1) // Confirmados (aceptados)
    : partidos.filter((p) => getEstadoActual(p) === 0); // Propuestos (pendientes)

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EmojiEventsIcon sx={{ color: "white", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#1e293b" }}>
              Mis Designaciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestiona tus próximos partidos asignados
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mb: 4 }}>
        <Card sx={{ background: "linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)", color: "white" }}>
          <CardContent>
            <Typography variant="h3" fontWeight={700}>{partidos.length}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>Total partidos</Typography>
          </CardContent>
        </Card>
        <Card sx={{ background: "linear-gradient(135deg, #5B7C99 0%, #3A5166 100%)", color: "white" }}>
          <CardContent>
            <Typography variant="h3" fontWeight={700}>
              {partidos.filter((p) => getEstadoActual(p) === 1).length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>Confirmados</Typography>
          </CardContent>
        </Card>
        <Card sx={{ background: "linear-gradient(135deg, #7BA7D9 0%, #5B7C99 100%)", color: "white" }}>
          <CardContent>
            <Typography variant="h3" fontWeight={700}>
              {partidos.filter((p) => getEstadoActual(p) === 0).length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>Propuestos</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              minWidth: 180,
            },
            '& .Mui-selected': {
              color: '#2C5F8D',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2C5F8D',
              height: 3,
            },
          }}
        >
          <Tab label="Partidos Confirmados" />
          <Tab label="Partidos Propuestos" />
        </Tabs>
      </Box>

      {/* Partidos List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {partidosFiltrados.length > 0 ? (
          partidosFiltrados.map((partido) => {
            const estadoActual = getEstadoActual(partido);
            const estadoInfo = getEstadoColor(estadoActual);
            const rolUsuario = getRolUsuario(partido);

            return (
              <Card
                key={partido.id}
                sx={{
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
                  {/* Main Content */}
                  <Box sx={{ flex: 1, p: 0 }}>
                    <Link to={`/detallesPartido/${partido.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <CardContent sx={{ p: 3 }}>
                        {/* Top Row - Teams and Status */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{ bgcolor: "#3b82f6", width: 48, height: 48 }}>
                              <SportsVolleyballIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight={700} sx={{ color: "#1e293b" }}>
                                {partido.equipoLocal} vs {partido.equipoVisitante}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                                <Chip
                                  size="small"
                                  label={partido.categoria}
                                  sx={{ bgcolor: "#e0e7ff", color: "#3730a3", fontWeight: 500 }}
                                />
                                <Chip
                                  size="small"
                                  label={rolUsuario}
                                  sx={{ bgcolor: "#f0fdf4", color: "#166534", fontWeight: 500 }}
                                />
                              </Box>
                            </Box>
                          </Box>
                          <Chip
                            label={estadoInfo.label}
                            sx={{
                              bgcolor: estadoInfo.bg,
                              color: estadoInfo.text,
                              fontWeight: 600,
                              fontSize: "0.85rem",
                            }}
                          />
                          {estadoActual === 2 && getMotivoActual(partido) && (
                            <Tooltip title={`Motivo: ${getMotivoActual(partido)}`} arrow>
                              <Chip
                                size="small"
                                label="Ver motivo"
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            </Tooltip>
                          )}
                        </Box>

                        {/* Info Grid */}
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
                            gap: 2,
                            mt: 2,
                            p: 2,
                            bgcolor: "#f8fafc",
                            borderRadius: "12px",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <CalendarTodayIcon sx={{ color: "#64748b", fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">Fecha</Typography>
                              <Typography variant="body2" fontWeight={600}>
                                {moment(partido.fecha).format("DD MMM YYYY")}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <AccessTimeIcon sx={{ color: "#64748b", fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">Hora</Typography>
                              <Typography variant="body2" fontWeight={600}>{partido.hora}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <LocationOnIcon sx={{ color: "#64748b", fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">Lugar</Typography>
                              <Typography variant="body2" fontWeight={600}>{partido.lugar}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <PersonIcon sx={{ color: "#64748b", fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" color="text.secondary">Tu rol</Typography>
                              <Typography variant="body2" fontWeight={600}>{rolUsuario}</Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Arrow indicator */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                          <Typography variant="body2" color="primary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            Ver detalles <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                          </Typography>
                        </Box>
                      </CardContent>
                    </Link>
                  </Box>

                  {/* Action Panel */}
                  <Box
                    sx={{
                      width: { xs: "100%", md: 140 },
                      bgcolor: "#f8fafc",
                      borderLeft: { md: "1px solid #e2e8f0" },
                      borderTop: { xs: "1px solid #e2e8f0", md: "none" },
                      display: "flex",
                      flexDirection: { xs: "row", md: "column" },
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      p: 2,
                    }}
                  >
                    {estadoActual === 0 ? (
                      <>
                        <Tooltip title="Aceptar designación" arrow>
                          <IconButton
                            onClick={() => handleOpenDialog(partido.id, 1)}
                            sx={{
                              width: 52,
                              height: 52,
                              bgcolor: "#10b981",
                              color: "white",
                              "&:hover": { bgcolor: "#059669", transform: "scale(1.05)" },
                              transition: "all 0.2s",
                            }}
                          >
                            <CheckIcon sx={{ fontSize: 28 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rechazar designación" arrow>
                          <IconButton
                            onClick={() => handleOpenDialog(partido.id, 2)}
                            sx={{
                              width: 52,
                              height: 52,
                              bgcolor: "#ef4444",
                              color: "white",
                              "&:hover": { bgcolor: "#dc2626", transform: "scale(1.05)" },
                              transition: "all 0.2s",
                            }}
                          >
                            <CloseIcon sx={{ fontSize: 28 }} />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <Box sx={{ textAlign: "center" }}>
                        {estadoActual === 1 ? (
                          <CheckIcon sx={{ color: "#10b981", fontSize: 40 }} />
                        ) : (
                          <CloseIcon sx={{ color: "#ef4444", fontSize: 40 }} />
                        )}
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ color: estadoActual === 1 ? "#10b981" : "#ef4444" }}
                        >
                          {estadoActual === 1 ? "Aceptado" : "Rechazado"}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Card>
            );
          })
        ) : (
          <Card sx={{ textAlign: "center", py: 8 }}>
            <CardContent>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 3,
                  borderRadius: "50%",
                  bgcolor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SportsVolleyballIcon sx={{ fontSize: 60, color: "#94a3b8" }} />
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {tabValue === 0 ? 'No tienes partidos confirmados' : 'No tienes partidos propuestos'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tabValue === 0 
                  ? 'Los partidos que aceptes aparecerán aquí' 
                  : 'Cuando te asignen un partido, aparecerá aquí'}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCancel}
        PaperProps={{
          sx: { borderRadius: "16px", maxWidth: 400 },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {selectedEstado === 1 ? (
              <Avatar sx={{ bgcolor: "#dcfce7" }}>
                <CheckIcon sx={{ color: "#166534" }} />
              </Avatar>
            ) : (
              <Avatar sx={{ bgcolor: "#fee2e2" }}>
                <CloseIcon sx={{ color: "#991b1b" }} />
              </Avatar>
            )}
            <Typography variant="h6" fontWeight={600}>
              Confirmar {selectedEstado === 1 ? "aceptación" : "rechazo"}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas {selectedEstado === 1 ? "aceptar" : "rechazar"} esta designación?
            {selectedEstado === 2 && " Se notificará al administrador."}
          </DialogContentText>
          {selectedEstado === 2 && (
            <TextField
              label="Motivo del rechazo"
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              sx={{ mt: 2 }}
              placeholder="Ej: No puedo por trabajo, viaje, lesión..."
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button onClick={handleCancel} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color={selectedEstado === 1 ? "success" : "error"}
            autoFocus
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

DesignacionesView.displayName = "DesignacionesView";

export default DesignacionesView;
