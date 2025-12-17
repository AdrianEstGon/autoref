import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  IconButton, Button, Box, Tooltip, TablePagination, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, Typography, Chip, Card, CardContent, Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SportsIcon from '@mui/icons-material/Sports';
import usuarioService from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Usuario {
  id: number;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  nivel: string;
  fechaNacimiento: string;
  clubVinculado: string;
  email: string;
  licencia: number;
  codigoPostal: string;
  esAdmin: boolean;
}

const UsuariosView: React.FC = () => {
  const SUPER_ADMIN_LICENCIA = 16409;

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosPaginados, setUsuariosPaginados] = useState<Usuario[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState<number | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await usuarioService.getUsuarios();
        const sortedData = data.sort((a: { primerApellido: string; }, b: { primerApellido: string }) => 
          a.primerApellido.localeCompare(b.primerApellido)
        );

        const superAdmin = sortedData.find((u: { licencia: number; }) => u.licencia === SUPER_ADMIN_LICENCIA);
        const otherUsers = sortedData.filter((u: { licencia: number; }) => u.licencia !== SUPER_ADMIN_LICENCIA);
        const finalSortedData = superAdmin ? [superAdmin, ...otherUsers] : otherUsers;

        finalSortedData.forEach((usuario: any) => {
          usuario.esAdmin = usuario.roles?.includes('Admin') || usuario.licencia === SUPER_ADMIN_LICENCIA;
        });

        setUsuarios(finalSortedData);
        setUsuariosPaginados(finalSortedData.slice(0, rowsPerPage));
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsuarios();
  }, [rowsPerPage]);

  const handleModify = (usuario: Usuario) => {
    navigate('/gestionUsuarios/modificarUsuario', { state: { usuario } });
  };

  const handleDelete = async () => {
    if (usuarioToDelete !== null) {
      try {
        await usuarioService.eliminarUsuario(usuarioToDelete);
        const updatedUsuarios = usuarios.filter(user => user.id !== usuarioToDelete);
        setUsuarios(updatedUsuarios);
        const startIndex = page * rowsPerPage;
        setUsuariosPaginados(updatedUsuarios.slice(startIndex, startIndex + rowsPerPage));

        setOpenConfirmDialog(false);
        setUsuarioToDelete(null);
        toast.success('Usuario eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setUsuarioToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenConfirmDialog(false);
    setUsuarioToDelete(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  const handleAdd = () => {
    navigate('/gestionUsuarios/crearUsuario');
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    const startIndex = newPage * rowsPerPage;
    setUsuariosPaginados(usuarios.slice(startIndex, startIndex + rowsPerPage));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setUsuariosPaginados(usuarios.slice(0, newRowsPerPage));
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PeopleAltIcon sx={{ color: "white", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#1e293b" }}>
              Gestión de Usuarios
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administra los árbitros y usuarios del sistema
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mb: 4 }}>
        <Card sx={{ background: "linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)", color: "white" }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
              <PeopleAltIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>{usuarios.length}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Total usuarios</Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ background: "linear-gradient(135deg, #5B7C99 0%, #3A5166 100%)", color: "white" }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
              <AdminPanelSettingsIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                {usuarios.filter(u => u.esAdmin).length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Administradores</Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ background: "linear-gradient(135deg, #7BA7D9 0%, #5B7C99 100%)", color: "white" }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
              <SportsIcon />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                {usuarios.filter(u => !u.esAdmin).length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Árbitros</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

          <TableContainer 
            component={Paper} 
            elevation={0}
            sx={{ 
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow 
                  sx={{ 
                    background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)',
                  }}
                >
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Nombre</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Primer apellido</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Segundo apellido</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Nivel</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Fecha Nac.</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Club</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}>Licencia</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem', textAlign: 'center' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuariosPaginados.map((usuario, index) => (
                  <TableRow
                    key={usuario.id}
                    sx={{
                      backgroundColor: usuario.licencia === SUPER_ADMIN_LICENCIA 
                        ? 'rgba(251, 191, 36, 0.1)' 
                        : index % 2 === 0 ? '#ffffff' : '#f8fafc',
                      borderLeft: usuario.licencia === SUPER_ADMIN_LICENCIA 
                        ? '4px solid #f59e0b' 
                        : '4px solid transparent',
                      '&:hover': {
                        backgroundColor: usuario.licencia === SUPER_ADMIN_LICENCIA 
                          ? 'rgba(251, 191, 36, 0.2)' 
                          : 'rgba(37, 99, 235, 0.05)',
                        transform: 'scale(1.001)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {usuario.nombre}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Typography variant="body2">
                        {usuario.primerApellido}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Typography variant="body2">
                        {usuario.segundoApellido}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Chip 
                        label={usuario.nivel} 
                        size="small" 
                        sx={{
                          bgcolor: '#e0e7ff',
                          color: '#3730a3',
                          fontWeight: 500,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(usuario.fechaNacimiento)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Typography variant="body2">
                        {usuario.clubVinculado}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                        {usuario.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2 }}>
                      <Chip 
                        label={usuario.licencia}
                        size="small"
                        variant={usuario.licencia === SUPER_ADMIN_LICENCIA ? "filled" : "outlined"}
                        sx={{
                          bgcolor: usuario.licencia === SUPER_ADMIN_LICENCIA ? '#fbbf24' : 'transparent',
                          color: usuario.licencia === SUPER_ADMIN_LICENCIA ? '#78350f' : '#64748b',
                          borderColor: '#cbd5e1',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2, px: 2, textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        {usuario.licencia !== SUPER_ADMIN_LICENCIA ? (
                          <Tooltip title="Modificar usuario" arrow>
                            <IconButton 
                              size="small"
                              onClick={() => handleModify(usuario)}
                              sx={{
                                bgcolor: '#eff6ff',
                                color: '#2563eb',
                                '&:hover': {
                                  bgcolor: '#dbeafe',
                                  transform: 'scale(1.1)',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          JSON.parse(localStorage.getItem('licencia') || 'null') === SUPER_ADMIN_LICENCIA && (
                            <Tooltip title="Modificar usuario" arrow>
                              <IconButton 
                                size="small"
                                onClick={() => handleModify(usuario)}
                                sx={{
                                  bgcolor: '#eff6ff',
                                  color: '#2563eb',
                                  '&:hover': {
                                    bgcolor: '#dbeafe',
                                    transform: 'scale(1.1)',
                                  },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )
                        )}
                        {usuario.licencia !== SUPER_ADMIN_LICENCIA && (
                          <Tooltip title="Eliminar usuario" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDeleteDialog(usuario.id)}
                              aria-label="eliminar usuario"
                              data-testid="delete-user-button"
                              sx={{
                                bgcolor: '#fef2f2',
                                color: '#ef4444',
                                '&:hover': {
                                  bgcolor: '#fee2e2',
                                  transform: 'scale(1.1)',
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer with actions */}
          <Box 
            sx={{ 
              mt: 3,
              p: 2,
              bgcolor: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'space-between', 
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={handleAdd}
              sx={{ 
                mb: { xs: 1, sm: 0 },
                background: 'linear-gradient(135deg, #4A90E2 0%, #2C5F8D 100%)',
                px: 3,
                py: 1.2,
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2C5F8D 0%, #1e3a5f 100%)',
                  boxShadow: '0 6px 16px rgba(74, 144, 226, 0.4)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s',
              }}
            >
              Agregar Usuario
            </Button>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={usuarios.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              sx={{
                '& .MuiTablePagination-select': {
                  borderRadius: '8px',
                  bgcolor: '#f8fafc',
                },
                '& .MuiIconButton-root': {
                  borderRadius: '8px',
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                  },
                },
              }}
            />
          </Box>

      <Dialog 
        open={openConfirmDialog} 
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          fontSize: '1.25rem',
          color: '#1e293b',
        }}>
          ⚠️ Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#64748b', fontSize: '1rem' }}>
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{
              borderRadius: '10px',
              px: 3,
              borderColor: '#e2e8f0',
              color: '#64748b',
              '&:hover': {
                borderColor: '#cbd5e1',
                bgcolor: '#f8fafc',
              },
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDelete}
            variant="contained"
            sx={{
              borderRadius: '10px',
              px: 3,
              bgcolor: '#ef4444',
              '&:hover': {
                bgcolor: '#dc2626',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
              },
              transition: 'all 0.2s',
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UsuariosView;
