import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import temporadaService, { Temporada } from '../../services/TemporadaService';

const TemporadasView: React.FC = () => {
  const [items, setItems] = useState<Temporada[]>([]);
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [activa, setActiva] = useState(true);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await temporadaService.getTemporadas();
      setItems(data);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando temporadas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!nombre.trim()) return toast.error('El nombre es obligatorio');
    if (!fechaInicio) return toast.error('Fecha inicio es obligatoria');
    if (!fechaFin) return toast.error('Fecha fin es obligatoria');
    setLoading(true);
    try {
      await temporadaService.createTemporada({
        nombre: nombre.trim(),
        fechaInicio,
        fechaFin,
        activa,
      });
      toast.success('Temporada creada');
      setNombre('');
      setFechaInicio('');
      setFechaFin('');
      setActiva(true);
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'Error creando temporada');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (t: Temporada, patch: Partial<Temporada>) => {
    setLoading(true);
    try {
      await temporadaService.updateTemporada(t.id, {
        nombre: patch.nombre ?? t.nombre,
        fechaInicio: patch.fechaInicio ?? t.fechaInicio,
        fechaFin: patch.fechaFin ?? t.fechaFin,
        activa: patch.activa ?? t.activa,
      });
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo actualizar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar temporada?')) return;
    setLoading(true);
    try {
      await temporadaService.deleteTemporada(id);
      toast.success('Temporada eliminada');
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo eliminar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarMonthIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Temporadas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Define temporadas para licencias y gestión deportiva.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Nueva temporada
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} sx={{ minWidth: 240 }} />
            <TextField
              label="Fecha inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Fecha fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel control={<Switch checked={activa} onChange={(e) => setActiva(e.target.checked)} />} label="Activa" />
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={loading}
              sx={{ borderRadius: '10px', background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)' }}
            >
              Crear
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Listado
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Inicio</TableCell>
                  <TableCell>Fin</TableCell>
                  <TableCell>Activa</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((t) => (
                  <TableRow key={t.id} hover>
                    <TableCell>{t.nombre}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="date"
                        value={(t.fechaInicio || '').slice(0, 10)}
                        onChange={(e) => handleToggle(t, { fechaInicio: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        disabled={loading}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="date"
                        value={(t.fechaFin || '').slice(0, 10)}
                        onChange={(e) => handleToggle(t, { fechaFin: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        disabled={loading}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch checked={t.activa} onChange={(e) => handleToggle(t, { activa: e.target.checked })} size="small" disabled={loading} />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDelete(t.id)} disabled={loading} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2" color="text.secondary">
                        No hay temporadas todavía.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TemporadasView;


