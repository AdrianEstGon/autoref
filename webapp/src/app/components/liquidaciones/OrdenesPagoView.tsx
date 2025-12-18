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
  TextField,
  Stack,
} from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import DownloadIcon from '@mui/icons-material/Download';
import { toast } from 'react-toastify';
import ordenesPagoService, { OrdenPago } from '../../services/OrdenesPagoService';

const OrdenesPagoView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [ordenes, setOrdenes] = useState<OrdenPago[]>([]);
  const [desde, setDesde] = useState<string>(() => new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10));
  const [hasta, setHasta] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [referencia, setReferencia] = useState<string>('Liquidaciones AutoRef');

  const load = async () => {
    setLoading(true);
    try {
      const res = await ordenesPagoService.getOrdenes();
      setOrdenes(res || []);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando órdenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const generar = async () => {
    if (!desde || !hasta) return toast.error('Indica periodo');
    setLoading(true);
    try {
      const res = await ordenesPagoService.generar({ periodoDesde: desde, periodoHasta: hasta, referencia: referencia || null });
      toast.success(res?.message || 'Generada');
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'No se pudo generar');
    } finally {
      setLoading(false);
    }
  };

  const exportar = async (id: string) => {
    setLoading(true);
    try {
      await ordenesPagoService.exportSepa(id);
      toast.success('SEPA generado');
      await load();
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'No se pudo exportar';
      toast.error(msg);
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
            <PaymentsIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Órdenes de pago
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generación periódica y exportación SEPA (remesa bancaria)
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card sx={{ borderRadius: '16px', mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <TextField label="Desde" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField label="Hasta" type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField label="Referencia" value={referencia} onChange={(e) => setReferencia(e.target.value)} sx={{ flex: 1 }} />
            <Button variant="contained" onClick={generar} disabled={loading}>
              Generar orden
            </Button>
          </Stack>
        </CardContent>
      </Card>

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
                    <TableCell>Estado</TableCell>
                    <TableCell>Periodo</TableCell>
                    <TableCell>Referencia</TableCell>
                    <TableCell align="right">Liquidaciones</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ordenes.map((o) => (
                    <TableRow key={o.id} hover>
                      <TableCell>{o.estado}</TableCell>
                      <TableCell>
                        {String(o.periodoDesde).slice(0, 10)} → {String(o.periodoHasta).slice(0, 10)}
                      </TableCell>
                      <TableCell>{o.referencia || '-'}</TableCell>
                      <TableCell align="right">{o.totalLiquidaciones}</TableCell>
                      <TableCell align="right">{Number(o.total || 0).toFixed(2)} €</TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={() => exportar(o.id)}>
                          SEPA
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {ordenes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary">
                          No hay órdenes de pago.
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

export default OrdenesPagoView;


