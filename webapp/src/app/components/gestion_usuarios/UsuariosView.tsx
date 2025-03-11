import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Box, Tooltip } from '@mui/material';
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

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await usuarioService.getUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);
  const navigate = useNavigate();

  const handleModificar = (id: number) => {
    console.log(`Modificar usuario con ID: ${id}`);
  };

  const handleEliminar = async (id: number) => {
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

  const handleAgregar = () => {
    navigate('/gestionUsuarios/crearUsuario');
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
              {usuarios.map((usuario) => (
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
                      <IconButton color="primary" onClick={() => handleModificar(usuario.id)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar usuario" arrow>
                      <IconButton color="secondary" onClick={() => handleEliminar(usuario.id)}>
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
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAgregar}>
            Agregar Usuario
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default UsuariosView;
