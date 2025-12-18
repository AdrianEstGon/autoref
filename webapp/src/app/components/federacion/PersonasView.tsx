import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EditIcon from '@mui/icons-material/Edit';
import BadgeIcon from '@mui/icons-material/Badge';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import personaService, { Persona, PersonaUpsert } from '../../services/PersonaService';
import licenciaService, { Licencia, LicenciaUpsert } from '../../services/LicenciaService';
import temporadaService, { Temporada } from '../../services/TemporadaService';
import modalidadService, { Modalidad } from '../../services/ModalidadService';
import categoriaService from '../../services/CategoriaService';
import documentoService from '../../services/DocumentoService';
import DownloadIcon from '@mui/icons-material/Download';

const TIPO_PERSONA = [
  { value: 1, label: 'Jugador' },
  { value: 2, label: 'Staff técnico' },
  { value: 3, label: 'Árbitro' },
  { value: 4, label: 'Staff' },
];

type Categoria = { id: string; nombre: string };

const PersonasView: React.FC = () => {
  const [items, setItems] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');

  const [openPersona, setOpenPersona] = useState(false);
  const [personaEdit, setPersonaEdit] = useState<Persona | null>(null);
  const [personaForm, setPersonaForm] = useState<PersonaUpsert>({
    documento: '',
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    tipo: 1,
    email: '',
    telefono: '',
    direccion: '',
    codigoPostal: '',
    provincia: '',
    ciudad: '',
  });

  const [openLicencias, setOpenLicencias] = useState(false);
  const [personaLicencias, setPersonaLicencias] = useState<Persona | null>(null);
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [openNuevaLicencia, setOpenNuevaLicencia] = useState(false);
  const [licenciaForm, setLicenciaForm] = useState<LicenciaUpsert>({
    personaId: '',
    temporadaId: '',
    modalidadId: '',
    categoriaBaseId: null,
    numeroLicencia: '',
    activa: true,
    observaciones: '',
  });

  const [openHabilitaciones, setOpenHabilitaciones] = useState(false);
  const [habilitacionesLicencia, setHabilitacionesLicencia] = useState<Licencia | null>(null);
  const [habilitacionesSelected, setHabilitacionesSelected] = useState<string[]>([]);

  const load = async (search?: string) => {
    setLoading(true);
    try {
      const data = await personaService.getPersonas(search?.trim() ? search.trim() : undefined);
      setItems(data);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando personas');
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogos = async () => {
    try {
      const [t, m, c] = await Promise.all([
        temporadaService.getTemporadas(),
        modalidadService.getModalidades(),
        categoriaService.getCategorias(),
      ]);
      setTemporadas(t);
      setModalidades(m);
      setCategorias((c || []).map((x: any) => ({ id: x.id, nombre: x.nombre })));
    } catch {
      // silencioso; se mostrará error al entrar a licencias si falta algo
    }
  };

  useEffect(() => {
    load();
    loadCatalogos();
  }, []);

  const tipoLabel = (tipo: number) => TIPO_PERSONA.find((t) => t.value === tipo)?.label ?? `Tipo ${tipo}`;

  const handleOpenCreate = () => {
    setPersonaEdit(null);
    setPersonaForm({
      documento: '',
      nombre: '',
      apellidos: '',
      fechaNacimiento: '',
      tipo: 1,
      email: '',
      telefono: '',
      direccion: '',
      codigoPostal: '',
      provincia: '',
      ciudad: '',
    });
    setOpenPersona(true);
  };

  const handleOpenEdit = (p: Persona) => {
    setPersonaEdit(p);
    setPersonaForm({
      documento: p.documento,
      nombre: p.nombre,
      apellidos: p.apellidos,
      fechaNacimiento: (p.fechaNacimiento || '').slice(0, 10),
      tipo: p.tipo,
      email: p.email ?? '',
      telefono: p.telefono ?? '',
      direccion: p.direccion ?? '',
      codigoPostal: p.codigoPostal ?? '',
      provincia: p.provincia ?? '',
      ciudad: p.ciudad ?? '',
    });
    setOpenPersona(true);
  };

  const handleSavePersona = async () => {
    if (!personaForm.documento.trim()) return toast.error('Documento obligatorio');
    if (!personaForm.nombre.trim()) return toast.error('Nombre obligatorio');
    if (!personaForm.apellidos.trim()) return toast.error('Apellidos obligatorios');
    if (!personaForm.fechaNacimiento) return toast.error('Fecha de nacimiento obligatoria');

    setLoading(true);
    try {
      // Importante: para permitir "limpiar" campos, enviamos "" explícito (backend lo interpreta como null)
      await personaService.upsertPersona({
        documento: personaForm.documento.trim(),
        nombre: personaForm.nombre.trim(),
        apellidos: personaForm.apellidos.trim(),
        fechaNacimiento: personaForm.fechaNacimiento,
        tipo: personaForm.tipo,
        email: personaForm.email ?? '',
        telefono: personaForm.telefono ?? '',
        direccion: personaForm.direccion ?? '',
        codigoPostal: personaForm.codigoPostal ?? '',
        provincia: personaForm.provincia ?? '',
        ciudad: personaForm.ciudad ?? '',
      });
      toast.success(personaEdit ? 'Persona actualizada' : 'Persona creada');
      setOpenPersona(false);
      await load(q);
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  const loadLicencias = async (persona: Persona) => {
    setPersonaLicencias(persona);
    setOpenLicencias(true);
    setLoading(true);
    try {
      const data = await licenciaService.getLicenciasByPersona(persona.id);
      setLicencias(data);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando licencias');
    } finally {
      setLoading(false);
    }
  };

  const temporadasActivas = useMemo(() => temporadas.filter((t) => t.activa), [temporadas]);
  const modalidadesActivas = useMemo(() => modalidades.filter((m) => m.activa), [modalidades]);

  const openCreateLicencia = () => {
    if (!personaLicencias) return;
    setLicenciaForm({
      personaId: personaLicencias.id,
      temporadaId: temporadasActivas[0]?.id ?? '',
      modalidadId: modalidadesActivas[0]?.id ?? '',
      categoriaBaseId: null,
      numeroLicencia: '',
      activa: true,
      observaciones: '',
    });
    setOpenNuevaLicencia(true);
  };

  const saveLicencia = async () => {
    if (!personaLicencias) return;
    if (!licenciaForm.temporadaId) return toast.error('Temporada obligatoria');
    if (!licenciaForm.modalidadId) return toast.error('Modalidad obligatoria');
    setLoading(true);
    try {
      await licenciaService.upsertLicencia({
        ...licenciaForm,
        personaId: personaLicencias.id,
        numeroLicencia: licenciaForm.numeroLicencia ?? '',
        observaciones: licenciaForm.observaciones ?? '',
      });
      toast.success('Licencia guardada');
      setOpenNuevaLicencia(false);
      await loadLicencias(personaLicencias);
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo guardar la licencia');
    } finally {
      setLoading(false);
    }
  };

  const openHabs = (lic: Licencia) => {
    setHabilitacionesLicencia(lic);
    setHabilitacionesSelected(lic.categoriasHabilitadas.map((c) => c.categoriaId));
    setOpenHabilitaciones(true);
  };

  const saveHabs = async () => {
    if (!habilitacionesLicencia || !personaLicencias) return;
    setLoading(true);
    try {
      await licenciaService.setHabilitaciones(habilitacionesLicencia.id, habilitacionesSelected);
      toast.success('Habilitaciones actualizadas');
      setOpenHabilitaciones(false);
      await loadLicencias(personaLicencias);
    } catch (e: any) {
      toast.error(e?.message || 'No se pudieron guardar habilitaciones');
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
            <PeopleAltIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Personas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Alta y gestión de jugadores, técnicos y árbitros. Desde aquí también gestionas licencias por temporada y modalidad.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <TextField
              label="Buscar (DNI / nombre / apellidos)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') load(q);
              }}
              sx={{ minWidth: 340 }}
            />
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button variant="outlined" onClick={() => load(q)} disabled={loading}>
                Buscar
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCreate}
                disabled={loading}
                sx={{ borderRadius: '10px', background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)' }}
              >
                Nueva persona
              </Button>
            </Box>
          </Box>
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
                  <TableCell>Documento</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Contacto</TableCell>
                  <TableCell>Mutua</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>{p.documento}</TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{p.apellidos}, {p.nombre}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Nac.: {(p.fechaNacimiento || '').slice(0, 10)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={tipoLabel(p.tipo)} sx={{ bgcolor: '#E8F4FA', color: '#2C5F8D' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{p.email || '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {p.telefono || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {p.mutuaEnviada ? (
                        <Chip size="small" label="Enviada" sx={{ bgcolor: '#E8F4FA', color: '#2C5F8D' }} />
                      ) : (
                        <Chip size="small" label="No" sx={{ bgcolor: '#E8ECEF', color: '#64748B' }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenEdit(p)} disabled={loading} title="Editar persona">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => loadLicencias(p)} disabled={loading} title="Licencias">
                        <BadgeIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary">
                        No hay personas todavía.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog Persona */}
      <Dialog open={openPersona} onClose={() => setOpenPersona(false)} fullWidth maxWidth="md">
        <DialogTitle>{personaEdit ? 'Editar persona' : 'Nueva persona'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Documento"
              value={personaForm.documento}
              onChange={(e) => setPersonaForm((prev) => ({ ...prev, documento: e.target.value }))}
              disabled={!!personaEdit}
            />
            <FormControl fullWidth>
              <InputLabel id="tipo-persona-label">Tipo</InputLabel>
              <Select
                labelId="tipo-persona-label"
                label="Tipo"
                value={personaForm.tipo}
                onChange={(e) => setPersonaForm((prev) => ({ ...prev, tipo: Number(e.target.value) }))}
              >
                {TIPO_PERSONA.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Nombre" value={personaForm.nombre} onChange={(e) => setPersonaForm((prev) => ({ ...prev, nombre: e.target.value }))} />
            <TextField
              label="Apellidos"
              value={personaForm.apellidos}
              onChange={(e) => setPersonaForm((prev) => ({ ...prev, apellidos: e.target.value }))}
            />
            <TextField
              label="Fecha de nacimiento"
              type="date"
              value={personaForm.fechaNacimiento}
              onChange={(e) => setPersonaForm((prev) => ({ ...prev, fechaNacimiento: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Contacto (opcional)
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField label="Email" value={personaForm.email ?? ''} onChange={(e) => setPersonaForm((prev) => ({ ...prev, email: e.target.value }))} />
            <TextField label="Teléfono" value={personaForm.telefono ?? ''} onChange={(e) => setPersonaForm((prev) => ({ ...prev, telefono: e.target.value }))} />
            <TextField label="Dirección" value={personaForm.direccion ?? ''} onChange={(e) => setPersonaForm((prev) => ({ ...prev, direccion: e.target.value }))} />
            <TextField
              label="Código postal"
              value={personaForm.codigoPostal ?? ''}
              onChange={(e) => setPersonaForm((prev) => ({ ...prev, codigoPostal: e.target.value }))}
            />
            <TextField label="Provincia" value={personaForm.provincia ?? ''} onChange={(e) => setPersonaForm((prev) => ({ ...prev, provincia: e.target.value }))} />
            <TextField label="Ciudad" value={personaForm.ciudad ?? ''} onChange={(e) => setPersonaForm((prev) => ({ ...prev, ciudad: e.target.value }))} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPersona(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleSavePersona}
            disabled={loading}
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)' }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Licencias */}
      <Dialog open={openLicencias} onClose={() => setOpenLicencias(false)} fullWidth maxWidth="lg">
        <DialogTitle>Licencias — {personaLicencias ? `${personaLicencias.apellidos}, ${personaLicencias.nombre}` : ''}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Gestiona licencias por temporada y modalidad. Usa habilitaciones para permitir competir en categorías superiores.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={openCreateLicencia}
              sx={{ background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)' }}
              disabled={!personaLicencias}
            >
              Nueva licencia
            </Button>
          </Box>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Temporada</TableCell>
                  <TableCell>Modalidad</TableCell>
                  <TableCell>Categoría base</TableCell>
                  <TableCell>Nº licencia</TableCell>
                  <TableCell>Activa</TableCell>
                  <TableCell>Habilitaciones</TableCell>
                  <TableCell>Acciones</TableCell>
                  <TableCell>Docs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {licencias.map((l) => (
                  <TableRow key={l.id} hover>
                    <TableCell>{l.temporada?.nombre}</TableCell>
                    <TableCell>{l.modalidad?.nombre}</TableCell>
                    <TableCell>{l.categoriaBase?.nombre ?? '-'}</TableCell>
                    <TableCell>{l.numeroLicencia ?? '-'}</TableCell>
                    <TableCell>{l.activa ? <Chip size="small" label="Sí" sx={{ bgcolor: '#E8F4FA', color: '#2C5F8D' }} /> : <Chip size="small" label="No" />}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                        {(l.categoriasHabilitadas || []).slice(0, 3).map((c) => (
                          <Chip key={c.categoriaId} size="small" label={c.nombre} />
                        ))}
                        {(l.categoriasHabilitadas || []).length > 3 && <Chip size="small" label={`+${(l.categoriasHabilitadas || []).length - 3}`} />}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" onClick={() => openHabs(l)} disabled={loading}>
                        Habilitaciones
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={async () => {
                          try {
                            await documentoService.descargarLicenciaExcel(l.id);
                          } catch (e: any) {
                            toast.error(e?.message || 'No se pudo descargar la licencia');
                          }
                        }}
                        disabled={loading}
                      >
                        Excel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {licencias.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Typography variant="body2" color="text.secondary">
                        No hay licencias para esta persona todavía.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLicencias(false)} color="inherit">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Nueva Licencia */}
      <Dialog open={openNuevaLicencia} onClose={() => setOpenNuevaLicencia(false)} fullWidth maxWidth="md">
        <DialogTitle>Nueva licencia</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="temporada-label">Temporada</InputLabel>
              <Select
                labelId="temporada-label"
                label="Temporada"
                value={licenciaForm.temporadaId}
                onChange={(e) => setLicenciaForm((prev) => ({ ...prev, temporadaId: String(e.target.value) }))}
              >
                {temporadas.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.nombre} {t.activa ? '' : '(inactiva)'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="modalidad-label">Modalidad</InputLabel>
              <Select
                labelId="modalidad-label"
                label="Modalidad"
                value={licenciaForm.modalidadId}
                onChange={(e) => setLicenciaForm((prev) => ({ ...prev, modalidadId: String(e.target.value) }))}
              >
                {modalidades.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.nombre} {m.activa ? '' : '(inactiva)'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="categoria-base-label">Categoría base</InputLabel>
              <Select
                labelId="categoria-base-label"
                label="Categoría base"
                value={licenciaForm.categoriaBaseId ?? ''}
                onChange={(e) => {
                  const v = String(e.target.value);
                  setLicenciaForm((prev) => ({ ...prev, categoriaBaseId: v ? v : null }));
                }}
              >
                <MenuItem value="">
                  <em>(sin categoría)</em>
                </MenuItem>
                {categorias.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Nº licencia"
              value={licenciaForm.numeroLicencia ?? ''}
              onChange={(e) => setLicenciaForm((prev) => ({ ...prev, numeroLicencia: e.target.value }))}
            />
            <FormControlLabel
              control={<Switch checked={licenciaForm.activa} onChange={(e) => setLicenciaForm((prev) => ({ ...prev, activa: e.target.checked }))} />}
              label="Activa"
            />
            <TextField
              label="Observaciones"
              value={licenciaForm.observaciones ?? ''}
              onChange={(e) => setLicenciaForm((prev) => ({ ...prev, observaciones: e.target.value }))}
              multiline
              minRows={2}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Nota: si ya existe licencia para la misma persona+temporada+modalidad, se actualizará.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNuevaLicencia(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={saveLicencia} disabled={loading} variant="contained" sx={{ background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)' }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Habilitaciones */}
      <Dialog open={openHabilitaciones} onClose={() => setOpenHabilitaciones(false)} fullWidth maxWidth="md">
        <DialogTitle>Habilitaciones a categorías superiores</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecciona categorías adicionales en las que la persona puede competir (además de su categoría base).
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="habs-label">Categorías habilitadas</InputLabel>
            <Select
              labelId="habs-label"
              label="Categorías habilitadas"
              multiple
              value={habilitacionesSelected}
              onChange={(e) => {
                const v = e.target.value as string[];
                setHabilitacionesSelected(v);
              }}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((id) => (
                    <Chip key={id} label={categorias.find((c) => c.id === id)?.nombre ?? id} size="small" />
                  ))}
                </Box>
              )}
            >
              {categorias.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHabilitaciones(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={saveHabs} disabled={loading} variant="contained" sx={{ background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)' }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PersonasView;


