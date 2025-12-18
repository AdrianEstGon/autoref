import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { toast } from 'react-toastify';
import cambiosPartidoService from '../../services/CambioPartidoService';

const CambiosPartidosView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await cambiosPartidoService.pendientesValidacion();
      setItems(data || []);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando cambios pendientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const validar = async (id: string, aprobar: boolean) => {
    setLoading(true);
    try {
      const res = await cambiosPartidoService.validarFederacion(id, aprobar);
      toast.success(res?.message || (aprobar ? 'Validado' : 'Rechazado'));
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo validar');
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
            <SwapHorizIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Cambios de partido
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Solicitudes aceptadas por clubes pendientes de validación final por Federación.
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
                    <TableCell>Partido</TableCell>
                    <TableCell>Club Local</TableCell>
                    <TableCell>Club Visitante</TableCell>
                    <TableCell>Propuesta</TableCell>
                    <TableCell>Motivo</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((x) => (
                    <TableRow key={x.id} hover>
                      <TableCell>
                        <Typography fontWeight={700} variant="body2">
                          {x.local} vs {x.visitante}
                        </Typography>
                      </TableCell>
                      <TableCell>{x.clubLocal}</TableCell>
                      <TableCell>{x.clubVisitante}</TableCell>
                      <TableCell>
                        {x.fechaPropuesta} {x.horaPropuesta} {x.lugarPropuesto ? `— ${x.lugarPropuesto}` : ''}
                      </TableCell>
                      <TableCell>{x.motivo || '-'}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button size="small" variant="contained" disabled={loading} onClick={() => validar(x.id, true)}>
                            Aprobar
                          </Button>
                          <Button size="small" color="error" variant="outlined" disabled={loading} onClick={() => validar(x.id, false)}>
                            Rechazar
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary">
                          No hay solicitudes pendientes de validación.
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
    </Box>
  );
};

export default CambiosPartidosView;


