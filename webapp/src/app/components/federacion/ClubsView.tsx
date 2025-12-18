import React, { useEffect, useState } from 'react';
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
  Divider,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';
import clubService from '../../services/ClubService';

type ClubDetalle = {
  id: string;
  nombre: string;
  razonSocial?: string | null;
  cif?: string | null;
  direccionFiscal?: string | null;
  codigoPostalFiscal?: string | null;
  provinciaFiscal?: string | null;
  ciudadFiscal?: string | null;
  emailFacturacion?: string | null;
  telefono?: string | null;
  responsableNombre?: string | null;
  responsableEmail?: string | null;
  responsableTelefono?: string | null;
};

const ClubsView: React.FC = () => {
  const [items, setItems] = useState<ClubDetalle[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ClubDetalle | null>(null);
  const [form, setForm] = useState<Partial<ClubDetalle>>({ nombre: '' });

  const load = async () => {
    setLoading(true);
    try {
      const data = await clubService.getClubsDetalle();
      setItems(data);
    } catch (e: any) {
      toast.error(e?.message || 'Error cargando clubes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ nombre: '' });
    setOpen(true);
  };

  const openEdit = (c: ClubDetalle) => {
    setEditing(c);
    setForm({ ...c });
    setOpen(true);
  };

  const save = async () => {
    if (!form.nombre || !String(form.nombre).trim()) return toast.error('El nombre es obligatorio');
    setLoading(true);
    try {
      const payload = {
        nombre: String(form.nombre).trim(),
        razonSocial: form.razonSocial ?? '',
        cif: form.cif ?? '',
        direccionFiscal: form.direccionFiscal ?? '',
        codigoPostalFiscal: form.codigoPostalFiscal ?? '',
        provinciaFiscal: form.provinciaFiscal ?? '',
        ciudadFiscal: form.ciudadFiscal ?? '',
        emailFacturacion: form.emailFacturacion ?? '',
        telefono: form.telefono ?? '',
        responsableNombre: form.responsableNombre ?? '',
        responsableEmail: form.responsableEmail ?? '',
        responsableTelefono: form.responsableTelefono ?? '',
      };

      if (editing) {
        await clubService.updateClub(editing.id, payload);
        toast.success('Club actualizado');
      } else {
        await clubService.createClub(payload);
        toast.success('Club creado');
      }
      setOpen(false);
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo guardar');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar club?')) return;
    setLoading(true);
    try {
      await clubService.deleteClub(id);
      toast.success('Club eliminado');
      await load();
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo eliminar');
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
            <BusinessIcon sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#1e293b' }}>
              Clubes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Alta de clubes con datos fiscales y responsables.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            Gestión
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            disabled={loading}
            sx={{ borderRadius: '10px', background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)' }}
          >
            Nuevo club
          </Button>
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
                  <TableCell>CIF</TableCell>
                  <TableCell>Razón social</TableCell>
                  <TableCell>Responsable</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>{c.nombre}</TableCell>
                    <TableCell>{c.cif || '-'}</TableCell>
                    <TableCell>{c.razonSocial || '-'}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{c.responsableNombre || '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {c.responsableEmail || ''} {c.responsableTelefono ? `· ${c.responsableTelefono}` : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => openEdit(c)} disabled={loading} title="Editar">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => remove(c.id)} disabled={loading} color="error" title="Eliminar">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2" color="text.secondary">
                        No hay clubes todavía.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editing ? 'Editar club' : 'Nuevo club'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField label="Nombre" value={form.nombre ?? ''} onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))} />
            <TextField label="Razón social" value={form.razonSocial ?? ''} onChange={(e) => setForm((p) => ({ ...p, razonSocial: e.target.value }))} />
            <TextField label="CIF" value={form.cif ?? ''} onChange={(e) => setForm((p) => ({ ...p, cif: e.target.value }))} />
            <TextField label="Email facturación" value={form.emailFacturacion ?? ''} onChange={(e) => setForm((p) => ({ ...p, emailFacturacion: e.target.value }))} />
            <TextField label="Teléfono" value={form.telefono ?? ''} onChange={(e) => setForm((p) => ({ ...p, telefono: e.target.value }))} />
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Dirección fiscal
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField label="Dirección fiscal" value={form.direccionFiscal ?? ''} onChange={(e) => setForm((p) => ({ ...p, direccionFiscal: e.target.value }))} />
            <TextField
              label="Código postal"
              value={form.codigoPostalFiscal ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, codigoPostalFiscal: e.target.value }))}
            />
            <TextField label="Provincia" value={form.provinciaFiscal ?? ''} onChange={(e) => setForm((p) => ({ ...p, provinciaFiscal: e.target.value }))} />
            <TextField label="Ciudad" value={form.ciudadFiscal ?? ''} onChange={(e) => setForm((p) => ({ ...p, ciudadFiscal: e.target.value }))} />
          </Box>

          <Divider sx={{ my: 2 }} />
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Responsable
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Nombre responsable"
              value={form.responsableNombre ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, responsableNombre: e.target.value }))}
            />
            <TextField
              label="Email responsable"
              value={form.responsableEmail ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, responsableEmail: e.target.value }))}
            />
            <TextField
              label="Teléfono responsable"
              value={form.responsableTelefono ?? ''}
              onChange={(e) => setForm((p) => ({ ...p, responsableTelefono: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={save} disabled={loading} variant="contained" sx={{ background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)' }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClubsView;


