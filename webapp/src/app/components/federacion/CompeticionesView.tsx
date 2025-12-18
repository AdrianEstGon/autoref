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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { toast } from 'react-toastify';
import competicionService, { Competicion } from '../../services/CompeticionService';
import temporadaService, { Temporada } from '../../services/TemporadaService';
import modalidadService, { Modalidad } from '../../services/ModalidadService';
import categoriaService from '../../services/CategoriaService';
import competicionConfigService, { CompeticionCategoriaConfig, CompeticionReglas } from '../../services/CompeticionConfigService';

const CompeticionesView: React.FC = () => {
  const [items, setItems] = useState<Competicion[]>([]);
  const [nombre, setNombre] = useState('');
  const [esFederada, setEsFederada] = useState(false);
  const [activa, setActiva] = useState(true);
  const [loading, setLoading] = useState(false);
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [categorias, setCategorias] = useState<{ id: string; nombre: string }[]>([]);

  const [temporadaId, setTemporadaId] = useState<string>('');
  const [modalidadId, setModalidadId] = useState<string>('');

  const [openConfig, setOpenConfig] = useState(false);
  const [selectedComp, setSelectedComp] = useState<Competicion | null>(null);
  const [tab, setTab] = useState(0);

  const [catConfig, setCatConfig] = useState<Record<string, CompeticionCategoriaConfig>>({});
  const [reglas, setReglasState] = useState<CompeticionReglas>({ puntosVictoria: 3, puntosEmpate: 1, puntosDerrota: 0, ordenDesempate: ['Puntos', 'Diferencia', 'EnfrentamientoDirecto'] });

  const [genCategoriaId, setGenCategoriaId] = useState<string>('');
  const [genFechaInicio, setGenFechaInicio] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [genDias, setGenDias] = useState<number>(7);
  const [genHora, setGenHora] = useState<string>('10:00');
  const [genDoble, setGenDoble] = useState<boolean>(false);

  const load = async () => {
    setLoading(true);
    try {
      const [data, temps, mods, cats] = await Promise.all([
        competicionService.getCompeticiones(),
        temporadaService.getTemporadas(),
        modalidadService.getModalidades(),
        categoriaService.getCategorias(),
      ]);
      setItems(data);
      setTemporadas(temps);
      setModalidades(mods);
      setCategorias((cats || []).map((c: any) => ({ id: c.id, nombre: c.nombre })));

      if (!temporadaId && temps?.[0]?.id) setTemporadaId(temps[0].id);
      if (modalidadId === '' && mods?.[0]?.id) setModalidadId(''); // por defecto, modalidad opcional
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
    if (!temporadaId) {
      toast.error('Selecciona una temporada');
      return;
    }
    setLoading(true);
    try {
      await competicionService.createCompeticion({ nombre: nombre.trim(), esFederada, activa, temporadaId, modalidadId: modalidadId || null });
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
        temporadaId: patch.temporadaId ?? c.temporadaId ?? temporadaId,
        modalidadId: patch.modalidadId ?? c.modalidadId ?? null,
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

  const openConfigDialog = async (c: Competicion) => {
    setSelectedComp(c);
    setOpenConfig(true);
    setTab(0);
    setLoading(true);
    try {
      const [cfg, r] = await Promise.all([
        competicionConfigService.getCategoriasConfig(c.id),
        competicionConfigService.getReglas(c.id),
      ]);
      const map: Record<string, CompeticionCategoriaConfig> = {};
      (cfg || []).forEach((x: any) => {
        map[x.categoriaId] = {
          categoriaId: x.categoriaId,
          categoriaNombre: x.categoriaNombre,
          activa: !!x.activa,
          inscripcionDesde: x.inscripcionDesde ? String(x.inscripcionDesde).slice(0, 10) : null,
          inscripcionHasta: x.inscripcionHasta ? String(x.inscripcionHasta).slice(0, 10) : null,
          cuota: x.cuota ?? null,
          horarioLocalDesde: x.horarioLocalDesde ? String(x.horarioLocalDesde).slice(0, 10) : null,
          horarioLocalHasta: x.horarioLocalHasta ? String(x.horarioLocalHasta).slice(0, 10) : null,
        };
      });
      setCatConfig(map);
      setReglasState(r);
      // Defaults calendario: primera categoría configurada
      const firstCat = Object.keys(map)[0] || '';
      setGenCategoriaId(firstCat);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando configuración');
    } finally {
      setLoading(false);
    }
  };

  const saveCategorias = async () => {
    if (!selectedComp) return;
    setLoading(true);
    try {
      await competicionConfigService.setCategoriasConfig(selectedComp.id, Object.values(catConfig));
      toast.success('Categorías configuradas');
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  const saveReglas = async () => {
    if (!selectedComp) return;
    setLoading(true);
    try {
      await competicionConfigService.setReglas(selectedComp.id, reglas);
      toast.success('Reglas guardadas');
    } catch (e: any) {
      toast.error(e?.message || 'No se pudieron guardar reglas');
    } finally {
      setLoading(false);
    }
  };

  const doGenerar = async () => {
    if (!selectedComp) return;
    if (!genCategoriaId) return toast.error('Selecciona categoría');
    if (!genFechaInicio) return toast.error('Fecha inicio obligatoria');
    setLoading(true);
    try {
      const res = await competicionConfigService.generarCalendario(selectedComp.id, {
        categoriaId: genCategoriaId,
        fechaInicio: genFechaInicio,
        diasEntreJornadas: genDias,
        hora: genHora,
        dobleVuelta: genDoble,
      });
      toast.success(res?.message || 'Calendario generado');
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo generar calendario');
    } finally {
      setLoading(false);
    }
  };

  const temporadaName = (id?: string | null) => temporadas.find((t) => t.id === id)?.nombre || '-';
  const modalidadName = (id?: string | null) => modalidades.find((m) => m.id === id)?.nombre || '-';

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
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel>Temporada</InputLabel>
              <Select value={temporadaId} label="Temporada" onChange={(e) => setTemporadaId(String(e.target.value))}>
                {temporadas.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.nombre} {t.activa ? '' : '(inactiva)'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel>Modalidad (opcional)</InputLabel>
              <Select value={modalidadId} label="Modalidad (opcional)" onChange={(e) => setModalidadId(String(e.target.value))}>
                <MenuItem value="">
                  <em>(sin modalidad)</em>
                </MenuItem>
                {modalidades.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.nombre} {m.activa ? '' : '(inactiva)'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          {temporadas.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No hay temporadas creadas. Crea una en el menú “Temporadas” para poder crear competiciones.
            </Typography>
          )}
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
                  <TableCell>Temporada</TableCell>
                  <TableCell>Modalidad</TableCell>
                  <TableCell>Federada</TableCell>
                  <TableCell>Activa</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.nombre}</TableCell>
                    <TableCell>{temporadaName(c.temporadaId)}</TableCell>
                    <TableCell>{modalidadName(c.modalidadId)}</TableCell>
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
                      <IconButton onClick={() => openConfigDialog(c)} disabled={loading} title="Configurar (inscripciones/reglas/calendario)">
                        <SettingsIcon />
                      </IconButton>
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

      <Dialog open={openConfig} onClose={() => setOpenConfig(false)} fullWidth maxWidth="lg">
        <DialogTitle>Configurar competición {selectedComp ? `— ${selectedComp.nombre}` : ''}</DialogTitle>
        <DialogContent dividers>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="Inscripciones (categorías/cuotas)" />
            <Tab label="Reglas (puntos/desempates)" />
            <Tab label="Calendario (jornadas)" />
          </Tabs>

          {tab === 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Selecciona qué categorías participan en la competición y define la apertura de inscripciones y cuota.
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                {categorias.map((cat) => {
                  const cfg = catConfig[cat.id];
                  const enabled = !!cfg;
                  return (
                    <Card key={cat.id} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                          <Typography fontWeight={700}>{cat.nombre}</Typography>
                          <Switch
                            checked={enabled}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setCatConfig((prev) => {
                                const copy = { ...prev };
                                if (!checked) {
                                  delete copy[cat.id];
                                } else {
                                  copy[cat.id] = {
                                    categoriaId: cat.id,
                                    activa: true,
                                    inscripcionDesde: null,
                                    inscripcionHasta: null,
                                    cuota: null,
                                    horarioLocalDesde: null,
                                    horarioLocalHasta: null,
                                    categoriaNombre: cat.nombre,
                                  };
                                }
                                return copy;
                              });
                            }}
                            size="small"
                          />
                        </Box>
                        {enabled && (
                          <>
                            <Divider sx={{ my: 1.5 }} />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={cfg?.activa ?? true}
                                  onChange={(e) => setCatConfig((p) => ({ ...p, [cat.id]: { ...(p[cat.id] || cfg!), activa: e.target.checked } }))}
                                  size="small"
                                />
                              }
                              label="Activa"
                            />
                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                              <TextField
                                label="Desde"
                                type="date"
                                value={cfg?.inscripcionDesde ?? ''}
                                onChange={(e) => setCatConfig((p) => ({ ...p, [cat.id]: { ...(p[cat.id] || cfg!), inscripcionDesde: e.target.value || null } }))}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                              />
                              <TextField
                                label="Hasta"
                                type="date"
                                value={cfg?.inscripcionHasta ?? ''}
                                onChange={(e) => setCatConfig((p) => ({ ...p, [cat.id]: { ...(p[cat.id] || cfg!), inscripcionHasta: e.target.value || null } }))}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                              />
                              <TextField
                                label="Cuota (€)"
                                type="number"
                                value={cfg?.cuota ?? ''}
                                onChange={(e) => setCatConfig((p) => ({ ...p, [cat.id]: { ...(p[cat.id] || cfg!), cuota: e.target.value === '' ? null : Number(e.target.value) } }))}
                                size="small"
                              />
                              <TextField
                                label="Horario local desde"
                                type="date"
                                value={cfg?.horarioLocalDesde ?? ''}
                                onChange={(e) => setCatConfig((p) => ({ ...p, [cat.id]: { ...(p[cat.id] || cfg!), horarioLocalDesde: e.target.value || null } }))}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                              />
                              <TextField
                                label="Horario local hasta"
                                type="date"
                                value={cfg?.horarioLocalHasta ?? ''}
                                onChange={(e) => setCatConfig((p) => ({ ...p, [cat.id]: { ...(p[cat.id] || cfg!), horarioLocalHasta: e.target.value || null } }))}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                              />
                            </Box>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </Box>
          )}

          {tab === 1 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Puntos victoria"
                type="number"
                value={reglas.puntosVictoria}
                onChange={(e) => setReglasState((p) => ({ ...p, puntosVictoria: Number(e.target.value) }))}
              />
              <TextField
                label="Puntos empate"
                type="number"
                value={reglas.puntosEmpate}
                onChange={(e) => setReglasState((p) => ({ ...p, puntosEmpate: Number(e.target.value) }))}
              />
              <TextField
                label="Puntos derrota"
                type="number"
                value={reglas.puntosDerrota}
                onChange={(e) => setReglasState((p) => ({ ...p, puntosDerrota: Number(e.target.value) }))}
              />
              <TextField
                label="Orden desempates (separado por comas)"
                value={reglas.ordenDesempate.join(', ')}
                onChange={(e) =>
                  setReglasState((p) => ({
                    ...p,
                    ordenDesempate: e.target.value
                      .split(',')
                      .map((x) => x.trim())
                      .filter(Boolean),
                  }))
                }
              />
              <Typography variant="caption" color="text.secondary" sx={{ gridColumn: '1 / -1' }}>
                Ejemplo: Puntos, Diferencia, EnfrentamientoDirecto
              </Typography>
            </Box>
          )}

          {tab === 2 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Categoría</InputLabel>
                <Select value={genCategoriaId} label="Categoría" onChange={(e) => setGenCategoriaId(String(e.target.value))}>
                  {Object.keys(catConfig).map((id) => (
                    <MenuItem key={id} value={id}>
                      {categorias.find((c) => c.id === id)?.nombre || id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label="Fecha inicio" type="date" value={genFechaInicio} onChange={(e) => setGenFechaInicio(e.target.value)} InputLabelProps={{ shrink: true }} />
              <TextField label="Días entre jornadas" type="number" value={genDias} onChange={(e) => setGenDias(Number(e.target.value))} />
              <TextField label="Hora" value={genHora} onChange={(e) => setGenHora(e.target.value)} helperText="Formato HH:mm (ej: 10:00)" />
              <FormControlLabel control={<Switch checked={genDoble} onChange={(e) => setGenDoble(e.target.checked)} />} label="Doble vuelta" />
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Button
                  variant="contained"
                  onClick={doGenerar}
                  disabled={loading}
                  sx={{ borderRadius: '10px', background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)' }}
                >
                  Generar calendario
                </Button>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Esto reemplazará los partidos existentes de esa competición+categoría y generará jornadas de liga regular.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {tab === 0 && (
            <Button onClick={saveCategorias} disabled={loading} variant="outlined">
              Guardar categorías
            </Button>
          )}
          {tab === 1 && (
            <Button onClick={saveReglas} disabled={loading} variant="outlined">
              Guardar reglas
            </Button>
          )}
          <Button onClick={() => setOpenConfig(false)} color="inherit">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompeticionesView;


