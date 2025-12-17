import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Avatar,
} from "@mui/material";
import moment from "moment";
import "moment/locale/es";
import { Link } from "react-router-dom";
import { usePartidosUsuario } from "../../hooks/usePartidosUsuario";
import HistoryIcon from "@mui/icons-material/History";
import SportsVolleyballIcon from "@mui/icons-material/SportsVolleyball";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

moment.locale("es");

const HistorialDesignacionesView = React.memo(() => {
  const { partidos } = usePartidosUsuario({ filterType: "past" });

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
              background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HistoryIcon sx={{ color: "white", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#1e293b" }}>
              Mi Historial
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Registro de partidos anteriores
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Card */}
      <Card sx={{ background: "linear-gradient(135deg, #64748b 0%, #475569 100%)", color: "white", mb: 4 }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 56, height: 56 }}>
            <SportsVolleyballIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h3" fontWeight={700}>{partidos.length}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>Partidos completados</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Partidos List */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {partidos.length > 0 ? (
          partidos.map((partido) => (
            <Link
              key={partido.id}
              to={`/detallesPartido/${partido.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Top Row - Teams */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "#64748b", width: 48, height: 48 }}>
                        <SportsVolleyballIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={700} sx={{ color: "#1e293b" }}>
                          {partido.equipoLocal} vs {partido.equipoVisitante}
                        </Typography>
                        <Chip
                          size="small"
                          label={partido.categoria}
                          sx={{ bgcolor: "#e0e7ff", color: "#3730a3", fontWeight: 500, mt: 0.5 }}
                        />
                      </Box>
                    </Box>
                    <Chip
                      label="Completado"
                      sx={{
                        bgcolor: "#f1f5f9",
                        color: "#64748b",
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  {/* Info Grid */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(3, 1fr)" },
                      gap: 2,
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
                        <Typography variant="body2" fontWeight={600}>
                          {partido.hora?.slice(0, 5)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <LocationOnIcon sx={{ color: "#64748b", fontSize: 20 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Lugar</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {partido.lugar || "Por determinar"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Footer */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Typography variant="body2" color="primary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      Ver detalles <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Link>
          ))
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
                <HistoryIcon sx={{ fontSize: 60, color: "#94a3b8" }} />
              </Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay partidos en el historial
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Los partidos completados aparecerán aquí
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
});

HistorialDesignacionesView.displayName = "HistorialDesignacionesView";

export default HistorialDesignacionesView;
