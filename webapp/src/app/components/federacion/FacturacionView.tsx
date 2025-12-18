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
  IconButton,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import { toast } from 'react-toastify';
import clubService from '../../services/ClubService';
import facturasService, { Factura } from '../../services/FacturasService';

const FacturacionView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  const [clubId, setClubId] = useState<string>('');
  const [fechaEmision, setFechaEmision] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [fechaVencimiento, setFechaVencimiento] = useState<string>(() => new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().slice(0, 10));
  const [observaciones, setObservaciones] = useState<string>('');
  const [lineas, setLineas] = useState<Array<{ concepto: string; cantidad: number; precioUnitario: number; ivaPorcentaje: number }>>([
    { concepto: 'Cuota', cantidad: 1, precioUnitario: 0, ivaPorcentaje: 0 },
  ]);

  const load = async () => {
    setLoading(true);
    try {
      const [f, c] = await Promise.all([facturasService.getFacturas(), clubService.getClubs()]);
      setFacturas(f || []);
      setClubs(c || []);
      if (!clubId && c?.[0]?.id) setClubId(c[0].id);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando facturación');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setClubId(clubs?.[0]?.id || '');
    setFechaEmision(new Date().toISOString().slice(0, 10));
    setFechaVencimiento(new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().slice(0, 10));
    setObservaciones('');
    setLineas([{ concepto: 'Cuota', cantidad: 1, precioUnitario: 0, ivaPorcentaje: 0 }]);
    setOpen(true);
  };

  const crear = async () => {
    if (!clubId) return toast.error('Selecciona club');
    if (!fechaEmision || !fechaVencimiento) return toast.error('Fechas obligatorias');
    const clean = lineas.filter((l) => l.concepto.trim().length > 0);
    if (clean.length === 0) return toast.error('Añade al menos una línea');

    setLoading(true);
    try {
      const res = await facturasService.createFactura({
        clubId,
        fechaEmision,
        fechaVencimiento,
        observaciones: observaciones || null,
        lineas: clean,
      });
      toast.success(res?.message || 'Factura creada');
      setOpen(false);
      await load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'No se pudo crear');
    } finally {
      setLoading(false);
    }
  };

  const marcarPagada = async (id: string) => {
    setLoading(true);
    try {
      const res = await facturasService.marcarPagada(id);
      toast.success(res?.message || 'Marcada como pagada');
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo marcar');
    } finally {
      setLoading(false);
    }
  };

  const imprimir = async (id: string) => {
    try {
      await facturasService.abrirHtml(id);
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo abrir');
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
            <ReceiptIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Facturación
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Facturas a clubes y gestión de estados
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" startIcon={<AddIcon />} onClick={openNew}>
            Nueva factura
          </Button>
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
                    <TableCell>Nº</TableCell>
                    <TableCell>Club</TableCell>
                    <TableCell>Emisión</TableCell>
                    <TableCell>Venc.</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facturas.map((f) => (
                    <TableRow key={f.id} hover>
                      <TableCell>{f.numero}</TableCell>
                      <TableCell>{f.club?.nombre || '-'}</TableCell>
                      <TableCell>{String(f.fechaEmision).slice(0, 10)}</TableCell>
                      <TableCell>{String(f.fechaVencimiento).slice(0, 10)}</TableCell>
                      <TableCell>{f.estado}</TableCell>
                      <TableCell align="right">{Number(f.total || 0).toFixed(2)} €</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button size="small" variant="outlined" startIcon={<PrintIcon />} onClick={() => imprimir(f.id)}>
                            Imprimir
                          </Button>
                          <Button size="small" variant="contained" onClick={() => marcarPagada(f.id)} disabled={f.estado === 'Pagada'}>
                            Marcar pagada
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {facturas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Typography variant="body2" color="text.secondary">
                          No hay facturas.
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

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Nueva factura</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
            <TextField select label="Club" value={clubId} onChange={(e) => setClubId(e.target.value)} SelectProps={{ native: true }}>
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </TextField>
            <TextField label="Fecha emisión" type="date" value={fechaEmision} onChange={(e) => setFechaEmision(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField label="Vencimiento" type="date" value={fechaVencimiento} onChange={(e) => setFechaVencimiento(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Box>

          <TextField label="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} multiline minRows={2} />

          <Typography fontWeight={700}>Líneas</Typography>
          {lineas.map((l, idx) => (
            <Card key={idx} variant="outlined" sx={{ borderRadius: '12px' }}>
              <CardContent sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 140px 160px 140px 48px' }, gap: 1.5, alignItems: 'center' }}>
                <TextField
                  label="Concepto"
                  value={l.concepto}
                  onChange={(e) => {
                    const next = [...lineas];
                    next[idx] = { ...next[idx], concepto: e.target.value };
                    setLineas(next);
                  }}
                />
                <TextField
                  label="Cantidad"
                  type="number"
                  value={l.cantidad}
                  onChange={(e) => {
                    const next = [...lineas];
                    next[idx] = { ...next[idx], cantidad: Number(e.target.value) };
                    setLineas(next);
                  }}
                  inputProps={{ step: '0.01' }}
                />
                <TextField
                  label="P. Unit (€)"
                  type="number"
                  value={l.precioUnitario}
                  onChange={(e) => {
                    const next = [...lineas];
                    next[idx] = { ...next[idx], precioUnitario: Number(e.target.value) };
                    setLineas(next);
                  }}
                  inputProps={{ step: '0.01' }}
                />
                <TextField
                  label="IVA %"
                  type="number"
                  value={l.ivaPorcentaje}
                  onChange={(e) => {
                    const next = [...lineas];
                    next[idx] = { ...next[idx], ivaPorcentaje: Number(e.target.value) };
                    setLineas(next);
                  }}
                  inputProps={{ step: '0.01' }}
                />
                <IconButton onClick={() => setLineas(lineas.filter((_, i) => i !== idx))} disabled={lineas.length === 1} aria-label="Eliminar">
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}

          <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setLineas([...lineas, { concepto: '', cantidad: 1, precioUnitario: 0, ivaPorcentaje: 0 }])}>
            Añadir línea
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button onClick={crear} variant="contained" disabled={loading}>
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FacturacionView;


