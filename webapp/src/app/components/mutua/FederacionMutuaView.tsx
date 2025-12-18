import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DownloadIcon from '@mui/icons-material/Download';
import mutuaService, { EnvioMutuaResumen, MutuaPendiente } from '../../services/MutuaService';
import { toast } from 'react-toastify';

const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

const getFilenameFromDisposition = (disposition?: string | null) => {
  if (!disposition) return null;
  // content-disposition: attachment; filename="X.xlsx"
  const match = /filename\*?=(?:UTF-8'')?\"?([^\";]+)\"?/i.exec(disposition);
  return match?.[1] || null;
};

const FederacionMutuaView: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [pendientes, setPendientes] = useState<MutuaPendiente[]>([]);
  const [envios, setEnvios] = useState<EnvioMutuaResumen[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const tipoLabel = useMemo(() => ({ 1: 'Jugador', 2: 'Staff técnico' } as Record<number, string>), []);

  const load = async () => {
    setLoading(true);
    try {
      const [p, e] = await Promise.all([mutuaService.getPendientes(), mutuaService.getEnvios()]);
      setPendientes(p);
      setEnvios(e);

      // Inicializar selección por defecto
      const nextSel: Record<string, boolean> = {};
      p.forEach((x) => {
        nextSel[x.inscripcionId] = Boolean(x.checkDefaultEnviar);
      });
      setSelected(nextSel);
    } catch (err: any) {
      toast.error(err?.message || 'Error cargando mutua');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleEnviar = async () => {
    const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);
    if (ids.length === 0) {
      toast.error('Selecciona al menos una persona');
      return;
    }
    setLoading(true);
    try {
      const response = await mutuaService.enviarMutua(ids);
      const filename =
        getFilenameFromDisposition(response.headers?.['content-disposition']) || `EnvioMutua_${new Date().toISOString().slice(0, 10)}.xlsx`;
      downloadBlob(response.data, filename);
      toast.success('Envío generado');
      await load();
    } catch (err: any) {
      toast.error(err?.message || 'Error generando envío');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadEnvio = async (envioId: string) => {
    setLoading(true);
    try {
      const response = await mutuaService.descargarEnvioExcel(envioId);
      const filename =
        getFilenameFromDisposition(response.headers?.['content-disposition']) || `EnvioMutua_${envioId}.xlsx`;
      downloadBlob(response.data, filename);
    } catch (err: any) {
      toast.error(err?.message || 'Error descargando Excel');
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
            <HealthAndSafetyIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Gestión de Mutua
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pendientes de envío, generación de Excel y histórico de envíos
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              mb: 2,
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
              '& .MuiTabs-indicator': { backgroundColor: '#2C5F8D', height: 3 },
            }}
          >
            <Tab label={`Pendientes (${pendientes.length})`} />
            <Tab label={`Envíos (${envios.length})`} />
          </Tabs>

          {tab === 0 && (
            <>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Por defecto, se marcan para envío las solicitudes del club y toda inscripción en competición federada.
                </Typography>
                <Button
                  variant="contained"
                  disabled={loading}
                  onClick={handleEnviar}
                  startIcon={<DownloadIcon />}
                  sx={{ borderRadius: '10px', background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)' }}
                >
                  Realizar envío (Excel)
                </Button>
              </Stack>

              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Enviar</TableCell>
                      <TableCell>Persona</TableCell>
                      <TableCell>Documento</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Categoría</TableCell>
                      <TableCell>Equipo</TableCell>
                      <TableCell>Club</TableCell>
                      <TableCell>Competición</TableCell>
                      <TableCell>Solicitud club</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendientes.map((p) => (
                      <TableRow key={p.inscripcionId} hover>
                        <TableCell>
                          <Checkbox
                            checked={Boolean(selected[p.inscripcionId])}
                            onChange={(e) => setSelected((prev) => ({ ...prev, [p.inscripcionId]: e.target.checked }))}
                          />
                        </TableCell>
                        <TableCell>
                          {p.nombre} {p.apellidos}
                          <Typography variant="caption" color="text.secondary" display="block">
                            {new Date(p.fechaNacimiento).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>{p.documento}</TableCell>
                        <TableCell>{tipoLabel[p.tipo] || p.tipo}</TableCell>
                        <TableCell>{p.categoria}</TableCell>
                        <TableCell>{p.equipo}</TableCell>
                        <TableCell>{p.club}</TableCell>
                        <TableCell>
                          {p.competicion}{' '}
                          {p.competicionFederada ? (
                            <Chip label="Federada" size="small" sx={{ ml: 1, bgcolor: '#E8F4FA', color: '#2C5F8D' }} />
                          ) : null}
                        </TableCell>
                        <TableCell>
                          {p.mutuaSolicitadaPorClub ? (
                            <Chip label="Sí" size="small" sx={{ bgcolor: '#dbeafe', color: '#2563eb' }} />
                          ) : (
                            <Chip label="No" size="small" sx={{ bgcolor: '#E8ECEF', color: '#64748B' }} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {pendientes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9}>
                          <Typography variant="body2" color="text.secondary">
                            No hay personas pendientes de envío.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {tab === 1 && (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha envío</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Excel</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {envios.map((e) => (
                    <TableRow key={e.envioId} hover>
                      <TableCell>{new Date(e.fechaEnvioMutua).toLocaleString()}</TableCell>
                      <TableCell>{e.totalItems}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadEnvio(e.envioId)}
                          disabled={loading}
                          sx={{ borderRadius: '10px' }}
                        >
                          Descargar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {envios.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="body2" color="text.secondary">
                          Todavía no hay envíos.
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

export default FederacionMutuaView;


