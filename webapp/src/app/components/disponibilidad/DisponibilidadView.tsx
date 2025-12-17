import React, { useState, useEffect, JSX, useImperativeHandle, forwardRef } from "react";
import {
  Typography, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, IconButton, Grid, useMediaQuery, useTheme, Card,
  Autocomplete, Chip, Tooltip
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import DeleteIcon from "@mui/icons-material/Delete";
import disponibilidadService from "../../services/DisponibilidadService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DisponibilidadView.css";

moment.locale("es");
const localizer = momentLocalizer(moment);

type CustomEvent = {
  title: string;
  start: Date;
  end: Date;
  resource: string;
  availability: number;
  color?: string;
  icon?: JSX.Element;
  disponibilidadId?: string;
  fecha?: string;
};

const DisponibilidadView = forwardRef((_props, ref) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<{ [key: string]: number | string }>({});
  const [events, setEvents] = useState<CustomEvent[]>([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const loadAvailabilityForDate = async (date: Date) => {
    const usuarioId = localStorage.getItem("userId"); 
    if (!usuarioId) {
      toast.error("Error: Usuario no identificado"); 
      return;
    }

    const formattedDate = moment(date).format("YYYY-MM-DD");

    try {
      const disponibilidad = await disponibilidadService.getDisponibilidadByUserAndDate(usuarioId, formattedDate);

      // Si existe disponibilidad y tiene id, cargar los valores
      if (disponibilidad && disponibilidad.id) {
        setAvailability({
          Franja1: disponibilidad.franja1 || 0,
          Franja2: disponibilidad.franja2 || 0,
          Franja3: disponibilidad.franja3 || 0,
          Franja4: disponibilidad.franja4 || 0,
          comments: disponibilidad.comentarios || ''
        });
      } else {
        // Si no existe, valores vacíos (0)
        setAvailability({
          Franja1: 0,
          Franja2: 0,
          Franja3: 0,
          Franja4: 0,
          comments: ''
        });
      }
    } catch (error) {
      console.error("Error al cargar disponibilidad:", error);
      // Si hay error, inicializar con valores vacíos
      setAvailability({
        Franja1: 0,
        Franja2: 0,
        Franja3: 0,
        Franja4: 0,
        comments: ''
      });
    }
  };

  const loadAvailabilityForMonth = async (month: Date) => {
    const usuarioId = localStorage.getItem("userId");
    if (!usuarioId) {
      toast.error("Error: Usuario no identificado");
      return;
    }
  
    const startOfMonth = moment(month).startOf("month").format("YYYY-MM-DD");
    const endOfMonth = moment(month).endOf("month").format("YYYY-MM-DD");
    const events: CustomEvent[] = [];
  
    try {
      // Una sola petición para todo el mes
      const disponibilidades = await disponibilidadService.getDisponibilidadesByUserAndRange(usuarioId, startOfMonth, endOfMonth);
      
      // Crear un mapa para búsqueda rápida por fecha
      const disponibilidadMap = new Map();
      disponibilidades.forEach((disp: any) => {
        const fechaKey = moment(disp.fecha).format("YYYY-MM-DD");
        disponibilidadMap.set(fechaKey, disp);
      });

      // Recorrer el mes y crear eventos
      for (let day = moment(month).startOf("month"); day.isSameOrBefore(moment(month).endOf("month"), "day"); day.add(1, "days")) {
        const fechaKey = day.format("YYYY-MM-DD");
        const disponibilidad = disponibilidadMap.get(fechaKey);
        
        if (!disponibilidad) continue;

        const date = day.toDate();
  
        const dayEvents: CustomEvent[] = ["franja1", "franja2", "franja3", "franja4"].map((franja, index) => {
          const availability = disponibilidad[franja] || 0;
          if (availability === 0) {
            return null; 
          }
  
          return {
            title: ["09:00 - 12:00", "12:00 - 15:00", "15:00 - 18:00", "18:00 - 22:00"][index],
            start: moment(date).hour(9 + index * 3).minute(0).toDate(),
            end: moment(date).hour(12 + index * 3).minute(0).toDate(),
            resource: `Franja${index + 1}`,
            availability,
            disponibilidadId: disponibilidad.id,
            fecha: fechaKey,
          };
        }).filter(event => event !== null);
  
        dayEvents.forEach(event => {
          if (event.availability === 1) {
            event.color = "blue";
            event.icon = <DirectionsCarIcon style={{ color: '#4A90E2' }} />;
          } else if (event.availability === 2) {
            event.color = "#5B7C99";
            event.icon = <DirectionsWalkIcon style={{ color: '#5B7C99' }} />;
          } else if (event.availability === 3) {
            event.color = "#94A3B8";
            event.icon = <DoNotDisturbIcon style={{ color: '#94A3B8' }} />;
          }
        });
  
        events.push(...dayEvents);
      }
  
      setEvents(events);
    } catch (error) {
      console.error("Error al cargar disponibilidad:", error);
      toast.error("Ocurrió un error al cargar la disponibilidad");
    }
  };
  

  
  const handleSave = async () => {
    if (!selectedDate) return;
  
    const usuarioId = localStorage.getItem("userId");
    if (!usuarioId) {
      toast.error("Error: Usuario no identificado");
      return;
    }
  
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
  
    // Asegurar que los valores sean números (1, 2, 3) o 0
    const disponibilidadData = {
      usuarioId,
      fecha: formattedDate,
      franja1: typeof availability.Franja1 === 'number' ? availability.Franja1 : 0,
      franja2: typeof availability.Franja2 === 'number' ? availability.Franja2 : 0,
      franja3: typeof availability.Franja3 === 'number' ? availability.Franja3 : 0,
      franja4: typeof availability.Franja4 === 'number' ? availability.Franja4 : 0,
      comentarios: availability.comments || "",
    };
  
    try {
      const disponibilidadExistente = await disponibilidadService.getDisponibilidadByUserAndDate(usuarioId, formattedDate);
  
      if (disponibilidadExistente && disponibilidadExistente.id) {
        // Si existe, actualizamos
        await disponibilidadService.actualizarDisponibilidad({
          id: disponibilidadExistente.id,
          ...disponibilidadData,
        });
        toast.success("Disponibilidad actualizada con éxito");
      } else {
        // Si no existe, creamos
        await disponibilidadService.crearDisponibilidad(disponibilidadData);
        toast.success("Disponibilidad creada con éxito");
      }
  
      // Recargar el calendario con los datos actualizados
      await loadAvailabilityForMonth(currentDate);
  
      // Cerrar el diálogo
      setOpenDialog(false);
      setSelectedDate(null);
    } catch (error) {
      console.error("Error al guardar disponibilidad:", error);
      toast.error("Ocurrió un error al guardar la disponibilidad");
    }
  };

  const eventStyleGetter = (event: CustomEvent) => {
    let backgroundColor = 'white';
    let borderColor = '#e5e7eb';
    
    if (event.availability === 1) {
      // Con transporte - Azul
      backgroundColor = '#dbeafe';
      borderColor = '#93c5fd';
    } else if (event.availability === 2) {
      // Sin transporte - Verde
      backgroundColor = '#d1fae5';
      borderColor = '#6ee7b7';
    } else if (event.availability === 3) {
      // No disponible - Rojo
      backgroundColor = '#fee2e2';
      borderColor = '#fca5a5';
    }

    return {
      style: {
        backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '8px', 
        color: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40px', 
        fontSize: '13px',
        fontWeight: 500,
        fontFamily: 'Arial, sans-serif', 
        padding: '5px', 
        overflow: 'hidden',
      },
    };
  };

  const dayPropGetter = (date: Date) => {
    const isWithin7Days = isDateWithin7Days(date);

    return {
      style: {
        height: isMobile ? '250px' : '300px',
        minHeight: isMobile ? '250px' : '300px',
        overflow: 'hidden',
        backgroundColor: isWithin7Days ? '#f0f0f0' : 'white',
        pointerEvents: (isWithin7Days ? 'none' : 'auto') as React.CSSProperties['pointerEvents'], // bloquea clics en los días deshabilitados
        opacity: isWithin7Days ? 0.5 : 1, 
      },
    };
  };

  const renderEventContent = ({ event }: { event: CustomEvent }) => {
    const testId = `event-${moment(event.start).format('YYYYMMDD')}-${event.resource}`;

    return (
      <div 
        data-testid={testId} 
        style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          width: "100%",
          position: "relative",
          padding: "0 4px",
        }}
        className="calendar-event-content"
      >
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          {event.icon && <div style={{ marginRight: "4px", display: "flex" }}>{event.icon}</div>}
          <span style={{ fontSize: "13px" }}>{event.title}</span>
        </div>
        <Tooltip title="Eliminar" arrow>
          <IconButton
            size="small"
            onClick={(e) => handleDeleteFranja(event, e)}
            className="delete-event-btn"
            sx={{
              padding: "2px",
              minWidth: "24px",
              width: "24px",
              height: "24px",
              opacity: 0,
              transition: "opacity 0.2s",
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.1)',
              },
              '.calendar-event-content:hover &': {
                opacity: 1,
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: 16, color: '#ef4444' }} />
          </IconButton>
        </Tooltip>
      </div>
    );
  };


  const renderLegend = () => (
    <Box sx={{ mb: 3, textAlign: 'center' }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <Box 
            display="flex" 
            alignItems="center" 
            sx={{
              bgcolor: '#dbeafe',
              px: 2,
              py: 1,
              borderRadius: '10px',
              border: '1px solid #93c5fd',
            }}
          >
            <DirectionsCarIcon sx={{ color: '#2563eb', mr: 1 }} />
            <Typography variant="body2" fontWeight={500} color="#2563eb">
              Con transporte
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box 
            display="flex" 
            alignItems="center" 
            sx={{
              bgcolor: '#d1fae5',
              px: 2,
              py: 1,
              borderRadius: '10px',
              border: '1px solid #6ee7b7',
            }}
          >
            <DirectionsWalkIcon sx={{ color: '#5B7C99', mr: 1 }} />
            <Typography variant="body2" fontWeight={500} color="#5B7C99">
              Sin transporte
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box 
            display="flex" 
            alignItems="center" 
            sx={{
              bgcolor: '#fee2e2',
              px: 2,
              py: 1,
              borderRadius: '10px',
              border: '1px solid #fca5a5',
            }}
          >
            <DoNotDisturbIcon sx={{ color: '#dc2626', mr: 1 }} />
            <Typography variant="body2" fontWeight={500} color="#dc2626">
              No disponible
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

    const isDateWithin7Days = (date: Date) => {
    const today = moment().startOf("day");
    const selected = moment(date).startOf("day");
    return selected.diff(today, "days") < 7;
  };

  const handleSelectSlot = async (slotInfo: { start: Date }) => {
    if (isDateWithin7Days(slotInfo.start)) {
      toast.warning("Solo puedes modificar tu disponibilidad con al menos 7 días de antelación");
      return;
    }
    setSelectedDate(slotInfo.start);
    await loadAvailabilityForDate(slotInfo.start);
    setOpenDialog(true);
  };

  const handleSelectEvent = async (event: any) => {
    if (isDateWithin7Days(event.start)) {
      toast.warning("Solo puedes modificar tu disponibilidad con al menos 7 días de antelación");
      return;
    }
    setSelectedDate(event.start);
    await loadAvailabilityForDate(event.start);
    setOpenDialog(true);
  };
  

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (franja: string, value: string | number) => {
    setAvailability({ ...availability, [franja]: value });
  };

  const handleDeleteFranja = async (event: CustomEvent, e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra el diálogo de edición
    
    if (!event.disponibilidadId || !event.fecha) return;
    
    const usuarioId = localStorage.getItem("userId");
    if (!usuarioId) {
      toast.error("Error: Usuario no identificado");
      return;
    }

    try {
      // Cargar la disponibilidad completa
      const disponibilidad = await disponibilidadService.getDisponibilidadByUserAndDate(usuarioId, event.fecha);
      
      if (!disponibilidad || !disponibilidad.id) {
        toast.error("No se encontró la disponibilidad");
        return;
      }

      // Determinar qué franja eliminar (poner a 0)
      const franjaKey = event.resource.toLowerCase(); // "Franja1" -> "franja1"
      const disponibilidadActualizada: any = {
        id: disponibilidad.id,
        usuarioId,
        fecha: event.fecha,
        franja1: disponibilidad.franja1,
        franja2: disponibilidad.franja2,
        franja3: disponibilidad.franja3,
        franja4: disponibilidad.franja4,
        comentarios: disponibilidad.comentarios || "",
      };

      // Poner la franja seleccionada a 0
      disponibilidadActualizada[franjaKey] = 0;

      // Verificar si todas las franjas están a 0
      const todasVacias = disponibilidadActualizada.franja1 === 0 && 
                         disponibilidadActualizada.franja2 === 0 && 
                         disponibilidadActualizada.franja3 === 0 && 
                         disponibilidadActualizada.franja4 === 0;

      if (todasVacias) {
        // Si todas las franjas están vacías, eliminar el registro completo
        await disponibilidadService.eliminarDisponibilidad(disponibilidad.id);
        toast.success("Disponibilidad eliminada");
      } else {
        // Si quedan otras franjas, solo actualizar
        await disponibilidadService.actualizarDisponibilidad(disponibilidadActualizada);
        toast.success("Franja eliminada");
      }

      // Recargar el calendario
      await loadAvailabilityForMonth(currentDate);
    } catch (error) {
      console.error("Error al eliminar franja:", error);
      toast.error("Error al eliminar la disponibilidad");
    }
  };

  useEffect(() => {
    loadAvailabilityForMonth(currentDate);
  }, [currentDate]);

  useImperativeHandle(
  process.env.NODE_ENV === 'test' ? ref : null,
  () => ({
    handleSelectSlot
  })
);


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
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CalendarMonthIcon sx={{ color: "white", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#1e293b" }}>
              Mi Disponibilidad
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configura tu disponibilidad para los partidos
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card sx={{ p: 3, borderRadius: '16px' }}>
        <Box sx={{ mb: 3 }}>
        </Box>

        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            flex: 1, 
            height: '100%',
          }}
        >
          {/* Controles de navegación del mes */}
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center" 
            mb={3}
            sx={{
              bgcolor: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)',
              p: 2,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)',
            }}
          >
            <IconButton 
              onClick={() => setCurrentDate(moment(currentDate).subtract(1, "months").toDate())}
              aria-label="Mes anterior"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: 'white',
                textTransform: 'capitalize',
              }}
            >
              {moment(currentDate).format("MMMM YYYY")}
            </Typography>
            <IconButton 
              onClick={() => setCurrentDate(moment(currentDate).add(1, "months").toDate())}
              aria-label="Mes siguiente"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
          {renderLegend()}
          <div style={{ minHeight: isMobile ? "500px" : "700px", width: "100%", cursor:'pointer' }}>
          <Calendar
            data-testid="calendar"
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            eventPropGetter={eventStyleGetter}
            dayPropGetter={dayPropGetter}
            views={{ month: true }} 
            components={{
              event: renderEventContent,
              toolbar: () => null,
            }}
            style={{ minHeight: '1000px' }} 
          />
          </div>
          <Dialog 
            open={openDialog} 
            onClose={handleCloseDialog} 
            fullWidth 
            maxWidth="sm" 
            data-testid="availability-dialog"
            PaperProps={{
              sx: {
                borderRadius: '20px',
                p: 1,
              },
            }}
          >
            <DialogTitle sx={{ 
              fontWeight: 700, 
              fontSize: '1.25rem',
              color: '#1e293b',
              textAlign: 'center',
              pt: 3,
            }}>
              📅 Seleccionar Disponibilidad
              <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 400, mt: 0.5 }}>
                {selectedDate && moment(selectedDate).format('DD/MM/YYYY')}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ px: 4, pt: 2 }}>
              {['Franja1', 'Franja2', 'Franja3', 'Franja4'].map((franja, index) => {
                const franjaLabel = `Franja ${index + 1}: ${["9:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-22:00"][index]}`;
                return (
                  <Box key={index} mb={2}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={10}>
                        <Autocomplete
                          sx ={{ mt: 2 }}
                          fullWidth
                          disablePortal={process.env.NODE_ENV === 'test'}
                          options={[
                            { label: 'Disponible con transporte', value: 1 },
                            { label: 'Disponible sin transporte', value: 2 },
                            { label: 'No disponible', value: 3 },
                          ]}
                          getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                          isOptionEqualToValue={(option, value) => option.value === (value as any)?.value}
                          value={
                            [
                              { label: 'Disponible con transporte', value: 1 },
                              { label: 'Disponible sin transporte', value: 2 },
                              { label: 'No disponible', value: 3 },
                            ].find((opt) => opt.value === availability[franja]) || null
                          }
                          onChange={(_, newValue) => handleChange(franja, newValue ? newValue.value : 0)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={franjaLabel}
                              variant="outlined"
                              data-testid={`autocomplete-${franja.toLowerCase()}`}
                            />
                            
                          )}
                        />
                      </Grid>
                      <Grid item xs={2} display="flex" justifyContent="center" alignItems="center">
                        {availability[franja] === 1 && (
                          <IconButton color="primary">
                            <DirectionsCarIcon />
                          </IconButton>
                        )}
                        {availability[franja] === 2 && (
                          <IconButton color="success">
                            <DirectionsWalkIcon />
                          </IconButton>
                        )}
                        {availability[franja] === 3 && (
                          <IconButton color="error">
                            <DoNotDisturbIcon />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Comentarios"
                variant="outlined"
                value={availability.comments || ''}
                onChange={(e) => setAvailability({ ...availability, comments: e.target.value })}
                sx={{ 
                  mt: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: '#4A90E2',
                    },
                  },
                }}
                inputProps={{ maxLength: 200 }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 4, pb: 3, gap: 1 }}>
              <Button 
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{
                  borderRadius: '10px',
                  px: 3,
                  borderColor: '#e2e8f0',
                  color: '#64748b',
                  '&:hover': {
                    borderColor: '#cbd5e1',
                    bgcolor: '#f8fafc',
                  },
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                variant="contained"
                sx={{
                  borderRadius: '10px',
                  px: 3,
                  background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2C5F8D 0%, #1e3a5f 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(74, 144, 226, 0.4)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Card>
      </Box>
    
  );
});

export default DisponibilidadView;
