import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { toast } from 'react-toastify';
import liquidacionesService, { Liquidacion } from '../../services/LiquidacionesService';

const estadoChip = (estado: string) => {
  const map: Record<string, { label: string; color: any }> = {
    Borrador: { label: 'Borrador', color: 'default' },
    Enviada: { label: 'Enviada', color: 'warning' },
    Aprobada: { label: 'Aprobada', color: 'success' },
    Rechazada: { label: 'Rechazada', color: 'error' },
    IncluidaEnOrdenPago: { label: 'En orden de pago', color: 'info' },
    Pagada: { label: 'Pagada', color: 'success' },
  };
  const x = map[estado] || { label: estado, color: 'default' };
  return <Chip size="small" label={x.label} color={x.color} variant={x.color === 'default' ? 'outlined' : 'filled'} />;
};

const tipoConceptoOptions = [
  { value: 0, label: 'Arbitraje' },
  { value: 1, label: 'Desplazamiento' },
  { value: 2, label: 'Dieta' },
  { value: 3, label: 'Otro' },
];

const MisLiquidacionesView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Liquidacion[]>([]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Liquidacion | null>(null);

  const [fecha, setFecha] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [tipo, setTipo] = useState<number>(0);
  const [observaciones, setObservaciones] = useState('');
  const [items, setItems] = useState<Array<{ tipo: number; descripcion: string; cantidad: number; precioUnitario: number; km?: number | null }>>([
    { tipo: 0, descripcion: 'Arbitraje', cantidad: 1, precioUnitario: 0 },
  ]);

  const totalDraft = useMemo(() => {
    return items.reduce((acc, it) => acc + (Number(it.cantidad || 0) * Number(it.precioUnitario || 0)), 0);
  }, [items]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await liquidacionesService.getMis();
      setData(res || []);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando liquidaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setFecha(new Date().toISOString().slice(0, 10));
    setTipo(0);
    setObservaciones('');
    setItems([{ tipo: 0, descripcion: 'Arbitraje', cantidad: 1, precioUnitario: 0 }]);
  };

  const openNew = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (l: Liquidacion) => {
    setEditing(l);
    setFecha(l.fecha);
    setTipo(l.tipo === 'PorDia' ? 1 : 0);
    setObservaciones(l.observaciones || '');
    setItems(
      (l.items || []).map((it: any) => ({
        tipo: tipoConceptoOptions.find((o) => o.label === it.tipo)?.value ?? 3,
        descripcion: it.descripcion,
        cantidad: Number(it.cantidad),
        precioUnitario: Number(it.precioUnitario),
        km: it.km ?? null,
      }))
    );
    setOpen(true);
  };

  const save = async () => {
    if (!fecha) return toast.error('Fecha obligatoria');
    const clean = items.filter((i) => i.descripcion.trim().length > 0);
    if (clean.length === 0) return toast.error('Añade al menos un concepto');

    setLoading(true);
    try {
      if (!editing) {
        const res = await liquidacionesService.create({
          tipo,
          fecha,
          observaciones: observaciones || null,
          items: clean,
        });
        toast.success(res?.message || 'Creada');
      } else {
        const res = await liquidacionesService.update(editing.id, {
          tipo,
          fecha,
          observaciones: observaciones || null,
          items: clean,
        });
        toast.success(res?.message || 'Actualizada');
      }
      setOpen(false);
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  const enviar = async (id: string) => {
    setLoading(true);
    try {
      const res = await liquidacionesService.enviar(id);
      toast.success(res?.message || 'Enviada');
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo enviar');
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
            <ReceiptLongIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Mis liquidaciones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Crea y envía tus gastos (arbitraje, desplazamientos, dietas…)
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Button variant="contained" onClick={openNew} startIcon={<AddIcon />}>
            Nueva
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
                    <TableCell>Fecha</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Motivo (si rechazo)</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((l) => (
                    <TableRow key={l.id} hover>
                      <TableCell>{l.fecha}</TableCell>
                      <TableCell>{l.tipo === 'PorDia' ? 'Por día' : 'Por partido'}</TableCell>
                      <TableCell>{estadoChip(l.estado)}</TableCell>
                      <TableCell>{l.motivoRechazo || '-'}</TableCell>
                      <TableCell align="right">{Number(l.total || 0).toFixed(2)} €</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button size="small" variant="outlined" onClick={() => openEdit(l)} disabled={l.estado !== 'Borrador'}>
                            Editar
                          </Button>
                          <Button size="small" variant="contained" onClick={() => enviar(l.id)} disabled={l.estado !== 'Borrador'}>
                            Enviar
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary">
                          No tienes liquidaciones.
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
        <DialogTitle>{editing ? 'Editar liquidación' : 'Nueva liquidación'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField label="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField select label="Tipo" value={tipo} onChange={(e) => setTipo(Number(e.target.value))} SelectProps={{ native: true }}>
              <option value={0}>Por partido</option>
              <option value={1}>Por día</option>
            </TextField>
          </Box>

          <TextField label="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} multiline minRows={2} />

          <Typography fontWeight={700}>Conceptos</Typography>
          {items.map((it, idx) => (
            <Card key={idx} variant="outlined" sx={{ borderRadius: '12px' }}>
              <CardContent sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '160px 1fr 120px 140px 48px' }, gap: 1.5, alignItems: 'center' }}>
                <TextField
                  select
                  label="Tipo"
                  value={it.tipo}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...next[idx], tipo: Number(e.target.value) };
                    setItems(next);
                  }}
                  SelectProps={{ native: true }}
                >
                  {tipoConceptoOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </TextField>
                <TextField
                  label="Descripción"
                  value={it.descripcion}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...next[idx], descripcion: e.target.value };
                    setItems(next);
                  }}
                />
                <TextField
                  label="Cantidad"
                  type="number"
                  value={it.cantidad}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...next[idx], cantidad: Number(e.target.value) };
                    setItems(next);
                  }}
                  inputProps={{ step: '0.01' }}
                />
                <TextField
                  label="P. Unit (€)"
                  type="number"
                  value={it.precioUnitario}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...next[idx], precioUnitario: Number(e.target.value) };
                    setItems(next);
                  }}
                  inputProps={{ step: '0.01' }}
                />
                <IconButton
                  onClick={() => setItems(items.filter((_, i) => i !== idx))}
                  disabled={items.length === 1}
                  aria-label="Eliminar"
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}

          <Box>
            <Button
              variant="outlined"
              onClick={() => setItems([...items, { tipo: 3, descripcion: '', cantidad: 1, precioUnitario: 0 }])}
              startIcon={<AddIcon />}
            >
              Añadir concepto
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Total estimado: <strong>{totalDraft.toFixed(2)} €</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button onClick={save} variant="contained" disabled={loading}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MisLiquidacionesView;


