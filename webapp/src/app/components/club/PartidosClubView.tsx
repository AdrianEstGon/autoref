import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import partidosService from '../../services/PartidoService';
import { toast } from 'react-toastify';

const PartidosClubView: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const clubId = useMemo(() => window.localStorage.getItem('clubVinculadoId') || '', []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await partidosService.getPartidosMiClub();
      setItems(data || []);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando partidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
            <SportsVolleyballIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Partidos del club
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fija horarios como local y gestiona solicitudes de cambio.
            </Typography>
          </Box>
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
                    <TableCell>Partido</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell>Lugar</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((p) => {
                    const esLocal = String(p.clubLocalId || '').toLowerCase() === String(clubId || '').toLowerCase();
                    return (
                      <TableRow key={p.id} hover>
                        <TableCell>
                          <Typography fontWeight={700} variant="body2">
                            {p.equipoLocal} vs {p.equipoVisitante}
                          </Typography>
                          <Box sx={{ mt: 0.5, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip size="small" label={esLocal ? 'Local' : 'Visitante'} color={esLocal ? 'primary' : 'default'} />
                            {p.jornada != null && <Chip size="small" label={`J${p.jornada}`} variant="outlined" />}
                            {p.numeroPartido && <Chip size="small" label={`Nº ${p.numeroPartido}`} variant="outlined" />}
                          </Box>
                        </TableCell>
                        <TableCell>{p.fecha}</TableCell>
                        <TableCell>{p.hora}</TableCell>
                        <TableCell>{p.lugar || '-'}</TableCell>
                        <TableCell>{p.categoria || '-'}</TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="outlined" onClick={() => navigate(`/detallesPartido/${p.id}`)}>
                            Ver detalle
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary">
                          No hay partidos asociados a este club.
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
    </Box>
  );
};

export default PartidosClubView;


