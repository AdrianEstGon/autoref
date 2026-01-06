import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DownloadIcon from '@mui/icons-material/Download';
import { toast } from 'react-toastify';
import equipoService from '../../services/EquipoService';
import competicionService, { Competicion } from '../../services/CompeticionService';
import inscripcionService, { Inscripcion } from '../../services/InscripcionService';
import documentoService from '../../services/DocumentoService';

type Equipo = { id: string; nombre: string; clubId: string; competicionId?: string | null; categoriaId: string };

const ClubInscripcionesView: React.FC = () => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [competiciones, setCompeticiones] = useState<Competicion[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(false);
  const [cupos, setCupos] = useState<{ jugadores: number; staff: number; minJugadores?: number | null; maxJugadores?: number | null } | null>(null);

  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    documento: '',
    fechaNacimiento: '',
    tipo: 1,
    equipoId: '',
    competicionId: '',
    mutuaSolicitada: true,
  });

  const tipoLabel = useMemo(() => ({ 1: 'Jugador', 2: 'Staff técnico (Entrenadores)', 3: 'Árbitro', 4: 'Staff' } as Record<number, string>), []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [misEquipos, comps, misIns] = await Promise.all([
        equipoService.getMisEquipos(form.competicionId || undefined),
        competicionService.getCompeticiones(),
        inscripcionService.getMisInscripciones(),
      ]);
      setEquipos(misEquipos);
      setCompeticiones(comps);
      setInscripciones(misIns);

      // Defaults
      if (!form.equipoId && misEquipos?.[0]?.id) setForm((p) => ({ ...p, equipoId: misEquipos[0].id }));
      if (!form.competicionId && comps?.[0]?.id) setForm((p) => ({ ...p, competicionId: comps[0].id }));
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar equipos cuando cambia la competición seleccionada (para que el selector de equipos sea por competición)
  useEffect(() => {
    const reloadEquipos = async () => {
      if (!form.competicionId) return;
      try {
        const misEquipos = await equipoService.getMisEquipos(form.competicionId);
        setEquipos(misEquipos);
        if (!misEquipos.find((e: any) => e.id === form.equipoId) && misEquipos?.[0]?.id) {
          setForm((p) => ({ ...p, equipoId: misEquipos[0].id }));
        }
      } catch {
        // silencioso
      }
    };
    reloadEquipos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.competicionId]);

  // Mostrar cupos del equipo seleccionado (jugadores / max) para ayudar al club
  useEffect(() => {
    const loadCupos = async () => {
      if (!form.equipoId || !form.competicionId) return setCupos(null);
      try {
        const data = await equipoService.getCuposEquipo(form.equipoId, form.competicionId);
        setCupos(data);
      } catch {
        setCupos(null);
      }
    };
    loadCupos();
  }, [form.equipoId, form.competicionId]);

  const handleCreate = async () => {
    if (!form.nombre || !form.apellidos || !form.documento || !form.fechaNacimiento || !form.equipoId || !form.competicionId) {
      toast.error('Completa todos los campos obligatorios');
      return;
    }
    try {
      await inscripcionService.createInscripcion({
        ...form,
        fechaNacimiento: form.fechaNacimiento,
        tipo: Number(form.tipo),
      });
      toast.success('Inscripción creada');
      setForm((p) => ({ ...p, nombre: '', apellidos: '', documento: '' }));
      await loadData();
    } catch (e: any) {
      toast.error(e?.message || 'Error creando inscripción');
    }
  };

  const handleToggleMutua = async (ins: Inscripcion, next: boolean) => {
    try {
      await inscripcionService.updateInscripcion(ins.id, { mutuaSolicitada: next });
      setInscripciones((prev) => prev.map((x) => (x.id === ins.id ? { ...x, mutuaSolicitada: next } : x)));
      toast.success('Actualizado');
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo actualizar');
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
            <HowToRegIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Inscripciones (Mutua)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Inscribe jugadores/staff y marca si se solicita Mutua
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Nueva inscripción
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Nombre" value={form.nombre} onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))} fullWidth />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Apellidos" value={form.apellidos} onChange={(e) => setForm((p) => ({ ...p, apellidos: e.target.value }))} fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Documento" value={form.documento} onChange={(e) => setForm((p) => ({ ...p, documento: e.target.value }))} fullWidth />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Fecha de nacimiento"
                type="date"
                value={form.fechaNacimiento}
                onChange={(e) => setForm((p) => ({ ...p, fechaNacimiento: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select value={form.tipo} label="Tipo" onChange={(e) => setForm((p) => ({ ...p, tipo: Number(e.target.value) }))}>
                  <MenuItem value={1}>Jugador</MenuItem>
                  <MenuItem value={2}>Staff técnico (Entrenadores)</MenuItem>
                  <MenuItem value={3}>Árbitro</MenuItem>
                  <MenuItem value={4}>Staff</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Equipo</InputLabel>
                <Select value={form.equipoId} label="Equipo" onChange={(e) => setForm((p) => ({ ...p, equipoId: String(e.target.value) }))}>
                  {equipos.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {cupos && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  Jugadores: {cupos.jugadores}
                  {cupos.maxJugadores ? ` / ${cupos.maxJugadores}` : ''} · Staff: {cupos.staff}
                  {cupos.minJugadores ? ` · Min jugadores: ${cupos.minJugadores}` : ''}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Competición</InputLabel>
                <Select value={form.competicionId} label="Competición" onChange={(e) => setForm((p) => ({ ...p, competicionId: String(e.target.value) }))}>
                  {competiciones.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.nombre} {c.esFederada ? '(Federada)' : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={<Switch checked={form.mutuaSolicitada} onChange={(e) => setForm((p) => ({ ...p, mutuaSolicitada: e.target.checked }))} />}
                label="Solicitar Mutua (Sí/No)"
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
              <Button
                variant="contained"
                onClick={handleCreate}
                disabled={loading}
                sx={{
                  borderRadius: '10px',
                  px: 3,
                  background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)',
                }}
              >
                Crear inscripción
              </Button>
            </Grid>
          </Grid>
          {equipos.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No tienes equipos creados para tu club. Pide a Federación que cree equipos/categorías o crea equipos desde el panel de Federación.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Personas inscritas
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Persona</TableCell>
                  <TableCell>Documento</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Equipo</TableCell>
                  <TableCell>Competición</TableCell>
                  <TableCell>Mutua</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Docs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inscripciones.map((i) => (
                  <TableRow key={i.id} hover>
                    <TableCell>{i.persona.nombre} {i.persona.apellidos}</TableCell>
                    <TableCell>{i.persona.documento}</TableCell>
                    <TableCell>{tipoLabel[i.persona.tipo] || i.persona.tipo}</TableCell>
                    <TableCell>
                      {i.equipo.nombre}
                      <Typography variant="caption" color="text.secondary" display="block">
                        {i.equipo.categoria}
                      </Typography>
                    </TableCell>
                    <TableCell>{i.competicion.nombre}</TableCell>
                    <TableCell>
                      <Switch
                        checked={i.mutuaSolicitada}
                        onChange={(e) => handleToggleMutua(i, e.target.checked)}
                        disabled={i.persona.mutuaEnviada}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {i.persona.mutuaEnviada ? (
                        <Chip label="Enviado a mutua" size="small" sx={{ bgcolor: '#E8F4FA', color: '#2C5F8D' }} />
                      ) : i.mutuaSolicitada ? (
                        <Chip label="Pendiente de envío" size="small" sx={{ bgcolor: '#F0F6FA', color: '#5B7C99' }} />
                      ) : (
                        <Chip label="No solicitado" size="small" sx={{ bgcolor: '#E8ECEF', color: '#64748B' }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={async () => {
                          try {
                            await documentoService.descargarAutorizacionExcel(i.id);
                          } catch (e: any) {
                            toast.error(e?.message || 'No se pudo descargar la autorización');
                          }
                        }}
                        title="Descargar autorización (Excel)"
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {inscripciones.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Typography variant="body2" color="text.secondary">
                        Todavía no hay inscripciones.
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

export default ClubInscripcionesView;


