import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import publicoService from '../../services/PublicoService';

const PublicoPortalView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [competiciones, setCompeticiones] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [competicion, setCompeticion] = useState<any | null>(null);
  const [categoria, setCategoria] = useState<any | null>(null);
  const [calendario, setCalendario] = useState<any[]>([]);
  const [clasificacion, setClasificacion] = useState<any | null>(null);

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
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
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
            Portal público
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Calendarios, resultados y clasificaciones (sin login).
          </Typography>
        </Box>
      </Box>

      <Card sx={{ borderRadius: '16px', mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Autocomplete
              options={competiciones}
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
        </CardContent>
      </Card>

      {loading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {!!categoria && !loading && (
        <>
          <Card sx={{ borderRadius: '16px', mb: 3 }}>
            <CardContent>
              <Typography fontWeight={700} sx={{ mb: 1 }}>
                Clasificación
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {clasificacion?.items?.length ? (
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
              )}
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: '16px' }}>
            <CardContent>
              <Typography fontWeight={700} sx={{ mb: 1 }}>
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
                          {p.equipoLocal} vs {p.equipoVisitante}
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
        </>
      )}
    </Box>
  );
};

export default PublicoPortalView;


