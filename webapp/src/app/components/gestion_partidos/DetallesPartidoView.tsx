import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  TextField,
  Stack,
  Autocomplete,
} from "@mui/material";
import partidosService from "../../services/PartidoService";
import cambiosPartidoService, { CambioPartido } from "../../services/CambioPartidoService";
import polideportivoService from "../../services/PolideportivoService";
import moment from "moment";
import "moment/locale/es";
import { Person, Event, ArrowBack, SportsSoccer, CalendarToday, AccessTime, LocationOn, Category } from "@mui/icons-material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { toast } from "react-toastify";

moment.locale("es");

const DetallesPartidoView = React.memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partido, setPartido] = useState<{
    id?: string;
    numeroPartido: string;
    equipoLocal: string;
    equipoLocalId?: string;
    equipoVisitante: string;
    equipoVisitanteId?: string;
    fecha: string;
    hora: string;
    lugar: { nombre: string; latitud: number; longitud: number } | null;
    lugarId?: string | null;
    categoria: string;
    categoriaId?: string | null;
    jornada: string;
    competicionId?: string | null;
    clubLocalId?: string | null;
    clubVisitanteId?: string | null;
    arbitro1?: string | null;
    arbitro1Licencia: string;
    arbitro2?: string | null;
    arbitro2Licencia: string;
    anotador?: string | null;
    anotadorLicencia: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [polideportivos, setPolideportivos] = useState<{ id: string; nombre: string }[]>([]);
  const [cambios, setCambios] = useState<CambioPartido[]>([]);
  const [loadingCambios, setLoadingCambios] = useState(false);

  const [horarioFecha, setHorarioFecha] = useState<string>("");
  const [horarioHora, setHorarioHora] = useState<string>("10:00");
  const [horarioLugar, setHorarioLugar] = useState<{ id: string; nombre: string } | null>(null);

  const [cambioFecha, setCambioFecha] = useState<string>("");
  const [cambioHora, setCambioHora] = useState<string>("10:00");
  const [cambioLugar, setCambioLugar] = useState<{ id: string; nombre: string } | null>(null);
  const [cambioMotivo, setCambioMotivo] = useState<string>("");

  const userRole = window.localStorage.getItem("userRole") || "";
  const myClubId = window.localStorage.getItem("clubVinculadoId") || "";
  const userId = window.localStorage.getItem("userId") || "";

  const center = useMemo(
    () =>
      partido?.lugar
        ? {
            lat: partido.lugar.latitud,
            lng: partido.lugar.longitud,
          }
        : { lat: 0, lng: 0 },
    [partido?.lugar]
  );

  useEffect(() => {
    const cargarDetallesPartido = async () => {
      try {
        if (!id) {
          throw new Error("ID del partido no proporcionado.");
        }
        const partidoData = await partidosService.getPartidoById(id);
        setPartido({
          ...partidoData,
        });

        // Defaults para formularios Club
        setHorarioFecha(String(partidoData?.fecha || "").slice(0, 10));
        setHorarioHora(String(partidoData?.hora || "").slice(0, 5) || "10:00");
        setCambioFecha(String(partidoData?.fecha || "").slice(0, 10));
        setCambioHora(String(partidoData?.hora || "").slice(0, 5) || "10:00");
      } catch (error) {
        console.error("Error al cargar los detalles del partido:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDetallesPartido();
  }, [id]);

  const loadCambiosAndPolis = async (partidoId: string) => {
    setLoadingCambios(true);
    try {
      const [camb, polis] = await Promise.all([
        cambiosPartidoService.getByPartido(partidoId),
        polideportivoService.getPolideportivos(),
      ]);
      setCambios(camb || []);
      setPolideportivos((polis || []).map((p: any) => ({ id: p.id, nombre: p.nombre })));
    } catch (e: any) {
      // silencioso para árbitros/público
    } finally {
      setLoadingCambios(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    if (userRole !== "Club" && userRole !== "Federacion" && userRole !== "Admin") return;
    loadCambiosAndPolis(id);
  }, [id, userRole]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!partido) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary">
          No se encontró el partido.
        </Typography>
      </Box>
    );
  }

  const esClub = userRole === "Club";
  const esFederacionAdmin = userRole === "Federacion" || userRole === "Admin";
  const clubLocal = String(partido.clubLocalId || "");
  const clubVisit = String(partido.clubVisitanteId || "");
  const esMiPartidoClub = esClub && !!myClubId && (myClubId === clubLocal || myClubId === clubVisit);
  const soyClubLocal = esClub && !!myClubId && myClubId === clubLocal;

  const estadoCambioLabel = (estado: number) => {
    switch (estado) {
      case 0:
        return "Pendiente (club)";
      case 1:
        return "Rechazado (club)";
      case 2:
        return "Aceptado (club)";
      case 3:
        return "Rechazado (federación)";
      case 4:
        return "Validado (federación)";
      case 5:
        return "Cancelado";
      default:
        return `Estado ${estado}`;
    }
  };

  const handleGuardarHorarioLocal = async () => {
    if (!id) return;
    if (!horarioFecha) return toast.error("Selecciona una fecha");
    if (!horarioHora) return toast.error("Selecciona una hora");
    try {
      const res = await partidosService.fijarHorarioLocal(id, {
        fecha: horarioFecha,
        hora: horarioHora,
        lugarId: horarioLugar?.id || null,
      });
      toast.success(res?.message || "Horario actualizado");
      const partidoData = await partidosService.getPartidoById(id);
      setPartido({ ...partidoData });
    } catch (e: any) {
      toast.error(e?.message || "No se pudo guardar el horario");
    }
  };

  const handleSolicitarCambio = async () => {
    if (!id) return;
    if (!cambioFecha) return toast.error("Selecciona una fecha");
    if (!cambioHora) return toast.error("Selecciona una hora");
    try {
      const res = await cambiosPartidoService.crear(id, {
        fechaPropuesta: cambioFecha,
        horaPropuesta: cambioHora,
        lugarPropuestoId: cambioLugar?.id || null,
        motivo: cambioMotivo || null,
      });
      toast.success(res?.message || "Solicitud creada");
      setCambioMotivo("");
      await loadCambiosAndPolis(id);
    } catch (e: any) {
      toast.error(e?.message || "No se pudo crear la solicitud");
    }
  };

  const responderClub = async (cambioId: string, aceptar: boolean) => {
    try {
      const res = await cambiosPartidoService.responderClub(cambioId, aceptar);
      toast.success(res?.message || (aceptar ? "Aceptada" : "Rechazada"));
      if (id) await loadCambiosAndPolis(id);
    } catch (e: any) {
      toast.error(e?.message || "No se pudo responder");
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2, color: "#64748b" }}
        >
          Volver
        </Button>
        {(userRole === "Arbitro" || userRole === "ComiteArbitros" || userRole === "Federacion" || userRole === "Admin") && (
          <Button
            variant="outlined"
            onClick={() => navigate(`/acta/${id}`)}
            sx={{ mb: 2, ml: 1 }}
            disabled={!id}
          >
            Acta
          </Button>
        )}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SportsSoccer sx={{ color: "white", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#1e293b" }}>
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
                label={`Jornada ${partido.jornada}`}
                sx={{ bgcolor: "#fef3c7", color: "#92400e", fontWeight: 500 }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Información del Partido */}
      <Card sx={{ mb: 3, borderRadius: "16px", overflow: "hidden" }}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            p: 2,
            color: "white",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            <Event sx={{ verticalAlign: "middle", mr: 1 }} />
            Información del Partido
          </Typography>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CalendarToday sx={{ color: "#64748b", fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Fecha
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {moment(partido.fecha).format("DD/MM/YYYY")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <AccessTime sx={{ color: "#64748b", fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Hora
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {moment(partido.hora, "HH:mm").format("HH:mm")}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <LocationOn sx={{ color: "#64748b", fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Lugar
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {partido.lugar ? partido.lugar.nombre : "No especificado"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Category sx={{ color: "#64748b", fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Nº Partido
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {partido.numeroPartido}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 5.4 Horarios / Cambios (Club/Federación) */}
      {(esMiPartidoClub || esFederacionAdmin) && (
        <Card sx={{ mb: 3, borderRadius: "16px", overflow: "hidden" }}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)",
              p: 2,
              color: "white",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Gestión de horario y cambios
            </Typography>
          </Box>
          <CardContent sx={{ p: 3 }}>
            {soyClubLocal && (
              <Box sx={{ mb: 3 }}>
                <Typography fontWeight={700} sx={{ mb: 1 }}>
                  Fijar horario (club local)
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
                  <TextField
                    label="Fecha"
                    type="date"
                    value={horarioFecha}
                    onChange={(e) => setHorarioFecha(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                  <TextField
                    label="Hora"
                    type="time"
                    value={horarioHora}
                    onChange={(e) => setHorarioHora(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                  <Autocomplete
                    options={polideportivos}
                    getOptionLabel={(o) => o.nombre}
                    value={horarioLugar}
                    onChange={(_, v) => setHorarioLugar(v)}
                    renderInput={(params) => <TextField {...params} label="Lugar" size="small" />}
                    sx={{ minWidth: 260 }}
                  />
                  <Button variant="contained" onClick={handleGuardarHorarioLocal} disabled={loadingCambios}>
                    Guardar
                  </Button>
                </Box>
              </Box>
            )}

            {esMiPartidoClub && (
              <Box sx={{ mb: 3 }}>
                <Divider sx={{ mb: 2 }} />
                <Typography fontWeight={700} sx={{ mb: 1 }}>
                  Solicitar cambio (fecha/hora/lugar)
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
                  <TextField
                    label="Fecha propuesta"
                    type="date"
                    value={cambioFecha}
                    onChange={(e) => setCambioFecha(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                  <TextField
                    label="Hora propuesta"
                    type="time"
                    value={cambioHora}
                    onChange={(e) => setCambioHora(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                  <Autocomplete
                    options={polideportivos}
                    getOptionLabel={(o) => o.nombre}
                    value={cambioLugar}
                    onChange={(_, v) => setCambioLugar(v)}
                    renderInput={(params) => <TextField {...params} label="Lugar propuesto" size="small" />}
                    sx={{ minWidth: 260 }}
                  />
                  <TextField
                    label="Motivo"
                    value={cambioMotivo}
                    onChange={(e) => setCambioMotivo(e.target.value)}
                    size="small"
                    sx={{ minWidth: 260 }}
                  />
                  <Button variant="outlined" onClick={handleSolicitarCambio} disabled={loadingCambios}>
                    Enviar solicitud
                  </Button>
                </Box>
              </Box>
            )}

            <Divider sx={{ mb: 2 }} />
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Historial de solicitudes
            </Typography>
            {cambios.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No hay solicitudes de cambio para este partido.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {cambios.map((c) => {
                  const pendienteClub = c.estado === 0;
                  const soyReceptor = esClub && myClubId && c.clubReceptorId === myClubId;
                  return (
                    <Card key={c.id} variant="outlined" sx={{ borderRadius: "12px" }}>
                      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                          <Box>
                            <Typography fontWeight={700} variant="body2">
                              {c.fechaOriginal} {c.horaOriginal} → {c.fechaPropuesta} {c.horaPropuesta}
                              {c.lugarPropuesto?.nombre ? ` — ${c.lugarPropuesto.nombre}` : ""}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {c.motivo || "Sin motivo"}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Chip size="small" label={estadoCambioLabel(c.estado)} />
                            {pendienteClub && soyReceptor && (
                              <>
                                <Button size="small" variant="contained" onClick={() => responderClub(c.id, true)}>
                                  Aceptar
                                </Button>
                                <Button size="small" variant="outlined" color="error" onClick={() => responderClub(c.id, false)}>
                                  Rechazar
                                </Button>
                              </>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </CardContent>
        </Card>
      )}

      {/* Árbitros y Anotador */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {partido.arbitro1 && (
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: "16px", height: "100%" }}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  p: 2,
                  color: "white",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  <Person sx={{ verticalAlign: "middle", mr: 1 }} />
                  Árbitro 1
                </Typography>
              </Box>
              <CardContent>
                <Typography variant="body1" fontWeight={600}>
                  {partido.arbitro1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Licencia: {partido.arbitro1Licencia || "N/A"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {partido.arbitro2 && (
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: "16px", height: "100%" }}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  p: 2,
                  color: "white",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  <Person sx={{ verticalAlign: "middle", mr: 1 }} />
                  Árbitro 2
                </Typography>
              </Box>
              <CardContent>
                <Typography variant="body1" fontWeight={600}>
                  {partido.arbitro2}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Licencia: {partido.arbitro2Licencia || "N/A"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {partido.anotador && (
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: "16px", height: "100%" }}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  p: 2,
                  color: "white",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  <Person sx={{ verticalAlign: "middle", mr: 1 }} />
                  Anotador
                </Typography>
              </Box>
              <CardContent>
                <Typography variant="body1" fontWeight={600}>
                  {partido.anotador}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Licencia: {partido.anotadorLicencia || "N/A"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Mapa */}
      {partido.lugar && (
        <Card sx={{ borderRadius: "16px", overflow: "hidden" }}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
              p: 2,
              color: "white",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              📍 ¿Cómo llegar?
            </Typography>
          </Box>
          <Box sx={{ height: 400 }}>
            <GoogleMap
              mapContainerStyle={{ height: "100%", width: "100%" }}
              center={center}
              zoom={15}
            >
              <Marker position={center} />
            </GoogleMap>
          </Box>
        </Card>
      )}
    </Box>
  );
});

DetallesPartidoView.displayName = "DetallesPartidoView";

export default DetallesPartidoView;
