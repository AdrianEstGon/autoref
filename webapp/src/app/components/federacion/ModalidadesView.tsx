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
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import modalidadService, { Modalidad } from '../../services/ModalidadService';

const ModalidadesView: React.FC = () => {
  const [items, setItems] = useState<Modalidad[]>([]);
  const [nombre, setNombre] = useState('');
  const [activa, setActiva] = useState(true);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await modalidadService.getModalidades();
      setItems(data);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando modalidades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!nombre.trim()) return toast.error('El nombre es obligatorio');
    setLoading(true);
    try {
      await modalidadService.createModalidad({ nombre: nombre.trim(), activa });
      toast.success('Modalidad creada');
      setNombre('');
      setActiva(true);
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'Error creando modalidad');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (m: Modalidad, patch: Partial<Modalidad>) => {
    setLoading(true);
    try {
      await modalidadService.updateModalidad(m.id, {
        nombre: patch.nombre ?? m.nombre,
        activa: patch.activa ?? m.activa,
      });
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo actualizar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar modalidad?')) return;
    setLoading(true);
    try {
      await modalidadService.deleteModalidad(id);
      toast.success('Modalidad eliminada');
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
            <SportsVolleyballIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Modalidades
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Si el deporte tiene varias modalidades, configúralas aquí.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Nueva modalidad
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} sx={{ minWidth: 280 }} />
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
                  <TableCell>Activa</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((m) => (
                  <TableRow key={m.id} hover>
                    <TableCell>
                      <TextField
                        size="small"
                        value={m.nombre}
                        onChange={(e) => handleToggle(m, { nombre: e.target.value })}
                        disabled={loading}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch checked={m.activa} onChange={(e) => handleToggle(m, { activa: e.target.checked })} size="small" disabled={loading} />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDelete(m.id)} disabled={loading} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="body2" color="text.secondary">
                        No hay modalidades todavía.
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

export default ModalidadesView;


