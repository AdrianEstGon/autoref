import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Select, MenuItem, IconButton, Grid
} from '@mui/material';
import NavigationBar from '../barra_navegacion/NavBar';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import './DisponibilidadView.css';

moment.locale('es');
const localizer = momentLocalizer(moment);

const DisponibilidadView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<{ [key: string]: number | string }>({});
  const [events, setEvents] = useState<any[]>([]);

  const generateEvents = (month: Date) => {
    const startOfMonth = moment(month).startOf('month');
    const endOfMonth = moment(month).endOf('month'); // Esta línea está bien, pero necesitamos revisar el rango de fechas
    const events: any[] = [];
  
    // Iterar sobre todos los días del mes
    for (let day = startOfMonth; day.isSameOrBefore(endOfMonth, 'day'); day.add(1, 'days')) { // Aquí ajustamos el bucle
      const date = day.toDate();
      const dayEvents = [
        { title: '9:00 - 12:00', start: moment(date).hour(9).minute(0).toDate(), end: moment(date).hour(12).minute(0).toDate(), resource: 'Franja1' },
        { title: '12:00 - 15:00', start: moment(date).hour(12).minute(0).toDate(), end: moment(date).hour(15).minute(0).toDate(), resource: 'Franja2' },
        { title: '15:00 - 18:00', start: moment(date).hour(15).minute(0).toDate(), end: moment(date).hour(18).minute(0).toDate(), resource: 'Franja3' },
        { title: '18:00 - 22:00', start: moment(date).hour(18).minute(0).toDate(), end: moment(date).hour(22).minute(0).toDate(), resource: 'Franja4' },
      ];
  
      events.push(...dayEvents);
    }
  
    return events;
  };

  useEffect(() => {
    setEvents(generateEvents(currentDate));
  }, [currentDate]);

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    setSelectedDate(slotInfo.start);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (franja: string, value: string | number) => {
    setAvailability({ ...availability, [franja]: value });
  };

  const handleSave = () => {
    console.log('Disponibilidad guardada para:', selectedDate, availability);
    setOpenDialog(false);
  };

  const handleNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'months').toDate());
  };

  const handlePrevMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'months').toDate());
  };

  return (
    <div style={{ backgroundColor: '#F5F5DC', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavigationBar />
      <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#F0F4F8', color: '#333', borderRadius: '12px', width: '100%' }}>
          <Typography variant="h6" gutterBottom textAlign="center" marginBottom={2} color="#333">
            Mi Disponibilidad
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <IconButton onClick={handlePrevMonth} color="primary">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" color="#333">
              {moment(currentDate).format('MMMM YYYY')}
            </Typography>
            <IconButton onClick={handleNextMonth} color="primary">
              <ArrowForwardIcon />
            </IconButton>
          </Box>
          <div style={{ height: '700px', width: '100%' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={handleSelectSlot}
              date={currentDate}
              onNavigate={date => setCurrentDate(date)}
              style={{
                height: '100%',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                color: '#333',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              }}
              views={['month']}
              toolbar={false}
            />
          </div>
        </Paper>
      </Container>
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
              <Grid container spacing={1} mt={1}>
                <Grid item>
                  {availability[franja] === 1 && (
                    <IconButton color="primary">
                      <DirectionsCarIcon />
                    </IconButton>
                  )}
                </Grid>
                <Grid item>
                  {availability[franja] === 2 && (
                    <IconButton color="success">
                      <DirectionsWalkIcon />
                    </IconButton>
                  )}
                </Grid>
                <Grid item>
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
          <Button onClick={handleCloseDialog} color="secondary">Cancelar</Button>
          <Button onClick={handleSave} color="primary" variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DisponibilidadView;
