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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import { toast } from 'react-toastify';
import temporadaService, { Temporada } from '../../services/TemporadaService';
import modalidadService, { Modalidad } from '../../services/ModalidadService';
import categoriaService from '../../services/CategoriaService';
import inscripcionService, { Inscripcion } from '../../services/InscripcionService';
import licenciaService from '../../services/LicenciaService';

const estadoChip = (estado?: string, activa?: boolean) => {
  if (estado === 'Validada' && activa) return <Chip size="small" color="success" label="Validada" />;
  if (estado === 'Rechazada') return <Chip size="small" color="error" label="Rechazada" />;
  if (estado === 'Pendiente') return <Chip size="small" color="warning" label="Pendiente" />;
  return <Chip size="small" variant="outlined" label={activa ? 'Activa' : 'Sin licencia'} />;
};

const LicenciasClubView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([]);

  const [temporadaId, setTemporadaId] = useState<string>('');
  const [modalidadId, setModalidadId] = useState<string>('');

  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [licencias, setLicencias] = useState<any[]>([]);

  const [openSolicitar, setOpenSolicitar] = useState(false);
  const [personaSel, setPersonaSel] = useState<any | null>(null);
  const [categoriaBaseId, setCategoriaBaseId] = useState<string | null>(null);
  const [observaciones, setObservaciones] = useState<string>('');

  const personasUnicas = useMemo(() => {
    const map = new Map<string, any>();
    inscripciones.forEach((i) => {
      map.set(i.persona.id, {
        ...i.persona,
        equipo: i.equipo,
        competicion: i.competicion,
      });
    });
    return Array.from(map.values()).sort((a, b) => `${a.apellidos} ${a.nombre}`.localeCompare(`${b.apellidos} ${b.nombre}`));
  }, [inscripciones]);

  const loadBase = async () => {
    setLoading(true);
    try {
      const [temps, mods, cats, ins] = await Promise.all([
        temporadaService.getTemporadas(),
        modalidadService.getModalidades(),
        categoriaService.getCategorias(),
        inscripcionService.getMisInscripciones(),
      ]);
      setTemporadas(temps || []);
      setModalidades(mods || []);
      setCategorias((cats || []).map((c: any) => ({ id: c.id, nombre: c.nombre })));
      setInscripciones(ins || []);

      if (!temporadaId && temps?.[0]?.id) setTemporadaId(temps[0].id);
      if (!modalidadId && mods?.[0]?.id) setModalidadId(mods[0].id);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  const loadLicencias = async () => {
    if (!temporadaId || !modalidadId) return;
    setLoading(true);
    try {
      const data = await licenciaService.getMisSolicitudes(temporadaId, modalidadId);
      setLicencias(data || []);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando licencias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBase();
  }, []);

  useEffect(() => {
    if (temporadaId && modalidadId) loadLicencias();
  }, [temporadaId, modalidadId]);

  const licenciaByPersona = useMemo(() => {
    const m = new Map<string, any>();
    (licencias || []).forEach((l) => m.set(l.personaId, l));
    return m;
  }, [licencias]);

  const openSolicitarDialog = (persona: any) => {
    setPersonaSel(persona);
    // sugerencia: categoría base = categoría del equipo si la encontramos por nombre
    const cat = categorias.find((c) => c.nombre === persona?.equipo?.categoria);
    setCategoriaBaseId(cat?.id || null);
    setObservaciones('');
    setOpenSolicitar(true);
  };

  const solicitar = async () => {
    if (!personaSel) return;
    if (!temporadaId || !modalidadId) return toast.error('Selecciona temporada y modalidad');
    setLoading(true);
    try {
      const res = await licenciaService.solicitarLicencia({
        personaId: personaSel.id,
        temporadaId,
        modalidadId,
        categoriaBaseId: categoriaBaseId || null,
        observaciones: observaciones || null,
      });
      toast.success(res?.message || 'Solicitud enviada');
      setOpenSolicitar(false);
      await loadLicencias();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo solicitar');
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
            <BadgeIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Licencias
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Solicita licencias para tus jugadores/técnicos y consulta su estado.
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
                    <TableCell>Equipo</TableCell>
                    <TableCell>Competición</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Motivo (si rechazo)</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {personasUnicas.map((p) => {
                    const lic = licenciaByPersona.get(p.id);
                    return (
                      <TableRow key={p.id} hover>
                        <TableCell>
                          <Typography fontWeight={700} variant="body2">
                            {p.apellidos}, {p.nombre}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {p.documento}
                          </Typography>
                        </TableCell>
                        <TableCell>{p.equipo?.nombre || '-'}</TableCell>
                        <TableCell>{p.competicion?.nombre || '-'}</TableCell>
                        <TableCell>{estadoChip(lic?.estado, lic?.activa)}</TableCell>
                        <TableCell>{lic?.motivoRechazo || '-'}</TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="outlined" onClick={() => openSolicitarDialog(p)} disabled={lic?.estado === 'Pendiente'}>
                            Solicitar / Reenviar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {personasUnicas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary">
                          No hay personas inscritas en tus equipos.
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

      <Dialog open={openSolicitar} onClose={() => setOpenSolicitar(false)} fullWidth maxWidth="sm">
        <DialogTitle>Solicitar licencia</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {personaSel ? `${personaSel.apellidos}, ${personaSel.nombre} — ${personaSel.documento}` : ''}
          </Typography>
          <Autocomplete
            options={categorias}
            getOptionLabel={(o) => o.nombre}
            value={categorias.find((c) => c.id === categoriaBaseId) || null}
            onChange={(_, v) => setCategoriaBaseId(v?.id || null)}
            renderInput={(params) => <TextField {...params} label="Categoría base" />}
          />
          <TextField label="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} multiline minRows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSolicitar(false)} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button onClick={solicitar} variant="contained" disabled={loading}>
            Enviar solicitud
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LicenciasClubView;


