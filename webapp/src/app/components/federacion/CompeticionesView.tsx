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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import competicionService, { Competicion } from '../../services/CompeticionService';

const CompeticionesView: React.FC = () => {
  const [items, setItems] = useState<Competicion[]>([]);
  const [nombre, setNombre] = useState('');
  const [esFederada, setEsFederada] = useState(false);
  const [activa, setActiva] = useState(true);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await competicionService.getCompeticiones();
      setItems(data);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando competiciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!nombre.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }
    setLoading(true);
    try {
      await competicionService.createCompeticion({ nombre: nombre.trim(), esFederada, activa });
      toast.success('Competición creada');
      setNombre('');
      setEsFederada(false);
      setActiva(true);
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'Error creando competición');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (c: Competicion, patch: Partial<Competicion>) => {
    setLoading(true);
    try {
      await competicionService.updateCompeticion(c.id, {
        nombre: patch.nombre ?? c.nombre,
        esFederada: patch.esFederada ?? c.esFederada,
        activa: patch.activa ?? c.activa,
      });
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo actualizar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar competición?')) return;
    setLoading(true);
    try {
      await competicionService.deleteCompeticion(id);
      toast.success('Competición eliminada');
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
            <EmojiEventsIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Competiciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Crea competiciones y marca si son federadas (afecta al check por defecto de Mutua)
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Nueva competición
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              sx={{ minWidth: 280 }}
            />
            <FormControlLabel control={<Switch checked={esFederada} onChange={(e) => setEsFederada(e.target.checked)} />} label="Federada" />
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
                  <TableCell>Federada</TableCell>
                  <TableCell>Activa</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.nombre}</TableCell>
                    <TableCell>
                      <Switch
                        checked={c.esFederada}
                        onChange={(e) => handleToggle(c, { esFederada: e.target.checked })}
                        size="small"
                        disabled={loading}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={c.activa}
                        onChange={(e) => handleToggle(c, { activa: e.target.checked })}
                        size="small"
                        disabled={loading}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleDelete(c.id)} disabled={loading} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography variant="body2" color="text.secondary">
                        No hay competiciones todavía.
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

export default CompeticionesView;


