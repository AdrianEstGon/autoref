import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import { toast } from 'react-toastify';
import liquidacionesService from '../../services/LiquidacionesService';

const ComiteLiquidacionesView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [motivo, setMotivo] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await liquidacionesService.pendientes();
      setPendientes(res || []);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando pendientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openResolver = (x: any) => {
    setSelected(x);
    setMotivo('');
    setOpen(true);
  };

  const aprobar = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await liquidacionesService.resolver(selected.id, { aprobar: true });
      toast.success(res?.message || 'Aprobada');
      setOpen(false);
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo aprobar');
    } finally {
      setLoading(false);
    }
  };

  const rechazar = async () => {
    if (!selected) return;
    if (!motivo.trim()) return toast.error('Indica motivo de rechazo');
    setLoading(true);
    try {
      const res = await liquidacionesService.resolver(selected.id, { aprobar: false, motivoRechazo: motivo.trim() });
      toast.success(res?.message || 'Rechazada');
      setOpen(false);
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo rechazar');
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
            <GavelIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Liquidaciones (Comité)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Revisión y aprobación/rechazo de liquidaciones enviadas
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card sx={{ borderRadius: '16px' }}>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Árbitro</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell>Observaciones</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendientes.map((x) => (
                    <TableRow key={x.id} hover>
                      <TableCell>{x.arbitro?.nombre || x.arbitro?.email || '-'}</TableCell>
                      <TableCell>{x.fecha}</TableCell>
                      <TableCell>{x.tipo === 'PorDia' ? 'Por día' : 'Por partido'}</TableCell>
                      <TableCell align="right">{Number(x.total || 0).toFixed(2)} €</TableCell>
                      <TableCell>{x.observaciones || '-'}</TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="contained" onClick={() => openResolver(x)}>
                          Resolver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pendientes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary">
                          No hay liquidaciones pendientes.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Resolver liquidación</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {selected ? `${selected.arbitro?.nombre || selected.arbitro?.email} — ${selected.fecha} — ${Number(selected.total || 0).toFixed(2)} €` : ''}
          </Typography>
          <TextField label="Motivo rechazo (si rechazas)" value={motivo} onChange={(e) => setMotivo(e.target.value)} multiline minRows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Stack direction="row" spacing={1}>
            <Button onClick={rechazar} color="error" variant="outlined" disabled={loading}>
              Rechazar
            </Button>
            <Button onClick={aprobar} variant="contained" disabled={loading}>
              Aprobar
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComiteLiquidacionesView;


