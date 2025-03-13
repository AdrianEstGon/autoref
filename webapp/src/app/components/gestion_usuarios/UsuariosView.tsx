import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Box, Tooltip, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import usuarioService from '../../services/userService';
import NavBar from '../barra_navegacion/NavBar';
import { useNavigate } from 'react-router-dom';

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
}

const UsuariosView: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosPaginados, setUsuariosPaginados] = useState<Usuario[]>([]); // State for paginated users
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of rows per page

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await usuarioService.getUsuarios();
        // Sort the users by the first surname (primerApellido) alphabetically
        const sortedData = data.sort((a: { primerApellido: string; }, b: { primerApellido: any; }) => a.primerApellido.localeCompare(b.primerApellido));
        setUsuarios(sortedData);
        setUsuariosPaginados(sortedData.slice(0, rowsPerPage)); // Get the first 5 users
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsuarios();
  }, [rowsPerPage]); // Re-fetch when rowsPerPage changes

  const handleModify = (id: number) => {
    console.log(`Modificar usuario con ID: ${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (confirmDelete) {
      try {
        await usuarioService.eliminarUsuario(id);
        setUsuarios(usuarios.filter(user => user.id !== id));
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleAdd = () => {
    navigate('/gestionUsuarios/crearUsuario');
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    const startIndex = newPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setUsuariosPaginados(usuarios.slice(startIndex, endIndex));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    setUsuariosPaginados(usuarios.slice(0, newRowsPerPage));
  };

  return (
    <>
      <NavBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" textAlign={'center'} gutterBottom>Gestión de Usuarios</Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, backgroundColor: '#fafafa' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f0f0f0', color: '#333' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Primer apellido</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Segundo apellido</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nivel</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Nacimiento</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Club Vinculado</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Correo Electrónico</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Número de Licencia</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuariosPaginados.map((usuario) => (
                <TableRow key={usuario.id} sx={{ '&:hover': { backgroundColor: '#e8e8e8' }, transition: '0.3s' }}>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.primerApellido}</TableCell>
                  <TableCell>{usuario.segundoApellido}</TableCell>
                  <TableCell>{usuario.nivel}</TableCell>
                  <TableCell>{formatDate(usuario.fechaNacimiento)}</TableCell>
                  <TableCell>{usuario.clubVinculado}</TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>{usuario.licencia}</TableCell>
                  <TableCell>
                    <Tooltip title="Modificar usuario" arrow>
                      <IconButton color="primary" onClick={() => handleModify(usuario.id)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar usuario" arrow>
                      <IconButton color="secondary" onClick={() => handleDelete(usuario.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
            Agregar Usuario
          </Button>
        </Box>
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
        />
      </Container>
    </>
  );
};

export default UsuariosView;
