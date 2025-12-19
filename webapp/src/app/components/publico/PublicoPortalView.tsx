import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Container,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import publicoService from '../../services/PublicoService';
import PublicoTopBar from './PublicoTopBar';
import { getNoticias, Noticia } from './noticiasData';
import { useNavigate } from 'react-router-dom';

const PublicoPortalView: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [competiciones, setCompeticiones] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [competicion, setCompeticion] = useState<any | null>(null);
  const [categoria, setCategoria] = useState<any | null>(null);
  const [calendario, setCalendario] = useState<any[]>([]);
  const [clasificacion, setClasificacion] = useState<any | null>(null);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [noticias, setNoticias] = useState<Noticia[]>([]);

  // Cargar noticias al montar el componente
  useEffect(() => {
    setNoticias(getNoticias());
  }, []);

  const filteredCompeticiones = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return competiciones;
    return (competiciones || []).filter((c) => String(c?.nombre || '').toLowerCase().includes(q));
  }, [competiciones, search]);

  const loadCompeticiones = async () => {
    setLoading(true);
    try {
      const data = await publicoService.getCompeticiones();
      setCompeticiones(data || []);
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async (competicionId: string) => {
    setLoading(true);
    try {
      const data = await publicoService.getCategorias(competicionId);
      setCategorias(data || []);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async (competicionId: string, categoriaId: string) => {
    setLoading(true);
    try {
      const [cal, clas] = await Promise.all([
        publicoService.getCalendario(competicionId, categoriaId),
        publicoService.getClasificacion(competicionId, categoriaId),
      ]);
      setCalendario(cal || []);
      setClasificacion(clas || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompeticiones();
  }, []);

  useEffect(() => {
    if (!competicion?.id) return;
    setCategoria(null);
    setCalendario([]);
    setClasificacion(null);
    loadCategorias(competicion.id);
  }, [competicion?.id]);

  useEffect(() => {
    if (!competicion?.id || !categoria?.categoriaId) return;
    loadData(competicion.id, categoria.categoriaId);
  }, [competicion?.id, categoria?.categoriaId]);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
      <PublicoTopBar />

      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          borderBottom: '1px solid #e2e8f0',
          backgroundImage: `linear-gradient(135deg, rgba(2,6,23,0.75) 0%, rgba(2,6,23,0.35) 100%), url(/background.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
          <Box sx={{ maxWidth: 760 }}>
            <Typography
              variant="h2"
              fontWeight={900}
              sx={{ color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05 }}
            >
              Resultados y clasificaciones,
              <br />
              sin complicaciones.
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.86)', mt: 2, lineHeight: 1.5 }}>
              Consulta calendario, resultados y clasificación por competición y categoría.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => document.getElementById('portal-datos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                sx={{
                  textTransform: 'none',
                  fontWeight: 800,
                  borderRadius: 999,
                  px: 3,
                  background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)',
                }}
              >
                Ver competiciones
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 800,
                  borderRadius: 999,
                  px: 3,
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.55)',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.85)' },
                }}
              >
                Acceso privado
              </Button>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: 'wrap' }}>
              <Chip label="Calendario" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' }} />
              <Chip label="Resultados" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' }} />
              <Chip label="Clasificación" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff' }} />
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container id="portal-datos" maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Selector */}
        <Card sx={{ borderRadius: '18px', mb: 3, border: '1px solid #e2e8f0' }} elevation={0}>
          <CardContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
              <TextField label="Buscar competición" value={search} onChange={(e) => setSearch(e.target.value)} />
              <Autocomplete
                options={filteredCompeticiones}
                getOptionLabel={(o) => o.nombre || ''}
                value={competicion}
                onChange={(_, v) => setCompeticion(v)}
                renderInput={(params) => <TextField {...params} label="Competición" />}
              />
              <Autocomplete
                options={categorias}
                getOptionLabel={(o: any) => o.nombre || ''}
                value={categoria}
                onChange={(_, v) => setCategoria(v)}
                renderInput={(params) => <TextField {...params} label="Categoría" />}
                disabled={!competicion}
              />
            </Box>

            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                Selecciona una competición y categoría para ver datos. Si eres club/federación/árbitro, entra en el acceso privado.
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 999 }}
              >
                Iniciar sesión
              </Button>
            </Box>
          </CardContent>
        </Card>

        {loading && (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        )}

        {!!categoria && !loading && (
          <>
            <Card sx={{ borderRadius: '18px', mb: 3, border: '1px solid #e2e8f0' }} elevation={0}>
              <CardContent>
                <Tabs
                  value={tab}
                  onChange={(_, v) => setTab(v)}
                  sx={{
                    mb: 2,
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 800 },
                    '& .MuiTabs-indicator': { backgroundColor: '#2C5F8D', height: 3 },
                  }}
                >
                  <Tab label="Clasificación" />
                  <Tab label="Calendario y resultados" />
                </Tabs>

                {tab === 0 && (
                  clasificacion?.items?.length ? (
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Equipo</TableCell>
                            <TableCell align="right">PJ</TableCell>
                            <TableCell align="right">PG</TableCell>
                            <TableCell align="right">PE</TableCell>
                            <TableCell align="right">PP</TableCell>
                            <TableCell align="right">PF</TableCell>
                            <TableCell align="right">PC</TableCell>
                            <TableCell align="right">DIF</TableCell>
                            <TableCell align="right">PTS</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {clasificacion.items.map((x: any, idx: number) => (
                            <TableRow key={x.equipoId || idx} hover>
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell>{x.equipo}</TableCell>
                              <TableCell align="right">{x.pj}</TableCell>
                              <TableCell align="right">{x.pg}</TableCell>
                              <TableCell align="right">{x.pe}</TableCell>
                              <TableCell align="right">{x.pp}</TableCell>
                              <TableCell align="right">{x.pf}</TableCell>
                              <TableCell align="right">{x.pc}</TableCell>
                              <TableCell align="right">{x.dif}</TableCell>
                              <TableCell align="right">
                                <strong>{x.pts}</strong>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Aún no hay resultados cerrados para generar clasificación.
                    </Typography>
                  )
                )}
              </CardContent>
            </Card>

            {tab === 1 && (
              <Card sx={{ borderRadius: '18px', border: '1px solid #e2e8f0' }} elevation={0}>
                <CardContent>
                  <Typography fontWeight={800} sx={{ mb: 1 }}>
                    Calendario y resultados
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Fecha</TableCell>
                          <TableCell>Hora</TableCell>
                          <TableCell>Partido</TableCell>
                          <TableCell>Lugar</TableCell>
                          <TableCell align="right">Resultado</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {calendario.map((p: any) => (
                          <TableRow key={p.id} hover>
                            <TableCell>{p.fecha}</TableCell>
                            <TableCell>{p.hora}</TableCell>
                            <TableCell>
                              <strong>{p.equipoLocal}</strong> vs <strong>{p.equipoVisitante}</strong>
                            </TableCell>
                            <TableCell>{p.lugar || '-'}</TableCell>
                            <TableCell align="right">
                              {p.cerrado && p.resultadoLocal != null && p.resultadoVisitante != null
                                ? `${p.resultadoLocal} - ${p.resultadoVisitante}`
                                : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                        {calendario.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5}>
                              <Typography variant="body2" color="text.secondary">
                                No hay partidos para esta competición/categoría.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Container>

      {/* Noticias preview */}
      <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 6 } }}>
        <Box sx={{ mt: { xs: 4, md: 6 }, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h5" fontWeight={900} sx={{ color: '#0f172a' }}>
              Noticias
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Comunicados y novedades.
            </Typography>
          </Box>
          <Button onClick={() => navigate('/noticias')} sx={{ textTransform: 'none', fontWeight: 800, borderRadius: 999 }}>
            Ver todas
          </Button>
        </Box>

        <Box sx={{ mt: 2.5, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {noticias.slice(0, 3).map((n) => (
            <Card
              key={n.slug}
              elevation={0}
              sx={{
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                cursor: 'pointer',
                '&:hover': { boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)' },
                transition: 'box-shadow 0.2s ease',
              }}
              onClick={() => navigate(`/noticias/${n.slug}`)}
            >
              <Box
                sx={{
                  height: 130,
                  backgroundImage: `linear-gradient(135deg, rgba(2,6,23,0.35) 0%, rgba(2,6,23,0.10) 100%), url(${n.imagen || '/fondo.jpeg'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Chip size="small" label={n.fecha} variant="outlined" />
                </Stack>
                <Typography fontWeight={900} sx={{ color: '#0f172a', lineHeight: 1.25 }}>
                  {n.titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  {n.resumen}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid #e2e8f0', color: '#64748b' }}>
          <Typography variant="body2">© {new Date().getFullYear()} AutoRef</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default PublicoPortalView;


