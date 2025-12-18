import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import { toast } from 'react-toastify';
import temporadaService, { Temporada } from '../../services/TemporadaService';
import modalidadService, { Modalidad } from '../../services/ModalidadService';
import clubService from '../../services/ClubService';
import licenciaService from '../../services/LicenciaService';

const LicenciasFederacionView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [temporadaId, setTemporadaId] = useState<string>('');
  const [modalidadId, setModalidadId] = useState<string>('');

  const [pendientes, setPendientes] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [numeroLicencia, setNumeroLicencia] = useState('');
  const [motivoRechazo, setMotivoRechazo] = useState('');

  const clubsById = useMemo(() => {
    const m = new Map<string, any>();
    (clubs || []).forEach((c: any) => m.set(c.id, c));
    return m;
  }, [clubs]);

  const loadBase = async () => {
    setLoading(true);
    try {
      const [temps, mods, cls] = await Promise.all([
        temporadaService.getTemporadas(),
        modalidadService.getModalidades(),
        clubService.getClubs(),
      ]);
      setTemporadas(temps || []);
      setModalidades(mods || []);
      setClubs(cls || []);
      if (!temporadaId && temps?.[0]?.id) setTemporadaId(temps[0].id);
      if (!modalidadId && mods?.[0]?.id) setModalidadId(mods[0].id);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const loadPendientes = async () => {
    if (!temporadaId || !modalidadId) return;
    setLoading(true);
    try {
      const data = await licenciaService.getPendientes(temporadaId, modalidadId);
      setPendientes(data || []);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBase();
  }, []);

  useEffect(() => {
    if (temporadaId && modalidadId) loadPendientes();
  }, [temporadaId, modalidadId]);

  const openValidar = (x: any) => {
    setSelected(x);
    setNumeroLicencia('');
    setMotivoRechazo('');
    setOpen(true);
  };

  const aprobar = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const res = await licenciaService.validarLicencia(selected.id, { aprobar: true, numeroLicencia: numeroLicencia || null });
      toast.success(res?.message || 'Licencia validada');
      setOpen(false);
      await loadPendientes();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo validar');
    } finally {
      setLoading(false);
    }
  };

  const rechazar = async () => {
    if (!selected) return;
    if (!motivoRechazo.trim()) return toast.error('Indica motivo de rechazo');
    setLoading(true);
    try {
      const res = await licenciaService.validarLicencia(selected.id, { aprobar: false, motivoRechazo: motivoRechazo.trim() });
      toast.success(res?.message || 'Licencia rechazada');
      setOpen(false);
      await loadPendientes();
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
            <VerifiedIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Validación de licencias
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Revisa solicitudes de clubes y valida/rechaza según normativa.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card sx={{ borderRadius: '16px', mb: 3 }}>
        <CardContent sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          <TextField
            select
            label="Temporada"
            value={temporadaId}
            onChange={(e) => setTemporadaId(e.target.value)}
            SelectProps={{ native: true }}
          >
            {temporadas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </TextField>
          <TextField
            select
            label="Modalidad"
            value={modalidadId}
            onChange={(e) => setModalidadId(e.target.value)}
            SelectProps={{ native: true }}
          >
            {modalidades.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </TextField>
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
                    <TableCell>Persona</TableCell>
                    <TableCell>Club</TableCell>
                    <TableCell>Categoría base</TableCell>
                    <TableCell>Observaciones</TableCell>
                    <TableCell>Fecha solicitud</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendientes.map((x) => (
                    <TableRow key={x.id} hover>
                      <TableCell>
                        <Typography fontWeight={700} variant="body2">
                          {x.persona?.apellidos}, {x.persona?.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {x.persona?.documento}
                        </Typography>
                      </TableCell>
                      <TableCell>{x.clubSolicitanteId ? (clubsById.get(x.clubSolicitanteId)?.nombre || x.clubSolicitanteId) : '-'}</TableCell>
                      <TableCell>{x.categoriaBase?.nombre || '-'}</TableCell>
                      <TableCell>{x.observaciones || '-'}</TableCell>
                      <TableCell>{x.fechaSolicitudUtc ? String(x.fechaSolicitudUtc).replace('T', ' ').slice(0, 16) : '-'}</TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="contained" onClick={() => openValidar(x)}>
                          Revisar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pendientes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary">
                          No hay solicitudes pendientes.
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
        <DialogTitle>Validar licencia</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {selected ? `${selected.persona?.apellidos}, ${selected.persona?.nombre} — ${selected.persona?.documento}` : ''}
          </Typography>
          <TextField label="Número de licencia (opcional)" value={numeroLicencia} onChange={(e) => setNumeroLicencia(e.target.value)} />
          <TextField label="Motivo rechazo (si rechazas)" value={motivoRechazo} onChange={(e) => setMotivoRechazo(e.target.value)} multiline minRows={2} />
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

export default LicenciasFederacionView;


