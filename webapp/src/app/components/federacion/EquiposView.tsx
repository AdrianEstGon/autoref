import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
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
} from '@mui/material';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import { toast } from 'react-toastify';
import clubService from '../../services/ClubService';
import categoriaService from '../../services/CategoriaService';
import equipoService from '../../services/EquipoService';

type Club = { id: string; nombre: string };
type Categoria = { id: string; nombre: string };
type Equipo = { id: string; nombre: string; clubId: string; categoriaId: string };

const EquiposView: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ nombre: '', clubId: '', categoriaId: '' });

  const load = async () => {
    setLoading(true);
    try {
      const [c, cat, eq] = await Promise.all([clubService.getClubs(), categoriaService.getCategorias(), equipoService.getEquipos()]);
      setClubs(c);
      setCategorias(cat);
      setEquipos(eq);
      if (!form.clubId && c?.[0]?.id) setForm((p) => ({ ...p, clubId: c[0].id }));
      if (!form.categoriaId && cat?.[0]?.id) setForm((p) => ({ ...p, categoriaId: cat[0].id }));
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    if (!form.nombre.trim() || !form.clubId || !form.categoriaId) {
      toast.error('Completa nombre, club y categoría');
      return;
    }
    setLoading(true);
    try {
      await equipoService.createEquipo({ nombre: form.nombre.trim(), clubId: form.clubId, categoriaId: form.categoriaId });
      toast.success('Equipo creado');
      setForm((p) => ({ ...p, nombre: '' }));
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'Error creando equipo');
    } finally {
      setLoading(false);
    }
  };

  const clubName = (id: string) => clubs.find((c) => c.id === id)?.nombre || id;
  const catName = (id: string) => categorias.find((c) => c.id === id)?.nombre || id;

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
              Equipos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Crea equipos (Club + Categoría) para poder inscribir personas y gestionar Mutua
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Nuevo equipo
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              label="Nombre"
              value={form.nombre}
              onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))}
              sx={{ minWidth: 260 }}
            />
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel>Club</InputLabel>
              <Select value={form.clubId} label="Club" onChange={(e) => setForm((p) => ({ ...p, clubId: String(e.target.value) }))}>
                {clubs.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={form.categoriaId}
                label="Categoría"
                onChange={(e) => setForm((p) => ({ ...p, categoriaId: String(e.target.value) }))}
              >
                {categorias.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={loading}
              sx={{ borderRadius: '10px', background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)' }}
            >
              Crear
            </Button>
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
                  <TableCell>Nombre</TableCell>
                  <TableCell>Club</TableCell>
                  <TableCell>Categoría</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {equipos.map((e) => (
                  <TableRow key={e.id} hover>
                    <TableCell>{e.nombre}</TableCell>
                    <TableCell>{clubName(e.clubId)}</TableCell>
                    <TableCell>{catName(e.categoriaId)}</TableCell>
                  </TableRow>
                ))}
                {equipos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="body2" color="text.secondary">
                        No hay equipos todavía.
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

export default EquiposView;


