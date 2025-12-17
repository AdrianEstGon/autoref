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
} from "@mui/material";
import partidosService from "../../services/PartidoService";
import moment from "moment";
import "moment/locale/es";
import { Person, Event, ArrowBack, SportsSoccer, CalendarToday, AccessTime, LocationOn, Category } from "@mui/icons-material";
import { GoogleMap, Marker } from "@react-google-maps/api";

moment.locale("es");

const DetallesPartidoView = React.memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [partido, setPartido] = useState<{
    numeroPartido: string;
    equipoLocal: string;
    equipoVisitante: string;
    fecha: string;
    hora: string;
    lugar: { nombre: string; latitud: number; longitud: number } | null;
    categoria: string;
    jornada: string;
    arbitro1?: string | null;
    arbitro1Licencia: string;
    arbitro2?: string | null;
    arbitro2Licencia: string;
    anotador?: string | null;
    anotadorLicencia: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error("Error al cargar los detalles del partido:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDetallesPartido();
  }, [id]);

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
