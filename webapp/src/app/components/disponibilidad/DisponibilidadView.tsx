import React, { useState, useEffect, JSX } from "react";
import {
  Container, Typography, Paper, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, MenuItem, IconButton, Grid, useMediaQuery, useTheme,
  Select
} from "@mui/material";
import NavigationBar from "../barra_navegacion/NavBar";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
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
};

const DisponibilidadView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<{ [key: string]: number | string }>({});
  const [events, setEvents] = useState<CustomEvent[]>([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const loadAvailabilityForDate = async (date: Date) => {
    const usuarioId = localStorage.getItem("userId"); // Get user ID
    if (!usuarioId) {
      toast.error("Error: Usuario no identificado"); // Show error toast
      return;
    }

    const formattedDate = moment(date).format("YYYY-MM-DD");

    try {
      const disponibilidad = await disponibilidadService.getDisponibilidadByUserAndDate(usuarioId, formattedDate);

      if (disponibilidad) {
        setAvailability({
          Franja1: disponibilidad.franja1 || '',
          Franja2: disponibilidad.franja2 || '',
          Franja3: disponibilidad.franja3 || '',
          Franja4: disponibilidad.franja4 || '',
          comments: disponibilidad.comentarios || ''
        });
      } else {
        setAvailability({
          Franja1: '',
          Franja2: '',
          Franja3: '',
          Franja4: '',
          comments: ''
        });
      }
    } catch (error) {
      console.error("Error al cargar disponibilidad:", error);
      toast.error("Ocurrió un error al cargar la disponibilidad"); // Show error toast
    }
  };

  const loadAvailabilityForMonth = async (month: Date) => {
    const usuarioId = localStorage.getItem("userId");
    if (!usuarioId) {
      toast.error("Error: Usuario no identificado");
      return;
    }

    const startOfMonth = moment(month).startOf("month");
    const endOfMonth = moment(month).endOf("month");
    const events: CustomEvent[] = [];

    try {
      for (let day = startOfMonth; day.isSameOrBefore(endOfMonth, "day"); day.add(1, "days")) {
        const formattedDate = day.format("YYYY-MM-DD");
        const disponibilidad = await disponibilidadService.getDisponibilidadByUserAndDate(usuarioId, formattedDate);
        const date = day.toDate();

        const dayEvents: CustomEvent[] = ["Franja1", "Franja2", "Franja3", "Franja4"].map((franja, index) => ({
          title: ["09:00 - 12:00", "12:00 - 15:00", "15:00 - 18:00", "18:00 - 22:00"][index],
          start: moment(date).hour(9 + index * 3).minute(0).toDate(),
          end: moment(date).hour(12 + index * 3).minute(0).toDate(),
          resource: franja,
          availability: disponibilidad?.[franja.toLowerCase()] || 0,
        }));

        dayEvents.forEach(event => {
          if (event.availability === 1) {
            event.color = "blue";
            event.icon = <DirectionsCarIcon />;
          } else if (event.availability === 2) {
            event.color = "green";
            event.icon = <DirectionsWalkIcon />;
          } else if (event.availability === 3) {
            event.color = "red";
            event.icon = <DoNotDisturbIcon />;
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
  
    const usuarioId = localStorage.getItem("userId"); // Get user ID
    if (!usuarioId) {
      toast.error("Error: Usuario no identificado"); // Show error toast
      return;
    }
  
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
  
    const disponibilidadData = {
      usuarioId,
      fecha: formattedDate,
      franja1: availability.Franja1 || 0,
      franja2: availability.Franja2 || 0,
      franja3: availability.Franja3 || 0,
      franja4: availability.Franja4 || 0,
      comentarios: availability.comments || "",
    };
  
    try {
      const disponibilidadExistente = await disponibilidadService.getDisponibilidadByUserAndDate(usuarioId, formattedDate);
  
      if (disponibilidadExistente && disponibilidadExistente.disponibilidad !== null) { // If availability exists
        await disponibilidadService.actualizarDisponibilidad({
          ...disponibilidadExistente,
          ...disponibilidadData,
        });
        toast.success("Disponibilidad actualizada con éxito"); // Show success toast
      } else {
        await disponibilidadService.crearDisponibilidad(disponibilidadData);
        toast.success("Disponibilidad creada con éxito"); // Show success toast
      }
  
      // Actualizar la disponibilidad en el estado de forma directa
      setAvailability(prevAvailability => ({
        ...prevAvailability,
        Franja1: disponibilidadData.franja1,
        Franja2: disponibilidadData.franja2,
        Franja3: disponibilidadData.franja3,
        Franja4: disponibilidadData.franja4,
        comments: disponibilidadData.comentarios
      }));
  
      // Actualizar los eventos (en caso de que sea necesario hacer un update rápido del calendario)
      await loadAvailabilityForMonth(currentDate);
  
      setOpenDialog(false); // Cerrar el diálogo después de guardar
    } catch (error) {
      console.error("Error al guardar disponibilidad:", error);
      toast.error("Ocurrió un error al guardar la disponibilidad"); // Show error toast
    }
  };

  const eventStyleGetter = (event: CustomEvent) => {
    let backgroundColor = 'white';
    if (event.availability === 1) {
      backgroundColor = 'blue';
    } else if (event.availability === 2) {
      backgroundColor = 'green';
    } else if (event.availability === 3) {
      backgroundColor = 'red';
    }
  
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '25px', // Reducimos la altura para que entren todos
        fontSize: '12px', // Reducimos tamaño de fuente
        padding: '2px',
        overflow: 'hidden',
      },
    };
  };

  const dayPropGetter = (date: Date) => {
    return {
      style: {
        height: '120px', // Aumentamos la altura de cada celda del día
        minHeight: '120px',
        overflow: 'visible', // Asegura que los eventos se vean correctamente
      },
    };
  };

  const renderEventContent = ({ event }: { event: CustomEvent }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      {event.icon && <div style={{ marginRight: "4px" }}>{event.icon}</div>}
      <span>{event.title}</span>
    </div>
  );

  const renderLegend = () => (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 1 }}>
        <Grid item>
          <Box display="flex" alignItems="center">
            <IconButton color="primary">
              <DirectionsCarIcon />
            </IconButton>
            <Typography variant="body2" color="#333">Disponible con transporte</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex" alignItems="center">
            <IconButton color="success">
              <DirectionsWalkIcon />
            </IconButton>
            <Typography variant="body2" color="#333">Disponible sin transporte</Typography>
          </Box>
        </Grid>
        <Grid item>
          <Box display="flex" alignItems="center">
            <IconButton color="error">
              <DoNotDisturbIcon />
            </IconButton>
            <Typography variant="body2" color="#333">No disponible</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  const handleSelectSlot = async (slotInfo: { start: Date }) => {
    setSelectedDate(slotInfo.start);
    await loadAvailabilityForDate(slotInfo.start); // Llamamos al nuevo método aquí
    setOpenDialog(true);
  };

  const handleSelectEvent = async (event: any) => {
    setSelectedDate(event.start);
    await loadAvailabilityForDate(event.start); // También llamamos al método aquí
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (franja: string, value: string | number) => {
    setAvailability({ ...availability, [franja]: value });
  };

  useEffect(() => {
    loadAvailabilityForMonth(currentDate);
  }, [currentDate]);

  return (
    <Box
      sx={{
        backgroundImage: "url('/fondo4.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavigationBar />
      <Container 
      sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        paddingBottom: '2rem', 
        minHeight: '100vh', 
      }}
    >
        <Paper 
            elevation={3} 
            sx={{ 
              padding: 3, 
              backgroundColor: '#F0F4F8', 
              color: '#333', 
              borderRadius: '12px', 
              width: '100%', 
              maxWidth: '1200px',
              display: 'flex', 
              flexDirection: 'column',
              flex: 1, // Permite que se expanda completamente
              height: '100%', // Se asegura de que cubra todo
              marginTop: '2rem',
            }}
          >
          <Typography variant="h4" textAlign="center" color="#333">
            Mi Disponibilidad
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <IconButton onClick={() => setCurrentDate(moment(currentDate).subtract(1, "months").toDate())} color="primary">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">{moment(currentDate).format("MMMM YYYY")}</Typography>
            <IconButton onClick={() => setCurrentDate(moment(currentDate).add(1, "months").toDate())} color="primary">
              <ArrowForwardIcon />
            </IconButton>
          </Box>
          {renderLegend()}
          <div style={{ minHeight: isMobile ? "500px" : "700px", width: "100%" }}>
          <Calendar
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
            dayPropGetter={dayPropGetter} // Asegurar que los eventos se vean correctamente
            views={{ month: true }} // Asegurar que la vista sea mensual
            components={{
              event: renderEventContent,
              toolbar: () => null, // Esto elimina completamente la barra de herramientas
            }}
            style={{ height: '800px' }} // Aumentamos la altura del calendario
          />
          </div>
          {/* Leyenda de Disponibilidad */}
          
          {/* Dialog for editing availability */}
          <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
            <DialogTitle sx={{ backgroundColor: '#F0F4F8', color: '#333' }}>
              Seleccionar Disponibilidad - {selectedDate && moment(selectedDate).format('DD/MM/YYYY')}
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: '#FFFFFF', color: '#333' }}>
              {['Franja1', 'Franja2', 'Franja3', 'Franja4'].map((franja, index) => (
                <Box key={index} mb={2}>
                  <Typography fontWeight="bold" color="#333">
                    {`Franja ${index + 1}: ${["9:00-12:00", "12:00-15:00", "15:00-18:00", "18:00-22:00"][index]}`}
                  </Typography>
                  <Grid container spacing={1} alignItems="center">
                    {/* Select */}
                    <Grid item xs={6}>
                      <Select
                        fullWidth
                        value={availability[franja] || ''}
                        onChange={(e) => handleChange(franja, e.target.value)}
                        sx={{ backgroundColor: '#FFFFFF' }}
                      >
                        <MenuItem value={1}>Disponible con transporte</MenuItem>
                        <MenuItem value={2}>Disponible sin transporte</MenuItem>
                        <MenuItem value={3}>No disponible</MenuItem>
                      </Select>
                    </Grid>
                    
                    {/* Icono */}
                    <Grid item xs={6} display="flex" justifyContent="center" alignItems="center">
                      {availability[franja] === 1 && (
                        <IconButton color="primary" >
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
              ))}
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Comentarios"
                variant="outlined"
                value={availability.comments || ''}
                onChange={(e) => setAvailability({ ...availability, comments: e.target.value })}
                sx={{ backgroundColor: '#FFFFFF' }}
              />
            </DialogContent>
            <DialogActions sx={{ backgroundColor: '#F0F4F8' }}>
              <Button onClick={handleCloseDialog} color="error">Cancelar</Button>
              <Button onClick={handleSave} color="primary" variant="contained">Guardar</Button>
            </DialogActions>
          </Dialog>

        </Paper>
      </Container>
      </Box>
    
  );
};

export default DisponibilidadView;
