import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Chip,
  Card,
  CardContent,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Newspaper as NewspaperIcon,
  Visibility as VisibilityIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

// Tipo de noticia (igual que en noticiasData.ts)
export type Noticia = {
  slug: string;
  titulo: string;
  fecha: string;
  resumen: string;
  imagen?: string;
  contenido: string;
};

// Storage key para localStorage
const NOTICIAS_STORAGE_KEY = 'autoref_noticias';

// Noticias iniciales por defecto
const defaultNoticias: Noticia[] = [
  {
    slug: 'bienvenida-a-autoref',
    titulo: 'Bienvenida a AutoRef: resultados, clasificaciones y gestión en un solo sitio',
    fecha: '2025-12-19',
    resumen: 'Estrenamos el nuevo portal público de AutoRef con una experiencia más clara para consultar competiciones, calendario y clasificación.',
    imagen: '/fondo4.jpeg',
    contenido: 'AutoRef ya ofrece portal público con calendario, resultados y clasificación. En las próximas iteraciones añadiremos más filtros, accesos rápidos y mejoras de rendimiento.',
  },
  {
    slug: 'mejoras-disponibilidad-y-designaciones',
    titulo: 'Mejoras en disponibilidad y designaciones',
    fecha: '2025-12-18',
    resumen: 'Optimizamos la carga del calendario de disponibilidad y añadimos flujos más claros para confirmar o rechazar designaciones con motivo.',
    imagen: '/fondo2.jpeg',
    contenido: 'La disponibilidad ahora carga por mes en una sola llamada y puedes eliminar franjas desde el calendario. En designaciones, se registran motivos de rechazo y fechas de respuesta.',
  },
  {
    slug: 'facturacion-y-liquidaciones',
    titulo: 'Nuevo módulo de liquidaciones, órdenes de pago y facturación',
    fecha: '2025-12-18',
    resumen: 'Añadimos liquidaciones por día/partido, exportación de remesas SEPA y facturas a clubes con estados.',
    imagen: '/fondo3.jpeg',
    contenido: 'Los árbitros pueden crear y enviar liquidaciones. El comité aprueba/rechaza. Se generan órdenes de pago por periodo y se exporta SEPA. La federación puede emitir facturas e imprimirlas.',
  },
];

// Funciones de utilidad para localStorage
const loadNoticias = (): Noticia[] => {
  try {
    const stored = localStorage.getItem(NOTICIAS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Primera vez: guardar las noticias por defecto
    localStorage.setItem(NOTICIAS_STORAGE_KEY, JSON.stringify(defaultNoticias));
    return defaultNoticias;
  } catch {
    return defaultNoticias;
  }
};

const saveNoticias = (noticias: Noticia[]) => {
  localStorage.setItem(NOTICIAS_STORAGE_KEY, JSON.stringify(noticias));
};

// Generar slug a partir del título
const generateSlug = (titulo: string): string => {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50);
};

const NoticiasAdminView: React.FC = () => {
  const theme = useTheme();
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null);
  const [noticiaToDelete, setNoticiaToDelete] = useState<Noticia | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    titulo: '',
    fecha: new Date().toISOString().split('T')[0],
    resumen: '',
    imagen: '',
    contenido: '',
  });

  useEffect(() => {
    setNoticias(loadNoticias());
  }, []);

  const handleOpenCreate = () => {
    setEditingNoticia(null);
    setFormData({
      titulo: '',
      fecha: new Date().toISOString().split('T')[0],
      resumen: '',
      imagen: '',
      contenido: '',
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (noticia: Noticia) => {
    setEditingNoticia(noticia);
    setFormData({
      titulo: noticia.titulo,
      fecha: noticia.fecha,
      resumen: noticia.resumen,
      imagen: noticia.imagen || '',
      contenido: noticia.contenido,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingNoticia(null);
  };

  const handleOpenDelete = (noticia: Noticia) => {
    setNoticiaToDelete(noticia);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setNoticiaToDelete(null);
  };

  const handleSave = () => {
    if (!formData.titulo.trim() || !formData.resumen.trim() || !formData.contenido.trim()) {
      toast.error('Completa todos los campos obligatorios');
      return;
    }

    let updatedNoticias: Noticia[];

    if (editingNoticia) {
      // Editar noticia existente
      updatedNoticias = noticias.map((n) =>
        n.slug === editingNoticia.slug
          ? {
              ...n,
              titulo: formData.titulo,
              fecha: formData.fecha,
              resumen: formData.resumen,
              imagen: formData.imagen || undefined,
              contenido: formData.contenido,
            }
          : n
      );
      toast.success('Noticia actualizada correctamente');
    } else {
      // Crear nueva noticia
      const newNoticia: Noticia = {
        slug: generateSlug(formData.titulo) + '-' + Date.now(),
        titulo: formData.titulo,
        fecha: formData.fecha,
        resumen: formData.resumen,
        imagen: formData.imagen || undefined,
        contenido: formData.contenido,
      };
      updatedNoticias = [newNoticia, ...noticias];
      toast.success('Noticia creada correctamente');
    }

    setNoticias(updatedNoticias);
    saveNoticias(updatedNoticias);
    handleCloseDialog();
  };

  const handleDelete = () => {
    if (!noticiaToDelete) return;

    const updatedNoticias = noticias.filter((n) => n.slug !== noticiaToDelete.slug);
    setNoticias(updatedNoticias);
    saveNoticias(updatedNoticias);
    toast.success('Noticia eliminada correctamente');
    handleCloseDelete();
  };

  const handlePreview = (slug: string) => {
    window.open(`/#/noticias/${slug}`, '_blank');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Card
        elevation={0}
        sx={{
          mb: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <CardContent sx={{ py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <NewspaperIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} color="text.primary">
                  Gestión de Noticias
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Administra las noticias del portal público
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Nueva Noticia
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Paper
          sx={{
            p: 2,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 2,
          }}
        >
          <NewspaperIcon color="primary" />
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {noticias.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Noticias publicadas
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Tabla de noticias */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <TableCell sx={{ fontWeight: 600 }}>Título</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Resumen</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {noticias.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <NewspaperIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">
                    No hay noticias publicadas
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreate}
                    sx={{ mt: 2, textTransform: 'none' }}
                  >
                    Crear primera noticia
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              noticias.map((noticia) => (
                <TableRow
                  key={noticia.slug}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  <TableCell>
                    <Box sx={{ maxWidth: 300 }}>
                      <Typography fontWeight={600} noWrap>
                        {noticia.titulo}
                      </Typography>
                      {noticia.imagen && (
                        <Chip
                          size="small"
                          label="Con imagen"
                          sx={{ mt: 0.5, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {formatDate(noticia.fecha)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {noticia.resumen}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver en portal público">
                      <IconButton
                        size="small"
                        onClick={() => handlePreview(noticia.slug)}
                        sx={{ color: 'info.main' }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenEdit(noticia)}
                        sx={{ color: 'warning.main' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDelete(noticia)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog crear/editar */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingNoticia ? 'Editar Noticia' : 'Nueva Noticia'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Título"
              fullWidth
              required
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Título de la noticia"
            />
            <TextField
              label="Fecha"
              type="date"
              fullWidth
              required
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Imagen (URL)"
              fullWidth
              value={formData.imagen}
              onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
              placeholder="/fondo.jpeg o https://..."
              helperText="Opcional. URL de la imagen de cabecera"
            />
            <TextField
              label="Resumen"
              fullWidth
              required
              multiline
              rows={2}
              value={formData.resumen}
              onChange={(e) => setFormData({ ...formData, resumen: e.target.value })}
              placeholder="Breve descripción que aparecerá en el listado"
            />
            <TextField
              label="Contenido"
              fullWidth
              required
              multiline
              rows={6}
              value={formData.contenido}
              onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
              placeholder="Contenido completo de la noticia"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ textTransform: 'none', px: 3 }}
          >
            {editingNoticia ? 'Guardar cambios' : 'Crear noticia'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog confirmar eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que quieres eliminar la noticia{' '}
            <strong>"{noticiaToDelete?.titulo}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleCloseDelete} sx={{ textTransform: 'none' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ textTransform: 'none' }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NoticiasAdminView;
