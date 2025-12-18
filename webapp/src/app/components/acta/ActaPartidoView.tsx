import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
  Typography,
  Autocomplete,
  Chip,
  Stack,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import { toast } from 'react-toastify';
import actaService, { ActaIncidencia, ActaSet, ActaUpsert, RosterPersona } from '../../services/ActaPartidoService';

const emptyActa = (): ActaUpsert => ({
  participantesLocal: [],
  participantesVisitante: [],
  sets: [],
  incidencias: [],
  observaciones: '',
  resultadoLocal: null,
  resultadoVisitante: null,
});

const ActaPartidoView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dto, setDto] = useState<any>(null);
  const [acta, setActa] = useState<ActaUpsert>(emptyActa());
  const [openCerrar, setOpenCerrar] = useState(false);

  const cerrado = !!dto?.cerrado;

  const titulo = useMemo(() => {
    const p = dto?.partido;
    if (!p) return 'Acta';
    return `Acta — ${p.equipoLocal} vs ${p.equipoVisitante}`;
  }, [dto]);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await actaService.get(id);
      setDto(data);
      setActa(data.acta || emptyActa());
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo cargar el acta');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const rosterLocal: RosterPersona[] = dto?.rosterLocal || [];
  const rosterVisitante: RosterPersona[] = dto?.rosterVisitante || [];

  const setResumen = useMemo(() => {
    if (!acta.sets?.length) return null;
    let l = 0;
    let v = 0;
    acta.sets.forEach((s) => {
      if (s.local > s.visitante) l++;
      else if (s.visitante > s.local) v++;
    });
    return { l, v };
  }, [acta.sets]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const res = await actaService.save(id, acta);
      toast.success(res?.message || 'Acta guardada');
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleCerrar = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const res = await actaService.cerrar(id, acta);
      toast.success(res?.message || 'Partido cerrado');
      setOpenCerrar(false);
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo cerrar');
    } finally {
      setSaving(false);
    }
  };

  const addSet = () => setActa((p) => ({ ...p, sets: [...(p.sets || []), { local: 0, visitante: 0 } as ActaSet] }));
  const updateSet = (idx: number, patch: Partial<ActaSet>) =>
    setActa((p) => ({ ...p, sets: p.sets.map((s, i) => (i === idx ? { ...s, ...patch } : s)) }));
  const removeSet = (idx: number) => setActa((p) => ({ ...p, sets: p.sets.filter((_, i) => i !== idx) }));

  const addIncidencia = () =>
    setActa((p) => ({
      ...p,
      incidencias: [...(p.incidencias || []), { tipo: 'Incidencia', momento: '', descripcion: '' } as ActaIncidencia],
    }));
  const updateIncidencia = (idx: number, patch: Partial<ActaIncidencia>) =>
    setActa((p) => ({ ...p, incidencias: p.incidencias.map((x, i) => (i === idx ? { ...x, ...patch } : x)) }));
  const removeIncidencia = (idx: number) => setActa((p) => ({ ...p, incidencias: p.incidencias.filter((_, i) => i !== idx) }));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!dto) {
    return (
      <Box py={6}>
        <Typography color="text.secondary">No se pudo cargar el acta.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            <DescriptionIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              {titulo}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dto?.partido?.fecha} {dto?.partido?.hora} — {dto?.partido?.lugar || 'Sin lugar'}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Volver
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => window.open(actaService.informeUrl(dto.partidoId), '_blank')}
          >
            Imprimir
          </Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving || cerrado}>
            Guardar
          </Button>
          <Button
            color="error"
            variant="contained"
            startIcon={<LockIcon />}
            onClick={() => setOpenCerrar(true)}
            disabled={saving || cerrado}
          >
            Cerrar partido
          </Button>
        </Stack>
      </Box>

      {cerrado && (
        <Box sx={{ mb: 2 }}>
          <Chip label="Partido cerrado" color="success" />
        </Box>
      )}

      <Card sx={{ borderRadius: '16px', mb: 3 }}>
        <CardContent>
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Participantes
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Autocomplete
              multiple
              options={rosterLocal}
              getOptionLabel={(o) => `${o.apellidos}, ${o.nombre}`}
              value={rosterLocal.filter((r) => acta.participantesLocal.includes(r.personaId))}
              onChange={(_, vals) => setActa((p) => ({ ...p, participantesLocal: vals.map((v) => v.personaId) }))}
              renderInput={(params) => <TextField {...params} label="Participantes local" />}
              disabled={cerrado}
            />
            <Autocomplete
              multiple
              options={rosterVisitante}
              getOptionLabel={(o) => `${o.apellidos}, ${o.nombre}`}
              value={rosterVisitante.filter((r) => acta.participantesVisitante.includes(r.personaId))}
              onChange={(_, vals) => setActa((p) => ({ ...p, participantesVisitante: vals.map((v) => v.personaId) }))}
              renderInput={(params) => <TextField {...params} label="Participantes visitante" />}
              disabled={cerrado}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: '16px', mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography fontWeight={700}>Marcador / Sets</Typography>
            <Button variant="outlined" onClick={addSet} disabled={cerrado}>
              Añadir set
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />

          {acta.sets.length === 0 ? (
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <TextField
                label="Resultado local"
                type="number"
                value={acta.resultadoLocal ?? ''}
                onChange={(e) => setActa((p) => ({ ...p, resultadoLocal: e.target.value === '' ? null : Number(e.target.value) }))}
                disabled={cerrado}
              />
              <TextField
                label="Resultado visitante"
                type="number"
                value={acta.resultadoVisitante ?? ''}
                onChange={(e) => setActa((p) => ({ ...p, resultadoVisitante: e.target.value === '' ? null : Number(e.target.value) }))}
                disabled={cerrado}
              />
              <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                Si el deporte va por sets, añade sets. Si no, usa marcador final.
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1}>
              {acta.sets.map((s, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Chip label={`Set ${idx + 1}`} />
                  <TextField
                    label="Local"
                    type="number"
                    value={s.local}
                    onChange={(e) => updateSet(idx, { local: Number(e.target.value) })}
                    size="small"
                    disabled={cerrado}
                  />
                  <TextField
                    label="Visitante"
                    type="number"
                    value={s.visitante}
                    onChange={(e) => updateSet(idx, { visitante: Number(e.target.value) })}
                    size="small"
                    disabled={cerrado}
                  />
                  <Button color="error" variant="text" onClick={() => removeSet(idx)} disabled={cerrado}>
                    Quitar
                  </Button>
                </Box>
              ))}
              {setResumen && (
                <Typography variant="body2" color="text.secondary">
                  Resultado por sets: {setResumen.l} - {setResumen.v}
                </Typography>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: '16px', mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography fontWeight={700}>Incidencias</Typography>
            <Button variant="outlined" onClick={addIncidencia} disabled={cerrado}>
              Añadir incidencia
            </Button>
          </Box>
          <Divider sx={{ my: 2 }} />
          {acta.incidencias.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Sin incidencias.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {acta.incidencias.map((inc, idx) => (
                <Card key={idx} variant="outlined" sx={{ borderRadius: '12px' }}>
                  <CardContent sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                    <TextField
                      label="Tipo"
                      value={inc.tipo}
                      onChange={(e) => updateIncidencia(idx, { tipo: e.target.value })}
                      size="small"
                      disabled={cerrado}
                    />
                    <TextField
                      label="Momento"
                      value={inc.momento || ''}
                      onChange={(e) => updateIncidencia(idx, { momento: e.target.value })}
                      size="small"
                      disabled={cerrado}
                      placeholder="Ej: min 12 / set 2"
                    />
                    <TextField
                      label="Descripción"
                      value={inc.descripcion}
                      onChange={(e) => updateIncidencia(idx, { descripcion: e.target.value })}
                      size="small"
                      disabled={cerrado}
                      sx={{ minWidth: 320, flex: 1 }}
                    />
                    <Button color="error" variant="text" onClick={() => removeIncidencia(idx)} disabled={cerrado}>
                      Quitar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: '16px' }}>
        <CardContent>
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Observaciones
          </Typography>
          <TextField
            value={acta.observaciones || ''}
            onChange={(e) => setActa((p) => ({ ...p, observaciones: e.target.value }))}
            fullWidth
            multiline
            minRows={3}
            disabled={cerrado}
            placeholder="Observaciones del partido..."
          />
        </CardContent>
      </Card>

      <Dialog open={openCerrar} onClose={() => setOpenCerrar(false)}>
        <DialogTitle>Cerrar partido</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción bloquea la edición del acta para evitar errores. Confirma que el resultado es correcto.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCerrar(false)} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleCerrar} variant="contained" color="error" disabled={saving}>
            Confirmar cierre
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActaPartidoView;


